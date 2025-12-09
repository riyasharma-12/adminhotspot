import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadCloud, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createHome, updateHome } from "../../store/slices/homeSlice"; // adjust path

const { TextArea } = Input;

const HomeForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<any>();
    const existingHome = location.state?.home;

    const [form] = Form.useForm();
    const [file1, setFile1] = useState<any[]>([]);
    const [file2, setFile2] = useState<any[]>([]);
    const [file3, setFile3] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (existingHome) {
            form.setFieldsValue({
                title: existingHome.title,
                description: existingHome.description,
            });

            setFile1(existingHome.image1 ? [{
                uid: "-1",
                name: existingHome.image1.split("/").pop(),
                status: "done",
                url: existingHome.image1
            }] : []);

            setFile2(existingHome.image2 ? [{
                uid: "-2",
                name: existingHome.image2.split("/").pop(),
                status: "done",
                url: existingHome.image2
            }] : []);

            setFile3(existingHome.image3 ? [{
                uid: "-3",
                name: existingHome.image3.split("/").pop(),
                status: "done",
                url: existingHome.image3
            }] : []);
        }
    }, [existingHome, form]);

    const buildFormData = () => {
        const values = form.getFieldsValue();
        const fd = new FormData();
        fd.append("title", values.title);
        fd.append("description", values.description);

        // include existing image urls (or "null") so backend knows to keep/remove
        const existingImage1 = file1[0] && !file1[0].originFileObj ? file1[0].url : "null";
        const existingImage2 = file2[0] && !file2[0].originFileObj ? file2[0].url : "null";
        const existingImage3 = file3[0] && !file3[0].originFileObj ? file3[0].url : "null";

        fd.append("existingImage1", existingImage1 ?? "null");
        fd.append("existingImage2", existingImage2 ?? "null");
        fd.append("existingImage3", existingImage3 ?? "null");

        // append new files only
        if (file1[0]?.originFileObj) fd.append("image1", file1[0].originFileObj);
        if (file2[0]?.originFileObj) fd.append("image2", file2[0].originFileObj);
        if (file3[0]?.originFileObj) fd.append("image3", file3[0].originFileObj);

        return fd;
    };

    const onFinish = async () => {
        setLoading(true);
        try {
            const fd = buildFormData();
            if (existingHome) {
                await dispatch(updateHome({ id: existingHome.id, formData: fd })).unwrap();
                message.success("Home updated");
            } else {
                await dispatch(createHome(fd)).unwrap();
                message.success("Home created");
            }
            navigate("/dashboard/homes");
        } catch (err: any) {
            message.error(err?.message || "Save failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white p-4 rounded shadow mt-1">
            <Button onClick={() => navigate("/dashboard/homes")} icon={<ArrowLeft size={16} />}>Back</Button>

            <h2 className="text-2xl font-semibold mb-4">{existingHome ? "Edit Home" : "Create Home"}</h2>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* <Form.Item name="title" label="Title" rules={[{ required: true, message: "Enter title" }]}>
          <Input />
        </Form.Item>  */}

                <Form.Item
                    name="title"
                    label="Title"
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
                </Form.Item>


                <Form.Item name="description" label="Description" rules={[
                    { required: true, message: "Enter description" },
                    {
                        validator: (_, value) =>
                            value && value.length > 300
                                ? Promise.reject("Description cannot exceed 400 characters.")
                                : Promise.resolve(),
                    },
                ]}>
                    <TextArea rows={6} maxLength={300} showCount />
                </Form.Item>

                <Form.Item label="Image 1">
                    <Upload
                        fileList={file1}
                        beforeUpload={() => false}
                        onChange={({ fileList }) => setFile1(fileList)}
                        maxCount={1}
                        listType="picture"
                    >
                        <Button icon={<UploadCloud size={16} />}>{file1.length ? "Change Image" : "Upload Image"}</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label="Image 2">
                    <Upload
                        fileList={file2}
                        beforeUpload={() => false}
                        onChange={({ fileList }) => setFile2(fileList)}
                        maxCount={1}
                        listType="picture"
                    >
                        <Button icon={<UploadCloud size={16} />}>{file2.length ? "Change Image" : "Upload Image"}</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label="Image 3">
                    <Upload
                        fileList={file3}
                        beforeUpload={() => false}
                        onChange={({ fileList }) => setFile3(fileList)}
                        maxCount={1}
                        listType="picture"
                    >
                        <Button icon={<UploadCloud size={16} />}>{file3.length ? "Change Image" : "Upload Image"}</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {existingHome ? "Update Home" : "Create Home"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default HomeForm;
