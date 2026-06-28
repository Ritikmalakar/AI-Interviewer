return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 via-gray-900 to-black px-4 py-8">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
        AI Interview
      </h1>

      <p className="text-center text-gray-500 mt-2 text-sm sm:text-base">
        Login to continue
      </p>

      <form onSubmit={submitData} className="mt-6 sm:mt-8 space-y-5">
        {/* Email */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formdata.email}
            onChange={changeData}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm sm:text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formdata.password}
            onChange={changeData}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm sm:text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold text-sm sm:text-base"
        >
          Login
        </button>

        {/* Register */}
        <p className="text-center text-gray-500 text-sm sm:text-base">
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer ml-1 hover:underline font-medium"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  </div>
);
