
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Image,
  List,
  Drawer,
  Form,
  Input,
  Upload,
  Button,
  message,
  Popconfirm,
} from "antd";
import { Plus, UploadCloud, Edit2, Trash2 } from "lucide-react";
import { featureService } from "../../services/api";

const FeatureDetails: React.FC = () => {
  const { state } = useLocation();
  const product = state?.product;

  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any>(null);

  const [featureForm] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (product) fetchFeatures();
  }, [product]);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const response = await featureService.getFeaturesByProduct(product.id);
      setFeatures(response.data || []);
    } catch (err) {
      message.error("Failed to fetch features");
    } finally {
      setLoading(false);
    }
  };

  //  Add or Update Feature
  const handleFeatureSubmit = async (values: any) => {
    if (!editingFeature && fileList.length === 0) {
      message.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("productId", product.id.toString());
    if (fileList.length > 0) formData.append("image", fileList[0].originFileObj);

    const hide = message.loading(
      editingFeature ? "Updating feature..." : "Adding feature...",
      0
    );
    try {
      if (editingFeature) {
        await featureService.updateFeature(editingFeature.id, formData);
        message.success("Feature updated successfully");
      } else {
      
        await featureService.createFeature(formData);
        message.success("Feature added successfully");
      }

      fetchFeatures();
      featureForm.resetFields();
      setFileList([]);
      setDrawerVisible(false);
      setEditingFeature(null);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Operation failed");
    } finally {
      hide();
    }
  };

  //  Open drawer for editing
  const handleEdit = (feature: any) => {
    setEditingFeature(feature);
    setDrawerVisible(true);
    featureForm.setFieldsValue({
      title: feature.title,
      description: feature.description,
    });
    if (feature.image) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: feature.image,
        },
      ]);
    }
  };

  
  const handleDelete = async (id: string | number) => {
    const hide = message.loading("Deleting feature...", 0);
    try {
      // await featureService.deleteFeature(id.toString());
       await featureService.deleteFeature(Number(id));
      message.success("Feature deleted successfully");
      fetchFeatures();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to delete feature");
    } finally {
      hide();
    }
  };

  return (
    <div className="p-6">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{product?.title}</h1>
         <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => {
            setEditingFeature(null);
            setDrawerVisible(true);
            featureForm.resetFields();
            setFileList([]);
          }}
        >
          Add Feature
        </Button>
      </div>

      {/* Product Info */}
      <div className="flex gap-6 mb-10 flex-wrap">
        <Image
          src={product?.image}
          alt={product?.title}
          width={250}
          height={250}
          style={{ borderRadius: 8, objectFit: "cover" }}
        />
        <div className="max-w-2xl">
          <p className="text-lg text-gray-700 leading-relaxed " dangerouslySetInnerHTML={{ __html: product?.description }}>
          </p>
        </div>
      </div>

      {/* Features List */}
      <h2 className="text-xl font-semibold mb-4">Features</h2>
      {loading ? (
        <p>Loading...</p>
      ) : features.length === 0 ? (
        <p>No features added yet.</p>
      ) : (
        <List
          dataSource={features}
          renderItem={(feature) => (
            <List.Item
              actions={[
                <Button
                  key="edit"
                  icon={<Edit2 size={14} />}
                  onClick={() => handleEdit(feature)}
                >
                  Edit
                </Button>,
                <Popconfirm
                  title="Are you sure you want to delete this feature?"
                  onConfirm={() => handleDelete(feature.id)}
                  okText="Yes"
                  cancelText="No"
                  key="delete"
                >
                  <Button danger icon={<Trash2 size={14} />}>
                    Delete
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  feature.image ? (
                    <Image
                      src={feature.image}
                      width={60}
                      height={60}
                      style={{ borderRadius: 4, objectFit: "cover" }}
                    />
                  ) : null
                }
                title={feature.title}
                description={feature.description}
              />
            </List.Item>
          )}
        />
      )}

      {/* Drawer */}
      <Drawer
        title={editingFeature ? "Edit Feature" : "Add New Feature"}
        width={400}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setEditingFeature(null);
        }}
      >
        <Form layout="vertical" form={featureForm} onFinish={handleFeatureSubmit}>
          <Form.Item
            name="title"
            label="Feature Title"
            // rules={[{ required: true, message: "Enter feature title" }]}
            rules={[
                                    { required: true, message: "Enter title" },
                                    {
                                        validator: (_, value) =>
                                            value && value.length > 70
                                                ? Promise.reject("Title cannot exceed 100 characters.")
                                                : Promise.resolve(),
                                    },
                                ]}
                            >
                                <Input maxLength={70} showCount />
            {/* <Input placeholder="Feature title" /> */}
          </Form.Item>

          <Form.Item
            name="description"
            label="Feature Description"
          //   rules={[{ required: true, message: "Enter feature description" }]}
          // >
          //   <Input.TextArea rows={3} placeholder="Feature description" />
          rules={[
                              { required: true, message: "Enter description" },
                              {
                                  validator: (_, value) =>
                                      value && value.length > 300
                                          ? Promise.reject("Description cannot exceed 300 characters.")
                                          : Promise.resolve(),
                              },
                          ]}>
                              <Input.TextArea rows={6} maxLength={300} showCount />
          </Form.Item>

          <Form.Item label="Image">
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadCloud size={16} />}>
                {fileList.length > 0 ? "Change Image" : "Upload Image"}
              </Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            {editingFeature ? "Update Feature" : "Add Feature"}
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default FeatureDetails;
