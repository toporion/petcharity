import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminAdoption = () => {
    const [activeTab, setActiveTab] = useState("requests");
    const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [adoptedUsers, setAdoptedUsers] = useState([]);

    // Fetch Adoption Requests
    useEffect(() => {
        axios.get("http://localhost:8080/api/adoption")
            .then((res) => setAdoptionRequests(res.data))
            .catch((error) => console.error("Error fetching adoption requests:", error));

        // Fetch users who adopted
        axios.get("http://localhost:8080/api/adoption?status=Accepted")
            .then((res) => setAdoptedUsers(res.data))
            .catch((error) => console.error("Error fetching adopted users:", error));
    }, []);

    // Handle Approve
    const handleApprove = (id) => {
        Swal.fire({
            title: "Approve Adoption?",
            text: "Are you sure you want to approve this adoption?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Approve",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`http://localhost:8080/api/animals/adoption/${id}`, { status: "Accepted" })
                    .then((res) => {
                        setAdoptionRequests((prev) =>
                            prev.map((req) =>
                                req._id === id ? { ...req, status: "Accepted" } : req
                            )
                        );
                        setAdoptedUsers((prev) => [...prev, res.data]);
                        Swal.fire("Approved!", "The adoption request has been approved.", "success");
                    })
                    .catch((error) => {
                        console.error("Error approving adoption:", error);
                        Swal.fire("Error!", "Could not approve adoption.", "error");
                    });
            }
        });
    };

    // Handle Reject
    const handleReject = (id) => {
        Swal.fire({
            title: "Reject Adoption?",
            text: "Are you sure you want to reject this adoption?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Reject",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`http://localhost:8080/api/animals/adoption/${id}`, { status: "Rejected" })
                    .then((res) => {
                        setAdoptionRequests((prev) =>
                            prev.map((req) =>
                                req._id === id ? { ...req, status: "Rejected" } : req
                            )
                        );
                        Swal.fire("Rejected!", "The adoption request has been rejected.", "success");
                    })
                    .catch((error) => {
                        console.error("Error rejecting adoption:", error);
                        Swal.fire("Error!", "Could not reject adoption.", "error");
                    });
            }
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Manage Adoptions</h1>

            {/* Tab Navigation */}
            <div className="flex gap-4 my-4 border-b pb-2">
                <button
                    onClick={() => setActiveTab("requests")}
                    className={`px-4 py-2 rounded ${activeTab === "requests" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Adoption Requests
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Who Requested
                </button>
                <button
                    onClick={() => setActiveTab("adopted")}
                    className={`px-4 py-2 rounded ${activeTab === "adopted" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Who Adopted
                </button>
            </div>

            {/* Adoption Requests Tab */}
            {activeTab === "requests" && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Adoption Requests</h2>
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Animal</th>
                                <th className="p-2 border">Requested By</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adoptionRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">
                                        No adoption requests found.
                                    </td>
                                </tr>
                            ) : (
                                adoptionRequests.map((req) => (
                                    <tr key={req._id} className="border">
                                        <td className="p-2">{req.animal?.name || "N/A"}</td>
                                        <td className="p-2">{req.user?.name || "N/A"}</td>
                                        <td className="p-2">{req.status}</td>
                                        <td className="p-2">
                                            {req.status === "Pending" ? (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(req._id)}
                                                        className="px-2 py-1 bg-green-500 text-white rounded mr-2"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req._id)}
                                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-gray-600">{req.status}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Who Requested Tab */}
            {activeTab === "users" && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Users Who Requested</h2>
                    <ul className="list-disc pl-6">
                        {adoptionRequests.length === 0 ? (
                            <p>No adoption requests found.</p>
                        ) : (
                            adoptionRequests.map((req) => (
                                <li key={req._id}>
                                    {req.user?.email || "N/A"} - {req.user?.name || "N/A"}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}

            {/* Who Adopted Tab */}
            {activeTab === "adopted" && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Who Adopted</h2>
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Adopter Name</th>
                                <th className="p-2 border">Adopted Animal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adoptedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="text-center p-4">
                                        No adoptions completed yet.
                                    </td>
                                </tr>
                            ) : (
                                adoptedUsers.map((req) => (
                                    <tr key={req._id} className="border">
                                        <td className="p-2">{req.user?.name || "N/A"}</td>
                                        <td className="p-2">{req.animal?.name || "N/A"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminAdoption;
