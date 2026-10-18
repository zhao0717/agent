__all__ = ["select_model", "select_embedding_model", "get_embedding_model_info_by_id"]


def __getattr__(name: str):
    if name == "select_model":
        from vanets.models.chat import select_model

        return select_model

    if name in {"select_embedding_model", "get_embedding_model_info_by_id"}:
        from vanets.models.embed import get_embedding_model_info_by_id, select_embedding_model

        return {
            "select_embedding_model": select_embedding_model,
            "get_embedding_model_info_by_id": get_embedding_model_info_by_id,
        }[name]

    raise AttributeError(f"module 'vanets.models' has no attribute {name!r}")


def __dir__():
    return sorted(set(globals()) | set(__all__))
