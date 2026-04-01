import jwt from "jsonwebtoken";
import User from "./models/User.js";
import bcrypt from 'bcrypt';
import JWT_SECRET from './constants.js'

const addUser = async (email, password) => {
    const passwordHash = await bcrypt.hash(password, 10)
    await User.create({ email, password: passwordHash });
} 

const loginUser = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('User not found')
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new Error('Wrong password')
    }

    return jwt.sign({ email }, JWT_SECRET, {expiresIn: '30d'});
}

export {
    addUser, loginUser
}