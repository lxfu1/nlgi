# AI Icon Factory 🎨

一个基于 AI 的图标生成器，用户可以通过一句话生成可编辑、可导出的 SVG 图标集。

![AI Icon Factory](https://img.shields.io/badge/AI-Icon%20Factory-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/nodejs-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## ✨ 功能特性

- 🤖 **AI 驱动生成**: 通过自然语言描述生成高质量 SVG 图标
- 🎨 **多种风格支持**: 现代、极简、经典、详细等多种设计风格
- ✏️ **在线编辑**: 颜色、尺寸、描边等属性实时调整
- 📦 **多格式导出**: 支持 SVG、PNG、JPG 格式导出
- 🔧 **SVG 代码编辑**: 直接编辑 SVG 源代码
- 📚 **图标库管理**: 保存和管理生成的图标集合
- 📱 **响应式设计**: 完美适配桌面和移动设备
- ⚡ **实时预览**: 所见即所得的编辑体验

<img width="1223" height="998" alt="image" src="https://github.com/user-attachments/assets/3039de9b-85bd-4f1b-8d9e-05c5a1307f4e" />


## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/lxfu1/nlgi.git
cd ai-icon-factory
```

### 2. 快速启动 (推荐)

```bash
./quick-start.sh
```

这个脚本会自动：
- ✅ 检查 Node.js 版本
- ✅ 安装所有依赖
- ✅ 启动开发服务器

### 3. 手动启动

```bash
# 安装所有依赖
npm run install-all

# 启动开发服务器
npm run dev
```

### 4. 配置 AI API

编辑 `server/.env` 文件，添加你的[智谱AI API 密钥](https://bigmodel.cn/usercenter/proj-mgmt/apikeys)：

```env
AI_API_KEY=your_actual_zhipuai_api_key_here
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 5. 访问应用

- **前端**: http://localhost:3000
- **后端 API**: http://localhost:3001
- **健康检查**: http://localhost:3001/health

## 📖 使用指南

### 生成图标

1. **描述你的想法**: 在左侧输入框中详细描述你想要的图标
   - 例如："一个现代简约的设置齿轮图标"
   - 例如："一个可爱的云朵上传符号"

2. **选择风格**: 根据需要选择图标风格
   - **Modern**: 现代化设计，适合 UI 界面
   - **Minimal**: 极简风格，线条简洁
   - **Classic**: 经典风格，传统设计
   - **Detailed**: 详细设计，包含更多细节

3. **设置数量**: 选择生成图标的数量 (1-8 个)

4. **点击生成**: AI 将为你创建一组相关的图标变体

### 编辑图标

1. **选择图标**: 点击生成的图标进行选择
2. **编辑模式**: 点击悬停时显示的编辑按钮
3. **调整属性**:
   - 🎨 **颜色**: 使用颜色选择器或预设颜色
   - 📏 **尺寸**: 调整图标大小 (16px - 128px)
   - ✏️ **描边**: 修改线条粗细
   - 📝 **代码**: 直接编辑 SVG 源代码

### 导出图标

1. **批量选择**: 选择多个图标进行批量操作
2. **选择格式**: 支持 SVG、PNG、JPG 格式
3. **设置尺寸**: PNG/JPG 可选择导出尺寸
4. **下载文件**: 单个下载或批量导出

### 管理图标库

1. **保存集合**: 将选中的图标保存为集合
2. **命名集合**: 为图标集起一个有意义的名称
3. **查看历史**: 浏览之前保存的图标集合

## 🎯 使用技巧

### 优化描述效果

- ✅ **具体描述**: "蓝色圆形背景中的白色加号"
- ✅ **指定风格**: "扁平化设计的购物车图标"
- ✅ **包含尺寸**: "24x24 像素的用户头像轮廓"
- ❌ **模糊描述**: "一个图标"
- ❌ **过于复杂**: "一个复杂的场景包含多个元素"

### 编辑建议

- 使用 **Modern** 风格获得最适合 UI 的图标
- SVG 格式支持无限缩放，推荐优先使用
- PNG/JPG 适合固定尺寸的应用场景
- 可以通过编辑 SVG 代码实现更复杂的效果

## 🏗 项目结构

```
ai-icon-factory/
├── client/                 # React 前端应用
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── services/       # API 服务
│   │   ├── types/          # TypeScript 类型定义
│   │   └── utils/          # 工具函数
│   └── public/             # 静态资源
├── server/                 # Node.js 后端服务
│   ├── routes/             # API 路由
│   ├── services/           # 业务逻辑
│   ├── middleware/         # 中间件
│   └── utils/              # 工具函数
├── README.md               # 项目说明
├── package.json            # 项目配置
└── quick-start.sh          # 快速启动脚本
```

## 🔧 开发命令

```bash
# 开发环境
npm run dev              # 同时启动前后端开发服务器
npm run server           # 仅启动后端服务器
npm run client           # 仅启动前端开发服务器

# 构建
npm run build            # 构建生产版本
npm start                # 启动生产服务器

# 依赖管理
npm run install-all      # 安装所有依赖
```

## 📝 API 文档

### 生成图标
```http
POST /api/ai/generate
Content-Type: application/json

{
  "prompt": "设置齿轮图标",
  "style": "modern",
  "count": 6
}
```

### 保存图标集合
```http
POST /api/icons/save
Content-Type: application/json

{
  "icons": [...],
  "collection_name": "我的图标集"
}
```

### 获取图标库
```http
GET /api/icons/library?page=1&limit=10
```

## 🐛 故障排除

### 常见问题

**Q: AI 生成失败怎么办？**
A: 检查以下几点：
- 确认智谱AI API 密钥已正确配置
- 检查网络连接是否正常
- 确认描述文本清晰具体

**Q: 图标无法下载？**
A: 尝试以下解决方案：
- 检查浏览器是否阻止了下载
- 尝试不同的导出格式
- 清除浏览器缓存后重试

**Q: 编辑功能不正常？**
A: 可能的解决方案：
- 确认浏览器支持现代 JavaScript 特性
- 检查 SVG 代码格式是否正确
- 刷新页面重新加载

### 调试模式

启用调试模式查看详细日志：

```bash
# 后端调试
DEBUG=* npm run server

# 前端调试
# 在浏览器开发者工具中查看 Console 面板
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情

---

<div align="center">
  <p>如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！</p>
  <p>Made with ❤️ by AI Icon Factory Team</p>
</div>
