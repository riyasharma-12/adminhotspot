import React, { useEffect, useState } from "react";
import { Input, Button, Upload, message } from "antd";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createFounder, updateFounder } from "../../store/slices/founderSlice";

const { TextArea } = Input;

const FounderForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<any>();

  const founder = location.state?.founder;

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (founder) {
      setName(founder.name || "");
      setTitle(founder.title || "");
      setDescription(founder.description || "");
      if (founder.image) {
        setFileList([
          {
            uid: "-1",
            name: founder.image.split("/").pop(),
            status: "done",
            url: founder.image,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [founder]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    formData.append("description", description);

    // send existingImage so backend knows whether to preserve or remove the image
    const existingImage = fileList[0] && !fileList[0].originFileObj ? fileList[0].url : null;
    formData.append("existingImage", existingImage ?? "null");

    if (fileList[0]?.originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    try {
      if (founder) {
        await dispatch(updateFounder({ id: founder.id, formData })).unwrap();
        message.success("Founder updated");
      } else {
        await dispatch(createFounder(formData)).unwrap();
        message.success("Founder created");
      }
      navigate("/dashboard/founderList");
    } catch (err: any) {
      message.error(err?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mt-6">
      <Button icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)} className="mb-4">
        Back
      </Button>

      <h2 className="text-2xl font-semibold mb-4">
        {founder ? "Edit Founder" : "Create Founder"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-semibold block mb-1">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label className="font-semibold block mb-1">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label className="font-semibold block mb-1">Description</label>
          <TextArea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div>
          <label className="font-semibold block mb-1">Image</label>
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
            listType="picture"
          >
            <Button icon={<UploadCloud size={16} />}>
              {fileList.length > 0 ? "Change Image" : "Upload Image"}
            </Button>
          </Upload>
        </div>

        <Button type="primary" htmlType="submit" loading={loading}>
          {founder ? "Update Founder" : "Create Founder"}
        </Button>
      </form>
    </div>
  );
};

export default FounderForm;
