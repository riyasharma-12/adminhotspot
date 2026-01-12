// import React, { useEffect } from "react";
// import { Table, Button, Popconfirm, message } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchSubCategories,
//   deleteSubCategory,
// } from "../../store/slices/subCategorySlice";
// import { fetchCategories } from "../../store/slices/categorySlice";
// import type { RootState, AppDispatch } from "../../store/store";

// const SubCategoryList: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const { subCategories, loading } = useSelector(
//     (state: RootState) => state.subCategories
//   );

//   useEffect(() => {
//     dispatch(fetchSubCategories(undefined));
//     // dispatch(fetchCategories(undefined));
//      dispatch(fetchCategories({ page: 1, limit: 1000 }));
//   }, [dispatch]);

//   const handleEdit = (subCategory: any) => {
//     navigate("/dashboard/subcategoriesForm", {
//       state: { subCategory }, // ✅ MATCHED KEY
//     });
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await dispatch(deleteSubCategory(id)).unwrap();
//       message.success("SubCategory deleted successfully");
//     } catch {
//       message.error("Failed to delete subcategory");
//     }
//   };

//   const columns = [
//     {
//       title: "SubCategory Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Category",
//       key: "category",
//       render: (_: any, record: any) =>
//         record.category?.name || "N/A",
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: any) => (
//         <div className="flex gap-2">
//           <Button onClick={() => handleEdit(record)}>
//             Edit
//           </Button>

//           <Popconfirm
//             title="Delete this subcategory?"
//             onConfirm={() => handleDelete(record.id)}
//           >
//             <Button danger>Delete</Button>
//           </Popconfirm>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-semibold">SubCategories</h2>

//         <Button
//           type="primary"
//           onClick={() => navigate("/dashboard/subcategoriesForm")}
//         >
//           Add SubCategory
//         </Button>
//       </div>

//       <Table
//         rowKey="id"
//         columns={columns}
//         dataSource={subCategories}
//         loading={loading}
//         pagination={{
//           pageSize: 10,
//           showSizeChanger: true,
//           showTotal: (total) => `Total ${total} categories`,
//         }}

//       />
//     </div>
//   );
// };

// export default SubCategoryList;
import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchSubCategories,
  deleteSubCategory,
} from "../../store/slices/subCategorySlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import type { RootState, AppDispatch } from "../../store/store";

const SubCategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { subCategories, total, loading } = useSelector(
    (state: RootState) => state.subCategories
  );

  console.log(subCategories)

  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ===================== EFFECTS ===================== */

  useEffect(() => {
    dispatch(fetchSubCategories({ page, limit: pageSize }));
  }, [dispatch, page]);

  // fetch categories for dropdown (form usage)
  useEffect(() => {
    dispatch(fetchCategories({ page: 1, limit: 1000 }));
  }, [dispatch]);

  /* ===================== HANDLERS ===================== */

  const handleEdit = (subCategory: any) => {
    navigate("/dashboard/subcategoriesForm", {
      state: { subCategory },
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteSubCategory(id)).unwrap();
      message.success("SubCategory deleted successfully");
      dispatch(fetchSubCategories({ page, limit: pageSize }));
    } catch {
      message.error("Failed to delete subcategory");
    }
  };

  /* ===================== TABLE COLUMNS ===================== */

  const columns = [
    {
      title: "SubCategory Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      key: "category",
      render: (_: any, record: any) =>
        record.category?.name || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(record)}>Edit</Button>

          <Popconfirm
            title="Delete this subcategory?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  /* ===================== RENDER ===================== */

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">SubCategories</h2>

        <Button
          type="primary"
          onClick={() => navigate("/dashboard/subcategoriesForm")}
        >
          Add SubCategory
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={subCategories}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (newPage) => setPage(newPage),
          showSizeChanger: false,
          showTotal: (total) =>
            `Total ${total} subcategories`,
        }}
      />
    </div>
  );
};

export default SubCategoryList;
