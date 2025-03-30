import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import PetsList from "../pages/petList/PetsList";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../admin/AdminDashboard";
import AdminPets from "../admin/AdminPets";
import AdminDonations from "../admin/AdminDonations";
import AdminUsers from "../admin/AdminUsers";
import RegisterForm from "../pages/register/RegisterForm";
import ProtectedRoute from "./ProtectedRoute";
import CreatePet from "../admin/CreatePet";
import AdminAdoption from "../admin/AdminAdoption";
import AdoptForm from "../pages/adoptForm/AdoptForm";
import AdminUpdate from "../admin/AdminUpdate";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/login", element: <Login /> },
            { path: "/pet", element: <PetsList /> },
            {path:"/register",element:<RegisterForm/>},
            {path:"/adopt/:animalId",element:<AdoptForm/>}
        ]
    },
    {
        path: "/admin",
        element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
        children: [
            { path: "dashboard", element: <AdminDashboard /> },
            { path: "pets", element: <AdminPets /> },
            { path: "donations", element: <AdminDonations /> },
            { path: "users", element: <AdminUsers /> },
            { path: "petCreate", element:<CreatePet/> },
            { path: "adoptions", element:<AdminAdoption/> },
            { path: "update/:id", element:<AdminUpdate/> }
        ]
    }
]);

export default router;
