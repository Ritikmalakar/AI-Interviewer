import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 text-center max-w-lg w-full">
        {/* Icon */}
        <FaExclamationTriangle className="text-yellow-500 text-5xl sm:text-6xl md:text-7xl mx-auto mb-5" />

        {/* Error Code */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-800">
          404
        </h1>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mt-3">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm sm:text-base mt-4 leading-relaxed">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-block mt-6 sm:mt-8 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
