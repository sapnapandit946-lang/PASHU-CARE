from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Tuple


@dataclass
class Document:
    doc_id: str
    text: str
    source: str


def load_documents(paths: Iterable[Path]) -> List[Document]:
    documents: List[Document] = []
    for path in paths:
        text = path.read_text(encoding="utf-8").strip()
        if not text:
            continue
        doc_id = path.stem
        documents.append(Document(doc_id=doc_id, text=text, source=str(path)))
    return documents


def chunk_text(
    text: str,
    chunk_size: int = 500,
    chunk_overlap: int = 80,
) -> List[str]:
    if chunk_size <= 0:
        raise ValueError("chunk_size must be > 0")
    if chunk_overlap < 0:
        raise ValueError("chunk_overlap must be >= 0")
    if chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be < chunk_size")

    words = text.split()
    if not words:
        return []

    chunks: List[str] = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end]).strip()
        if chunk:
            chunks.append(chunk)
        if end == len(words):
            break
        start = end - chunk_overlap
    return chunks


def build_chunks(documents: Iterable[Document]) -> List[Tuple[str, str, str]]:
    all_chunks: List[Tuple[str, str, str]] = []
    for doc in documents:
        chunks = chunk_text(doc.text)
        for i, chunk in enumerate(chunks):
            chunk_id = f"{doc.doc_id}_chunk_{i:04d}"
            all_chunks.append((chunk_id, chunk, doc.source))
    return all_chunks
