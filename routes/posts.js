const router = require('express').Router()
const { verify } = require('./verifyToken')
const multer = require('multer')
const Post = require('../model/Post')
// const upload = multer({ dest: 'uploads/' })
const cloudinary = require('../cloudinary')
const upload = multer({ storage: multer.diskStorage({}) })
const Comment = require('../model/Comment')
const User = require('../model/User')

router.get('/posts', verify, async (req, res) => {
    const page = req.query.page
    try {
        const skip = (page - 1) * 2

        const allPosts = await Post.find().populate('likes').populate('owner').populate({ path: 'comments', populate: { path: 'owner' } }).sort({createdAt : -1}).limit(2).skip(skip);
        const currentUser = await User.findById(req.user._id)
        const count = await Post.estimatedDocumentCount()
        const pageCount = Math.ceil(count / 2)
        res.status(200).send({"pageCount" : pageCount, "allPosts": allPosts, "CurrentUser": { "name": currentUser.name, "id": currentUser._id } });
    } catch (error) {
        res.status(401).send(error)
    }
})


router.post('/uploadPost', verify, upload.single('image'), async (req, res) => {
    try {

        const result = cloudinary.uploader.upload(req.file.path)
        const post = new Post({
            description: req.body.description,
            imgUrl: (await result).secure_url,
            owner: req.user._id,
            cloudinary_id: (await result).public_id
        })

        const savedPost = await post.save();
        const user = await User.findById(req.user._id);
        user.posts.push(savedPost)
        const savedUser = await user.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(401).send(error)
    }
})

router.post('/uploadComment', verify, async (req, res) => {
    const comment = new Comment({
        description: req.body.description,
        owner: req.user._id
    })


    try {
        const savedComment = await comment.save();
        const postObj = await Post.findById(req.body.postId);
        postObj.comments.push(savedComment._id);
        const newPost = postObj.save();
        res.json(savedComment);
    } catch (error) {
        res.status(401).send(error)
    }
})


router.post('/dislikePost', verify, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id)
        const currentPost = await Post.findById(req.body.postId).populate('likes')
        let index = -1;
        for (id in currentPost.likes) {
            if (JSON.stringify(currentPost.likes[id]) === JSON.stringify(currentUser)) {
                index = id;
                break
            }
        }

        currentPost.likes.splice(index, 1);

        const updatedPostWithLike = currentPost.save()
    } catch (err) {
        res.status(401).send(err)
    }
})

router.post('/likePost', verify, async (req, res) => {

    try {
        const currentUser = await User.findById(req.user._id)
        const currentPost = await Post.findById(req.body.postId)

        currentPost.likes.push(currentUser)

        const updatedPostWithLike = currentPost.save()
    } catch (err) {
        res.status(200).send("Can not like")
    }
})

router.post('/deletePost/:id', verify, async (req, res) => {

    try {
        const currentPost = await Post.findById(req.params.id).populate('comments')

        await cloudinary.uploader.destroy(currentPost.cloudinary_id)

        const postOwner = await User.findById(currentPost.owner)

        var index = postOwner.posts.indexOf(currentPost._id);


        postOwner.posts.splice(index, 1);
        postOwner.save();

        currentPost.comments.map(async (comment) => {
            // const currentComment = await Comment.findById(comment._id);
            const deletedComment = await Comment.deleteOne({ _id: comment._id })
        })

        const deletedPost = await Post.deleteOne({ _id: req.params.id })
        res.status(200).send('Post deleted Successfully')
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/deleteComment/:postId/:commentId', verify, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)

        var index = post.comments.indexOf(req.params.commentId);

        post.comments.splice(index, 1);
        post.save();

        const deletedComment = await Comment.deleteOne({ _id: req.params.commentId })

        res.status(200).send("Comment Deleted Successfully")
    }catch(err){
        res.status(400).send(err)
    }
    

})

module.exports = router;