
import { ShieldCheck, ListOrdered } from "lucide-react";
import { UserOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { fetchUsers } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import React, { useEffect } from "react";



const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users: users = [] } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const stats = [
    {
      title: "Total Users",
      value: users?.length,
      icon: <UserOutlined className="text-3xl text-blue-500" />,
    },
    // {
    //   title: "Total Orders",
    //   value: orders?.length,
    //   icon: <ListOrdered className="text-3xl text-green-500" />,
    // },
    // {
    //   title: "Total Bookings",
    //   value: bookings?.length,
    //   icon: <ShieldCheck className="w-8 h-8 text-purple-500" />,
    // },
  ];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div>
            <h3 className="text-lg font-medium text-gray-600">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default Home;
