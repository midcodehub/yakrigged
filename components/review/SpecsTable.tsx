/**
 * <SpecsTable rows={[{label, value}]} />
 * --------------------------------------------------
 * 装备规格对照表。比纯 Markdown 表格更紧凑，且 mobile 友好（自动栈式布局）。
 *
 * 用法：
 *   <SpecsTable
 *     title="Garmin Striker Vivid 5cv specs"
 *     rows={[
 *       { label: "Screen", value: "5\" 800×480" },
 *       { label: "Transducer", value: "GT20-TM (CHIRP + ClearVü)" },
 *       { label: "Weight", value: "0.6 lb (head unit)" },
 *     ]}
 *   />
 */
interface Props {
  rows?: ReadonlyArray<{ label: string; value: React.ReactNode }>;
  title?: string;
}

export function SpecsTable({ rows = [], title }: Props) {
  if (rows.length === 0) return null;
  return (
    <div className="my-8 overflow-hidden rounded-lg ring-1 ring-sand-200">
      {title && (
        <div className="border-b border-sand-200 bg-sand-100 px-4 py-2 text-sm font-semibold text-ink-900">
          {title}
        </div>
      )}
      <dl className="divide-y divide-sand-200">
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[1fr_2fr] sm:gap-4"
          >
            <dt className="text-sm font-medium text-ink-500">{row.label}</dt>
            <dd className="text-sm text-ink-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
