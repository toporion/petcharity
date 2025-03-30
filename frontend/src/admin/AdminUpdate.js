import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

export default function AdminUpdate() {
    const { register, handleSubmit, reset } = useForm();
    const { id } = useParams();

    // Fetch Animal Data
    const { data: animals, isLoading, error } = useQuery({
        queryKey: ['animals', id],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:8080/api/animals/${id}`);
            return res.data.data;
        }
    });

    // Populate form with existing data
    useEffect(() => {
        if (animals) {
            reset({
                name: animals.name,
                breed: animals.breed,
                species: animals.species,
                color: animals.color,
                age: animals.age,
                rehomingFee: animals.rehomingFee,
                sex: animals.sex,
                arrivedDate: animals.arrivedDate,
                arrivedFrom: animals.arrivedFrom,
                size: animals.size,
                location: animals.location,
                adoptionStatus: animals.adoptionStatus
            });
        }
    }, [animals, reset]);

    const onSubmit = async (data) => {
        console.log("Submitting Data:", data);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('breed', data.breed);
        formData.append('species', data.species);
        formData.append('color', data.color);
        formData.append('age', data.age);
        formData.append('rehomingFee', data.rehomingFee);
        formData.append('sex', data.sex);
        formData.append('arrivedDate', data.arrivedDate);
        formData.append('arrivedFrom', data.arrivedFrom);
        formData.append('size', data.size);
        formData.append('location', data.location);
        formData.append('adoptionStatus', data.adoptionStatus);

        // ✅ Add Profile Image if provided
        if (data.profileImage?.[0]) {
            formData.append('profileImage', data.profileImage[0]);
        }

        try {
            const res = await axios.put(`http://localhost:8080/api/animals/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("Update Response:", res.data);
            reset();
            alert("Animal updated successfully!");
        } catch (error) {
            console.error("Error updating animal:", error);
            alert("Failed to update animal. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Update Animal Profile</h2>

            {isLoading && <p className="text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">Error fetching data</p>}

            {!isLoading && !error && (
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            {[
                                { label: "Name", name: "name", type: "text" },
                                { label: "Breed", name: "breed", type: "select", options: ["Labrador", "Bulldog", "Poodle", "Beagle"] },
                                { label: "Species", name: "species", type: "select", options: ["Dog", "Cat", "Rabbit"] },
                                { label: "Color", name: "color", type: "text" },
                                { label: "Age", name: "age", type: "text" },
                                { label: "Rehoming Fee", name: "rehomingFee", type: "number" },
                            ].map(({ label, name, type, options }) => (
                                <div key={name} className="flex flex-col md:flex-row md:items-center">
                                    <label className="md:w-32 mb-1 md:mb-0">{label}:</label>
                                    {type === "select" ? (
                                        <select {...register(name)} className="border p-2 flex-1 rounded">
                                            {options.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input {...register(name)} type={type} className="border p-2 flex-1 rounded" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            {[
                                { label: "Sex", name: "sex", type: "select", options: ["Male", "Female"] },
                                { label: "Arrived Date", name: "arrivedDate", type: "date" },
                                { label: "Arrived From", name: "arrivedFrom", type: "text" },
                                { label: "Size", name: "size", type: "select", options: ["Small (<15kg)", "Large (15-30kg)", "Extra Large (>30kg)"] },
                                { label: "Location", name: "location", type: "select", options: ["New York", "Los Angeles", "Chicago"] },
                                { label: "Adoption Status", name: "adoptionStatus", type: "select", options: ["In Rescue", "Adopted"] },
                            ].map(({ label, name, type, options }) => (
                                <div key={name} className="flex flex-col md:flex-row md:items-center">
                                    <label className="md:w-32 mb-1 md:mb-0">{label}:</label>
                                    {type === "select" ? (
                                        <select {...register(name)} className="border p-2 flex-1 rounded">
                                            {options.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input {...register(name)} type={type} className="border p-2 flex-1 rounded" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Profile Image Upload Field */}
                    <div className="mt-4 flex flex-col md:flex-row md:items-center">
                        <label className="md:w-32 mb-1 md:mb-0">Profile Image:</label>
                        <input {...register("profileImage")} type="file" className="border p-2 flex-1 rounded" accept="image/*" />
                    </div>

                    <div className="mt-6 text-center">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Update
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
