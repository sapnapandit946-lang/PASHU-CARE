from __future__ import annotations

from dataclasses import dataclass
from typing import List


@dataclass
class EmbeddingConfig:
    model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    normalize: bool = True


class EmbeddingModel:
    def __init__(self, config: EmbeddingConfig | None = None) -> None:
        self.config = config or EmbeddingConfig()
        self._model = None

    def _load(self) -> None:
        if self._model is not None:
            return
        try:
            from sentence_transformers import SentenceTransformer
        except Exception as exc:  # pragma: no cover - runtime dependency
            raise RuntimeError(
                "sentence-transformers is required for embeddings. "
                "Install with: pip install sentence-transformers"
            ) from exc
        self._model = SentenceTransformer(self.config.model_name)

    def embed(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        self._load()
        embeddings = self._model.encode(
            texts,
            normalize_embeddings=self.config.normalize,
            convert_to_numpy=True,
            show_progress_bar=False,
        )
        return embeddings.tolist()
