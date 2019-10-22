import User from '../model/user'
// const shortId = require('shortid')
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
exports.signup = (req,res)=>{

    User.findOne({
        email:req.body.email
    }).exec((err,user)=>{
        if(user){
            return res.status(400).json({
                error:'email is taken'
            })
        }

        const {email,password,confirmPassword} = req.body
        
        if(confirmPassword!== password){
            res.status(400).json({
                status:'fail',
                message:'Ensure you password is the same as your Confirm Password'
            })
        }
    

        const newUser = new User({email,password})
    
        newUser.save((err,success)=>{
            if(err){
                return res.status(400).json({
                    status:'fail',
                    error:err
                })
            }

            res.status(201).json({
                status:'success',
                message:'User successfully create'
            })
        })
    })
    
}

exports.signin = (req,res)=>{
    const {email,password} = req.body
    //check if user exist
    User.findOne({
        email
    }).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                status:'fail',
                error:"User with the email doesnt exist.please signin"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                status:'fail',
                error:"Email and password doesnt match"
            })
        }

        const token = jwt.sign({_id:user._id},process.env.SECRET,{expiresIn:'1d'})
        //send token as cookie
        res.cookie('token',token,{expiresIn:'1d'})

        const {_id,email} = user

        return res.status(200).json({
            status:'success',
            token,
             _id,
            email            
            

        })
    })

}

exports.signout = (req,res) =>{
    res.clearCookie('token')
    res.json({
        message:"signout successful"
    })
}

exports.requireSignin = expressJwt({
    secret:process.env.SECRET
})