
import React, { useEffect, useState } from "react";
import { Input, Button, Form, message, Upload } from "antd";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct } from "../../store/slices/productSlice";

const ProductForm: React.FC = () => {

  // ADD THIS AT TOP
const TITLE_LIMIT = 100;
const DESCRIPTION_LIMIT = 320;

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<any>();

  const product = location.state?.product;
  // const [description, setDescription] = useState(product?.description || "");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  // Load existing data on edit
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        title: product.title,
        description: product.description,
      });

      if (product.image) {
        setFileList([
          {
            uid: "-1",
            name: product.image.split("/").pop(),
            status: "done",
            url: product.image,
          },
        ]);
      }
    }
  }, [product, form]);

  const handleGoBack = () => navigate("/dashboard/products");

  const handleSubmit = async (values: any) => {
  

    if (fileList.length === 0 && !product?.image) {
      message.error("Please upload a product image");
      return;
    }

    const hide = message.loading(product ? "Updating..." : "Creating...", 0);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description); // FIXED ✔

      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      } else if (product?.image) {
        formData.append("image", product.image);
      }

      if (product) {
        await dispatch(
          updateProduct({ id: product.id.toString(), product: formData })
        ).unwrap();
        message.success("Product updated successfully");
      } else {
        await dispatch(createProduct(formData)).unwrap();
        message.success("Product created successfully");
      }

      form.resetFields();
      setFileList([]);
      navigate("/dashboard/products");
    } catch (error: any) {
      message.error(error || "Failed to save product");
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
          {/* <Form.Item
            name="title"
            label="Product Title"
            rules={[{ required: true, message: "Enter product title" }]}
          >
            <Input placeholder="Enter product title" />
          </Form.Item> */}
           <Form.Item
    name="title"
    label={`Product Title `}
    rules={[
      { required: true, message: "Enter product title" },
      {
        max: TITLE_LIMIT,
        message: `Title cannot exceed ${TITLE_LIMIT} characters.`,
      },
    ]}
  >
    <Input
      placeholder="Enter product title"
      onChange={(e) => {
        if (e.target.value.length <= TITLE_LIMIT) {
          form.setFieldsValue({ title: e.target.value });
        }
      }}
    />
  </Form.Item>
          <Form.Item label="Product Image">
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadCloud size={16} />}>
                {fileList.length > 0 ? "Change Image" : "Upload Image"}
              </Button>
            </Upload>
          </Form.Item>

          {/* FIXED: ReactQuill Connected to Antd Form */}
            <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Enter product description" }]}
            getValueFromEvent={(content) => content} // REQUIRED ✔
          >
            <ReactQuill theme="snow" style={{ height: "200px" }} />
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


