import jwt from "jsonwebtoken";
import JWT_SECRET from '../constants.js'

const auth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const verifyResult = jwt.verify(token, JWT_SECRET)
        console.log(verifyResult)
        req.user = {
            email: verifyResult.email,
        }
        
        next()
    } catch(e) {
        res.redirect('/login')
    }
}

export default auth;