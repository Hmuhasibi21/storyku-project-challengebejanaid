import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import ModalAlert from '../components/ModalAlert';

export default function AddChapter() {
    const navigate = useNavigate();
    const location = useLocation();
    const { storyId, storyTitle, chapterId } = location.state || {};
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: 'info', title: '', message: '', onConfirm: null });
    const closeAlert = () => setAlertConfig({ ...alertConfig, isOpen: false });

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(!!chapterId);

    useEffect(() => {
        if (chapterId) {
            axios.get(`http://localhost:5000/chapters/${chapterId}`)
                .then(res => { setTitle(res.data.chapter_title); setContent(res.data.story_chapter); setLoading(false); })
                .catch(err => { setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: 'Gagal ambil data chapter.' }); navigate(-1); });
        }
    }, [chapterId, navigate]);

    if (!storyId && !chapterId) {
        return <div className="p-10 text-center"><h2 className="text-2xl font-bold text-red-500">Error: Missing Data context.</h2></div>;
    }

    const handleSave = async () => {
        if (!title || !content) { setAlertConfig({ isOpen: true, type: 'error', title: 'Missing Info', message: 'Title and Content required!' }); return; }
        try {
            if (chapterId) await axios.put(`http://localhost:5000/chapters/${chapterId}`, { chapter_title: title, story_chapter: content });
            else await axios.post('http://localhost:5000/add-chapter', { story_id: storyId, chapter_title: title, story_chapter: content });
            
            setAlertConfig({ isOpen: true, type: 'success', title: 'Success!', message: 'Chapter saved successfully.', onClose: () => { closeAlert(); navigate(`/edit-story/${storyId}`); } });
        } catch (error) { setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to save chapter.' }); }
    };

    const handleCancel = () => { setAlertConfig({ isOpen: true, type: 'confirm', title: 'Cancel?', message: 'Unsaved changes will be lost.', onConfirm: () => navigate(-1) }); };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen p-8 font-sans bg-gray-50">
            <ModalAlert {...alertConfig} onClose={() => { if(alertConfig.onClose) alertConfig.onClose(); else closeAlert(); }} />
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 text-sm text-gray-500">Stories Management {'>'} {storyTitle || 'Story'} {'>'} <span className="font-bold text-cyan-600">{chapterId ? 'Edit Chapter' : 'Add Chapter'}</span></div>
                <div className="flex items-center justify-between mb-6"><h1 className="text-3xl font-bold text-gray-800">{chapterId ? 'Edit Chapter' : 'Add Chapter'}</h1></div>
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 mb-6 font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300"><FaArrowLeft /> Back</button>
                <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <div className="mb-6"><label className="block mb-2 font-bold">Chapter Title</label><input type="text" placeholder="Ex: Chapter 1" className="w-full p-3 border rounded-lg outline-none" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                    <div className="mb-8"><label className="block mb-2 font-bold">Story Content</label><textarea className="w-full p-4 border rounded-lg outline-none resize-none h-96" placeholder="Write here..." value={content} onChange={(e) => setContent(e.target.value)}></textarea><p className="mt-2 text-xs text-right text-gray-400">*Rich Text disabled.</p></div>
                </div>
                <div className="flex justify-end gap-4 mt-6"><button onClick={handleCancel} className="px-6 py-3 font-bold border rounded-full">Cancel</button><button onClick={handleSave} className="px-8 py-3 font-bold text-white bg-orange-500 rounded-full shadow-lg">Save</button></div>
            </div>
        </div>
    );
}