const router = require('express').Router();
const { verify } = require('./verifyToken')
const User = require('../model/User')
const multer = require('multer');
const Post = require('../model/Post');
const cloudinary = require("../cloudinary")
const upload = multer({ storage: multer.diskStorage({}) })

router.get('/profile', verify, async (req, res) => {
    const userId = req.user._id;
    const profileUser = await User.findOne({ _id: userId })
        .populate({
            path: 'posts',
            model: Post,
            populate: [{
                path: 'comments',
                populate: { path: 'owner' }
            },
            {
                path: 'owner'
            }, {
                path: 'likes'
            }],
            options:{ sort: [{createdAt: -1 }] }
        });
        
    const currentUser = await User.findById(req.user._id)
    
    res.status(200).json({ 'profileUser': profileUser, "currentUser": { "name": currentUser.name, "id": currentUser._id } });

})

router.post('/updateProfile', verify, upload.single('profilePicture'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if(req.file){

            const result = cloudinary.uploader.upload(req.file.path)

            user.profilePicture = (await result).secure_url

            user.cloudinary_id = (await result).public_id
        }
        
        user.bio = req.body.bio

        const savedUser = await user.save()

        res.status(200).json({ 'picture': savedUser.profilePicture })

    } catch (err) {
        res.status(401).send(err)
    }
})

router.post('/userProfile', verify, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
            .populate({
                path: 'posts',
                model: Post,
                populate: [{
                    path: 'comments',
                    populate: { path: 'owner' }
                },
                {
                    path: 'owner'
                }, {
                    path: 'likes'
                }]
            });
        const data = {
            name: user.name,
            profilePicture: user.profilePicture,
            posts: user.posts,
            noOfPosts: user.posts.length,
            noOfFollowers: user.followers.length,
            noOfFollowings: user.followings.length
        }

        const currentUser = await User.findById(req.user._id)
        res.status(200).send({ 'userDetail': data, "currentUser": { "name": currentUser.name, "id": currentUser._id } })
    } catch (err) {
        res.status(401).send(err)
    }
})


module.exports = router;