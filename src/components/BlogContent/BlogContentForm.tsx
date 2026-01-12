

// import React, { useEffect, useState } from "react";
// import { Form, Button, Select, Upload, message } from "antd";
// import { ArrowLeft } from "lucide-react";
// import { UploadOutlined } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// import { fetchBlogs } from "../../store/slices/blogSlice";
// import {
//   createContent,
//   updateContent,
// } from "../../store/slices/blogContentSlice";
// import type { RootState, AppDispatch } from "../../store/store";

// const BlogContentForm: React.FC = () => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { blogs } = useSelector((state: RootState) => state.blog);

//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [editingContent, setEditingContent] = useState<any>(null);

//   useEffect(() => {
//     dispatch(fetchBlogs({ limit: 10 }));

//     if (location.state?.content) {
//       const content = location.state.content;
//       setEditingContent(content);

//       form.setFieldsValue({
//         blogId: content.blogId,
//         description: content.description || "",
//       });
//     }
//   }, [dispatch, location.state, form]);

//   const handleSubmit = async (values: any) => {
//     try {
//       const formData = new FormData();

//       // required
//       formData.append("blogId", values.blogId);

//       // optional
//       if (values.description && values.description.trim() !== "") {
//         formData.append("description", values.description);
//       }

//       if (imageFile) {
//         formData.append("image", imageFile);
//       }

//       if (editingContent) {
//         await dispatch(
//           updateContent({ id: editingContent.id, payload: formData })
//         ).unwrap();
//         message.success("Blog content updated successfully");
//       } else {
//         await dispatch(createContent(formData)).unwrap();
//         message.success("Blog content added successfully");
//       }

//       navigate("/dashboard/blogContent");
//     } catch (error: any) {
//       message.error(error?.message || "Operation failed");
//     }
//   };

//   return (
//     <>
//       <Button
//         className="mb-4"
//         icon={<ArrowLeft />}
//         onClick={() => navigate("/dashboard/blogContent")}
//       >
//         Go Back
//       </Button>

//       <div className="bg-white p-6 rounded-lg shadow max-w-xl">
//         <h2 className="text-xl font-semibold mb-4">
//           {editingContent ? "Edit Blog Content" : "Add Blog Content"}
//         </h2>

//         <Form layout="vertical" form={form} onFinish={handleSubmit}>
//           {/* Blog Select (Required) */}
//           <Form.Item
//             name="blogId"
//             label="Select Blog"
//             rules={[{ required: true, message: "Please select a blog" }]}
//           >
//             <Select placeholder="Select a blog">
//               {blogs.map((blog) => (
//                 <Select.Option key={blog.id} value={blog.id}>
//                   {blog.title}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {/* Description (Optional) */}
//           <Form.Item name="description" label="Content Description">
//             <ReactQuill theme="snow" style={{ height: 200 }} />
//           </Form.Item>

//           {/* Image (Optional) */}
//           <Form.Item label="Image">
//             <Upload
//               beforeUpload={(file) => {
//                 setImageFile(file);
//                 return false;
//               }}
//               maxCount={1}
//               listType="picture"
//             >
//               <Button icon={<UploadOutlined />}>Upload Image</Button>
//             </Upload>
//           </Form.Item>

//           <Button type="primary" htmlType="submit">
//             {editingContent ? "Update Content" : "Add Content"}
//           </Button>
//         </Form>
//       </div>
//     </>
//   );
// };

// export default BlogContentForm;



import React, { useEffect, useState } from "react";
import { Form, Button, Select, Upload, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { fetchBlogs } from "../../store/slices/blogSlice";
import {
  createContent,
  updateContent,
} from "../../store/slices/blogContentSlice";
import { fetchAllContents,  } from "../../store/slices/blogContentSlice";
import type { RootState, AppDispatch } from "../../store/store";

const stripHtml = (html?: string) =>
  html?.replace(/<[^>]*>/g, "").trim();

const BlogContentForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const editingContent = location.state?.content;
  const isEdit = Boolean(editingContent);

  const { blogs } = useSelector((state: RootState) => state.blog);

  // image per content index
  const [imageFiles, setImageFiles] = useState<Record<number, any>>({});

  useEffect(() => {
    dispatch(fetchBlogs({ limit: 50 }));

    // ✅ PREFILL EDIT DATA
    if (editingContent) {
      form.setFieldsValue({
        blogId: editingContent.blogId,
        contents: [
          {
            description: editingContent.description,
          },
        ],
      });

      if (editingContent.images?.[0]?.image) {
        setImageFiles({
          0: {
            uid: "-1",
            name: "image",
            status: "done",
            url: editingContent.images[0].image,
          },
        });
      }
    }
  }, [dispatch, editingContent, form]);

  const handleSubmit = async (values: any) => {
    const { blogId, contents } = values;

    if (!contents || contents.length === 0) {
      message.error("Please add at least one content item");
      return;
    }

    try {
      for (let i = 0; i < contents.length; i++) {
        const hasDescription = stripHtml(contents[i]?.description);
        const hasImage = imageFiles[i]?.originFileObj || imageFiles[i]?.url;

        if (!hasDescription && !hasImage) {
          message.error(
            `Item #${i + 1} must have description or image`
          );
          return;
        }

        const formData = new FormData();
        formData.append("blogId", blogId);

        if (hasDescription) {
          formData.append("description", contents[i].description);
        }

        if (imageFiles[i]?.originFileObj) {
          formData.append("image", imageFiles[i].originFileObj);
        }

        if (isEdit) {
          await dispatch(
            updateContent({
              id: editingContent.id,
              payload: formData,
            })
          ).unwrap();

          await dispatch(fetchAllContents());
        } else {
          await dispatch(createContent(formData)).unwrap();
        }
      }

      message.success(
        isEdit ? "Content updated successfully" : "Content created successfully"
      );
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

      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Blog Content" : "Add Blog Contents"}
        </h2>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{ contents: [{}] }}
        >
          {/* Blog */}
          <Form.Item
            name="blogId"
            label="Select Blog"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select blog">
              {blogs.map((blog) => (
                <Select.Option key={blog.id} value={blog.id}>
                  {blog.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* CONTENT LIST */}
          <Form.List name="contents">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <div
                    key={key}
                    className="border p-4 mb-4 rounded bg-gray-50"
                  >
                    <Form.Item
                      name={[name, "description"]}
                      label={`Description #${name + 1}`}
                    >
                      <ReactQuill theme="snow" style={{ height: 150 }} />
                    </Form.Item>

                    <Form.Item label="Image">
                      <Upload
                        beforeUpload={() => false}
                        listType="picture"
                        maxCount={1}
                        fileList={
                          imageFiles[name]
                            ? [imageFiles[name]]
                            : []
                        }
                        onChange={({ fileList }) =>
                          setImageFiles((prev) => ({
                            ...prev,
                            [name]: fileList[0],
                          }))
                        }
                      >
                        <Button icon={<UploadOutlined />}>
                          Upload Image
                        </Button>
                      </Upload>
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button danger onClick={() => remove(name)}>
                        Remove Item
                      </Button>
                    )}
                  </div>
                ))}

                {!isEdit && (
                  <Button type="dashed" onClick={() => add()} block>
                    + Add Content Item
                  </Button>
                )}
              </>
            )}
          </Form.List>

          <Button type="primary" htmlType="submit" block>
            {isEdit ? "Update Content" : "Upload Contents"}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default BlogContentForm;
