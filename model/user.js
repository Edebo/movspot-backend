import mongoose from 'mongoose'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
   
 email:{
        type:String,
        trim:true,
        required:true,
        maxlength:32,
       
    },
    hash_password:{
        type:String,
        required:true
    },
    salt:String
   

},{timestamps:true})

userSchema.virtual('password')
.set(function(password){
        //create a temporary varible to stre password
        this._password = password

        //generate salt
        this.salt = this.makeSalt()

        //encrypt password and save in hashpassord

        this.hash_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

userSchema.methods = {
    authenticate:function(loginPassword){
        return this.encryptPassword(loginPassword) === this.hash_password
    },
    encryptPassword:function (password) {
        if(!password) return ''

        try{
            return crypto.createHmac('sha1',this.salt)
            .update(password)
            .digest('hex')
        }catch(e){

        }
    },
    makeSalt:function(){
        return Math.round(new Date().valueOf()* Math.random()*'')
    }
}

module.exports = mongoose.model('User',userSchema)