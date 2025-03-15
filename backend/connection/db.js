const mongoose=require('mongoose')
const mongo_url=process.env.MONGO_URL;

mongoose.connect(mongo_url)
.then(()=>{
    console.log('successfully connect with database')
})
.catch(error=>{
    console.log('see happen error',error)
})