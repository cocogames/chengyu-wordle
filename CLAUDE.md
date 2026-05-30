# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**成语 Wordle** 是一个 Wordle 的中文变种游戏——猜四字成语。玩家有 6 次机会猜出一个成语。使用 **Preact + Vite** 构建，部署为静态网站。每天有一个固定成语（每日谜题），玩家也可以通过成语 ID 或随机选择来玩任意往期谜题。

## 常用命令

```bash
npm i              # 安装依赖
npm run dev        # 启动开发服务器（端口 3030）
npm run build      # 生产环境构建
npm run preview    # 本地预览生产构建
npm run data       # 从原始数据 data/ 重新生成游戏数据到 game-data/
npm test           # 运行单元测试（vitest，watch 模式）
npm run e2e-test   # 运行 E2E 测试（Playwright，自动启动开发服务器）
```

## 架构

### 技术栈
- **Preact** 10.x（兼容 React，更轻量）+ JSX
- **Vite** 2.x 作为打包工具/开发服务器
- **i18next** + react-i18next 用于国际化（英语、中文）
- **howler.js** 用于音效
- **pinyin-pro** 用于中文拼音转换
- **vitest** 用于单元测试，**Playwright** 用于 E2E 测试

### 代码结构

```
src/
  main.jsx              # 入口：初始化 i18n，渲染 <App>
  app.jsx               # 主游戏逻辑（1500+ 行）—— 棋盘、键盘、弹窗、状态
  constants.js          # localStorage 键前缀 ('cywd-')
  index.css             # 全局样式
  components/           # Preact 组件（Tile、图标等）
  utils/                # 工具函数：compareWords、LS（localStorage）、copy、alert 等

data/                   # 原始数据（idioms.json、THUOCL 词频列表）
game-data/              # 处理后的游戏数据（由 `npm run data` 生成）
  all-idioms.txt        # 所有合法成语（每行一个）—— 用于输入校验
  game-idioms.csv       # 游戏用成语及唯一 ID —— 每日谜题池
i18n/                   # 翻译文件（en.json、zh-CN.json）
test/                   # 单元测试（vitest）
e2e-test/               # E2E 测试（Playwright）
```

### 游戏流程

1. **每日谜题**：`getTodayGame()` 根据距 2022-01-27 的天数从游戏成语列表中选取一个成语。
2. **棋盘状态**：6 行 × 4 个字。状态用 `board` 数组管理，持久化到 localStorage。
3. **输入**：玩家输入拼音字母（a-z 通过 pinyin-pro 映射为汉字），或点击屏幕键盘。
4. **校验**：提交的成语必须存在于 `all-idioms.txt` 中。
5. **评分**：`compareWords()` 返回 🟩（位置正确）、🟧（字存在但位置不对）、⬜（不存在）。
6. **键盘字母**：每个谜题动态生成相关成语作为候选答案，确保有足够的可选答案。
7. **Hash 路由**：`#<idiom-id>` 加载特定成语谜题；`#/` 加载当天游戏。

### 关键常量
- `MAX_STEPS = 6`（最大猜测次数）
- `MAX_LETTERS = 4`（每个成语 4 个字）
- `KEY_PREFIX = 'cywd-'`（localStorage 键前缀）
- 存在困难模式（40 键，最少 10 个候选成语 vs 普通模式 20 键，最少 6 个）

### 数据管道
`npm run data`（`scripts/gen-data.mjs`）：
1. 读取 `data/idioms.json`（所有成语）+ `data/THUOCL_chengyu.txt`（高频词列表）
2. 过滤出四字成语
3. 生成 `game-data/game-idioms.csv`，使用基于 hash 的 ID
4. 生成 `game-data/all-idioms.txt`（所有成语的并集，用于输入校验）

## 测试

- **单元测试**：`test/compareWords.test.js` —— 测试格子比较逻辑。运行 `npm test`。
- **E2E 测试**：`e2e-test/` —— Playwright 测试应用加载、游戏玩法和国际化。运行 `npm run e2e-test`，会自动在 3030 端口启动开发服务器。

## 注意事项

- 主组件 `app.jsx` 是一个单文件大组件（约 1500 行），包含所有游戏逻辑。这是刻意为之——本项目是一个小游戏，不是大型应用。
- 游戏状态通过 `cywd-` 前缀持久化到 localStorage。暴露了 `window.clearGames()` 和 `window.allGames()` 辅助函数用于调试。
- 答案和提示通过浏览器控制台泄露（`window.ANSWER`、`window.HINTS`），作为彩蛋。
- 成语释义数据在运行时从外部 API（`baidu-hanyu-idiom.cheeaun.workers.dev`）动态获取。
