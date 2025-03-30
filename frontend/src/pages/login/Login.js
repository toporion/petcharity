import { useForm } from "react-hook-form";
import UseAuth from "../../hook/UseAuth";

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { loginUser } = UseAuth()
    const onSubmit = async (data) => {
        try {
            console.log("Login Data:", data);

            const res = await loginUser(data.email, data.password);

            if (!res || !res.data) {
                console.error("Invalid response from loginUser:", res);
                return;
            }

            console.log("Login Successful:", res.data);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };


    return (
        <div className="max-w-sm mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Field */}
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" } })}
                        className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
                        className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                    Login
                </button>
            </form>
        </div>
    );
}
