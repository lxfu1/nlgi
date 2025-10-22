const express = require('express');
const Joi = require('joi');
const router = express.Router();

// Mock storage for generated icons (in production, use a database)
let iconLibrary = [];

/**
 * POST /api/icons/save
 * Save generated icons to library
 */
router.post('/save', async (req, res) => {
  try {
    const schema = Joi.object({
      icons: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          description: Joi.string().required(),
          svg: Joi.string().required(),
          category: Joi.string().required()
        })
      ).required(),
      collection_name: Joi.string().optional().default('Untitled Collection')
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const collection = {
      id: Date.now().toString(),
      name: value.collection_name,
      icons: value.icons,
      created_at: new Date().toISOString(),
      icon_count: value.icons.length
    };

    iconLibrary.push(collection);

    res.json({
      success: true,
      data: collection
    });

  } catch (error) {
    console.error('Save icons error:', error);
    res.status(500).json({
      error: 'Failed to save icons',
      message: error.message
    });
  }
});

/**
 * GET /api/icons/library
 * Get saved icon collections
 */
router.get('/library', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);

    const collections = iconLibrary.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        collections: collections,
        total: iconLibrary.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(iconLibrary.length / limit)
      }
    });

  } catch (error) {
    console.error('Get library error:', error);
    res.status(500).json({
      error: 'Failed to get icon library',
      message: error.message
    });
  }
});

/**
 * GET /api/icons/:id
 * Get specific icon collection by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const collection = iconLibrary.find(c => c.id === id);

    if (!collection) {
      return res.status(404).json({
        error: 'Collection not found'
      });
    }

    res.json({
      success: true,
      data: collection
    });

  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({
      error: 'Failed to get collection',
      message: error.message
    });
  }
});

/**
 * DELETE /api/icons/:id
 * Delete icon collection
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const index = iconLibrary.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: 'Collection not found'
      });
    }

    const deleted = iconLibrary.splice(index, 1)[0];

    res.json({
      success: true,
      data: {
        message: 'Collection deleted successfully',
        deleted_collection: deleted
      }
    });

  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json({
      error: 'Failed to delete collection',
      message: error.message
    });
  }
});

/**
 * POST /api/icons/validate
 * Validate SVG code
 */
router.post('/validate', async (req, res) => {
  try {
    const schema = Joi.object({
      svg: Joi.string().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const { svg } = value;

    // Basic SVG validation
    const isValid = svg.includes('<svg') && svg.includes('</svg>') && svg.includes('</');

    res.json({
      success: true,
      data: {
        is_valid: isValid,
        size: svg.length,
        element_count: (svg.match(/<(circle|rect|path|polygon|polyline|ellipse|line|g)/g) || []).length
      }
    });

  } catch (error) {
    console.error('Validate SVG error:', error);
    res.status(500).json({
      error: 'Failed to validate SVG',
      message: error.message
    });
  }
});

module.exports = router;