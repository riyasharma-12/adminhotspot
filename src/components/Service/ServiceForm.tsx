import React, { useState, useEffect } from "react";
import { Button, Upload, message, Input } from "antd";
import { ArrowLeft, UploadCloud, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createService, updateService } from "../../store/slices/serviceSlice";

const ServiceForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<any>();

  const service = location.state?.service;

  const [heading, setHeading] = useState("");
  const [items, setItems] = useState<
    { id?: number; title: string; description: string; image?: any }[]
  >([{ title: "", description: "", image: [] }]);

  useEffect(() => {
    if (service) {
      setHeading(service.heading);

      setItems(
        service.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image
            ? [
                {
                  uid: String(item.id),
                  name: item.image.split("/").pop(),
                  status: "done",
                  url: item.image,
                },
              ]
            : [],
        }))
      );
    }
  }, [service]);

  // Add new empty item
  const handleAddItem = () => {
    if (items.length >= 5) {
    return message.error("You can add maximum 5 service items.");
  }
    setItems([...items, { title: "", description: "", image: [] }]);
  };

  // Update item fields
  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length > 5) {
  return message.error("A service cannot have more than 5 items.");
}

   
    if (heading.length > 250) {
      return message.error("Heading cannot exceed 70 characters.");
    }

    for (let item of items) {
      if (item.title.length > 50) {
        return message.error("Item title cannot exceed 50 characters.");
      }
      if (item.description.length > 200) {
        return message.error("Item description cannot exceed 200 characters.");
      }
    }

    const formData = new FormData();
    formData.append("heading", heading);

    // IMPORTANT: Send IDs + existing image URLs too
    formData.append(
      "items",
      JSON.stringify(
        items.map((item) => ({
          id: item.id ?? null,
          title: item.title,
          description: item.description,
          image:
            item.image &&
            item.image[0] &&
            !item.image[0].originFileObj
              ? item.image[0].url // existing S3 image
              : null, // replaced or removed
        }))
      )
    );

    // Append only NEW images
    items.forEach((item) => {
      if (item.image && item.image[0]?.originFileObj) {
        formData.append("images", item.image[0].originFileObj);
      }
    });

    try {
      if (service) {
        await dispatch(updateService({ id: service.id, formData })).unwrap();
        message.success("Service updated successfully");
      } else {
        await dispatch(createService(formData)).unwrap();
        message.success("Service created successfully");
      }

      navigate("/dashboard/services");
    } catch (error: any) {
      message.error(error || "Failed to save service");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-6">
      <Button
        icon={<ArrowLeft size={16} />}
        className="mb-6"
        onClick={() => navigate("/dashboard/services")}
      >
        Go Back
      </Button>

      <h2 className="text-2xl font-semibold mb-6">
        {service ? "Update Service" : "Create Service"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-semibold block mb-1">Heading</label>
          <Input
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            required
            className="rounded-lg"
            maxLength={250}
            showCount
          />
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg mb-4 space-y-3 bg-gray-50"
          >
            <h3 className="font-semibold">Item {index + 1}</h3>

            <Input
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                handleItemChange(index, "title", e.target.value)
              }
              required
               maxLength={50}
            showCount
            />

            <Input.TextArea
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
              rows={3}
               maxLength={200}
            showCount
              required
            />

            <Upload
              fileList={item.image}
              beforeUpload={() => false}
              onChange={({ fileList }) =>
                handleItemChange(index, "image", fileList)
              }
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadCloud size={16} />}>
                {item.image && item.image.length > 0
                  ? "Change Image"
                  : "Upload Image"}
              </Button>
            </Upload>
          </div>
        ))}

        <Button type="dashed" icon={<Plus />} onClick={handleAddItem}>
          Add Another Item
        </Button>

        <Button type="primary" htmlType="submit" className="w-full mt-4">
          {service ? "Update Service" : "Create Service"}
        </Button>
      </form>
    </div>
  );
};

export default ServiceForm;
