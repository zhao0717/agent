# Knowledge Workspace

[Documentation](docs/index.md) · [Quick Start](docs/intro/quick-start.md) · [中文](README.md)

## Introduction

This platform is a **self-hosted, multi-tenant knowledge agent platform**. Rather than stopping at a chat interface, it brings **RAG retrieval, Milvus-backed knowledge graphs, LangGraph multi-agent orchestration, MCP/Skills, sandbox tools, and access control** into one workspace.

Administrators connect model providers, build knowledge bases, and manage user or department permissions. Users work with agents that can retrieve cited sources, reason over graph context, call tools and sub-agents, and deliver previewable, downloadable artifacts.

Navigation: [Introduction](docs/index.md) ｜ [Quick Start](docs/intro/quick-start.md) ｜ [Roadmap](docs/develop-guides/roadmap.md); for the latest updates, see the [changelog](docs/develop-guides/changelog.md).

## Core Features

- 🤖 **Agent development** — Built on LangGraph, with sub-agents (SubAgents), Skills, MCPs, Tools, and middleware; long-running tasks run asynchronously on a background worker, backed by a sandbox file system for persisting, previewing, and downloading tool artifacts.
- 📚 **Knowledge base (RAG)** — Multi-format document parsing (MinerU / PaddleX / OCR), configurable Embedding and Rerank models, knowledge base evaluation, in-app PDF / image preview, and retrieval sources backfilled as chat citations.
- 🕸️ **Knowledge graph** — Build, visualize, and retrieve entity-relation graphs inside Milvus knowledge bases, then fuse graph hits with chunk retrieval for agent reasoning.
- 🏢 **Multi-tenancy & permissions** — User / department-level access control, unified model provider configuration, and API Key authentication for external system integration.
- ⚙️ **Platform & engineering** — Vue + FastAPI architecture, ready-to-run Docker Compose deployment, dark mode, and production-grade orchestration.

## When to Use This Platform

This platform is a strong fit for teams that need private deployment, organizational access control, multiple knowledge sources, and extensible agents that can execute work. If you only need a minimal single-document chat UI or a fully managed SaaS with no infrastructure to operate, this platform may be more platform than you need.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Vue 3 · Vite · Pinia |
| Backend | FastAPI · LangGraph · ARQ (async worker) |
| Storage | PostgreSQL · Redis · MinIO · Milvus · Neo4j |
| Doc parsing | MinerU · PaddleX · RapidOCR |
| Deployment | Docker Compose |

## Quick Start

**Prerequisites**: [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed, plus at least one OpenAI-compatible LLM API.

Set `REPOSITORY_URL` to your repository URL. If you already have the source, run initialization from the project root.

**1. Clone and initialize**

```bash
git clone --branch v0.7.2 --depth 1 "${REPOSITORY_URL}" workspace
cd workspace

# Linux/macOS
./scripts/init.sh

# Windows PowerShell
.\scripts\init.ps1
```

**2. Start with Docker**

```bash
docker compose up --build
```

Do not run `up` directly when upgrading an existing installation to the v0.7.2
storage layout. The single owning procedure is the
[production deployment guide](docs/advanced/deployment.md).

**3. Open the platform**

Once the services are ready, open `http://localhost:5173` in your browser and follow the first-run page to create the initial superadmin account.


## Acknowledgements

This platform references and builds on the following excellent open-source projects:

- [LightRAG](https://github.com/HKUDS/LightRAG) - Inspired parts of the early graph construction and retrieval design. The platform uses its own Milvus-backed knowledge-base and graph pipeline.
- [DeepAgents](https://github.com/langchain-ai/deepagents) - Used as the deep agent framework.
- [DeerFlow](https://github.com/bytedance/deer-flow) - Referenced for Sandbox agent architecture ideas.
- [RAGFlow](https://github.com/infiniflow/ragflow) - Referenced for document text chunking strategies.
- [LangGraph](https://github.com/langchain-ai/langgraph) - Multi-agent orchestration framework and the core architectural foundation of this project.
- [QwenPaw](https://github.com/agentscope-ai/QwenPaw) - Referenced for model configuration and personal file area design.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

Third-party components brought in by Docker Compose (Neo4j Community GPL-3.0, MinIO AGPL-3.0, etc.) retain their original licenses; see the [deployment guide](docs/advanced/deployment.md) for deployment and redistribution boundaries.
