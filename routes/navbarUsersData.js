const router = require('express').Router()
const { verify } = require('./verifyToken')
const User = require('../model/User')

router.get('/navbarUserData', async (req, res) => {
    try {
        const allUsersData = await User.find();

        const allUsersDatatobeSent = [];

        allUsersData.map(data => {
            allUsersDatatobeSent.push({
                'id': data._id,
                'name': data.name,
                'profilePicture': data.profilePicture
            })
        })
        res.status(200).send({"allUsers": allUsersDatatobeSent })

    } catch (err) {
        res.status(401).send("Navbar data not fetched properly")
    }

})

module.exports = router