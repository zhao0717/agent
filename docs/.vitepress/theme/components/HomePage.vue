<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <main class="workspace-home">
    <p class="eyebrow">知识库 · 智能体 · 协作</p>
    <h1>知识工作台</h1>
    <p class="intro">连接团队知识，使用智能体检索资料、执行任务并交付结果。</p>
    <div class="actions">
      <a :href="withBase('/intro/quick-start')">快速开始</a>
      <a :href="withBase('/intro/project-overview')">了解功能</a>
    </div>
    <section class="features" aria-label="平台功能">
      <article><h2>知识检索</h2><p>管理文档、构建知识图谱，结合检索结果回答问题。</p><a :href="withBase('/intro/knowledge-base')">知识库使用指南 →</a></article>
      <article><h2>智能体与工具</h2><p>组合模型、MCP、Skills 和沙盒，完成需要多个步骤的任务。</p><a :href="withBase('/agents/agents-config')">智能体配置 →</a></article>
      <article><h2>自主部署</h2><p>通过 Docker Compose 部署，管理访问权限、模型和数据。</p><a :href="withBase('/advanced/deployment')">部署与运维 →</a></article>
    </section>
  </main>
</template>

<style scoped>
.workspace-home { max-width: 1120px; margin: 0 auto; padding: 80px 32px; }
.eyebrow { color: var(--vp-c-text-2); }
h1 { font-size: clamp(32px, 6vw, 56px); line-height: 1.2; font-weight: 700; margin: 20px 0; }
.intro { max-width: 640px; color: var(--vp-c-text-2); font-size: 20px; line-height: 1.7; }
.actions { display: flex; flex-wrap: wrap; gap: 16px; margin: 32px 0 64px; }
.actions a { padding: 10px 20px; border: 1px solid var(--vp-c-divider); border-radius: 8px; }
.actions a:first-child { background: var(--vp-c-brand-1); color: var(--vp-c-bg); }
.features { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
article { padding: 24px; border: 1px solid var(--vp-c-divider); border-radius: 8px; }
h2 { font-size: 20px; font-weight: 600; }
article p { color: var(--vp-c-text-2); line-height: 1.8; margin: 16px 0; }
article a { color: var(--vp-c-brand-1); }
a:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 4px; }
@media (max-width: 768px) { .features { grid-template-columns: 1fr; } .workspace-home { padding: 40px 24px; } }
</style>
