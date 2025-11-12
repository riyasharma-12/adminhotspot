import React, { useEffect, useState } from "react";
import { Input, Button, Form, message, Upload, Select } from "antd";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { createBlog, updateBlog } from "../../store/slices/blogSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import type { RootState } from "../../store/store"; // adjust path

const BlogForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<any>();

  const blog = location.state?.blog;
  const [form] = Form.useForm();
  const [description, setDescription] = useState(blog?.description || "");
  const [fileList, setFileList] = useState<any[]>([]);

  const { categories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories
  );

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Pre-fill form on edit
  useEffect(() => {
    if (blog) {
      let categoryId = blog.categoryId;
      // If backend returns category object instead of categoryId
      if (!categoryId && blog.category) {
        categoryId = blog.category.id;
      }

      form.setFieldsValue({
        title: blog.title,
        categoryId,
      });

      setDescription(blog.description || "");

      if (blog.image) {
        setFileList([
          {
            uid: "-1",
            name: blog.image.split("/").pop(),
            status: "done",
            url: blog.image,
          },
        ]);
      }
    }
  }, [blog, form]);

  const handleGoBack = () => navigate("/dashboard/blogs");

  const handleSubmit = async (values: any) => {
    if (fileList.length === 0 && !blog?.image) {
      message.error("Please upload a blog image");
      return;
    }

    const hide = message.loading(blog ? "Updating..." : "Creating...", 0);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", description);
      formData.append("categoryId", values.categoryId);

      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      } else if (blog?.image) {
        formData.append("image", blog.image);
      }

      if (blog) {
        await dispatch(updateBlog({ id: blog.id.toString(), blogData: formData })).unwrap();
        message.success("Blog updated successfully");
      } else {
        await dispatch(createBlog(formData)).unwrap();
        message.success("Blog created successfully");
      }

      form.resetFields();
      setDescription("");
      setFileList([]);
      navigate("/dashboard/blogs");
    } catch (error: any) {
      message.error(error?.message || "Failed to save blog");
    } finally {
      hide();
    }
  };

  return (
    <>
      <Button className="mb-4" onClick={handleGoBack} icon={<ArrowLeft size={16} />}>
        Go Back
      </Button>

      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">{blog ? "Edit Blog" : "Add New Blog"}</h1>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Blog Title"
            rules={[{ required: true, message: "Enter blog title" }]}
          >
            <Input placeholder="Enter blog title" />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Select a category" }]}
          >
            <Select
              placeholder="Select a category"
              loading={categoriesLoading}
              options={categories.map((cat) => ({
                label: cat.name,
                value: cat.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Blog Image">
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

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Enter blog description" }]}
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
              {blog ? "Update Blog" : "Create Blog"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default BlogForm;
