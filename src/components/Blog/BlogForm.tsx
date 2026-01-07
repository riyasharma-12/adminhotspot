import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createBlog, updateBlog } from "../../store/slices/blogSlice";

const { TextArea } = Input;

const BlogForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const location = useLocation();

  const blog = location.state?.blog;
  const isEdit = Boolean(blog);

  const [fileList, setFileList] = useState<any[]>([]);

  // Prefill data in edit mode
  useEffect(() => {
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        authorName: blog.authorName,
        description: blog.description,
      });

      if (blog.coverImage) {
        setFileList([
          {
            uid: "-1",
            name: "cover-image",
            status: "done",
            url: blog.coverImage,
          },
        ]);
      }
    }
  }, [blog, form]);

  const handleSubmit = async (values: any) => {
    if (!isEdit && fileList.length === 0) {
      message.error("Blog cover image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("authorName", values.authorName);
    formData.append("description", values.description);

    if (fileList[0]?.originFileObj) {
      formData.append("coverImage", fileList[0].originFileObj);
    }

    try {
      if (isEdit) {
        await dispatch(
          updateBlog({
            id: blog.id,
            payload: formData,
          })
        ).unwrap();
        message.success("Blog updated successfully");
      } else {
        await dispatch(createBlog(formData)).unwrap();
        message.success("Blog created successfully");
      }

      navigate("/dashboard/blogs");
    } catch (error) {
      message.error("Failed to save blog");
    }
  };

  return (
    <>
      <Button
        className="mb-4"
        icon={<ArrowLeft />}
        onClick={() => navigate("/dashboard/blogs")}
      >
        Go Back
      </Button>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Blog" : "Add Blog"}
        </h2>

        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Blog Title"
            rules={[{ required: true, message: "Enter blog title" }]}
          >
            <Input placeholder="Enter blog title" />
          </Form.Item>

          <Form.Item
            name="authorName"
            label="Author Name"
            rules={[{ required: true, message: "Enter author name" }]}
          >
            <Input placeholder="Enter author name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Enter blog description" }]}
          >
            <TextArea rows={5} placeholder="Enter blog description" />
          </Form.Item>

          {/* ✅ IMAGE UPLOAD */}
          <Form.Item label="Cover Image">
            <Upload
              beforeUpload={() => false}
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>
                {fileList.length ? "Change Image" : "Upload Image"}
              </Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {isEdit ? "Update Blog" : "Create Blog"}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default BlogForm;
