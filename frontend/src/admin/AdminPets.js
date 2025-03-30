import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UseAuth from '../hook/UseAuth';

const AdminPets = () => {
    const { loading: authLoading } = UseAuth();  // ✅ Check auth loading
    const [activeTab, setActiveTab] = useState("requests");
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);  // ✅ Loading state for pets

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8080/api/animals')
            .then(res => {
                console.log('Fetched pets:', res.data.data);
                setPets(res.data.data);
            })
            .catch(err => {
                console.error("Error fetching pets:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                setPets(pets.filter(pet => pet._id !== id));
                Swal.fire("Deleted!", "The pet has been removed.", "success");
            }
        });
    };

    // ✅ Show loading if authentication or pet data is loading
    if (authLoading || loading) {
        return <p className="text-center text-lg font-bold">Loading...</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Manage Pets</h1>
            <p className="mb-4">List, edit, delete, and add new pets.</p>

            {/* Navigation Tabs */}
            <div className="mb-4 flex space-x-4 border-b pb-2">
                <button onClick={() => setActiveTab("requests")} className={activeTab === "requests" ? "font-bold border-b-2 border-blue-500" : ""}>Adoption Requests</button>
                <button onClick={() => setActiveTab("pets")} className={activeTab === "pets" ? "font-bold border-b-2 border-blue-500" : ""}>Pet Listings</button>
            </div>

            {/* Pet Listings */}
            {activeTab === "pets" && (
                <div>
                    <Link to={'/admin/petCreate'}>
                        <button className="mb-4 bg-green-500 text-white px-4 py-2 rounded">Add Pet</button>
                    </Link>

                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Breed</th>
                                <th className="border p-2">Age</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pets.map(pet => (
                                <tr key={pet._id} className="text-center">
                                    <td className="border p-2">{pet.name}</td>
                                    <td className="border p-2">{pet.breed}</td>
                                    <td className="border p-2">{pet.age}</td>
                                    <td className="border p-2">
                                        <Link to={`/admin/update/${pet._id}`}>
                                            <button className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded">Edit</button>
                                        </Link>
                                        <button onClick={() => handleDelete(pet._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPets;
