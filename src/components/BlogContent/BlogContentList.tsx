import React, { useEffect } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../store/store";
import { fetchAllContents, deleteContent } from "../../store/slices/blogContentSlice";
import DOMPurify from "dompurify";

const AllBlogContents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { contents, loading, error } = useSelector(
    (state: RootState) => state.blogContent
  );

  console.log(contents)
  // Fetch all contents

  useEffect(() => {
    dispatch(fetchAllContents());
  }, [dispatch]);

  
  const handleEdit = (content: any) =>
    navigate("/dashboard/blogContentForm", { state: { content } });

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteContent(id)).unwrap();
      message.success("Content deleted successfully");
    } catch {
      message.error("Failed to delete content");
    }
  };

  const columns = [
    // Show blog title
    {
      title: "Blog",
      dataIndex: ["blog", "title"],
      key: "blog",
      render: (text: string) => <strong>{text}</strong>,
    },
    // { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              text?.length > 60 ? text.slice(0, 60) + "..." : text || ""
            ),
          }}
        ></div>
      ),
    },
    // { title: "Order", dataIndex: "order", key: "order" },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images: any[]) =>
        images?.map((img, idx) => (
          <img
            key={idx}
            src={img.image}
            alt="content"
            style={{ width: 50, marginRight: 5, borderRadius: 4 }}
          />
        )),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete this content?"
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
        <h2 className="text-xl font-semibold">All Blog Contents</h2>
        <Button
          type="primary"
          onClick={() => navigate("/dashboard/blogContentForm")}
        >
          Add Content
        </Button>
      </div>

      {error && <div className="mb-2 text-red-600 font-medium">Error: {error}</div>}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={contents}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AllBlogContents;
