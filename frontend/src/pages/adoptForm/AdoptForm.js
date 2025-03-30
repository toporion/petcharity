import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../authProvider/AuthProvider';

const AdoptForm = () => {
    const { user } = useContext(AuthContext);
    const { animalId, } = useParams();
   
    const userId=user?._id;
    const { data: animal, isLoading, error } = useQuery({
        queryKey: ['animal', animalId],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:8080/api/animals/${animalId}`);
            return res.data.data;
        }
    });

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        if (!userId) {
            alert("You must be logged in to adopt a cat.");
            return;
          }
        // Add the animalId to the form data and submit the adoption request
        axios.post('http://localhost:8080/api/animals/adopt', {
            ...data,
            userId,
            animalId,  // Associate adoption with the specific animal
        })
        .then(response => {
            console.log("Adoption form submitted", response.data);
        })
        .catch(error => {
            console.error("Error submitting form", error);
        });
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;
    if (!animal) return <p>No animal found</p>;

    return (
        <div className="flex justify-center gap-8 py-8">
            {/* Pet Info Card */}
            <div className=" h-[500px] p-4 border border-gray-300 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold mb-4">{animal.name}</h2>
                <img src={animal.profileImage} alt={animal.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <p><strong>Breed:</strong> {animal.breed}</p>
                <p><strong>Species:</strong> {animal.species}</p>
                <p><strong>Color:</strong> {animal.color}</p>
                <p><strong>Age:</strong> {animal.age} years</p>
                <p><strong>Sex:</strong> {animal.sex}</p>
                <p><strong>Rehoming Fee:</strong> ${animal.rehomingFee}</p>
                <p><strong>Adoption Status:</strong> {animal.adoptionStatus}</p>
            </div>

            {/* Adoption Form */}
            <div className="max-w-xl w-full p-6 border border-gray-300 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Adopt {animal.name}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        placeholder="Your Name"
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    {errors.name && <span className="text-red-500">{errors.name.message}</span>}

                    <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        placeholder="Your Email"
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    {errors.email && <span className="text-red-500">{errors.email.message}</span>}

                    <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        placeholder="Your Phone Number"
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    {errors.phone && <span className="text-red-500">{errors.phone.message}</span>}

                    <input
                        type="text"
                        {...register('address', { required: 'Address is required' })}
                        placeholder="Your Address"
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    {errors.address && <span className="text-red-500">{errors.address.message}</span>}

                    <input
                        type="text"
                        {...register('housingType', { required: 'Please select housing type' })}
                        placeholder="Type of Housing"
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    {errors.housingType && <span className="text-red-500">{errors.housingType.message}</span>}

                    <input
                        type="text"
                        {...register('ownOrRent', { required: 'Please specify if you own or rent' })}
                        placeholder="Do you own or rent?"
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    {errors.ownOrRent && <span className="text-red-500">{errors.ownOrRent.message}</span>}

                    <textarea
                        {...register('message', { required: 'Please tell us why you want to adopt this pet' })}
                        placeholder="Why do you want to adopt?"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        rows="4"
                    />
                    {errors.message && <span className="text-red-500">{errors.message.message}</span>}

                    <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-md">Submit Adoption Request</button>
                </form>
            </div>
        </div>
    );
};

export default AdoptForm;
