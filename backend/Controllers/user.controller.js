const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieOptions = require('../Utils/cookieOptions.utils');
const userModel = require('../Model/User.Model');
const { errorResponse, successResponse } = require('../Utils/response.utils');
const User = require('../Model/User.Model');

const register = async(req, res) =>{
    const {name, email, password, role} = req.body;

    const existed = await userModel.findOne({email});
    existed && errorResponse(res, "Email already registered, please use another account")

    const hashedPassword = await bcrypt.hash(password,10);

    try {
        const user = await userModel.create({
            name,
            email,
            password:hashedPassword,
            role
        })
        return successResponse(res, "Successfully to register user", {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        })
    } catch (error) {
        return errorResponse(res, "something went wrong", {message: error.message})
    }
}

const login = async(req, res) =>{
    const {email, password} = req.body;

    //cari user
    const user = await User.findOne({email:email});
    if(!user) return errorResponse(res, "email not found, please try again",null);

    //cocokan passwor user
    const match = await bcrypt.compare(password, user.password);
    if(!match) return errorResponse(res, "wrong password, please try again",null);

    //buat jwt agar mendapatkan akses
    
    const token = jwt.sign({id: user.id, role:user.role}, process.env.JWT_SECRET, {expiresIn: "2d"});

    res.cookie("token", token, cookieOptions(req));

    return successResponse(res, "Login successful", ({
        userId: user.id,
        email: email,
        role: user.role,
        token: token
    }));
}

const logout = async(req, res) =>{
    res.clearCookie("token", {
        ...cookieOptions(req),
        maxAge: undefined, //agar cookie terhapus
    });

    return successResponse(res, "logout succefuly")
}


module.exports = {register, login, logout}