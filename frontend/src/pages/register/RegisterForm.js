import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

const RegisterForm = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        console.log(data); // You can handle the form submission here
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('password', data.password)
        if (data.profileImage && data.profileImage.length > 0) {
            formData.append('profileImage', data.profileImage[0]);
        }
        try {
            const res = await axios.post('http://localhost:8080/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }

            })
            console.log(res.data);
            // Show SweetAlert on successful registration
            Swal.fire({
                title: 'Welcome to Happy Paws',
                text: 'Registration Successful',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            reset()
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    };



    return (
        <div className="flex items-center justify-center mt-4 ">
            <div className="flex bg-white w-[800px] h-auto rounded-lg shadow-lg">
                {/* Left Section: Orange Color & "Join Us" */}
                <div className="flex-1 bg-orange-500 flex items-center justify-center rounded-l-lg">
                    <h2 className="text-white text-3xl font-bold">Join Us</h2>
                </div>

                {/* Right Section: Form */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full max-w-md space-y-4 "
                    >
                        <div className="mb-2">
                            <label className="block text-gray-700">Name</label>
                            <input
                                {...register('name', { required: "Name is required" })}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        <div className="mb-2">
                            <label className="block text-gray-700">Email</label>
                            <input
                                {...register('email', { required: "Email is required", pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/ })}
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        <div className="mb-2">
                            <label className="block text-gray-700">Password</label>
                            <input
                                {...register('password', { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } })}
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        <div className="mb-2">
                            <label className="block text-gray-700">Profile Image</label>
                            <input
                                {...register('profileImage', { required: "Profile image is required" })}
                                type="file"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.profileImage && <p className="text-red-500 text-sm">{errors.profileImage.message}</p>}
                        </div>

                        <div>
                            <button type="submit" className="w-full bg-orange-500 text-white p-3 rounded-md">
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
