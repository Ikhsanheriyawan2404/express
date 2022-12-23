const { validationResult } = require('express-validator')
const BlogPost = require('../models/blog')
const path = require('path')
const fs = require('fs')

exports.createBlogPost = (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err = new Error('error broh')
        err.errorStatus = 400
        err.data = errors.array()
        throw err
    }

    if (!req.file) {
        const err = new Error('Musti file bruh')
        err.errorStatus = 422
        throw err
    }

    const title = req.body.title
    const image = req.file.path
    const body = req.body.body

    const Posting = new BlogPost({
        title: title,
        body: body,
        image: image,
        author: {
            name: "Ikhsan Heriyawan"
        }
    })

    Posting.save()
        .then(result => {
            res.status(201).json({
                message: "Berhasil membuat blog",
                data: result,
            });
        })
        .catch(err => {
            res.status(400).json({
                message: 'Gagal pokoe mah',
                data: err.data,
            });
        });
}

exports.findAll = (req, res, next) => {
    BlogPost.find()
        .then(result => {
            res.status(200).json({
                message: 'List blogs',
                data: result
            })
        })
        .catch(err => {
            next(err)
        })
}

exports.findById = (req, res, next) => {

    const blogId = req.params.blogId

    BlogPost.find({
        _id: blogId
    }).then(result => {
        if (!result) {
            const error = new Error('Data Not Found')
            error.errorStatus = 404
            throw error;
        }
        res.status(200).json({
            message: "Data fdsfsaf assdfdf",
            data: result
        })
    }).catch(err => {
        next(err)
    })
}

exports.update = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err = new Error('error broh')
        err.errorStatus = 400
        err.data = errors.array()
        throw err
    }

    if (!req.file) {
        const err = new Error('Musti file bruh')
        err.errorStatus = 422
        throw err
    }

    const title = req.body.title
    const image = req.file.path
    const body = req.body.body
    const blogId = req.params.blogId

    BlogPost.findById(blogId)
        .then(post => {
            if (!post) {
                const err = new Error('Data Not Found')
                err.errorStatus = 404
                throw err
            }

            post.title = title
            post.body = body
            post.image = image

            return post.save()
        }) 
        .then(result => {
            res.status(201).json({
                message: "Berhasil mengupdate blog",
                data: result,
            });
        })
        .catch(err => {
            next(err)
        });
}

exports.destroy = (req, res, next) => {
    const blogId = req.params.blogId

    BlogPost.findById(blogId)
        .then(post => {
            if (!post) {
                const err = new Error('Data Not Found')
                err.errorStatus = 404
                throw err
            }

            removeImage(post.image)
            return BlogPost.findByIdAndRemove(blogId)
        })
        .then(result => {
            res.status(201).json({
                message: "Berhasil menghapus blog",
                data: null,
            });
        })
        .catch(err => {
            next(err)
        })
}

const removeImage = (filePath) => {
    filePath = path.join(__dirname, '../..', filePath)
    fs.unlink(filePath, err => console.log(err))
} 