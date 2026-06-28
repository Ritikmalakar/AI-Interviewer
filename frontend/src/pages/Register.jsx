return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 via-gray-900 to-black px-4 py-8">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
        AI Interview
      </h1>

      <p className="text-center text-gray-500 mt-2 text-sm sm:text-base">
        Create your account
      </p>

      <form onSubmit={submitData} className="mt-6 sm:mt-8 space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={changeData}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={changeData}
            placeholder="Enter your email"
            className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={changeData}
            placeholder="Create a password"
            className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm sm:text-base hover:bg-blue-700 transition"
        >
          Create Account
        </button>

        {/* Login */}
        <p className="text-center text-gray-500 text-sm sm:text-base">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="ml-1 text-blue-600 cursor-pointer hover:underline font-medium"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  </div>
);
