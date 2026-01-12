import React, { useEffect } from "react";
import { Button, Table, Popconfirm, message, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchBlogs, deleteBlog } from "../../store/slices/blogSlice";
import type { RootState } from "../../store/store";

const BlogList: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { blogs, loading } = useSelector((state: RootState) => state.blog);
  console.log(blogs)

  useEffect(() => {
    dispatch(fetchBlogs(undefined));
  }, [dispatch]);

  const handleEdit = (blog: any) =>
    navigate("/dashboard/blogForm", { state: { blog } });

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteBlog(id)).unwrap();
      message.success("Blog deleted successfully");
    } catch {
      message.error("Failed to delete blog");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "coverImage",
      key: "coverImage",
      render: (image: string) =>
        image ? (
          <img
            src={image}
            alt="cover"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) =>
        text?.length > 80 ? (
          <Tooltip title={text}>{text.slice(0, 80)}...</Tooltip>
        ) : (
          text
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(record)}>Edit</Button>

          <Popconfirm
            title="Delete this blog?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Blogs</h2>
        <Button
          type="primary"
          onClick={() => navigate("/dashboard/blogForm")}
        >
          Add Blog
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={blogs}
        loading={loading}
      // scroll={{ x: 800 }}
      />
    </div>
  );
};

export default BlogList;
