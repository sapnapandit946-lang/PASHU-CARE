from __future__ import annotations

from dataclasses import dataclass
from typing import List

from .embedding_model import EmbeddingModel
from .vector_store import VectorRecord, VectorStore


@dataclass
class RetrievedChunk:
    record: VectorRecord
    score: float


class Retriever:
    def __init__(self, embedder: EmbeddingModel, store: VectorStore) -> None:
        self.embedder = embedder
        self.store = store

    def retrieve(self, query: str, top_k: int = 5) -> List[RetrievedChunk]:
        if not query.strip():
            return []
        embedding = self.embedder.embed([query])[0]
        results = self.store.search(embedding, top_k=top_k)
        return [RetrievedChunk(record=record, score=score) for record, score in results]
