const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.AI_API_KEY;
    this.baseURL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

    if (!this.apiKey) {
      console.warn('⚠️  AI_API_KEY not found in environment variables');
    }
  }

  async generateIcons(prompt, options = {}) {
    try {
      const systemPrompt = `你是一个专业的 SVG 图标设计师。根据用户描述生成高质量、现代化的 SVG 图标。

要求：
1. 生成 4-6 个相关的 SVG 图标变体
2. 每个图标都要简洁、清晰、现代化
3. 使用纯色设计，适合 UI 界面使用
4. SVG 代码要简洁，使用 path、circle、rect 等基本元素
5. 图标尺寸建议 24x24 或 32x32 视图框
6. 提供每个图标的简短描述

返回格式：
{
  "icons": [
    {
      "name": "图标名称",
      "description": "图标描述",
      "svg": "<svg>...</svg>",
      "category": "分类"
    }
  ]
}

示例：
用户输入："设置齿轮图标"
返回包含不同风格的齿轮图标变体`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请为以下描述生成 SVG 图标集：${prompt}` }
      ];

      const response = await axios.post(
        this.baseURL,
        {
          model: 'glm-4.6',
          messages: messages,
          temperature: 0.8,
          max_tokens: 4000
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 300000 // 5 分钟超时
        }
      );

      const aiResponse = response.data.choices[0].message.content;

      // 尝试解析 AI 返回的 JSON
      let iconData;
      try {
        iconData = JSON.parse(aiResponse);
      } catch (parseError) {
        // 如果解析失败，尝试从文本中提取 SVG
        iconData = this.extractSVGFromText(aiResponse);
      }

      return this.validateAndCleanIcons(iconData);
    } catch (error) {
      console.error('AI Service Error:', error.response?.data || error.message);
      throw new Error(
        'Failed to generate icons: ' +
          (error.response?.data?.error?.message || error.message)
      );
    }
  }

  extractSVGFromText(text) {
    // 如果 AI 返回的不是标准 JSON，尝试提取 SVG 代码
    const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/g;
    const svgMatches = text.match(svgRegex) || [];

    const icons = svgMatches.slice(0, 6).map((svg, index) => ({
      name: `图标 ${index + 1}`,
      description: `AI 生成的图标 ${index + 1}`,
      svg: svg,
      category: 'ai-generated'
    }));

    return { icons };
  }

  validateAndCleanIcons(iconData) {
    if (!iconData.icons || !Array.isArray(iconData.icons)) {
      throw new Error('Invalid icon data structure');
    }

    const validIcons = iconData.icons.filter((icon) => {
      if (!icon.svg || typeof icon.svg !== 'string') return false;
      if (!icon.svg.includes('<svg')) return false;
      return true;
    });

    if (validIcons.length === 0) {
      throw new Error('No valid SVG icons found in response');
    }

    return {
      icons: validIcons.map((icon) => ({
        ...icon,
        name: icon.name || 'Untitled Icon',
        description: icon.description || 'AI generated icon',
        category: icon.category || 'ai-generated',
        svg: this.cleanSVG(icon.svg)
      }))
    };
  }

  cleanSVG(svg) {
    // 清理和优化 SVG 代码
    return svg.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
  }
}

module.exports = new AIService();
