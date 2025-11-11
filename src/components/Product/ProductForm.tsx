// import React, { useState, useEffect } from "react";
// import { Input, Button, Form, message, Upload } from "antd";
// import { ArrowLeft, UploadCloud } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { productService } from "../../services/api";

// const ProductForm: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const product = location.state?.product;
//   const [form] = Form.useForm();
//   const [description, setDescription] = useState(product?.description || "");
//   const [imageUrl, setImageUrl] = useState(product?.image || "");

//   useEffect(() => {
//     if (product) {
//       form.setFieldsValue({
//         title: product.title,
//         description: product.description,
//         image: product.image,
//       });
//       setDescription(product.description);
//       setImageUrl(product.image);
//     }
//   }, [product, form]);

//   const handleGoBack = () => {
//     navigate("/dashboard/products");
//   };

//   const handleSubmit = async (values: any) => {
//     const hide = message.loading(product ? "Updating..." : "Creating...", 0);
//     try {
//       const payload = {
//         title: values.title,
//         description,
//         image: imageUrl,
//       };

//       let response;
//       if (product) {
//         response = await productService.updateProduct(product.id, payload);
//       } else {
//         response = await productService.createProduct(payload);
//       }

//       message.success(
//         response?.message ||
//           (product
//             ? "Product updated successfully"
//             : "Product created successfully")
//       );

//       form.resetFields();
//       setDescription("");
//       setImageUrl("");
//       navigate("/dashboard/products");
//     } catch (error: any) {
//       message.error(error?.response?.data?.message || "Failed to submit product");
//     } finally {
//       hide();
//     }
//   };

//   return (
//     <>
//       <Button className="mb-4" onClick={handleGoBack} icon={<ArrowLeft size={16} />}>
//         Go Back
//       </Button>

//       <div className="p-6 bg-white rounded-lg shadow">
//         <h1 className="text-2xl font-semibold mb-4">
//           {product ? "Edit Product" : "Add New Product"}
//         </h1>

//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//           <Form.Item
//             name="title"
//             label="Product Title"
//             rules={[{ required: true, message: "Enter product title" }]}
//           >
//             <Input placeholder="Enter product title" />
//           </Form.Item>

//           <Form.Item label="Product Image">
//             <Upload
//               listType="picture"
//               maxCount={1}
//               beforeUpload={(file) => {
//                 const reader = new FileReader();
//                 reader.readAsDataURL(file);
//                 reader.onload = () => setImageUrl(reader.result as string);
//                 return false; // prevent upload
//               }}
//             >
//               <Button icon={<UploadCloud size={16} />}>Upload Image</Button>
//             </Upload>
//             {imageUrl && (
//               <img
//                 src={imageUrl}
//                 alt="preview"
//                 className="mt-2 w-32 h-32 object-cover rounded"
//               />
//             )}
//           </Form.Item>

//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: "Enter product description" }]}
//           >
//             <ReactQuill
//               theme="snow"
//               value={description}
//               onChange={setDescription}
//               style={{ height: "200px" }}
//             />
//           </Form.Item>

//           <Form.Item className="mt-4">
//             <Button type="primary" htmlType="submit">
//               {product ? "Update Product" : "Create Product"}
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </>
//   );
// };

// export default ProductForm;
import React, { useState, useEffect } from "react";
import { Input, Button, Form, message, Upload } from "antd";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { createProduct, updateProduct } from "../../store/slices/productSlice";

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const product = location.state?.product;
  const [form] = Form.useForm();
  const [description, setDescription] = useState(product?.description || "");
  const [imageUrl, setImageUrl] = useState(product?.image || "");

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        title: product.title,
        description: product.description,
        image: product.image,
      });
      setDescription(product.description);
      setImageUrl(product.image);
    }
  }, [product, form]);

  const handleGoBack = () => {
    navigate("/dashboard/products");
  };

  const handleSubmit = async (values: any) => {
    const hide = message.loading(product ? "Updating..." : "Creating...", 0);

    const payload = {
      title: values.title,
      description,
      image: imageUrl,
    };

    try {
      if (product) {
        await dispatch(updateProduct({ id: product.id, product: payload })).unwrap();
        message.success("Product updated successfully");
      } else {
        await dispatch(createProduct(payload)).unwrap();
        message.success("Product created successfully");
      }

      form.resetFields();
      setDescription("");
      setImageUrl("");
      navigate("/dashboard/products");
    } catch (error: any) {
      message.error(error || "Failed to submit product");
    } finally {
      hide();
    }
  };

  return (
    <>
      <Button
        className="mb-4"
        onClick={handleGoBack}
        icon={<ArrowLeft size={16} />}
      >
        Go Back
      </Button>

      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">
          {product ? "Edit Product" : "Add New Product"}
        </h1>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Product Title"
            rules={[{ required: true, message: "Enter product title" }]}
          >
            <Input placeholder="Enter product title" />
          </Form.Item>

          <Form.Item label="Product Image">
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => setImageUrl(reader.result as string);
                return false; // prevent upload
              }}
            >
              <Button icon={<UploadCloud size={16} />}>Upload Image</Button>
            </Upload>

            {imageUrl && (
              <img
                src={imageUrl}
                alt="preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Enter product description" }]}
          >
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              style={{ height: "200px" }}
            />
          </Form.Item>

          <Form.Item className="mt-4">
            <Button type="primary" htmlType="submit">
              {product ? "Update Product" : "Create Product"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ProductForm;
