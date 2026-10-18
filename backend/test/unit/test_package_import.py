import sys


def test_import_vanets_does_not_eagerly_import_knowledge(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.delitem(sys.modules, "vanets", raising=False)
    monkeypatch.delitem(sys.modules, "vanets.knowledge", raising=False)

    import vanets

    assert vanets.get_version() == vanets.__version__
    assert "vanets.knowledge" not in sys.modules
