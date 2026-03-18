import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <h1 className="text-xl font-bold px-5 pt-5 pb-2 border-b border-blue-700">
        Admin Panel
      </h1>

      <nav className="flex flex-col p-4 gap-3">
        <Link to="/" className="hover:bg-blue-00 p-2 rounded">Dashboard</Link>
        <Link to="/reports" className="hover:bg-blue-700 p-2 rounded">Report</Link>
        <Link to="/schools" className="hover:bg-blue-700 p-2 rounded">Schools</Link>
        <Link to="/users" className="hover:bg-blue-700 p-2 rounded">Users</Link>
        <Link to="/moderation" className="hover:bg-blue-700 p-2 rounded">Moderation</Link>
        <Link to="/payments" className="hover:bg-blue-700 p-2 rounded">Payments</Link>
        <Link to="/messaging" className="hover:bg-blue-700 p-2 rounded">Messaging</Link>
        {/* <Link to="/settings" className="hover:bg-blue-700 p-2 rounded">Settings</Link> */}
      </nav>
    </div>
  );
}