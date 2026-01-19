import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaPlus, FaTimes, FaImage } from 'react-icons/fa';
import ModalAlert from '../components/ModalAlert';

export default function EditStory() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: 'info', title: '', message: '', onConfirm: null });
    const closeAlert = () => setAlertConfig({ ...alertConfig, isOpen: false });

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [category, setCategory] = useState('Financial');
    const [status, setStatus] = useState('Draft');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [coverImage, setCoverImage] = useState(null); 
    const [previewImage, setPreviewImage] = useState(null); 
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    const recommendedTags = ["Fiction", "Non-Fiction", "Romance", "Fantasy", "Sci-Fi", "Mystery", "Horror", "Teen", "Comedy", "Drama", "Action"];
    const filteredSuggestions = recommendedTags.filter(tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storyRes = await axios.get(`http://localhost:5000/stories/${id}`);
                const data = storyRes.data;
                setTitle(data.title); setAuthor(data.author); setSynopsis(data.synopsis || ''); setCategory(data.category); setStatus(data.status);
                if (data.tags) setTags(data.tags.split(',').filter(t => t.trim() !== ''));
                if (data.cover_image) setPreviewImage(`http://localhost:5000/uploads/${data.cover_image}`);
                const chaptersRes = await axios.get(`http://localhost:5000/stories/${id}/chapters`);
                setChapters(chaptersRes.data);
                setLoading(false);
            } catch (error) { setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: 'Gagal load data.' }); }
        };
        fetchData();
    }, [id]);

    const handleKeyDownTag = (e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } };
    const addTag = (tagVal) => { if (tagVal.trim() && !tags.includes(tagVal.trim())) { setTags([...tags, tagVal.trim()]); setTagInput(''); setShowSuggestions(false); } };
    const removeTag = (idx) => setTags(tags.filter((_, i) => i !== idx));
    const handleImageChange = (e) => { const file = e.target.files[0]; if (file) { setCoverImage(file); setPreviewImage(URL.createObjectURL(file)); } };

    const handleUpdateStory = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title); formData.append('author', author); formData.append('synopsis', synopsis);
        formData.append('category', category); formData.append('status', status); formData.append('tags', tags.join(','));
        if (coverImage) formData.append('cover_image', coverImage);

        try {
            await axios.put(`http://localhost:5000/stories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setAlertConfig({ isOpen: true, type: 'success', title: 'Updated!', message: 'Story updated successfully!', onClose: () => { closeAlert(); navigate('/'); } });
        } catch (error) { setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: 'Update failed.' }); }
    };

    const handleDeleteChapterClick = (chapId) => {
        setAlertConfig({
            isOpen: true, type: 'confirm', title: 'Delete Chapter?', message: 'Are you sure?',
            onConfirm: async () => {
                try {
                    await axios.delete(`http://localhost:5000/chapters/${chapId}`);
                    setChapters(chapters.filter(c => c.id !== chapId));
                    closeAlert();
                } catch (error) { setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: 'Delete failed.' }); }
            }
        });
    }

    const handleCancel = () => { setAlertConfig({ isOpen: true, type: 'confirm', title: 'Cancel Edit?', message: 'Unsaved changes lost.', onConfirm: () => navigate('/') }); };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen p-8 font-sans bg-gray-50">
            <ModalAlert {...alertConfig} onClose={() => { if(alertConfig.onClose) alertConfig.onClose(); else closeAlert(); }} />
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6"><button onClick={() => navigate('/')} className="flex items-center gap-2 font-bold text-gray-500 hover:text-orange-500"><FaArrowLeft /> Back to Home</button><h2 className="text-xl font-bold text-gray-700">Edit Story</h2></div>
                <div className="p-8 mb-8 bg-white shadow-md rounded-xl">
                    <form onSubmit={handleUpdateStory}>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div><label className="block mb-2 font-bold">Title</label><input value={title} onChange={(e)=>setTitle(e.target.value)} type="text" className="w-full p-3 border rounded-lg outline-none" /></div>
                            <div><label className="block mb-2 font-bold">Writer Name</label><input value={author} onChange={(e)=>setAuthor(e.target.value)} type="text" className="w-full p-3 border rounded-lg outline-none" /></div>
                        </div>
                        <div className="mb-6"><label className="block mb-2 font-bold">Synopsis</label><textarea value={synopsis} onChange={(e)=>setSynopsis(e.target.value)} rows="4" className="w-full p-3 border rounded-lg outline-none"></textarea></div>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div><label className="block mb-2 font-bold">Category</label><select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full p-3 border rounded-lg"><option value="Financial">Financial</option><option value="Technology">Technology</option><option value="Health">Health</option></select></div>
                            <div><label className="block mb-2 font-bold">Status</label><select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full p-3 border rounded-lg"><option value="Draft">Draft</option><option value="Publish">Publish</option></select></div>
                        </div>
                        <div className="mb-6"><label className="block mb-2 font-bold">Cover Image</label><div className="flex items-center gap-4"><label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200"><FaImage /> Change File<input type="file" accept="image/*" className="hidden" onChange={handleImageChange} /></label>{previewImage && <img src={previewImage} className="object-cover w-16 h-16 border rounded-md" />}</div></div>
                        <div className="relative mb-6"><label className="block mb-2 font-bold">Tags / Keywords</label><div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg">{tags.map((tag, index) => <span key={index} className="flex items-center gap-1 px-2 py-1 text-sm text-orange-600 bg-orange-100 rounded-full">{tag}<button type="button" onClick={() => removeTag(index)}><FaTimes size={12}/></button></span>)}<input value={tagInput} onChange={(e) => { setTagInput(e.target.value); setShowSuggestions(true); }} onKeyDown={handleKeyDownTag} type="text" className="flex-1 outline-none p-1 min-w-[100px]" /></div>{showSuggestions && tagInput && filteredSuggestions.length > 0 && <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border rounded-lg shadow-lg max-h-40">{filteredSuggestions.map((tag, index) => <li key={index} onClick={() => addTag(tag)} className="px-4 py-2 cursor-pointer hover:bg-orange-50">{tag}</li>)}</ul>}</div>

                        <div className="flex justify-end gap-4 pb-8 mb-8 border-b">
                            <button type="button" onClick={handleCancel} className="px-6 py-2 font-bold text-gray-600 border rounded-full hover:bg-gray-100">Cancel</button>
                            <button type="submit" className="px-8 py-2 font-bold text-white bg-orange-500 rounded-full shadow-lg hover:bg-orange-600">Save Changes</button>
                        </div>
                    </form>

                    <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold">Chapter List</h3><Link to="/add-chapter" state={{ storyId: id, storyTitle: title }} className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-orange-500 rounded-full shadow-md hover:bg-orange-600"><FaPlus /> New Chapter</Link></div>
                    <div className="overflow-hidden border rounded-lg">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50"><tr><th className="px-4 py-3 text-sm">Title</th><th className="px-4 py-3 text-sm">Last Updated</th><th className="px-4 py-3 text-center">Action</th></tr></thead>
                            <tbody>
                                {chapters.length > 0 ? chapters.map((chap) => (
                                    <tr key={chap.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{chap.chapter_title}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(chap.last_updated).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                        <td className="flex justify-center gap-2 px-4 py-3 text-center">
                                            <button onClick={() => navigate('/add-chapter', { state: { chapterId: chap.id, storyId: id, storyTitle: title } })} className="p-2 text-blue-500 hover:text-blue-700"><FaEdit /></button>
                                            <button onClick={() => handleDeleteChapterClick(chap.id)} className="p-2 text-red-500 hover:text-red-700"><FaTrash /></button>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="3" className="py-6 text-center text-gray-400">No chapters yet.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}