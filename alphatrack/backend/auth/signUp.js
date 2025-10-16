import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//allows to create several routers (GET,POST,PUT,DELETE) with request and export to import inside app.js
const signupRouter = express.Router();

//POST api/users/signup
signupRouter.post('/signup', async(req, res)=>{
    //avoid creating duplicated users 
    let user;
    user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already exist')

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    });

    try{
        await user.save();

        const token = jwt.sign({
            _id: user._id,
            role: user.role,
        },process.env.JWT_SECRET,{
            //for safety 
            expiresIn: '1h',
        });

        res
            .status(201)
            .header('Authorization', token)
            .json({
               user: {
               name: user.name,
               email: user.email,
               role: user.role,
        },
        token,
    });
    }catch(error){
        res.status(500).send('Something went wrong')
    }
});

export default signupRouter;