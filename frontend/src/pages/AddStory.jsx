import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTimes, FaImage } from 'react-icons/fa';
import ModalAlert from '../components/ModalAlert';

export default function AddStory() {
    const navigate = useNavigate();
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

    const recommendedTags = ["Fiction", "Non-Fiction", "Romance", "Fantasy", "Sci-Fi", "Mystery", "Horror", "Teen", "Comedy", "Drama", "Action"];
    const filteredSuggestions = recommendedTags.filter(tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag));
    const handleKeyDownTag = (e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } };
    const addTag = (tagVal) => { if (tagVal.trim() && !tags.includes(tagVal.trim())) { setTags([...tags, tagVal.trim()]); setTagInput(''); setShowSuggestions(false); } };
    const removeTag = (index) => { setTags(tags.filter((_, i) => i !== index)); };
    const handleImageChange = (e) => { const file = e.target.files[0]; if(file){ setCoverImage(file); setPreviewImage(URL.createObjectURL(file)); }};

    const saveStoryToDb = async (redirectToAddChapter = false) => {
        if(!title || !author) { setAlertConfig({ isOpen: true, type: 'error', title: 'Missing Data', message: 'Title and Author are required.' }); return; }
        const formData = new FormData();
        formData.append('title', title); formData.append('author', author); formData.append('synopsis', synopsis);
        formData.append('category', category); formData.append('status', status); formData.append('tags', tags.join(','));
        if (coverImage) formData.append('cover_image', coverImage);

        try {
            const res = await axios.post('http://localhost:5000/add-story', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            const newStoryId = res.data.id;
            if (redirectToAddChapter) navigate('/add-chapter', { state: { storyId: newStoryId, storyTitle: title } });
            else setAlertConfig({ isOpen: true, type: 'success', title: 'Success!', message: 'Story created successfully!', onClose: () => { closeAlert(); navigate('/'); } });
        } catch (error) { setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to save story.' }); }
    };

    const handleCancel = () => { setAlertConfig({ isOpen: true, type: 'confirm', title: 'Cancel Creation?', message: 'Are you sure? Unsaved data will be lost.', onConfirm: () => navigate('/') }); };

    return (
        <div className="min-h-screen p-8 font-sans bg-gray-50">
            <ModalAlert {...alertConfig} onClose={() => { if(alertConfig.onClose) alertConfig.onClose(); else closeAlert(); }} />
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-6 font-bold text-gray-500 hover:text-orange-500"><FaArrowLeft /> Back to Home</button>
                <div className="p-8 bg-white shadow-md rounded-xl">
                    <h2 className="pb-4 mb-6 text-2xl font-bold text-gray-800 border-b">Add New Story</h2>
                    <div className="grid grid-cols-1 gap-6 mb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block mb-2 font-bold">Title</label><input value={title} onChange={(e)=>setTitle(e.target.value)} type="text" className="w-full p-3 border rounded-lg outline-none" placeholder="Title"/></div>
                            <div><label className="block mb-2 font-bold">Writer Name</label><input value={author} onChange={(e)=>setAuthor(e.target.value)} type="text" className="w-full p-3 border rounded-lg outline-none" placeholder="Author"/></div>
                        </div>
                        <div><label className="block mb-2 font-bold">Synopsis</label><textarea value={synopsis} onChange={(e)=>setSynopsis(e.target.value)} rows="4" className="w-full p-3 border rounded-lg outline-none"></textarea></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block mb-2 font-bold">Category</label><select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full p-3 border rounded-lg"><option value="Financial">Financial</option><option value="Technology">Technology</option><option value="Health">Health</option></select></div>
                            <div><label className="block mb-2 font-bold">Status</label><select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full p-3 border rounded-lg"><option value="Draft">Draft</option><option value="Publish">Publish</option></select></div>
                        </div>
                        <div><label className="block mb-2 font-bold">Cover Image</label><div className="flex items-center gap-4"><label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200"><FaImage /> Choose File<input type="file" accept="image/*" className="hidden" onChange={handleImageChange} /></label>{previewImage && <img src={previewImage} className="object-cover w-16 h-16 border rounded-md" />}</div></div>
                        <div className="relative"><label className="block mb-2 font-bold">Tags / Keywords</label><div className="flex flex-wrap gap-2 p-2 bg-white border rounded-lg">{tags.map((tag, index) => <span key={index} className="flex items-center gap-1 px-2 py-1 text-sm text-orange-600 bg-orange-100 rounded-full">{tag}<button onClick={() => removeTag(index)}><FaTimes size={12}/></button></span>)}<input value={tagInput} onChange={(e) => { setTagInput(e.target.value); setShowSuggestions(true); }} onKeyDown={handleKeyDownTag} type="text" placeholder="Type..." className="flex-1 outline-none p-1 min-w-[150px]" /></div>{showSuggestions && tagInput && filteredSuggestions.length > 0 && <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border rounded-lg shadow-lg max-h-40">{filteredSuggestions.map((tag, index) => <li key={index} onClick={() => addTag(tag)} className="px-4 py-2 cursor-pointer hover:bg-orange-50">{tag}</li>)}</ul>}</div>
                    </div>
                    <div className="mb-8"><div className="flex items-center justify-between pb-2 mb-4 border-b"><h3 className="text-lg font-bold">Chapter List</h3><button type="button" onClick={() => saveStoryToDb(true)} className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-orange-500 rounded-full"><FaPlus /> Add New Chapter</button></div><div className="p-6 text-center text-gray-500 border border-dashed rounded-lg bg-gray-50"><p>Save General Info first to start adding chapters.</p></div></div>
                    <div className="flex justify-end gap-4 pt-4 mt-8 border-t"><button type="button" onClick={handleCancel} className="px-6 py-3 font-bold text-gray-600 border rounded-full">Cancel</button><button type="button" onClick={() => saveStoryToDb(false)} className="px-8 py-3 font-bold text-white bg-orange-500 rounded-full shadow-lg">Save Story</button></div>
                </div>
            </div>
        </div>
    );
}