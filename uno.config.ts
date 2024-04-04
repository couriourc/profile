// uno.config.js
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(), // 添加 UnoCSS 的默认样式预设
    presetAttributify(),
    presetIcons(),
  ],
});
