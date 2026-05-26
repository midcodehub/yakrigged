/**
 * <ProsCons pros={[...]} cons={[...]} />
 * --------------------------------------------------
 * 评测文章里几乎每一篇都会用到的"优缺点对比"卡片。
 * 设计上故意保持左右两列对齐，让阅读者扫描成本极低。
 *
 * 用法：
 *   <ProsCons
 *     pros={["Crisp screen", "Day-long battery"]}
 *     cons={["Heavy at 1.2kg", "No Bluetooth"]}
 *   />
 */
/**
 * pros / cons 每条支持 ReactNode，方便在 MDX 里直接塞内联链接（联盟链接、内链）。
 * 旧用法 ["纯文本"] 完全兼容 —— string 本身就是 ReactNode 的合法子类型。
 */
interface Props {
  pros?: ReadonlyArray<React.ReactNode>;
  cons?: ReadonlyArray<React.ReactNode>;
}

export function ProsCons({ pros = [], cons = [] }: Props) {
  if (pros.length === 0 && cons.length === 0) return null;
  return (
    <div className="my-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <h3 className="!mt-0 mb-3 flex items-center gap-2 text-base font-semibold text-emerald-900">
          <span aria-hidden>+</span> Pros
        </h3>
        <ul className="!mt-0 space-y-2 text-sm text-emerald-900">
          {pros.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="mt-0.5 text-emerald-600">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-rose-200 bg-rose-50 p-5">
        <h3 className="!mt-0 mb-3 flex items-center gap-2 text-base font-semibold text-rose-900">
          <span aria-hidden>−</span> Cons
        </h3>
        <ul className="!mt-0 space-y-2 text-sm text-rose-900">
          {cons.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="mt-0.5 text-rose-600">✗</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
