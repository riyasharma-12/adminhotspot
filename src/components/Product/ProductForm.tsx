

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Form,
//   Input,
//   Button,
//   Select,
//   Upload,
//   message,
//   Space,
//   Card,
// } from "antd";
// import {
//   UploadOutlined,
//   PlusOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import { ArrowLeft } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// import {
//   createProduct,
//   updateProduct,
// } from "../../store/slices/productSlice";
// import { fetchCategories } from "../../store/slices/categorySlice";
// import { fetchSubCategories } from "../../store/slices/subCategorySlice";
// import type { RootState, AppDispatch } from "../../store/store";


// type ImageSlot = {
//   file?: File;
//   preview?: string;
// };

// type Description = {
//   title: string;
//   info: string;
// };


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

//   /* ================= STATE ================= */
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [imagesChanged, setImagesChanged] = useState(false);

//   const [descriptions, setDescriptions] = useState<Description[]>([
//     { title: "", info: "" },
//   ]);

//   const [imageSlots, setImageSlots] = useState<ImageSlot[]>(
//     Array.from({ length: 5 }, () => ({}))
//   );

//   /* ================= CATEGORY WATCH ================= */
//   const selectedCategoryId = Form.useWatch("categoryId", form);

//   const filteredSubCategories = useMemo(() => {
//     if (!selectedCategoryId) return [];
//     return subCategories.filter(
//       (s) => s.categoryId === selectedCategoryId
//     );
//   }, [selectedCategoryId, subCategories]);

//   /* ================= INIT ================= */
//   useEffect(() => {
//     dispatch(fetchCategories({ page: 1, limit: 1000 }));
//     // dispatch(fetchSubCategories(undefined));
//     dispatch(fetchSubCategories({ page: 1, limit: 1000 }));


//     if (product) {
//       form.setFieldsValue({
//         title: product.title,
//         price: product.price,
//         categoryId: product.categoryId ?? undefined,
//         subCategoryId: product.subCategoryId ?? undefined,
//       });

//       if (product.descriptions?.length) {
//         setDescriptions(product.descriptions);
//       }

//       if (product.images?.length) {
//         const slots = Array.from({ length: 5 }, (_, i) => ({
//           preview: product.images[i]?.url,
//         }));
//         setImageSlots(slots);
//       }
//     }
//   }, [dispatch, product, form]);

//   /* ================= IMAGE HANDLERS ================= */
//   const handleImageChange = (index: number, file: File) => {
//     const updated = [...imageSlots];
//     updated[index] = {
//       file,
//       preview: URL.createObjectURL(file),
//     };
//     setImageSlots(updated);
//     setImagesChanged(true);
//   };

//   const removeImage = (index: number) => {
//     const updated = [...imageSlots];
//     updated[index] = {};
//     setImageSlots(updated);
//     setImagesChanged(true);
//   };

//   /* ================= DESCRIPTION HANDLERS ================= */
//   const addDescription = () =>
//     setDescriptions([...descriptions, { title: "", info: "" }]);

//   const removeDescription = (index: number) =>
//     setDescriptions(descriptions.filter((_, i) => i !== index));

//   /* ================= SUBMIT ================= */
//   const onFinish = async (values: any) => {
//     if (isSubmitting) return;

//     if (!isEdit && imageSlots.every((slot) => !slot.file)) {
//       message.error("At least one product image is required");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const formData = new FormData();
//       formData.append("title", values.title);
//       formData.append("price", values.price);

//       if (values.categoryId)
//         formData.append("categoryId", values.categoryId);
//       if (values.subCategoryId)
//         formData.append("subCategoryId", values.subCategoryId);

//       // ✅ Only send images if creating OR images changed
//       if (!isEdit || imagesChanged) {
//         imageSlots.forEach((slot) => {
//           if (slot.file) {
//             formData.append("images", slot.file);
//           }
//         });
//       }

//       formData.append("descriptions", JSON.stringify(descriptions));

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
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <>
//       <Button
//         className="mb-4"
//         icon={<ArrowLeft />}
//         onClick={() => navigate("/dashboard/products")}
//       >
//         Go Back
//       </Button>

//       <Card className="max-w-3xl">
//         <h2 className="text-xl font-semibold mb-4">
//           {isEdit ? "Edit Product" : "Add Product"}
//         </h2>

//         <Form layout="vertical" form={form} onFinish={onFinish}>
//           <Form.Item
//             name="title"
//             label="Product Title"
//             rules={[{ required: true }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="price"
//             label="Price"
//             rules={[{ required: true }]}
//           >
//             <Input type="number" />
//           </Form.Item>

//           <Form.Item name="categoryId" label="Category">
//             <Select
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

//           <Form.Item name="subCategoryId" label="SubCategory">
//             <Select allowClear disabled={!selectedCategoryId}>
//               {filteredSubCategories.map((s) => (
//                 <Select.Option key={s.id} value={s.id}>
//                   {s.name}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item label="Product Descriptions">
//             {descriptions.map((desc, index) => (
//               <Space
//                 key={index}
//                 direction="vertical"
//                 style={{ width: "100%" }}
//               >
//                 <Input
//                   placeholder="Description Title"
//                   value={desc.title}
//                   onChange={(e) => {
//                     const next = [...descriptions];
//                     next[index].title = e.target.value;
//                     setDescriptions(next);
//                   }}
//                 />

//                 <ReactQuill
//                   theme="snow"
//                   value={desc.info}
//                   onChange={(value) => {
//                     const next = [...descriptions];
//                     next[index].info = value;
//                     setDescriptions(next);
//                   }}
//                 />

//                 {descriptions.length > 1 && (
//                   <Button
//                     danger
//                     icon={<DeleteOutlined />}
//                     onClick={() => removeDescription(index)}
//                   >
//                     Remove
//                   </Button>
//                 )}
//               </Space>
//             ))}

//             <Button
//               type="dashed"
//               icon={<PlusOutlined />}
//               onClick={addDescription}
//               className="mt-3"
//             >
//               Add Description
//             </Button>
//           </Form.Item>

//           <Form.Item label="Product Images (Up to 5)">
//             <div className="grid grid-cols-5 gap-4">
//               {imageSlots.map((slot, index) => (
//                 <div key={index} className="relative">
//                   <Upload
//                     showUploadList={false}
//                     beforeUpload={(file) => {
//                       handleImageChange(index, file);
//                       return false;
//                     }}
//                   >
//                     <div className="border rounded-md h-24 flex items-center justify-center cursor-pointer overflow-hidden">
//                       {slot.preview ? (
//                         <img
//                           src={slot.preview}
//                           alt={`img-${index}`}
//                           className="h-full w-full object-cover"
//                         />
//                       ) : (
//                         <div className="text-xs text-gray-500 text-center">
//                           <UploadOutlined />
//                           <br />
//                           Image {index + 1}
//                         </div>
//                       )}
//                     </div>
//                   </Upload>

//                   {slot.preview && (
//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
//                       className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </Form.Item>

//           <Button
//             type="primary"
//             htmlType="submit"
//             block
//             loading={isSubmitting}
//             disabled={isSubmitting}
//           >
//             {isEdit ? "Update Product" : "Create Product"}
//           </Button>
//         </Form>
//       </Card>
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
  preview: string;
  existing?: boolean;
};

type Description = {
  title: string;
  info: string;
};

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptions, setDescriptions] = useState<Description[]>([
    { title: "", info: "" },
  ]);
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([]);

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
    dispatch(fetchCategories({ page: 1, limit: 1000 }));
    dispatch(fetchSubCategories({ page: 1, limit: 1000 }));

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
        const existingImages = product.images.map((img: any) => ({
          preview: img.url,
          existing: true,
        }));
        setImageSlots(existingImages);
      }
    }
  }, [dispatch, product, form]);

  /* ================= IMAGE HANDLERS ================= */
  const handleImageUpload = (file: File) => {
    const newImage: ImageSlot = {
      file,
      preview: URL.createObjectURL(file),
    };

    setImageSlots((prev) => [...prev, newImage]);
    return false;
  };

  const removeImage = (index: number) => {
    setImageSlots((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= DESCRIPTION HANDLERS ================= */
  const addDescription = () =>
    setDescriptions([...descriptions, { title: "", info: "" }]);

  const removeDescription = (index: number) =>
    setDescriptions(descriptions.filter((_, i) => i !== index));

  /* ================= SUBMIT ================= */
  const onFinish = async (values: any) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("price", values.price);

      if (values.categoryId)
        formData.append("categoryId", values.categoryId);
      if (values.subCategoryId)
        formData.append("subCategoryId", values.subCategoryId);

      /* ========= SEND EXISTING IMAGES ========= */
      if (isEdit) {
        const existingImageUrls = imageSlots
          .filter((img) => img.existing)
          .map((img) => img.preview);

        formData.append(
          "existingImages",
          JSON.stringify(existingImageUrls)
        );
      }

      /* ========= SEND NEW IMAGES ========= */
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
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Form.Item name="title" label="Product Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="categoryId" label="Category">
            <Select allowClear onChange={() =>
              form.setFieldsValue({ subCategoryId: undefined })
            }>
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

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

          {/* IMAGES */}
          <Form.Item label="Product Images (Optional)">
            <Upload multiple showUploadList={false} beforeUpload={handleImageUpload}>
              <Button icon={<UploadOutlined />}>Select Images</Button>
            </Upload>

            <div className="grid grid-cols-5 gap-4 mt-4">
              {imageSlots.map((slot, index) => (
                <div key={index} className="relative">
                  <img
                    src={slot.preview}
                    alt={`img-${index}`}
                    className="h-24 w-full object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={isSubmitting}>
            {isEdit ? "Update Product" : "Create Product"}
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default ProductForm;
