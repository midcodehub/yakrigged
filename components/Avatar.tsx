/**
 * <Avatar />
 * --------------------------------------------------
 * 有 src 就用 next/image；没有就生成"首字母圆形"占位图。
 * 设计目的：作者档案页空缺头像也别留个尴尬空格，同时不引入第三方依赖。
 */
import Image from 'next/image';

interface Props {
  src?: string;
  name: string;
  /** px 尺寸（宽=高），默认 96 */
  size?: number;
  className?: string;
}

/** 从作者名取首字母（多词取每词首字母拼起来，最多 2 个字符） */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (
    (parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')
  ).toUpperCase();
}

/** 给定字符串生成稳定的色相（0-360），让不同作者的占位色不同但不刺眼 */
function hueOf(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

export function Avatar({ src, name, size = 96, className = '' }: Props) {
  const baseClass = `flex-none rounded-full border border-brand-200 bg-brand-50 object-cover ${className}`;

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={baseClass}
      />
    );
  }

  // 占位：HSL 着色，文字白色，居中
  const hue = hueOf(name);
  return (
    <div
      role="img"
      aria-label={name}
      className={baseClass}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue} 55% 55%), hsl(${(hue + 30) % 360} 60% 45%))`,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.42,
        letterSpacing: -1,
      }}
    >
      {initialsOf(name)}
    </div>
  );
}
