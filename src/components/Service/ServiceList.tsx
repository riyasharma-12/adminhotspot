
import React, { useEffect } from "react";
import { Button, message, Image, List } from "antd";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { fetchServices, deleteService } from "../../store/slices/serviceSlice";

const ServiceList: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { services, loading } = useSelector((state: RootState) => state.services);
  console.log(services)

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await dispatch(deleteService(id)).unwrap();
      message.success("Service deleted successfully");
    } catch (error) {
      message.error("Failed to delete service");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Services</h1>
        {services.length === 0 && (
                                    
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate("/dashboard/serviceForm")}
        >
          Create Service
        </Button>
)}
      </div>

      {loading ? (
        <p className="text-center py-6">Loading...</p>
      ) : services.length === 0 ? (
        <p className="text-center py-6">No services found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 font-semibold">Heading</th>
                <th className="p-3 font-semibold">Items</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b hover:bg-gray-50 align-top">
                  <td className="p-3">{service.heading}</td>
                  <td className="p-3">
                    {service.items.length === 0 ? (
                      <p>No items</p>
                    ) : (
                      <List
                        dataSource={service.items}
                        renderItem={(item: any) => (
                          <List.Item>
                            <div className="flex items-start gap-3">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  width={60}
                                  height={60}
                                  style={{ objectFit: "cover", borderRadius: 4 }}
                                  preview={true} // enable image preview
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
                                  No Image
                                </div>
                              )}
                              <div>
                                <p className="font-semibold mb-1">{item.title}</p>
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2">

                    <Button
                      icon={<Edit2 size={16} />}
                      onClick={() =>
                        navigate("/dashboard/serviceForm", { state: { service } })
                      }
                    />
                    <Button
                      icon={<Trash2 size={16} />}
                      danger
                      onClick={() => handleDelete(service.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
