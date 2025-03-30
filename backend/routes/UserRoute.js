const { createUser, loginUser, getAllUser, getUserById, makeRole, deleteUser } = require('../controllers/UserController')
const imageUpload = require('../middlewares/imageUploader')

const route=require('express').Router()

route.post('/register',imageUpload.single('profileImage'),createUser)
route.post('/login',loginUser)
route.get('/users',getAllUser)
route.get('/users/:id',getUserById)
route.delete('/users/:id',deleteUser)
route.patch('/role/:id',makeRole)

module.exports=route