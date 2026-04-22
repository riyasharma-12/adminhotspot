// export default function Header() {
//   return (
//     <div className="bg-gray-900 shadow p-4 flex justify-between">
//       <h2 className="font-semibold text-white">Admin Dashboard</h2>
//       {/* <div className=" text-white">Admin</div> */}
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth tokens / session
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className="bg-gray-900 shadow p-4 flex justify-between items-center">
      <h2 className="font-semibold text-white">Admin Dashboard</h2>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-md transition-all duration-150"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>
    </div>
  );
}