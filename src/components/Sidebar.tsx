import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <h1 className="text-xl font-bold px-5 pt-5 pb-2 border-b border-blue-700">
        Admin Panel
      </h1>

      <nav className="flex flex-col p-4 gap-3">
        <Link to="/" className="hover:bg-blue-00 p-2 rounded">Dashboard</Link>
        <Link to="/users" className="hover:bg-blue-700 p-2 rounded">Users</Link>
        <Link to="/blogs" className="hover:bg-blue-700 p-2 rounded">Blog Management</Link>
        <Link to="/reviews" className="hover:bg-blue-700 p-2 rounded">Review Management</Link>
        <Link to="/orders" className="hover:bg-blue-700 p-2 rounded">Orders</Link>
         <Link to="/setting" className="hover:bg-blue-700 p-2 rounded">Setting</Link>
      </nav>
    </div>
  );
}