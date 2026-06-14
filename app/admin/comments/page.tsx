'use client';

/**
 * 站长审核队列页 /admin/comments
 * --------------------------------------------------
 * P1 轻量后台:输入 COMMENTS_ADMIN_SECRET 登录(种 httpOnly cookie),
 * 然后看 pending 队列,逐条 放行 / 标垃圾 / 删除。
 * 仅站长本人用,无需做成精美页面。
 */
import { useCallback, useEffect, useState } from 'react';

interface PendingRow {
  id: string;
  post_slug: string;
  author_name: string | null;
  body: string;
  created_at: string;
}

export default function AdminCommentsPage() {
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState('');
  const [rows, setRows] = useState<PendingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/admin/comments', { cache: 'no-store' });
    if (res.status === 401) {
      setAuthed(false);
      setLoading(false);
      return;
    }
    const json = await res.json();
    setRows(json.data ?? []);
    setAuthed(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    });
    if (!res.ok) {
      setError('密钥错误或未配置');
      return;
    }
    setSecret('');
    load();
  }

  async function act(id: string, action: string) {
    await fetch('/api/admin/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    setAuthed(false);
    setRows([]);
  }

  if (!authed) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-semibold text-ink-900">站长登录</h1>
        <form onSubmit={login} className="mt-6 space-y-3">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="COMMENTS_ADMIN_SECRET"
            className="w-full rounded-lg border border-sand-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            登录
          </button>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink-900">待审留言队列</h1>
        <button onClick={logout} className="text-sm text-ink-500 underline">
          退出
        </button>
      </div>

      {loading && <p className="mt-6 text-sm text-ink-500">加载中…</p>}
      {!loading && rows.length === 0 && (
        <p className="mt-6 text-sm text-ink-500">队列为空 🎉 没有待审留言。</p>
      )}

      <ul className="mt-6 space-y-4">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl border border-sand-200 bg-white p-4">
            <div className="mb-1 text-xs text-ink-500">
              {r.author_name || 'Anonymous'} · /blog/{r.post_slug} ·{' '}
              {new Date(r.created_at).toLocaleString()}
            </div>
            <p className="whitespace-pre-wrap text-sm text-ink-900">{r.body}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => act(r.id, 'approve')}
                className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
              >
                放行
              </button>
              <button
                onClick={() => act(r.id, 'spam')}
                className="rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white"
              >
                标垃圾
              </button>
              <button
                onClick={() => act(r.id, 'delete')}
                className="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white"
              >
                删除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
