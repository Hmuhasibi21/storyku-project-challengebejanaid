import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function StoryDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storyRes = await axios.get(`http://localhost:5000/stories/${id}`);
                setStory(storyRes.data);
                if (storyRes.data.tags) setTags(storyRes.data.tags.split(',').filter(t => t.trim() !== ''));
                const chaptersRes = await axios.get(`http://localhost:5000/stories/${id}/chapters`);
                setChapters(chaptersRes.data);
                setLoading(false);
            } catch (error) { setLoading(false); }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!story) return <div className="p-10 text-center">Story not found</div>;

    return (
        <div className="min-h-screen p-8 font-sans bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-gray-500 transition hover:text-orange-500">
                        <FaArrowLeft /> Back
                    </button>
                    <div className="text-sm text-gray-400">View Only Mode</div>
                </div>

                <div className="p-8 mb-8 bg-white shadow-md rounded-xl">
                    <div className="flex items-start justify-between pb-6 mb-6 border-b">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-800">{story.title}</h1>
                            <p className="text-gray-500">by {story.author}</p>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-sm font-bold ${story.status === 'Publish' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {story.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border">
                                {story.cover_image ? (
                                    <img src={`http://localhost:5000/uploads/${story.cover_image}`} alt="Cover" className="object-cover w-full h-full" />
                                ) : <div className="flex items-center justify-center h-full text-gray-400">No Cover</div>}
                            </div>
                        </div>

                        <div className="space-y-6 md:col-span-2">
                            <div>
                                <label className="block mb-1 text-xs font-bold text-gray-500 uppercase">Synopsis</label>
                                <p className="p-4 leading-relaxed text-gray-700 border border-gray-100 rounded-lg bg-gray-50">{story.synopsis || "No synopsis."}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-xs font-bold text-gray-500 uppercase">Category</label>
                                    <div className="font-medium text-gray-800">{story.category}</div>
                                </div>
                                <div>
                                    <label className="block mb-1 text-xs font-bold text-gray-500 uppercase">Total Chapters</label>
                                    <div className="font-medium text-gray-800">{chapters.length} Chapters</div>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 text-xs font-bold text-gray-500 uppercase">Keywords</label>
                                <div className="flex flex-wrap gap-2">
                                    {tags.length > 0 ? tags.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1 text-sm text-orange-600 rounded-full bg-orange-50">{tag}</span>
                                    )) : <span className="text-gray-400">-</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-xl font-bold text-gray-800">Chapter List</h3>
                        <div className="overflow-hidden border rounded-lg">
                            <table className="w-full text-left">
                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-sm font-bold text-gray-600">Title</th>
                                        <th className="px-4 py-3 text-sm font-bold text-right text-gray-600">Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chapters.length > 0 ? (
                                        chapters.map((chap) => (
                                            <tr key={chap.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-800">{chap.chapter_title}</td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-500">
                                                    {new Date(chap.last_updated).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="2" className="py-6 text-center text-gray-400">No chapters yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}