'use client';

/**
 * Emoji 选择器(emoji-mart 封装)
 * --------------------------------------------------
 * 用成熟开源 emoji-mart,不自研。父组件用 next/dynamic ssr:false 引入,
 * 避免 emoji-mart 在 SSR 阶段访问浏览器 API 报错。
 */
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function EmojiPicker({
  onSelect,
}: {
  onSelect: (native: string) => void;
}) {
  return (
    <Picker
      data={data}
      onEmojiSelect={(e: { native: string }) => onSelect(e.native)}
      theme="light"
      previewPosition="none"
      skinTonePosition="none"
      navPosition="bottom"
      perLine={8}
    />
  );
}
