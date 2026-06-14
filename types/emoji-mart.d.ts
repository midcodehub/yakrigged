/**
 * @emoji-mart/data 的运行时主文件是一个 emoji JSON,但它的 index.d.ts
 * 只导出若干 interface、没有 default 导出。这里用模块增强补一个 default,
 * 让 `import data from '@emoji-mart/data'` 通过类型检查(运行时本就是那个 JSON)。
 */
declare module '@emoji-mart/data' {
  const data: unknown;
  export default data;
}
