const AnimalModel = require("../models/AnimalModel");

const createAnimal=async(req,res)=>{
    try{
        const animalData=req.body;
        const files=req.files
        const profileImage=files.profileImage ? files.profileImage[0].path :null;
        const newAnimal= new AnimalModel({
            ...animalData,
            profileImage
        })
        await newAnimal.save()
        res.status(200).json({
            success:true,
            message:"successfully create animal data",
            data:newAnimal
        })
    }catch(error){
        console.log('see full error',error)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
const updateAnimal=async(req,res)=>{
    try{
        const {id}=req.params;
        const updateData=req.body;
        const files=req.files
        
      if(files && files.profileImage){
        updateData.profileImage=files.profileImage[0].path;
      }
      
        const updateAnimal= await AnimalModel.findByIdAndUpdate(
            id,
            updateData,
           {new:true}
        )
        if (!updateAnimal) {
            return res.status(404).json({
                success: false,
                message: "Animal not found"
            });
        }
        res.status(200).json({
            success:true,
            message:"successfully create animal data",
            data:updateAnimal
        })
    }catch(error){
        console.log('see full error',error)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
const getAnimals = async (req, res) => {
    try {
        const filters = {};
        const { breed, species, location, age, sex } = req.query;

        if (breed) filters.breed = breed;
        if (species) filters.species = species;
        if (location) filters.location = location;
        if (age) filters.age = age;
        if (sex) filters.sex = sex;

        const animals = await AnimalModel.find(filters);
        res.status(200).json({
            success: true,
            data: animals,
        });
    } catch (error) {
        console.error("Error fetching animals:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getAnimalById=async(req,res)=>{
    try{
        const {id}=req.params;
        const singleAnimal=await AnimalModel.findById(id)
        res.status(200).json({
            success:true,
            message:"get successfully item",
            data:singleAnimal
        })
    }catch(error){
        console.log('see the error',error)
        res.status(500).json({success:false,message:'Internal server error'})
    }
}

module.exports={createAnimal,getAnimals,getAnimalById,updateAnimal}