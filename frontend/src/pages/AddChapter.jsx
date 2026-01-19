import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'clean']
        ],
    };

    useEffect(() => {
        if (chapterId) {
            axios.get(`http://localhost:5000/chapters/${chapterId}`)
                .then(res => {
                    setTitle(res.data.chapter_title);
                    setContent(res.data.story_chapter);
                    setLoading(false);
                })
                .catch(err => {
                    setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: 'Gagal ambil data chapter.' });
                    navigate(-1);
                });
        }
    }, [chapterId, navigate]);

    if (!storyId && !chapterId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
                <div className="max-w-md p-8 text-center bg-white border border-red-100 shadow-lg rounded-xl">
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">Error Missing Data</h2>
                    <p className="mb-6 text-gray-500">ID Cerita tidak ditemukan.</p>
                    <button onClick={() => navigate('/')} className="px-6 py-2 font-bold text-white bg-orange-500 rounded-full">Kembali ke Home</button>
                </div>
            </div>
        );
    }

    const handleSave = async () => {
        if (!title || !content) {
            setAlertConfig({ isOpen: true, type: 'error', title: 'Missing Info', message: 'Judul dan Konten wajib diisi!' });
            return;
        }

        try {
            if (chapterId) {
                await axios.put(`http://localhost:5000/chapters/${chapterId}`, {
                    chapter_title: title,
                    story_chapter: content
                });
                
                setAlertConfig({ 
                    isOpen: true, 
                    type: 'success', 
                    title: 'Updated!', 
                    message: 'Chapter berhasil diperbarui.',
                    onClose: () => {
                        closeAlert();
                        navigate(`/edit-story/${storyId}`);
                    }
                });

            } else {
                await axios.post('http://localhost:5000/add-chapter', {
                    story_id: storyId, 
                    chapter_title: title,
                    story_chapter: content
                });

                setAlertConfig({ 
                    isOpen: true, 
                    type: 'success', 
                    title: 'Success!', 
                    message: 'Chapter berhasil ditambahkan.',
                    onClose: () => {
                        closeAlert();
                        navigate(`/edit-story/${storyId}`);
                    }
                });
            }
        } catch (error) {
            setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: 'Gagal menyimpan chapter.' });
        }
    };

    const handleCancel = () => {
        setAlertConfig({
            isOpen: true,
            type: 'confirm',
            title: 'Cancel?',
            message: 'Perubahan yang belum disimpan akan hilang.',
            onConfirm: () => navigate(-1)
        });
    };

    if (loading) return <div className="p-10 text-center">Loading Data...</div>;

    return (
        <div className="min-h-screen p-8 font-sans bg-gray-50">
            <ModalAlert {...alertConfig} onClose={() => { if (alertConfig.onClose) alertConfig.onClose(); else closeAlert(); }} />

            <div className="max-w-5xl mx-auto">
                <div className="mb-6 text-sm text-gray-500">
                    Stories Management {'>'} {storyTitle || 'Story'} {'>'} <span className="font-bold text-cyan-600">{chapterId ? 'Edit Chapter' : 'Add Chapter'}</span>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">{chapterId ? 'Edit Chapter' : 'Add Chapter'}</h1>
                </div>

                <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 mb-6 font-medium text-gray-700 transition bg-gray-200 rounded-full hover:bg-gray-300">
                    <FaArrowLeft /> Back
                </button>

                <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <div className="mb-6">
                        <label className="block mb-2 font-bold text-gray-800">Chapter Title</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Chapter 1" 
                            className="w-full p-3 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block mb-2 font-bold text-gray-800">Story Content</label>
                        <div className="mb-12 bg-white h-96">
                            <ReactQuill 
                                theme="snow" 
                                value={content} 
                                onChange={setContent} 
                                modules={modules}
                                className="h-full"
                                placeholder="Write your amazing story here..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={handleCancel} className="px-6 py-3 font-bold text-gray-600 transition border border-gray-300 rounded-full hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-8 py-3 font-bold text-white transition bg-orange-500 rounded-full shadow-lg hover:bg-orange-600">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}