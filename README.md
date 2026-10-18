# 知骨 · 系统解剖学AI教学学伴

[打开在线作品](https://crh2007530.github.io/zhigu-ai-teaching/) · [材料与本地版下载](https://crh2007530.github.io/zhigu-ai-teaching/materials/)

AI+高等教育 / AI+教学。杏林智骨队，西安医学院。

## 在线可用

- 4模块、36学习条目（含骨群、组成部分和标志），13张教材图。
- 96道自编题；日常练习60题，独立前测、后测、保持测验各12题。
- 错题复习、笔记、本机记录、教师导入与人工复核。
- AI伴学初答草稿、历史记录、导入导出与跨地址迁移。

GitHub Pages托管静态网页，当前没有在线AI后端。不会在网页中收集密钥，也不会用预写回答替代模型。在线资料保存在访问者当前浏览器，未上传中央数据库。

## 启用本地真实AI

下载仓库ZIP并解压，安装Node.js 20+。Windows双击 `启用AI.cmd`，选择DeepSeek或千问，在本机命令窗口隐藏输入有效API Key；使用 `http://127.0.0.1:8790/`。仅预览本地网站也可执行 `node server.mjs`。

初答与依据 → AI引用原文追问 → 回应与修正 → AI比较前后解释 → 程序匹配迁移题 → 教师复核。密钥仅在服务进程环境中使用，不要提交到仓库。

## 验证状态

课程18项、API检测7项、伴学流程10项、草稿迁移11项已做软件检查。成功AI分支采用明确标注的模拟上游，仅验证流程；真实模型知识质量、教师审核与课堂试用尚未执行。材料中的12份验证草稿均为教师预设，不是真实学生记录。尚无可报告的学习提升或准确率。

## 教材署名与使用许可

教材及13张插图：OpenStax, *Anatomy and Physiology 2e*。Access for free at https://openstax.org/books/anatomy-and-physiology-2e/pages/1-introduction 。插图及相关改编教学内容按 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 非商业共享，保留原英文标签、署名及相同许可。逐图链接、哈希与许可见 `assets/来源与许可.json`。

无标签骨骼原图：Mikael Häggström，公有领域；来源见 `THIRD_PARTY_NOTICES.md`。软件源码开放用于本次作品展示；未声明额外开源代码许可。正式提交前须补齐真实身份和官方签字材料。
