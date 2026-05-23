/**
 * <SearchClient />
 * 客户端搜索 UI：从 /search-index.json 拉数据，做 substring + token 匹配。
 * - 关注键盘可达性：input 自动 focus、回车提交、↑↓ 不接管（结果是链接，让浏览器原生 Tab）
 * - 高亮命中关键词（mark 标签）
 */
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface IndexRecord {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  pubDate: string;
  haystack: string;
}

/** 把 query 按空白切成 token，全小写，去掉空串 */
function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** 把命中片段用 <mark> 包起来（仅对 title / description 这种短文本） */
function highlight(text: string, tokens: string[]): React.ReactNode {
  if (tokens.length === 0) return text;
  // 用正则 OR 一次性匹配所有 token，避免多次 replace 互相覆盖
  const escaped = tokens
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const re = new RegExp(`(${escaped})`, 'gi');
  return text.split(re).map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="bg-accent-500/30 text-ink-900">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function SearchClient({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [index, setIndex] = useState<IndexRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 拉索引：组件挂载后一次性 fetch；网络失败回显友好错误
  useEffect(() => {
    let cancelled = false;
    fetch('/search-index.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<IndexRecord[]>;
      })
      .then((data) => {
        if (!cancelled) setIndex(data);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tokens = useMemo(() => tokenize(query), [query]);

  /**
   * 匹配规则：所有 token 都必须在 haystack 里能找到（AND 逻辑），
   * 这比 OR 更直觉——用户多打字 = 收紧结果。
   * 命中数（命中 token 数 × 标题命中加权）作为排序。
   */
  const results = useMemo(() => {
    if (!index || tokens.length === 0) return [];
    return index
      .map((rec) => {
        const haystack = rec.haystack;
        const allHit = tokens.every((t) => haystack.includes(t));
        if (!allHit) return null;
        const titleLower = rec.title.toLowerCase();
        const titleHits = tokens.filter((t) => titleLower.includes(t)).length;
        return { rec, score: tokens.length + titleHits * 2 };
      })
      .filter((x): x is { rec: IndexRecord; score: number } => x !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
  }, [index, tokens]);

  return (
    <div>
      <label htmlFor="q" className="sr-only">
        Search articles
      </label>
      <input
        id="q"
        type="search"
        autoFocus
        placeholder="Search for rod holders, fish finders, lake names…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-lg shadow-sm outline-none ring-brand-400 focus:ring-2"
      />

      {/* 状态行 */}
      <p className="mt-3 text-sm text-ink-500">
        {error ? (
          <span className="text-red-600">Search index failed to load: {error}</span>
        ) : !index ? (
          'Loading search index…'
        ) : tokens.length === 0 ? (
          `Ready — ${index.length} articles indexed.`
        ) : (
          `${results.length} result${results.length === 1 ? '' : 's'}`
        )}
      </p>

      {/* 结果列表 */}
      {results.length > 0 && (
        <ul className="mt-6 divide-y divide-brand-100 rounded-xl border border-brand-100 bg-white">
          {results.map(({ rec }) => (
            <li key={rec.slug} className="p-5 hover:bg-brand-50/50">
              <Link href={`/blog/${rec.slug}`} className="block">
                <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-brand-600">
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold">
                    {rec.category}
                  </span>
                  <span className="text-ink-500 normal-case tracking-normal">
                    {new Date(rec.pubDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-ink-900">
                  {highlight(rec.title, tokens)}
                </h3>
                <p className="mt-1 text-sm text-ink-700">
                  {highlight(rec.description, tokens)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* 空结果但有 query */}
      {index && tokens.length > 0 && results.length === 0 && (
        <p className="mt-6 rounded-lg border border-dashed border-brand-200 p-6 text-center text-ink-500">
          No matches. Try fewer or simpler keywords.
        </p>
      )}
    </div>
  );
}
