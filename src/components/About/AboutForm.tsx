
import React, { useEffect, useState } from "react";
import { Button, message, Upload } from "antd";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { aboutService } from "../../services/api";

const AboutForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const about = location.state?.about; // <-- RECEIVING EDIT DATA

  const [titleOne, setTitleOne] = useState("");
  const [titleTwo, setTitleTwo] = useState("");
  const [descriptionOne, setDescriptionOne] = useState("");
  const [descriptionTwo, setDescriptionTwo] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pre-fill fields when editing
  useEffect(() => {
    if (about) {
      setTitleOne(about.titleOne);
      setTitleTwo(about.titleTwo);
      setDescriptionOne(about.descriptionOne);
      setDescriptionTwo(about.descriptionTwo);

      if (about.videoUrl) {
        setFileList([
          {
            uid: "-1",
            name: about.videoUrl.split("/").pop(),
            status: "done",
            url: about.videoUrl,
          },
        ]);
      }
    }
  }, [about]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (titleOne.length > 60) {
      setLoading(false);
      return message.error("Title One cannot exceed 60 characters.");
    }
    if (titleTwo.length > 60) {
      setLoading(false);
      return message.error("Title Two cannot exceed 60 characters.");
    }
    if (descriptionOne.length > 300) {
      setLoading(false);
      return message.error("Description One cannot exceed 300 characters.");
    }
    if (descriptionTwo.length > 300) {
      setLoading(false);
      return message.error("Description Two cannot exceed 300 characters.");
    }

    const formData = new FormData();
    formData.append("titleOne", titleOne);
    formData.append("titleTwo", titleTwo);
    formData.append("descriptionOne", descriptionOne);
    formData.append("descriptionTwo", descriptionTwo);

    // Handle video upload
    if (fileList[0]?.originFileObj) {
      formData.append("video", fileList[0].originFileObj);
    }

    try {
      if (about) {
        await aboutService.updateAbout(about.id, formData);
        message.success("About updated successfully");
      } else {
        await aboutService.createAbout(formData);
        message.success("About created successfully");
      }
      navigate("/dashboard/abouts");
    } catch (error) {
      console.error("Save failed:", error);
      message.error("Failed to save About page");
    }

    setLoading(false);
  };

  return (
    <>
      <Button
        className="mb-4"
        onClick={() => navigate("/dashboard/abouts")}
        icon={<ArrowLeft size={16} />}
      >
        Go Back
      </Button>

      <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          {about ? "Update About Page" : "Create About Page"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title One */}
          <div>
            <label className="font-semibold block mb-1">Title One</label>
            <input
              type="text"
              className="border p-3 rounded-lg w-full"
              value={titleOne}
              onChange={(e) => setTitleOne(e.target.value)}
              required
            />
             <p className="text-gray-500 text-sm">{titleOne.length}/60</p>
          </div>

          {/* Title Two */}
          <div>
            <label className="font-semibold block mb-1">Title Two</label>
            <input
              type="text"
              className="border p-3 rounded-lg w-full"
              value={titleTwo}
              onChange={(e) => setTitleTwo(e.target.value)}
              required
            />
            <p className="text-gray-500 text-sm">{titleTwo.length}/60</p>
          </div>

          {/* Description One */}
          <div>
            <label className="font-semibold block mb-1">Description One</label>
            <textarea
              className="border p-3 rounded-lg w-full h-28"
              value={descriptionOne}
              onChange={(e) => setDescriptionOne(e.target.value)}
              required
            />
            <p className="text-gray-500 text-sm">{descriptionOne.length}/270</p>
          </div>

          {/* Description Two */}
          <div>
            <label className="font-semibold block mb-1">Description Two</label>
            <textarea
              className="border p-3 rounded-lg w-full h-28"
              value={descriptionTwo}
              onChange={(e) => setDescriptionTwo(e.target.value)}
              required
            />
            <p className="text-gray-500 text-sm">{descriptionOne.length}/270</p>
          </div>

          {/* Video Upload */}
          <div>
            <label className="font-semibold block mb-1">Video File</label>
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
              listType="text"
            >
              <Button icon={<UploadCloud size={16} />}>
                {fileList.length > 0 ? "Change Video" : "Upload Video"}
              </Button>
            </Upload>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : about ? "Update About" : "Create About"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AboutForm;
