import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

const UsersTable = () => {
    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:8080/api/users');
            console.log('see', res.data.data);
            return res.data.data;
        }
    });

    const handleChangeRole = (id, role) => {
        axios.patch(`http://localhost:8080/api/role/${id}`, { role })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleDeleteUser=(id)=>{
        axios.delete(`http://localhost:8080/api/users/${id}`)
        .then(res=>{
            console.log(res.data)
        })
    }
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        <th className="py-2 px-4 border">Image</th>
                        <th className="py-2 px-4 border">Name</th>
                        <th className="py-2 px-4 border">Email</th>
                        <th className="py-2 px-4 border">Role</th>
                        <th className="py-2 px-4 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="text-center border-b hover:bg-gray-100">
                            <td className="py-2 px-4 border">
                                <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full mx-auto" />
                            </td>
                            <td className="py-2 px-4 border">{user.name}</td>
                            <td className="py-2 px-4 border">{user.email}</td>
                            <td className="py-2 px-4 border">
                                <select
                                    onChange={(e) => handleChangeRole(user._id, e.target.value)}
                                    className="border p-1 rounded"
                                >
                                    <option value="admin" selected={user.role === 'admin'}>admin</option>
                                    <option value="user" selected={user.role === 'user'}>user</option>
                                </select>
                            </td>
                            <td className="py-2 px-4 border">
                                <select onChange={()=>handleDeleteUser(user._id)} className="border p-1 rounded">
                                    <option value="edit">Edit</option>
                                    <option value="delete">Delete</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;