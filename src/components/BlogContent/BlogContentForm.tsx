import React, { useEffect, useState } from "react";
import { Form, Button, Select, Upload, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { fetchBlogs } from "../../store/slices/blogSlice";
import { createContent, updateContent } from "../../store/slices/blogContentSlice";
import type { RootState, AppDispatch } from "../../store/store";

const BlogContentForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { blogs } = useSelector((state: RootState) => state.blog);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingContent, setEditingContent] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchBlogs({ limit: 10 }));

    if (location.state?.content) {
      const content = location.state.content;
      setEditingContent(content);

      form.setFieldsValue({
        blogId: content.blogId,
        description: content.description,
      });
    }
  }, [dispatch, location.state, form]);

  const handleSubmit = async (values: any) => {
    if (!imageFile && !editingContent) {
      message.error("Image is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("blogId", values.blogId);
      formData.append("description", values.description);

      if (imageFile) {
        formData.append("image", imageFile); // ✅ SINGLE IMAGE
      }

      if (editingContent) {
        await dispatch(
          updateContent({ id: editingContent.id, payload: formData })
        ).unwrap();
        message.success("Blog content updated successfully");
      } else {
        await dispatch(createContent(formData)).unwrap();
        message.success("Blog content added successfully");
      }

      navigate("/dashboard/blogContent");
    } catch (error: any) {
      message.error(error?.message || "Operation failed");
    }
  };

  return (
    <>
      <Button
        className="mb-4"
        icon={<ArrowLeft />}
        onClick={() => navigate("/dashboard/blogContent")}
      >
        Go Back
      </Button>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          {editingContent ? "Edit Blog Content" : "Add Blog Content"}
        </h2>

        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="blogId"
            label="Select Blog"
            rules={[{ required: true, message: "Please select a blog" }]}
          >
            <Select placeholder="Select a blog">
              {blogs.map((blog) => (
                <Select.Option key={blog.id} value={blog.id}>
                  {blog.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Content Description"
            rules={[{ required: true }]}
          >
            <ReactQuill theme="snow" style={{ height: 200 }} />
          </Form.Item>

          <Form.Item label="Image">
            <Upload
              beforeUpload={(file) => {
                setImageFile(file);
                return false; // prevent auto upload
              }}
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {editingContent ? "Update Content" : "Add Content"}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default BlogContentForm;
