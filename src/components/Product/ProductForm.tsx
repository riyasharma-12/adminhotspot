
// import React, { useEffect, useMemo, useState } from "react";
// import { Form, Input, Button, Select, Upload, message } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { ArrowLeft } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// import {
//   createProduct,
//   updateProduct,
// } from "../../store/slices/productSlice";
// import {
//   fetchCategories,
  
// } from "../../store/slices/categorySlice";
// import { fetchSubCategories } from "../../store/slices/subCategorySlice";
// import type { RootState, AppDispatch } from "../../store/store";

// const ProductForm: React.FC = () => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const product = location.state?.product;
//   const isEdit = Boolean(product);

//   const { categories } = useSelector((state: RootState) => state.categories);
//   const { subCategories } = useSelector(
//     (state: RootState) => state.subCategories
//   );

//   const [fileList, setFileList] = useState<any[]>([]);

//   // Watch selected category
//   const selectedCategoryId = Form.useWatch("categoryId", form);

//   // Filter subcategories by category
//   const filteredSubCategories = useMemo(() => {
//     if (!selectedCategoryId) return [];
//     return subCategories.filter(
//       (s) => s.categoryId === selectedCategoryId
//     );
//   }, [selectedCategoryId, subCategories]);

//   // Initial load
//   useEffect(() => {
//     dispatch(fetchCategories(undefined));
//     dispatch(fetchSubCategories(undefined));

//     if (product) {
//       form.setFieldsValue({
//         title: product.title,
//         description: product.description,
//         price: product.price,
//         categoryId: product.categoryId ?? undefined,
//         subCategoryId: product.subCategoryId ?? undefined,
//       });

//       if (product.image) {
//         setFileList([
//           {
//             uid: "-1",
//             name: "image",
//             status: "done",
//             url: product.image,
//           },
//         ]);
//       }
//     }
//   }, [dispatch, product, form]);

//   // Submit handler
//   const onFinish = async (values: any) => {
//     if (!isEdit && fileList.length === 0) {
//       message.error("Product image is required");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("title", values.title);
//       formData.append("description", values.description);
//       formData.append("price", values.price);

//       if (values.categoryId) {
//         formData.append("categoryId", values.categoryId);
//       }

//       if (values.subCategoryId) {
//         formData.append("subCategoryId", values.subCategoryId);
//       }

//       if (fileList[0]?.originFileObj) {
//         formData.append("image", fileList[0].originFileObj);
//       }

//       if (isEdit) {
//         await dispatch(
//           updateProduct({ id: product.id, data: formData })
//         ).unwrap();
//         message.success("Product updated successfully");
//       } else {
//         await dispatch(createProduct(formData)).unwrap();
//         message.success("Product created successfully");
//       }

//       navigate("/dashboard/products");
//     } catch {
//       message.error("Failed to save product");
//     }
//   };

//   return (
//     <>
//       <Button
//         className="mb-4"
//         icon={<ArrowLeft />}
//         onClick={() => navigate("/dashboard/products")}
//       >
//         Go Back
//       </Button>

//       <div className="bg-white p-6 rounded-lg shadow max-w-xl">
//         <h2 className="text-xl font-semibold mb-4">
//           {isEdit ? "Edit Product" : "Add Product"}
//         </h2>

//         <Form layout="vertical" form={form} onFinish={onFinish}>
//           {/* TITLE */}
//           <Form.Item
//             name="title"
//             label="Product Title"
//             rules={[{ required: true, message: "Enter product title" }]}
//           >
//             <Input placeholder="Enter product title" />
//           </Form.Item>

//           {/* DESCRIPTION */}
//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: "Enter product description" }]}
//             getValueFromEvent={(content) => content}
//           >
//             <ReactQuill theme="snow" style={{ height: 200 }} />
//           </Form.Item>

//           {/* PRICE */}
//           <Form.Item
//             name="price"
//             label="Price"
//             rules={[{ required: true, message: "Enter price" }]}
//           >
//             <Input type="number" placeholder="Enter price" />
//           </Form.Item>

//           {/* CATEGORY (OPTIONAL) */}
//           <Form.Item name="categoryId" label="Category">
//             <Select
//               placeholder="Select category (optional)"
//               allowClear
//               onChange={() =>
//                 form.setFieldsValue({ subCategoryId: undefined })
//               }
//             >
//               {categories.map((c) => (
//                 <Select.Option key={c.id} value={c.id}>
//                   {c.name}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {/* SUBCATEGORY (OPTIONAL, DEPENDS ON CATEGORY) */}
//           <Form.Item
//             name="subCategoryId"
//             label="SubCategory"
//             dependencies={["categoryId"]}
//             rules={[
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (value && !getFieldValue("categoryId")) {
//                     return Promise.reject(
//                       new Error("Select category first")
//                     );
//                   }
//                   return Promise.resolve();
//                 },
//               }),
//             ]}
//           >
//             <Select
//               placeholder={
//                 selectedCategoryId
//                   ? "Select subcategory (optional)"
//                   : "Select category first"
//               }
//               allowClear
//               disabled={!selectedCategoryId}
//             >
//               {filteredSubCategories.map((s) => (
//                 <Select.Option key={s.id} value={s.id}>
//                   {s.name}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {/* IMAGE */}
//           <Form.Item label="Product Image">
//             <Upload
//               beforeUpload={() => false}
//               listType="picture"
//               maxCount={1}
//               fileList={fileList}
//               onChange={({ fileList }) => setFileList(fileList)}
//             >
//               <Button icon={<UploadOutlined />}>
//                 {fileList.length ? "Change Image" : "Upload Image"}
//               </Button>
//             </Upload>
//           </Form.Item>

//           <Button type="primary" htmlType="submit">
//             {isEdit ? "Update Product" : "Create Product"}
//           </Button>
//         </Form>
//       </div>
//     </>
//   );
// };

// export default ProductForm;

import React, { useEffect, useMemo, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Space,
  Card,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  createProduct,
  updateProduct,
} from "../../store/slices/productSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchSubCategories } from "../../store/slices/subCategorySlice";
import type { RootState, AppDispatch } from "../../store/store";

/* ================= TYPES ================= */
type ImageSlot = {
  file?: File;
  preview?: string;
};

type Description = {
  title: string;
  info: string;
};

/* ================= COMPONENT ================= */
const ProductForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;
  const isEdit = Boolean(product);

  const { categories } = useSelector((state: RootState) => state.categories);
  const { subCategories } = useSelector(
    (state: RootState) => state.subCategories
  );

  /* ================= STATE ================= */
  const [descriptions, setDescriptions] = useState<Description[]>([
    { title: "", info: "" },
  ]);

  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(
    Array.from({ length: 5 }, () => ({}))
  );

  /* ================= CATEGORY WATCH ================= */
  const selectedCategoryId = Form.useWatch("categoryId", form);

  const filteredSubCategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    return subCategories.filter(
      (s) => s.categoryId === selectedCategoryId
    );
  }, [selectedCategoryId, subCategories]);

  /* ================= INIT ================= */
  useEffect(() => {
    dispatch(fetchCategories(undefined));
    dispatch(fetchSubCategories(undefined));

    if (product) {
      form.setFieldsValue({
        title: product.title,
        price: product.price,
        categoryId: product.categoryId ?? undefined,
        subCategoryId: product.subCategoryId ?? undefined,
      });

      if (product.descriptions?.length) {
        setDescriptions(product.descriptions);
      }

      if (product.images?.length) {
        const slots = Array.from({ length: 5 }, (_, i) => ({
          preview: product.images[i]?.url,
        }));
        setImageSlots(slots);
      }
    }
  }, [dispatch, product, form]);

  /* ================= IMAGE HANDLER ================= */
  const handleImageChange = (index: number, file: File) => {
    const updated = [...imageSlots];
    updated[index] = {
      file,
      preview: URL.createObjectURL(file),
    };
    setImageSlots(updated);
  };

  /* ================= DESCRIPTION HANDLERS ================= */
  const addDescription = () =>
    setDescriptions([...descriptions, { title: "", info: "" }]);

  const removeDescription = (index: number) =>
    setDescriptions(descriptions.filter((_, i) => i !== index));

  /* ================= SUBMIT ================= */
  const onFinish = async (values: any) => {
    if (!isEdit && imageSlots.every((slot) => !slot.file)) {
      message.error("At least one product image is required");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("price", values.price);

      if (values.categoryId) formData.append("categoryId", values.categoryId);
      if (values.subCategoryId)
        formData.append("subCategoryId", values.subCategoryId);

      imageSlots.forEach((slot) => {
        if (slot.file) {
          formData.append("images", slot.file);
        }
      });

      formData.append("descriptions", JSON.stringify(descriptions));

      if (isEdit) {
        await dispatch(
          updateProduct({ id: product.id, data: formData })
        ).unwrap();
        message.success("Product updated successfully");
      } else {
        await dispatch(createProduct(formData)).unwrap();
        message.success("Product created successfully");
      }

      navigate("/dashboard/products");
    } catch {
      message.error("Failed to save product");
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <Button
        className="mb-4"
        icon={<ArrowLeft />}
        onClick={() => navigate("/dashboard/products")}
      >
        Go Back
      </Button>

      <Card className="max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        <Form layout="vertical" form={form} onFinish={onFinish}>
          {/* TITLE */}
          <Form.Item name="title" label="Product Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          {/* PRICE */}
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          {/* CATEGORY */}
          <Form.Item name="categoryId" label="Category">
            <Select
              allowClear
              onChange={() => form.setFieldsValue({ subCategoryId: undefined })}
            >
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* SUBCATEGORY */}
          <Form.Item name="subCategoryId" label="SubCategory">
            <Select allowClear disabled={!selectedCategoryId}>
              {filteredSubCategories.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* DESCRIPTIONS */}
          <Form.Item label="Product Descriptions">
            {descriptions.map((desc, index) => (
              <Space key={index} direction="vertical" style={{ width: "100%" }}>
                <Input
                  placeholder="Description Title"
                  value={desc.title}
                  onChange={(e) => {
                    const next = [...descriptions];
                    next[index].title = e.target.value;
                    setDescriptions(next);
                  }}
                />

                <ReactQuill
                  theme="snow"
                  value={desc.info}
                  onChange={(value) => {
                    const next = [...descriptions];
                    next[index].info = value;
                    setDescriptions(next);
                  }}
                  placeholder="Enter description details..."
                />

                {descriptions.length > 1 && (
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeDescription(index)}
                  >
                    Remove
                  </Button>
                )}
              </Space>
            ))}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addDescription}
              className="mt-3"
            >
              Add Description
            </Button>
          </Form.Item>

          {/* IMAGE SLOTS */}
          <Form.Item label="Product Images (Up to 5)">
            <div className="grid grid-cols-5 gap-4">
              {imageSlots.map((slot, index) => (
                <Upload
                  key={index}
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleImageChange(index, file);
                    return false;
                  }}
                >
                  <div className="border rounded-md h-24 flex items-center justify-center cursor-pointer">
                    {slot.preview ? (
                      <img
                        src={slot.preview}
                        alt={`img-${index}`}
                        className="h-full w-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="text-xs text-gray-500 text-center">
                        <UploadOutlined />
                        <br />
                        Image {index + 1}
                      </div>
                    )}
                  </div>
                </Upload>
              ))}
            </div>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            {isEdit ? "Update Product" : "Create Product"}
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default ProductForm;
