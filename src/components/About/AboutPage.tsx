// import React, { useEffect, useState } from "react";
// import { Table, Button, Space, message, } from "antd";
// import { Edit2, Trash2, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { aboutService } from "../../services/api";

// const AboutList: React.FC = () => {
//     const navigate = useNavigate();
//     const [abouts, setAbouts] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadAbouts();
//     }, []);

//     const loadAbouts = async () => {
//         try {
//             const response = await aboutService.getAbout();
//             setAbouts(response.data || []);
//         } catch (error) {
//             console.error("Failed to load about pages:", error);
//             message.error("Failed to load About pages");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (id: number) => {
//         if (!window.confirm("Are you sure you want to delete this About page?")) return;
//         try {
//             await aboutService.deleteAbout(id);
//             message.success("About page deleted successfully");
//             setAbouts(abouts.filter((a) => a.id !== id));
//         } catch (error) {
//             console.error("Delete failed:", error);
//             message.error("Failed to delete About page");
//         }
//     };

//     const columns = [
//         {
//             title: "Title One",
//             dataIndex: "titleOne",
//             key: "titleOne",
//         },
//         {
//             title: "Title Two",
//             dataIndex: "titleTwo",
//             key: "titleTwo",
//         },
//         {
//             title: "Description One",
//             dataIndex: "descriptionOne",
//             key: "descriptionOne",
//             render: (text: string) =>
//                 text?.length > 60 ? text.slice(0, 60) + "..." : text,
//         },
//         {
//             title: "Description Two",
//             dataIndex: "descriptionTwo",
//             key: "descriptionTwo",
//             render: (text: string) =>
//                 text?.length > 60 ? text.slice(0, 60) + "..." : text,
//         },
//         {
//             title: "Video",
//             dataIndex: "videoUrl",
//             key: "videoUrl",
//             render: (url: string) =>
//                 url ? (
//                     <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//                         View Video
//                     </a>
//                 ) : (
//                     "No Video"
//                 ),
//         },
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_: any, record: any) => (
//                 <Space>
//                     <Button
//                         type="text"
//                         icon={<Edit2 size={16} />}
//                         onClick={() =>
//                             navigate("/dashboard/aboutForm", { state: { about: record } })
//                         }

//                     />
//                     <Button
//                         type="text"
//                         danger
//                         icon={<Trash2 size={16} />}
//                         onClick={() => handleDelete(record.id)}
//                     />
//                 </Space>
//             ),
//         },
//     ];

//     return (
//         <div className="p-6">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl font-semibold">About Pages</h1>
//                 <div className="flex gap-3">
//                       <Button
//                     type="primary"
//                     icon={<Plus size={16} />}
//                     onClick={() => navigate("/dashboard/founderList")}
//                 >
//                     Show Founder
//                 </Button>
//                 {/* <Button
//                     type="primary"
//                     icon={<Plus size={16} />}
//                     onClick={() => navigate("/dashboard/founderForm")}
//                 >
//                     Create Founder
//                 </Button> */}
//                 {abouts.length === 0 && (
//                  <Button
//                     type="primary"
//                     icon={<Plus size={16} />}
//                     onClick={() => navigate("/dashboard/aboutForm")}
//                 >
//                     Create About Page
//                 </Button>    
//                 )}
//                 </div>
//             </div>

//             <Table
//                 columns={columns}
//                 dataSource={abouts}
//                 loading={loading}
//                 rowKey="id"
//                 pagination={{ pageSize: 10 }}
//             />
//         </div>
//     );
// };

// export default AboutList;
import React, { useEffect, useState } from "react";
import { Button, message, Card } from "antd";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { aboutService } from "../../services/api";
import FounderList from "../Founder/FounderList";

const AboutList: React.FC = () => {
    const navigate = useNavigate();
    const [abouts, setAbouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAbouts();
    }, []);

    const loadAbouts = async () => {
        try {
            const response = await aboutService.getAbout();
            setAbouts(response.data || []);
        } catch (error) {
            console.error("Failed to load about pages:", error);
            message.error("Failed to load About pages");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this About page?")) return;
        try {
            await aboutService.deleteAbout(id);
            message.success("About page deleted successfully");
            setAbouts(abouts.filter((a) => a.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
            message.error("Failed to delete About page");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">About Pages</h1>

                <div className="flex gap-3">
                    {/* <Button
                        type="primary"
                        icon={<Plus size={16} />}
                        onClick={() => navigate("/dashboard/founderList")}
                    >
                        Show Founder
                    </Button> */}

                    {abouts.length === 0 && (
                        <Button
                            type="primary"
                            icon={<Plus size={16} />}
                            onClick={() => navigate("/dashboard/aboutForm")}
                        >
                            Create About Page
                        </Button>
                    )}
                </div>
            </div>

            {/* Full Width Vertical Cards */}
            <div className="flex flex-col gap-6">
                {abouts.map((item) => (
                    <Card
                        key={item.id}
                        loading={loading}
                        className="rounded-xl shadow-md border w-full"
                    >
                        {/* Title One */}
                        <h2 className="text-xl font-semibold mb-2">
                            {item.titleOne}
                        </h2>

                        {/* Description One */}
                        <p className="text-gray-600 mb-4">
                            {item.descriptionOne}
                        </p>

                        {/* Video */}
                        {item.videoUrl && (
                            <div className="mb-4">
                                <a
                                    href={item.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    View Video
                                </a>
                            </div>
                        )}

                        {/* Title Two */}
                        <h3 className="text-lg font-semibold mt-4">
                            {item.titleTwo}
                        </h3>

                        {/* Description Two */}
                        <p className="text-gray-600 mb-4">
                            {item.descriptionTwo}
                        </p>

                        {/* Actions */}
                        <div className="flex justify-end mt-6 gap-3">
                            <Button
                                type="default"
                                icon={<Edit2 size={16} />}
                                onClick={() =>
                                    navigate("/dashboard/aboutForm", {
                                        state: { about: item },
                                    })
                                }
                            >
                                Edit
                            </Button>

                            <Button
                                danger
                                icon={<Trash2 size={16} />}
                                onClick={() => handleDelete(item.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {abouts.length === 0 && !loading && (
                <p className="text-gray-500 text-center mt-10">
                    No About Pages Found
                </p>
            )}
      
             {/* <Button
                        type="primary"
                        icon={<Plus size={16} />}
                        onClick={() => navigate("/dashboard/founderList")}
                    >
                        Show Founder
                    </Button> */}
                    <div className="mt-4">
                        <FounderList/>
                    </div>
        </div>
    );
};

export default AboutList;
