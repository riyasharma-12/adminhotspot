
import React, { useEffect, useState } from "react";
import { Table, Button, Image, Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../../store/slices/productSlice";
import type { RootState, AppDispatch } from "../../store/store";
import DOMPurify from "dompurify";

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { products, total, loading } = useSelector(
    (state: RootState) => state.products
  );

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ✅ Fetch products on page change
  useEffect(() => {
    dispatch(fetchProducts( { page: 1, limit: 1000 } ));
  }, [dispatch, page]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      message.success("Product deleted successfully");
      dispatch(fetchProducts({ page: 1, limit: 1000 }));
    } catch {
      message.error("Failed to delete product");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) =>
        image ? <Image width={60} src={image} /> : "No Image",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
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
      render: (price: number) => `₹ ${price}`,
    },
    {
      title: "SubCategory",
      key: "subCategory",
      render: (_: any, record: any) =>
        record.subCategory?.name || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
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

      {/* Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        loading={loading}
       pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} products`
        }}

      />
    </div>
  );
};

export default ProductList;

