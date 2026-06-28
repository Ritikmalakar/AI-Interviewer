import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-lg w-full">
        <FaExclamationTriangle className="text-yellow-500 text-7xl mx-auto mb-6" />

        <h1 className="text-7xl font-extrabold text-gray-800">404</h1>

        <h2 className="text-3xl font-bold text-gray-700 mt-3">
          Page Not Found
        </h2>

        <p className="text-gray-500 mt-4">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
