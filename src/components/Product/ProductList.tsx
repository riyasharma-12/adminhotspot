import React, { useEffect, useState } from "react";
import { Table, Button, Image, Popconfirm, message, Switch, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  fetchProducts, 
  deleteProduct, 
  toggleProductStatus 
} from "../../store/slices/productSlice";
import type { RootState, AppDispatch } from "../../store/store";
import DOMPurify from "dompurify";

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // ✅ Fix: Access products array correctly
  const { products, loading } = useSelector(
    (state: RootState) => state.products // This gives you { products: [], loading: false, error: null }
  );

  // ✅ Add console log to debug
  console.log('Redux state:', { products, loading });
  console.log('Products is array?', Array.isArray(products));

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchProducts({ limit: 1000, includeInactive: true }));
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      message.success("Product deleted successfully");
      dispatch(fetchProducts({ limit: 1000, includeInactive: true }));
    } catch {
      message.error("Failed to delete product");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await dispatch(toggleProductStatus(id)).unwrap();
      message.success(
        `Product ${currentStatus ? "deactivated" : "activated"} successfully`
      );
    } catch (error) {
      console.error("Toggle error:", error);
      message.error("Failed to toggle product status");
    }
  };

  const columns = [
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (isActive: boolean, record: any) => (
        <div className="flex flex-col items-center gap-2">
          <Switch
            checked={isActive ?? true}
            onChange={() => handleToggleStatus(record.id, isActive)}
            checkedChildren="ON"
            unCheckedChildren="OFF"
          />
          <Tag color={isActive ? "success" : "default"}>
            {isActive ? "Visible" : "Hidden"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image: string) =>
        image ? <Image width={60} src={image} /> : "No Image",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
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
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (price: number) => `₹ ${price}`,
    },
    {
      title: "SubCategory",
      key: "subCategory",
      width: 150,
      render: (_: any, record: any) => record.subCategory?.name || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button
            onClick={() =>
              navigate("/dashboard/productsForm", {
                state: { product: record },
              })
            }
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this product?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // ✅ Ensure products is always an array
  const productsList = Array.isArray(products) ? products : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <Button
          type="primary"
          onClick={() => navigate("/dashboard/productsForm")}
        >
          Add Product
        </Button>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
        <p>
          📊 Total products: <strong>{productsList.length}</strong>
        </p>
        <p>
          👁️ Active: <strong>{productsList.filter((p) => p.isActive).length}</strong>
        </p>
        <p>
          🚫 Inactive: <strong>{productsList.filter((p) => !p.isActive).length}</strong>
        </p>
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={productsList}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total) => `Total ${total} products`,
        }}
      />
    </div>
  );
};

export default ProductList;