/**
 * Tailwind CSS v4 通过 PostCSS 插件接入 Next.js。
 * 注意：v4 不再需要 tailwind.config.js — 主题在 globals.css 里用 @theme 配置。
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
