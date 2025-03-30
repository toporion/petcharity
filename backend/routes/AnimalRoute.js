const { adoptionRequest, getAdoptionRequest, adoptionCotroll, getAvailableAnimals, generateReceipt } = require('../controllers/AdoptionController');
const { createAnimal, getAnimals, getAnimalById, updateAnimal } = require('../controllers/AnimalController');
const animalUpload = require('../middlewares/AnimalImage');

const route=require('express').Router()


route.post('/animal', animalUpload.fields([
{ name: 'profileImage', maxCount: 2 },
]), createAnimal);
route.get('/animals', getAnimals);
route.put('/animals/:id', updateAnimal);
route.get('/animals/:id', getAnimalById);
route.post('/animals/adopt',adoptionRequest)
route.get('/adoption',getAdoptionRequest)
route.put('/animals/adoption/:id',adoptionCotroll)
route.get('/animals/available-animals',getAvailableAnimals)
route.get('/receipt/:id', generateReceipt)

module.exports=route