"""知识库运行时单例。"""

import os

from vanets.config import get_runtime_dir
from vanets.knowledge.factory import KnowledgeBaseFactory
from vanets.knowledge.implementations.dify import DifyKB
from vanets.knowledge.implementations.milvus import MilvusKB
from vanets.knowledge.implementations.notion import NotionKB
from vanets.knowledge.manager import KnowledgeBaseManager

KnowledgeBaseFactory.register(MilvusKB)
KnowledgeBaseFactory.register(DifyKB)
KnowledgeBaseFactory.register(NotionKB)

knowledge_base = KnowledgeBaseManager(os.path.join(get_runtime_dir(), "knowledge_base_data"))
