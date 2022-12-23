const express = require("express");
const blogController  = require('../controllers/blogController');
const router = express.Router();
const { body } = require('express-validator')

router.use((error, req, res, next) => {
    const status = error.errorStatus || 500
    const message = error.message
    const data = error.array()
    res.status(status).json({message: message, data: data})
})

router.post('/blogs', [
    body('title').isLength({min: 5}).withMessage('title is required'),
    body('body').isLength({min: 5}).withMessage('body is required')
], blogController.createBlogPost);
router.get('/blogs', blogController.findAll);
router.get('/blogs/:blogId', blogController.findById);
router.put('/blogs/:blogId',  [
    body('title').isLength({min: 5}).withMessage('title is required'),
    body('body').isLength({min: 5}).withMessage('body is required')
], blogController.update);
router.delete('/blogs/:blogId', blogController.destroy);

module.exports = router;