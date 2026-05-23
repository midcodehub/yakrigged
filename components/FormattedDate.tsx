/**
 * <FormattedDate />
 * 把 Date 渲染成对人友好的格式，同时输出语义化的 <time datetime="ISO">，
 * Google / 阅读器 / RSS 都能正确识别。
 */
interface Props {
  date: Date;
  className?: string;
}

export function FormattedDate({ date, className }: Props) {
  return (
    <time dateTime={date.toISOString()} className={className}>
      {date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}
    </time>
  );
}
