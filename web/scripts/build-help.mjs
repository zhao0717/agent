import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import MarkdownIt from 'markdown-it'

const docs = fileURLToPath(new URL('../../docs/', import.meta.url))
const output = fileURLToPath(new URL('../public/help/', import.meta.url))
const renderer = new MarkdownIt({ html: false })
const entries = [
  ['快速开始', 'intro/quick-start'],
  ['模型配置', 'intro/model-config'],
  ['知识库', 'intro/knowledge-base'],
  ['文档处理', 'advanced/document-processing'],
  ['知识库评估', 'intro/evaluation'],
  ['智能体', 'agents/agents-config'],
  ['生产部署', 'advanced/deployment']
]
const nav = entries.map(([title, page]) => `<a href="/help/${page}.html">${title}</a>`).join('')
const style = `:root{color-scheme:light dark}*{box-sizing:border-box}body{font:16px/1.8 system-ui,sans-serif;margin:0;color:light-dark(#243042,#e2e8f0);background:light-dark(#fff,#18212f)}header,main{max-width:960px;margin:auto;padding:24px}nav{display:flex;gap:12px 24px;flex-wrap:wrap}a{color:light-dark(#09657a,#8dd7e8)}main{border-top:1px solid #8792a455}h1{font-size:28px}h2{margin-top:32px}pre{padding:16px;overflow:auto;background:light-dark(#f1f5f9,#263346);border-radius:8px}code{font-family:monospace;overflow-wrap:anywhere}table{display:block;overflow:auto;border-collapse:collapse}td,th{border:1px solid #8792a455;padding:8px 12px}img{max-width:100%}`

// VitePress 的标题锚点规则，保持文档中的节内链接可访问。
const slug = (text) =>
  text
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
renderer.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('id', slug(tokens[idx + 1].content))
  return self.renderToken(tokens, idx, options)
}

function page(body) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>使用帮助</title><link rel="icon" href="/favicon.svg"><style>${style}</style></head><body><header><a href="/">返回工作台</a><h1>使用帮助</h1><nav>${nav}</nav></header><main>${body}</main></body></html>\n`
}

async function renderDirectory(relative = '') {
  for (const entry of await readdir(path.join(docs, relative), { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ['node_modules', 'vibe', 'public'].includes(entry.name))
      continue
    const rel = path.posix.join(relative, entry.name)
    if (entry.isDirectory()) {
      await renderDirectory(rel)
      continue
    }
    if (!entry.name.endsWith('.md') || rel === 'index.md') continue
    let source = await readFile(path.join(docs, rel), 'utf8')
    source = source.replace(/^---\n[\s\S]*?\n---\n/, '')
    source = source.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, target) => {
      if (/^(?:https?:|mailto:|#)/.test(target)) return match
      const [file, fragment] = target.split('#')
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(rel), file))
      if (resolved.startsWith('../')) return `\`${label}\``
      const destination = resolved.endsWith('.md')
        ? resolved.slice(0, -3) + '.html'
        : resolved.endsWith('/')
          ? resolved + 'index.html'
          : resolved
      return `[${label}](/help/${destination}${fragment ? '#' + fragment : ''})`
    })
    const file = path.join(output, rel.replace(/\.md$/, '.html'))
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, page(renderer.render(source)))
  }
}

// 此目录只包含生成的帮助页面，重建时移除已经删除或移动的旧页面。
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
await renderDirectory()
await writeFile(
  path.join(output, 'index.html'),
  page('<h2>知识工作台</h2><p>从快速开始完成部署与登录，接着配置模型、创建知识库和智能体。</p>')
)
console.log('Generated local help from current documentation.')
