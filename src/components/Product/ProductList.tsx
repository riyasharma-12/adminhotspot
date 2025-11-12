
// import React, { useEffect, useState } from "react";
// import { Table, Button, Space, message, Image, Drawer, List, Form, Input, Upload } from "antd";
// import { Edit2, Trash2, Plus, Eye, UploadCloud } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../store/store";
// import { useNavigate } from "react-router-dom";
// import { fetchProducts } from "../../store/slices/productSlice";
// // import { productService } from "../../services/api";
// // import { featureService } from "../../services/featureService";
// import { productService } from "../../services/api";
// import { featureService } from "../../services/api";

// const ProductList: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { products, loading } = useSelector((state: RootState) => state.products);

//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);
//   const [features, setFeatures] = useState<any[]>([]);
//   const [featureLoading, setFeatureLoading] = useState(false);

//   const [featureForm] = Form.useForm();
//   const [fileList, setFileList] = useState<any[]>([]);

//   useEffect(() => {
//     dispatch(fetchProducts() as any);
//   }, [dispatch]);

//   const openDrawer = async (product: any) => {
//     setSelectedProduct(product);
//     setDrawerVisible(true);
//     setFeatureLoading(true);
//     try {
//       const response = await featureService.getFeaturesByProduct(product.id);
//       setFeatures(response.data || []);
//     } catch (error) {
//       message.error("Failed to fetch features");
//     } finally {
//       setFeatureLoading(false);
//     }
//   };

//   const addFeature = async (values: any) => {
//     if (fileList.length === 0) {
//       message.error("Please upload an image for the feature");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", values.title);
//     formData.append("description", values.description);
//     formData.append("productId", selectedProduct.id.toString());
//     formData.append("image", fileList[0].originFileObj);

//     const hide = message.loading("Adding feature...", 0);
//     try {
//       const response = await featureService.createFeature(formData);
//       message.success(response.message || "Feature added successfully");
//       // Refresh features list
//       const featuresResp = await featureService.getFeaturesByProduct(selectedProduct.id);
//       setFeatures(featuresResp.data || []);
//       featureForm.resetFields();
//       setFileList([]);
//     } catch (error: any) {
//       message.error(error?.response?.data?.message || "Failed to add feature");
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
//         <Image src={url} alt="product" width={70} height={70} style={{ borderRadius: 8, objectFit: "cover" }} preview={false} />
//       ),
//     },
//     {
//       title: "Title",
//       dataIndex: "title",
//       key: "title",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//       render: (text: string) => (text?.length > 60 ? text.slice(0, 60) + "..." : text),
//     },
//     {
//       title: "Updated At",
//       dataIndex: "updatedAt",
//       key: "updatedAt",
//       render: (date: string) => new Date(date).toLocaleDateString(),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: any) => (
//         <Space>
//           <Button type="text" icon={<Eye size={16} />} onClick={() => openDrawer(record)} />
//           <Button type="text" icon={<Edit2 size={16} />} onClick={() => navigate("/dashboard/productsForm", { state: { product: record } })} />
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">Products</h1>
//         <Button type="primary" icon={<Plus size={16} />} onClick={() => navigate("/dashboard/productsForm")}>
//           Create Product
//         </Button>
//       </div>

//       <Table columns={columns} dataSource={products} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} />

//       {/* Drawer */}
//       <Drawer
//         title={`Features of "${selectedProduct?.title}"`}
//         width={500}
//         onClose={() => setDrawerVisible(false)}
//         open={drawerVisible}
//       >
//         {/* Features List */}
//         {featureLoading ? (
//           <p>Loading...</p>
//         ) : features.length === 0 ? (
//           <p>No features found.</p>
//         ) : (
//           <List
//             dataSource={features}
//             renderItem={(feature) => (
//               <List.Item>
//                 <List.Item.Meta
//                   avatar={feature.image ? <Image src={feature.image} alt={feature.title} width={50} height={50} style={{ objectFit: "cover", borderRadius: 4 }} /> : null}
//                   title={feature.title}
//                   description={feature.description}
//                 />
//               </List.Item>
//             )}
//           />
//         )}

//         <hr className="my-4" />

//         {/* Add Feature Form */}
//         <h3 className="text-lg font-semibold mb-2">Add New Feature</h3>
//         <Form form={featureForm} layout="vertical" onFinish={addFeature}>
//           <Form.Item name="title" label="Title" rules={[{ required: true, message: "Enter feature title" }]}>
//             <Input placeholder="Feature title" />
//           </Form.Item>
//           <Form.Item name="description" label="Description" rules={[{ required: true, message: "Enter feature description" }]}>
//             <Input.TextArea rows={3} placeholder="Feature description" />
//           </Form.Item>
//           <Form.Item label="Image" rules={[{ required: true, message: "Upload feature image" }]}>
//             <Upload
//               fileList={fileList}
//               onChange={({ fileList }) => setFileList(fileList)}
//               beforeUpload={() => false}
//               listType="picture"
//               maxCount={1}
//             >
//               <Button icon={<UploadCloud size={16} />}>{fileList.length > 0 ? "Change Image" : "Upload Image"}</Button>
//             </Upload>
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Add Feature
//             </Button>
//           </Form.Item>
//         </Form>
//       </Drawer>
//     </div>
//   );
// };

// export default ProductList;

// import React, { useEffect, useState } from "react";
// import { Table, Button, Space, message, Image, Drawer, List, Form, Input, Upload } from "antd";
// import { Edit2, Trash2, Plus, Eye, UploadCloud } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../store/store";
// import { useNavigate } from "react-router-dom";
// import { fetchProducts } from "../../store/slices/productSlice";
// import { productService } from "../../services/api";
// import { featureService } from "../../services/api";

// const ProductList: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { products, loading } = useSelector((state: RootState) => state.products);

//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);
//   const [features, setFeatures] = useState<any[]>([]);
//   const [featureLoading, setFeatureLoading] = useState(false);

//   const [featureForm] = Form.useForm();
//   const [fileList, setFileList] = useState<any[]>([]);

//   useEffect(() => {
//     dispatch(fetchProducts() as any);
//   }, [dispatch]);

//   // Open Features Drawer
//   const openDrawer = async (product: any) => {
//     setSelectedProduct(product);
//     setDrawerVisible(true);
//     setFeatureLoading(true);
//     try {
//       const response = await featureService.getFeaturesByProduct(product.id);
//       setFeatures(response.data || []);
//     } catch (error) {
//       message.error("Failed to fetch features");
//     } finally {
//       setFeatureLoading(false);
//     }
//   };

//   // Add a Feature
//   const addFeature = async (values: any) => {
//     if (fileList.length === 0) {
//       message.error("Please upload an image for the feature");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", values.title);
//     formData.append("description", values.description);
//     formData.append("productId", selectedProduct.id.toString());
//     formData.append("image", fileList[0].originFileObj);

//     const hide = message.loading("Adding feature...", 0);
//     try {
//       const response = await featureService.createFeature(formData);
//       message.success(response.message || "Feature added successfully");

//       // Refresh feature list
//       const featuresResp = await featureService.getFeaturesByProduct(selectedProduct.id);
//       setFeatures(featuresResp.data || []);

//       featureForm.resetFields();
//       setFileList([]);
//     } catch (error: any) {
//       message.error(error?.response?.data?.message || "Failed to add feature");
//     } finally {
//       hide();
//     }
//   };

//   // Delete Product
//   const handleDeleteProduct = async (productId: number) => {
//     const hide = message.loading("Deleting product...", 0);
//     try {
//       const response = await productService.deleteProduct(productId.toString());
//       message.success(response.message || "Product deleted successfully");
//       dispatch(fetchProducts() as any);
//     } catch (error: any) {
//       message.error(error?.response?.data?.message || "Failed to delete product");
//     } finally {
//       hide();
//     }
//   };

//   // Delete Feature
//   const handleDeleteFeature = async (featureId: number) => {
//     const hide = message.loading("Deleting feature...", 0);
//     try {
//       await featureService.deleteFeature(featureId);
//       message.success("Feature deleted successfully");

//       // Refresh feature list
//       const featuresResp = await featureService.getFeaturesByProduct(selectedProduct.id);
//       setFeatures(featuresResp.data || []);
//     } catch (error: any) {
//       message.error(error?.response?.data?.message || "Failed to delete feature");
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
//         <Image
//           src={url}
//           alt="product"
//           width={70}
//           height={70}
//           style={{ borderRadius: 8, objectFit: "cover" }}
//           preview={false}
//         />
//       ),
//     },
//     {
//       title: "Title",
//       dataIndex: "title",
//       key: "title",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//       render: (text: string) =>
//         text?.length > 60 ? text.slice(0, 60) + "..." : text,
//     },
//     {
//       title: "Updated At",
//       dataIndex: "updatedAt",
//       key: "updatedAt",
//       render: (date: string) => new Date(date).toLocaleDateString(),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: any) => (
//         <Space>
//           <Button
//             type="text"
//             icon={<Eye size={16} />}
//             onClick={() => openDrawer(record)}
//           />
//           <Button
//             type="text"
//             icon={<Edit2 size={16} />}
//             onClick={() =>
//               navigate("/dashboard/productsForm", { state: { product: record } })
//             }
//           />
//           <Button
//             type="text"
//             danger
//             icon={<Trash2 size={16} />}
//             onClick={() => handleDeleteProduct(record.id)}
//           />
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">Products</h1>
//         <Button
//           type="primary"
//           icon={<Plus size={16} />}
//           onClick={() => navigate("/dashboard/productsForm")}
//         >
//           Create Product
//         </Button>
//       </div>

//       <Table
//         columns={columns}
//         dataSource={products}
//         loading={loading}
//         rowKey="id"
//         pagination={{ pageSize: 10 }}
//       />

//       {/* Features Drawer */}
//       <Drawer
//         title={`Features of "${selectedProduct?.title}"`}
//         width={500}
//         onClose={() => setDrawerVisible(false)}
//         open={drawerVisible}
//       >
//         {/* Features List */}
//         {featureLoading ? (
//           <p>Loading...</p>
//         ) : features.length === 0 ? (
//           <p>No features found.</p>
//         ) : (
//           <List
//             dataSource={features}
//             renderItem={(feature) => (
//               <List.Item
//                 actions={[
//                   <Button
//                     type="text"
//                     danger
//                     onClick={() => handleDeleteFeature(feature.id)}
//                   >
//                     Delete
//                   </Button>,
//                 ]}
//               >
//                 <List.Item.Meta
//                   avatar={
//                     feature.image ? (
//                       <Image
//                         src={feature.image}
//                         alt={feature.title}
//                         width={50}
//                         height={50}
//                         style={{ objectFit: "cover", borderRadius: 4 }}
//                       />
//                     ) : null
//                   }
//                   title={feature.title}
//                   description={feature.description}
//                 />
//               </List.Item>
//             )}
//           />
//         )}

//         <hr className="my-4" />

//         {/* Add Feature Form */}
//         <h3 className="text-lg font-semibold mb-2">Add New Feature</h3>
//         <Form form={featureForm} layout="vertical" onFinish={addFeature}>
//           <Form.Item
//             name="title"
//             label="Title"
//             rules={[{ required: true, message: "Enter feature title" }]}
//           >
//             <Input placeholder="Feature title" />
//           </Form.Item>
//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: "Enter feature description" }]}
//           >
//             <Input.TextArea rows={3} placeholder="Feature description" />
//           </Form.Item>
//           <Form.Item label="Image" rules={[{ required: true, message: "Upload feature image" }]}>
//             <Upload
//               fileList={fileList}
//               onChange={({ fileList }) => setFileList(fileList)}
//               beforeUpload={() => false}
//               listType="picture"
//               maxCount={1}
//             >
//               <Button icon={<UploadCloud size={16} />}>
//                 {fileList.length > 0 ? "Change Image" : "Upload Image"}
//               </Button>
//             </Upload>
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Add Feature
//             </Button>
//           </Form.Item>
//         </Form>
//       </Drawer>
//     </div>
//   );
// };

// export default ProductList;

import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Image, Drawer, List, Form, Input, Upload } from "antd";
import { Edit2, Trash2, Plus, Eye, UploadCloud } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../store/slices/productSlice";
import { productService } from "../../services/api";
import { featureService } from "../../services/api";

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state: RootState) => state.products);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [featureLoading, setFeatureLoading] = useState(false);

  const [featureForm] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);

  // Open Features Drawer
  const openDrawer = async (product: any) => {
    setSelectedProduct(product);
    setDrawerVisible(true);
    setFeatureLoading(true);
    try {
      const response = await featureService.getFeaturesByProduct(product.id);
      setFeatures(response.data || []);
    } catch (error) {
      message.error("Failed to fetch features");
    } finally {
      setFeatureLoading(false);
    }
  };

  // Add a Feature
  const addFeature = async (values: any) => {
    if (fileList.length === 0) {
      message.error("Please upload an image for the feature");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("productId", selectedProduct.id.toString());
    formData.append("image", fileList[0].originFileObj);

    const hide = message.loading("Adding feature...", 0);
    try {
      const response = await featureService.createFeature(formData);
      message.success(response.message || "Feature added successfully");

      // Refresh feature list
      const featuresResp = await featureService.getFeaturesByProduct(selectedProduct.id);
      setFeatures(featuresResp.data || []);

      featureForm.resetFields();
      setFileList([]);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to add feature");
    } finally {
      hide();
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: number) => {
    const hide = message.loading("Deleting product...", 0);
    try {
      const response = await productService.deleteProduct(productId.toString());
      message.success(response.message || "Product deleted successfully");
      dispatch(fetchProducts() as any);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to delete product");
    } finally {
      hide();
    }
  };

  // Delete Feature
  const handleDeleteFeature = async (featureId: number) => {
    const hide = message.loading("Deleting feature...", 0);
    try {
      await featureService.deleteFeature(featureId);
      message.success("Feature deleted successfully");

      // Refresh feature list
      const featuresResp = await featureService.getFeaturesByProduct(selectedProduct.id);
      setFeatures(featuresResp.data || []);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to delete feature");
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
          {/* <Button
            type="text"
            icon={<Eye size={16} />}
            onClick={() => openDrawer(record)}
          /> */}
          <Button
  type="text"
  icon={<Eye size={16} />}
  onClick={() => navigate("/dashboard/feature-details", { state: { product: record } })}
/>

          <Button
            type="text"
            icon={<Edit2 size={16} />}
            onClick={() =>
              navigate("/dashboard/productsForm", { state: { product: record } })
            }
          />
          <Button
            type="text"
            danger
            icon={<Trash2 size={16} />}
            onClick={() => handleDeleteProduct(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate("/dashboard/productsForm")}
        >
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

     
      <Drawer
        title={`Features of "${selectedProduct?.title}"`}
        width="100%"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: "24px", overflowY: "auto" }}
      >
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        
          <div style={{ flex: 2, minWidth: 300 }}>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            {featureLoading ? (
              <p>Loading...</p>
            ) : features.length === 0 ? (
              <p>No features found.</p>
            ) : (
              <List
                dataSource={features}
                renderItem={(feature) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        danger
                        onClick={() => handleDeleteFeature(feature.id)}
                      >
                        Delete
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        feature.image ? (
                          <Image
                            src={feature.image}
                            width={60}
                            height={60}
                            style={{ objectFit: "cover", borderRadius: 4 }}
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
          </div>

         
          <div style={{ flex: 1, minWidth: 250 }}>
            <h3 className="text-lg font-semibold mb-4">Add New Feature</h3>
            <Form form={featureForm} layout="vertical" onFinish={addFeature}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Enter feature title" }]}
              >
                <Input placeholder="Feature title" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Enter feature description" }]}
              >
                <Input.TextArea rows={3} placeholder="Feature description" />
              </Form.Item>
              <Form.Item label="Image" rules={[{ required: true, message: "Upload feature image" }]}>
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
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<Plus />}>
                  Add Feature
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ProductList;




