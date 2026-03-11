from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Dict, List

from .data_loader import build_chunks, load_documents
from .embedding_model import EmbeddingModel, EmbeddingConfig
from .retriever import Retriever
from .vector_store import VectorRecord, VectorStore


@dataclass
class RAGConfig:
    knowledge_dir: Path
    top_k: int = 5
    model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"


def _simple_section_extract(text: str) -> Dict[str, List[str]]:
    sections: Dict[str, List[str]] = {
        "Symptoms": [],
        "Causes": [],
        "Prevention": [],
        "Treatment": [],
        "When to call a vet": [],
        "Notes": [],
    }
    current = None
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        for header in sections.keys():
            if line.lower().startswith(header.lower() + ":"):
                current = header
                remainder = line.split(":", 1)[1].strip()
                if remainder:
                    sections[header].append(remainder)
                break
        else:
            if current:
                sections[current].append(line)
    return sections


def _merge_sections(section_list: List[Dict[str, List[str]]]) -> Dict[str, List[str]]:
    merged: Dict[str, List[str]] = {k: [] for k in section_list[0].keys()}
    for sections in section_list:
        for key, lines in sections.items():
            for line in lines:
                if line not in merged[key]:
                    merged[key].append(line)
    return merged


def _format_response(sections: Dict[str, List[str]]) -> str:
    lines: List[str] = []
    for key in ["Symptoms", "Causes", "Prevention", "Treatment", "When to call a vet", "Notes"]:
        items = sections.get(key) or []
        if not items:
            continue
        lines.append(f"{key}:")
        for item in items[:6]:
            lines.append(f"- {item}")
        lines.append("")
    lines.append("If the animal is very sick, has high fever, severe pain, or stops eating or drinking, contact a veterinarian immediately.")
    return "\n".join(lines).strip()


class RAGPipeline:
    def __init__(self, config: RAGConfig) -> None:
        self.config = config
        self.embedder = EmbeddingModel(EmbeddingConfig(model_name=config.model_name))
        self.store = VectorStore()
        self.retriever = Retriever(self.embedder, self.store)

    def build_index(self) -> None:
        paths = sorted(self.config.knowledge_dir.glob("*.txt"))
        documents = load_documents(paths)
        chunks = build_chunks(documents)
        if not chunks:
            raise RuntimeError("No knowledge base content found.")
        texts = [chunk for _, chunk, _ in chunks]
        embeddings = self.embedder.embed(texts)
        records = [
            VectorRecord(chunk_id=chunk_id, text=text, source=source)
            for (chunk_id, text, source) in chunks
        ]
        self.store.add(embeddings, records)

    def answer(
        self,
        question: str,
        llm_generate: Callable[[str], str] | None = None,
    ) -> str:
        retrieved = self.retriever.retrieve(question, top_k=self.config.top_k)
        if not retrieved:
            return "I could not find relevant veterinary guidance. Please describe symptoms in more detail or consult a veterinarian."

        context = "\n\n".join([chunk.record.text for chunk in retrieved])

        if llm_generate:
            prompt = (
                "You are a veterinary assistant for cattle farmers. "
                "Answer using only the information in the context. "
                "Keep it simple and practical. Include symptoms, causes, prevention, and treatment if available. "
                "If serious, advise seeing a veterinarian.\n\n"
                f"Context:\n{context}\n\n"
                f"Question:\n{question}\n\n"
                "Answer:"
            )
            return llm_generate(prompt)

        sections_list = [_simple_section_extract(chunk.record.text) for chunk in retrieved]
        merged = _merge_sections(sections_list)
        return _format_response(merged)
