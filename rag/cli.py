from __future__ import annotations

import argparse
import json
import pickle
import sys
from dataclasses import asdict
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np

from rag.data_loader import build_chunks, load_documents
from rag.embedding_model import EmbeddingConfig, EmbeddingModel
from rag.rag_pipeline import RAGConfig, RAGPipeline
from rag.vector_store import VectorRecord, VectorStore


def _fingerprint_files(paths: List[Path]) -> str:
    parts: List[str] = []
    for path in paths:
        stat = path.stat()
        parts.append(f"{path.name}:{stat.st_mtime_ns}:{stat.st_size}")
    return "|".join(parts)


def _load_cache(cache_path: Path) -> Tuple[str | None, np.ndarray | None, List[VectorRecord]]:
    if not cache_path.exists():
        return None, None, []
    try:
        with cache_path.open("rb") as handle:
            payload = pickle.load(handle)
        return (
            payload.get("fingerprint"),
            payload.get("embeddings"),
            [VectorRecord(**item) for item in payload.get("records", [])],
        )
    except Exception:
        return None, None, []


def _save_cache(cache_path: Path, fingerprint: str, embeddings: np.ndarray, records: List[VectorRecord]) -> None:
    payload = {
        "fingerprint": fingerprint,
        "embeddings": embeddings,
        "records": [asdict(r) for r in records],
    }
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    with cache_path.open("wb") as handle:
        pickle.dump(payload, handle)


def _build_store(knowledge_dir: Path, cache_path: Path | None, model_name: str) -> Tuple[VectorStore, str]:
    paths = sorted(knowledge_dir.glob("*.txt"))
    if not paths:
        raise RuntimeError("No knowledge base content found.")

    fingerprint = f"model={model_name}|{_fingerprint_files(paths)}"
    store = VectorStore()

    if cache_path:
        cached_fp, embeddings, records = _load_cache(cache_path)
        if cached_fp == fingerprint and embeddings is not None and records:
            store.load(embeddings, records)
            return store, fingerprint

    documents = load_documents(paths)
    chunks = build_chunks(documents)
    texts = [chunk for _, chunk, _ in chunks]
    embedder = EmbeddingModel(EmbeddingConfig(model_name=model_name))
    embeddings = embedder.embed(texts)
    records = [
        VectorRecord(chunk_id=chunk_id, text=text, source=source)
        for (chunk_id, text, source) in chunks
    ]
    store.add(embeddings, records)

    if cache_path:
        embeddings_np, records_dump = store.dump()
        if embeddings_np is not None:
            _save_cache(cache_path, fingerprint, embeddings_np, records_dump)

    return store, fingerprint


def _retrieve_context(store: VectorStore, embedder: EmbeddingModel, question: str, top_k: int) -> List[Dict[str, str]]:
    embedding = embedder.embed([question])[0]
    hits = store.search(embedding, top_k=top_k)
    results = []
    for record, score in hits:
        results.append(
            {
                "chunk_id": record.chunk_id,
                "source": record.source,
                "score": f"{score:.4f}",
                "text": record.text,
            }
        )
    return results


def main() -> int:
    parser = argparse.ArgumentParser(description="RAG CLI for cattle veterinary assistance.")
    parser.add_argument("--question", required=True, help="User question text.")
    parser.add_argument("--knowledge-dir", default="rag/knowledge_base", help="Path to knowledge base directory.")
    parser.add_argument("--top-k", type=int, default=5, help="Number of chunks to retrieve.")
    parser.add_argument("--mode", choices=["answer", "retrieve"], default="answer", help="Output mode.")
    parser.add_argument("--model-name", default="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2", help="Embedding model name.")
    parser.add_argument("--cache-path", default="rag/.rag_cache.pkl", help="Path to embedding cache.")
    parser.add_argument("--max-context-chars", type=int, default=6000, help="Max characters for combined context.")
    args = parser.parse_args()

    knowledge_dir = Path(args.knowledge_dir)
    cache_path = Path(args.cache_path) if args.cache_path else None

    if args.mode == "answer":
        pipeline = RAGPipeline(RAGConfig(knowledge_dir=knowledge_dir, top_k=args.top_k, model_name=args.model_name))
        pipeline.build_index()
        print(pipeline.answer(args.question))
        return 0

    store, _ = _build_store(knowledge_dir, cache_path, args.model_name)
    embedder = EmbeddingModel(EmbeddingConfig(model_name=args.model_name))
    chunks = _retrieve_context(store, embedder, args.question, args.top_k)
    context = "\n\n".join(chunk["text"] for chunk in chunks)
    if len(context) > args.max_context_chars:
        context = context[: args.max_context_chars].rsplit(" ", 1)[0] + "..."

    payload = {
        "context": context,
        "chunks": chunks,
    }
    sys.stdout.write(json.dumps(payload, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
