import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Modal, Image } from "antd";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../store/slices/productSlice";
import { productService } from "../../services/api";

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state: RootState) => state.products);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);

  const handleEdit = (record: any) => {
    navigate("/dashboard/productsForm", { state: { product: record } });
  };

  const handleCreate = () => {
    navigate("/dashboard/productsForm");
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;
    const hide = message.loading("Deleting...", 0);
    try {
      const response = await productService.deleteProduct(selectedProductId);
      message.success(response.message || "Product deleted successfully");
      dispatch(fetchProducts() as any);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to delete product");
    } finally {
      hide();
      setIsModalVisible(false);
      setSelectedProductId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedProductId(id);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (url: string) => (
        <Image
          src={url}
          alt="product"
          width={70}
          height={70}
          style={{ borderRadius: 8, objectFit: "cover" }}
          preview={false}
        />
      ),
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
      render: (text: string) =>
        text?.length > 60 ? text.slice(0, 60) + "..." : text,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
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
            onClick={() => confirmDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button type="primary" icon={<Plus size={16} />} onClick={handleCreate}>
          Create Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Confirm Deletion"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </div>
  );
};

export default ProductList;
