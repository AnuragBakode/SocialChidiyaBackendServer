const jwt = require('jsonwebtoken')

const  verify = function(req , res , next){
    const token = req.header('token')
    if(!token) return res.status(401).send('Access Denied')

    try {
        const verified = jwt.verify(token , process.env.TOKEN_SECRET , (err , res) => {
            if(err) {
                if(err.name == 'TokenExpiredError'){
                    return "token expired"
                }
                return "Invalid User"
                
            }
            return res
        })

        if(verified == 'token expired'){
            return res.status(400).send('Invalid token')
        }
        req.user = verified
    } catch (error) {
        res.status(400).send("Invalid Credentials")
    }

    next()
}

module.exports.verify = verify