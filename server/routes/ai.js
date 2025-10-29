const express = require('express');
const Joi = require('joi');
const aiService = require('../services/aiService');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// AI generation specific rate limit (more restrictive)
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 AI requests per minute
  message: {
    error: 'Too many AI generation requests, please try again later.',
    retryAfter: 60
  }
});

// Input validation schema
const generateSchema = Joi.object({
  prompt: Joi.string().required().min(3).max(500).messages({
    'string.empty': 'Prompt cannot be empty',
    'string.min': 'Prompt must be at least 3 characters long',
    'string.max': 'Prompt must not exceed 500 characters',
    'any.required': 'Prompt is required'
  }),
  style: Joi.object({
    value: Joi.string().required(),
    desc: Joi.string().required(),
    label: Joi.string().optional()
  }).required(),
  count: Joi.number().optional().integer().min(1).max(8).default(6)
});

// Apply AI rate limiter to all routes
router.use(aiLimiter);

/**
 * POST /api/ai/generate
 * Generate SVG icons from text description
 */
router.post('/generate', async (req, res) => {
  try {
    // Validate input
    const { error, value } = generateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const { prompt, style, count } = value;

    // Check if AI service is configured
    if (!process.env.AI_API_KEY) {
      return res.status(503).json({
        error: 'AI service not configured',
        message: 'Server is missing AI API configuration'
      });
    }

    console.log(
      `🎨 Generating icons for prompt: "${prompt}" with style: ${style}`
    );

    // Generate icons using AI service
    const result = await aiService.generateIcons(prompt, { style, count });

    // Limit the number of icons returned
    if (result.icons.length > count) {
      result.icons = result.icons.slice(0, count);
    }

    console.log(`✅ Generated ${result.icons.length} icons successfully`);

    res.json({
      success: true,
      data: {
        prompt: prompt,
        style: style,
        count: result.icons.length,
        icons: result.icons,
        generated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Icon generation failed:', error.message);

    // Handle specific error types
    if (error.message.includes('API key')) {
      return res.status(503).json({
        error: 'AI service error',
        message: 'Invalid or missing AI API key'
      });
    }

    if (
      error.message.includes('quota') ||
      error.message.includes('rate limit')
    ) {
      return res.status(429).json({
        error: 'AI service rate limit',
        message: 'AI service rate limit exceeded, please try again later',
        retryAfter: 60
      });
    }

    res.status(500).json({
      error: 'Failed to generate icons',
      message: error.message
    });
  }
});

/**
 * GET /api/ai/health
 * Check AI service health
 */
router.get('/health', async (req, res) => {
  try {
    const isConfigured = !!process.env.AI_API_KEY;

    res.json({
      status: 'OK',
      ai_service: {
        configured: isConfigured,
        provider: 'zhipuai',
        model: 'glm-4'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
