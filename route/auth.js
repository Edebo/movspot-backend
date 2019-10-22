import express from 'express'
import {signup,signin,signout,requireSigin} from '../controller/auth'
import {runValidation} from '../validator'
import {userSignupValidator,userSigninValidator} from'../validator/auth'

const router = express.Router()
router.post('/signup', userSignupValidator, runValidation,signup)
router.post('/signin', userSigninValidator, runValidation,signin)
router.get('/signout',signout)

module.exports =  router