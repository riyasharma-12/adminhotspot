import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { fetchBenefits, createBenefit, updateBenefit, deleteBenefit, } from "../../store/slices/benefitSlice";
import { List, Button, Drawer, Form, Input, Popconfirm, message, } from "antd";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";


import type { AppDispatch, } from "../../store/store";

interface BenefitItemForm {
  title: string;
  description: string;
}

const BenefitAdmin: React.FC = () => {
//   const dispatch = useDispatch();
const dispatch = useDispatch<AppDispatch>();
  const { benefits, loading, error } = useSelector((state: RootState) => state.benefits);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<any>(null);

  const [form] = Form.useForm();

  const [items, setItems] = useState<BenefitItemForm[]>([]);

  useEffect(() => {
    dispatch(fetchBenefits());
  }, [dispatch]);

  const openDrawer = (benefit?: any) => {
    if (benefit) {
      setEditingBenefit(benefit);
      form.setFieldsValue({
        heading: benefit.heading,
        description: benefit.description,
      });
      setItems(benefit.items || []);
    } else {
      setEditingBenefit(null);
      form.resetFields();
      setItems([]);
    }
    setDrawerVisible(true);
  };

  const handleAddItem = () => {
    if (items.length >= 6) {
    message.error("You can add maximum 6 items.");
    return;
  }
    setItems([...items, { title: "", description: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index: number, key: "title" | "description", value: string) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (items.length === 0) {
        message.error("Please add at least one item");
        return;
      }
      
      if (items.length > 6) {
      message.error("Maximum 6 items allowed.");
      return;
    }

      const data = {
        heading: values.heading,
        description: values.description,
        items,
      };

      if (editingBenefit) {
        await dispatch(updateBenefit({ id: editingBenefit.id, data }));
        message.success("Benefit updated successfully");
      } else {
        await dispatch(createBenefit(data));
        message.success("Benefit created successfully");
      }

      setDrawerVisible(false);
      setEditingBenefit(null);
      setItems([]);
      form.resetFields();
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteBenefit(id));
    message.success("Benefit deleted successfully");
  };

  const navigate = useNavigate();

  return (
    
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Benefits</h1>
        <div className="flex gap-2">
             {/* <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  onClick={() => navigate("/dashboard/planList")}
                >
                 List Plan
                </Button> */}
           <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  onClick={() => navigate("/dashboard/faqList")}
                >
                 List Faq
                </Button>
    
        <Button type="primary" icon={<Plus size={16} />} onClick={() => openDrawer()}>
          Add Benefit
        </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : benefits.length === 0 ? (
        <p>No benefits found.</p>
      ) : (
        // <List
        //   dataSource={benefits}
        //   renderItem={(benefit) => (
        //     <List.Item
        //       actions={[
        //         <Button key="edit" icon={<Edit2 size={14} />} onClick={() => openDrawer(benefit)}>
        //           Edit
        //         </Button>,
        //         <Popconfirm
        //           key="delete"
        //           title="Are you sure you want to delete this benefit?"
        //           onConfirm={() => handleDelete(benefit.id)}
        //           okText="Yes"
        //           cancelText="No"
        //         >
        //           <Button danger icon={<Trash2 size={14} />}>
        //             Delete
        //           </Button>
        //         </Popconfirm>,
        //       ]}
        //     >
        //       <List.Item.Meta
        //         title={benefit.heading}
        //         description={benefit.description}
        //       />
        //       <div>
        //         {benefit.items.map((item: any, index: number) => (
        //           <div key={index} className="ml-4">
        //             <strong>{item.title}:</strong> {item.description}
        //           </div>
        //         ))}
        //       </div>
        //     </List.Item>
        //   )}
        // />

        <List
  dataSource={benefits}
  renderItem={(benefit) => (
    <div className="bg-white p-5 rounded-xl shadow-md mb-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {benefit.heading}
          </h2>
          <p className="text-gray-600 mt-1">{benefit.description}</p>
        </div>

        <div className="flex gap-2">
          <Button
            key="edit"
            type="primary"
            icon={<Edit2 size={14} />}
            onClick={() => openDrawer(benefit)}
          >
            Edit
          </Button>

          <Popconfirm
            key="delete"
            title="Are you sure you want to delete this benefit?"
            onConfirm={() => handleDelete(benefit.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<Trash2 size={14} />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>

      {/* Items */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Items</h3>

        <ul className="space-y-2">
          {benefit.items.map((item: any, index: number) => (
            <li
              key={index}
              className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full"></div>

              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )}
/>

      )}

      {/* Drawer Form */}
      <Drawer
        title={editingBenefit ? "Edit Benefit" : "Add Benefit"}
        width={500}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="heading"
            label="Heading"
             rules={[
      { required: true, message: "Enter heading" },
      { max: 80, message: "Heading must be at most 80 characters" },
    ]}
          >
           <Input maxLength={80} showCount />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
           rules={[
      { required: true, message: "Enter description" },
      { max: 300, message: "Description must be at most 300 characters" },
    ]}
          >
             <Input.TextArea rows={3} maxLength={300} showCount />
          </Form.Item>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Items</h3>
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <Input
                  placeholder="Title"
                   maxLength={80}  
                   showCount
                  value={item.title}
                  onChange={(e) => handleItemChange(index, "title", e.target.value)}
                />
                <Input
                  placeholder="Description"
                   maxLength={150}  // LIMIT 80 characters
                   showCount
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                />
                <Button danger onClick={() => handleRemoveItem(index)}>
                  X
                </Button>
              </div>
            ))}
            <Button type="dashed" onClick={handleAddItem} disabled={items.length >= 6}>
              + Add Item
            </Button>
          </div>

          <Button type="primary" block onClick={handleSubmit}>
            {editingBenefit ? "Update Benefit" : "Create Benefit"}
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default BenefitAdmin;
