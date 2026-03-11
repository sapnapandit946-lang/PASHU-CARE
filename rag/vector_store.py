from __future__ import annotations

from dataclasses import dataclass
from typing import List, Tuple

import numpy as np


@dataclass
class VectorRecord:
    chunk_id: str
    text: str
    source: str


class VectorStore:
    def __init__(self) -> None:
        self._embeddings: np.ndarray | None = None
        self._records: List[VectorRecord] = []
        self._faiss_index = None

    def add(self, embeddings: List[List[float]], records: List[VectorRecord]) -> None:
        if len(embeddings) != len(records):
            raise ValueError("Embeddings and records length mismatch.")
        if not embeddings:
            return

        vectors = np.asarray(embeddings, dtype="float32")
        if self._embeddings is None:
            self._embeddings = vectors
        else:
            self._embeddings = np.vstack([self._embeddings, vectors])
        self._records.extend(records)
        self._build_faiss()

    def load(self, embeddings: np.ndarray, records: List[VectorRecord]) -> None:
        if embeddings.size == 0 or not records:
            return
        self._embeddings = embeddings.astype("float32", copy=False)
        self._records = list(records)
        self._build_faiss()

    def dump(self) -> Tuple[np.ndarray | None, List[VectorRecord]]:
        return self._embeddings, list(self._records)

    def _build_faiss(self) -> None:
        try:
            import faiss  # type: ignore
        except Exception:
            self._faiss_index = None
            return

        if self._embeddings is None:
            return
        dim = self._embeddings.shape[1]
        index = faiss.IndexFlatIP(dim)
        index.add(self._embeddings)
        self._faiss_index = index

    def search(self, query_embedding: List[float], top_k: int = 5) -> List[Tuple[VectorRecord, float]]:
        if self._embeddings is None or not self._records:
            return []

        query = np.asarray(query_embedding, dtype="float32")[None, :]

        if self._faiss_index is not None:
            scores, indices = self._faiss_index.search(query, top_k)
            results = []
            for idx, score in zip(indices[0].tolist(), scores[0].tolist()):
                if idx == -1:
                    continue
                results.append((self._records[idx], float(score)))
            return results

        # Fallback cosine similarity (assumes embeddings normalized if desired)
        scores = np.dot(self._embeddings, query.T).squeeze(1)
        top_idx = np.argsort(scores)[::-1][:top_k]
        return [(self._records[i], float(scores[i])) for i in top_idx]
