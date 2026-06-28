import React, { useState } from "react";
import { toast } from "react-toastify";
import { baseUrlUser } from "../../Axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

export default function Login() {
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const changeData = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };
  const dispatch = useDispatch();

  const submitData = async (e) => {
    e.preventDefault();

    try {
      const { data } = await baseUrlUser.post("/login", formdata);

      if (data?.success) {
        dispatch(setUserData(data.user));
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      dispatch(setUserData(null));
      toast.error(error?.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          AI Interview
        </h1>

        <p className="text-center text-gray-500 mt-2">Login to continue</p>

        <form onSubmit={submitData} className="mt-8 space-y-5">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formdata.email}
              onChange={changeData}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formdata.password}
              onChange={changeData}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>

          <p className="text-center text-gray-500">
            Don't have an account?
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer ml-1 hover:underline"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
