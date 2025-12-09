// import React, { useEffect } from "react";
// import { Table, Button, Space, message, Image } from "antd";
// import { Edit2, Trash2, Plus } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../store/store";
// import { useNavigate } from "react-router-dom";
// import { fetchBlogs, deleteBlog } from "../../store/slices/blogSlice";
// import DOMPurify from "dompurify";

// const BlogList: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { blogs, loading } = useSelector((state: RootState) => state.blogs);

//   useEffect(() => {
//     dispatch(fetchBlogs() as any);
//   }, [dispatch]);

//   const handleEdit = (blog: any) => navigate("/dashboard/blogForm", { state: { blog } });

//   const handleDelete = async (id: number) => {
//     const hide = message.loading("Deleting blog...", 0);
//     try {
//       await dispatch(deleteBlog(id.toString())).unwrap();
//       message.success("Blog deleted successfully");
//     } catch (error: any) {
//       message.error(error?.response?.data?.message || "Failed to delete blog");
//     } finally {
//       hide();
//     }
//   };

//   const columns = [
//     {
//       title: "Image",
//       dataIndex: "image",
//       key: "image",
//       render: (url: string) => (
//         <Image src={url} width={70} height={70} style={{ borderRadius: 8 }} preview={false} />
//       ),
//     },
//     { title: "Title", dataIndex: "title", key: "title" },
//     {
//       title: "Category",
//       dataIndex: ["category", "name"], // safely access category.name
//       key: "category",
//       render: (name: string, record: any) => {
//         // fallback if category object not present
//         return record.category ? record.category.name : "N/A";
//       },
//     },
//     // {
//     //   title: "Description",
//     //   dataIndex: "description",
//     //   key: "description",
//     //   render: (text: string) => (text?.length > 60 ? text.slice(0, 60) + "..." : text),
//     // },

//     {
//   title: "Description",
//   dataIndex: "description",
//   key: "description",
//   render: (text: string) => (
//     <div
//       dangerouslySetInnerHTML={{
//         __html: DOMPurify.sanitize(
//           text?.length > 60 ? text.slice(0, 60) + "..." : text || ""
//         ),
//       }}
//     ></div>
//   ),
// },

    

//     {
//   title: "Updated At",
//   key: "updatedAt",
//   render: (record: any) => {
//     const dateStr = record.updatedAt || record.createdAt;
//     const d = new Date(dateStr);
//     return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString() ;
//   },
// },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: any) => (
//         <Space>
//           <Button type="text" icon={<Edit2 size={16} />} onClick={() => handleEdit(record)} />
//           <Button type="text" danger icon={<Trash2 size={16} />} onClick={() => handleDelete(record.id)} />
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">Blogs</h1>
//         <div className="flex gap-3">
//           <Button
//             type="primary"
//             icon={<Plus size={16} />}
//             onClick={() => navigate("/dashboard/categoryForm")}
//           >
//             Add Category
//           </Button>

//           <Button
//             type="primary"
//             icon={<Plus size={16} />}
//             onClick={() => navigate("/dashboard/categories")}
//           >
//             Category List
//           </Button>

//           <Button type="primary" icon={<Plus size={16} />} onClick={() => navigate("/dashboard/blogForm")}>
//             Create Blog
//           </Button>
//         </div>
//       </div>

//       <Table
//         columns={columns}
//         dataSource={blogs}
//         loading={loading}
//         rowKey="id"
//         pagination={{ pageSize: 10 }}
//       />
//     </div>
//   );
// };

// export default BlogList;

import React, { useEffect } from "react";
import { Table, Button, Space, message, Image } from "antd";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { fetchBlogs, deleteBlog } from "../../store/slices/blogSlice";
import DOMPurify from "dompurify";
import type { AppDispatch } from "../../store/store";

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const dispatch = useDispatch<AppDispatch>();
  
  const { blogs, loading } = useSelector((state: RootState) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogs() as any);
  }, [dispatch]);

  const handleEdit = (blog: any) =>
    navigate("/dashboard/blogForm", { state: { blog } });

  const handleDelete = async (id: number) => {
    const hide = message.loading("Deleting blog...", 0);
    try {
      await dispatch(deleteBlog(id.toString())).unwrap();
      message.success("Blog deleted successfully");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to delete blog");
    } finally {
      hide();
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (url: string) => (
        <Image
          src={url}
          width={70}
          height={70}
          style={{ borderRadius: 8 }}
          preview={false}
        />
      ),
    },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (name: string, record: any) =>
        record.category ? record.category.name : "N/A",
    },
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
    {
      title: "Created At",
      key: "createdAt",
      render: (record: any) => {
        const dateStr = record.createdAt;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
      },
    },
    {
      title: "Published Date",
      key: "publishedDate",
      render: (record: any) => {
        const dateStr = record.publishedDate;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            icon={<Edit2 size={16} />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<Trash2 size={16} />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Blogs</h1>
        <div className="flex gap-3">
          {/* <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate("/dashboard/categoryForm")}
          >
            Add Category
          </Button> */}

          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate("/dashboard/categories")}
          >
            Category List
          </Button>
           
              <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate("/dashboard/blogForm")}
          >
            Create Blog
          </Button>

          {/* <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate("/dashboard/blogForm")}
          >
            Create Blog
          </Button> */}
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={blogs}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default BlogList;
