import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Deactivated Account Access Attempted:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 text-red-600 rounded-full p-4">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M5.93 19h12.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L4.2 16c-.77 1.33.19 3 1.73 3z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Account Deactivated
        </h1>

        <p className="text-gray-600 mb-6">
          Your account has been deactivated.  
          Please contact <span className="font-semibold">Tommy & Furry Admin</span>
          for further assistance.
        </p>

        <a
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
