import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlus, FaEllipsisH, FaChevronLeft, FaChevronRight, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { BsGrid1X2Fill, BsJournalBookmarkFill } from "react-icons/bs";
import ModalAlert from '../components/ModalAlert';

export default function StoryList() {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]); 
    const [filteredStories, setFilteredStories] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState({ category: '', status: '' });
    const [tempFilter, setTempFilter] = useState({ category: '', status: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [activeActionId, setActiveActionId] = useState(null);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: 'info', title: '', message: '', onConfirm: null });

    useEffect(() => { fetchStories(); }, []);

    const fetchStories = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/stories');
            setStories(res.data); setFilteredStories(res.data); setLoading(false);
        } catch (error) { setLoading(false); }
    };

    useEffect(() => {
        let temp = [...stories];
        if (search) temp = temp.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.author.toLowerCase().includes(search.toLowerCase()));
        if (activeFilter.category) temp = temp.filter(s => s.category === activeFilter.category);
        if (activeFilter.status) temp = temp.filter(s => s.status === activeFilter.status);
        setFilteredStories(temp); setCurrentPage(1);
    }, [search, activeFilter, stories]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStories = filteredStories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredStories.length / itemsPerPage);

    const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

    const handleDeleteClick = (id) => {
        setAlertConfig({
            isOpen: true, type: 'confirm', title: 'Delete Story?', message: 'This action cannot be undone.',
            onConfirm: () => performDelete(id)
        });
    };

    const performDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/stories/${id}`);
            closeAlert();
            setTimeout(() => { setAlertConfig({ isOpen: true, type: 'success', title: 'Deleted!', message: 'Story deleted.', onConfirm: null }); }, 300);
            fetchStories(); setActiveActionId(null);
        } catch (error) {
            closeAlert();
            setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to delete.' });
        }
    }

    const toggleActionMenu = (id) => activeActionId === id ? setActiveActionId(null) : setActiveActionId(id);
    const handleApplyFilter = () => { setActiveFilter(tempFilter); setShowFilterModal(false); };
    const handleResetFilter = () => { setTempFilter({ category: '', status: '' }); };

    return (
        <div className="flex h-screen overflow-hidden font-sans bg-gray-50">
            <ModalAlert {...alertConfig} onClose={closeAlert} />
            <aside className="z-20 flex flex-col flex-shrink-0 w-64 bg-white border-r">
                <div className="p-6">
                    <div className="flex items-center gap-2 text-2xl font-bold text-cyan-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        STORYKU
                    </div>
                </div>
                <nav className="flex-1 mt-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-6 py-4 text-gray-500 transition hover:bg-gray-50 hover:text-cyan-600"><BsGrid1X2Fill className="text-lg"/> <span className="font-medium">Dashboard</span></Link>
                    <Link to="/" className="flex items-center gap-3 px-6 py-4 font-medium transition border-r-4 bg-cyan-50 text-cyan-600 border-cyan-600"><BsJournalBookmarkFill className="text-lg"/> <span className="font-medium">Story Management</span></Link>
                </nav>
            </aside>
            <main className="relative flex-1 p-8 overflow-y-auto">
                <h1 className="mb-8 text-3xl font-bold text-gray-800">Stories</h1>
                <div className="p-2 mb-6 bg-white shadow-sm rounded-xl"> 
                    <div className="flex items-center justify-between p-2">
                        <div className="flex items-center flex-1 gap-3">
                            <div className="relative w-96">
                                <FaSearch className="absolute text-gray-400 -translate-y-1/2 left-4 top-1/2" />
                                <input type="text" placeholder="Search by Writers / Title" className="w-full pl-10 pr-4 py-2.5 border border-gray-100 rounded-full bg-gray-50 focus:ring-1 focus:ring-cyan-500 text-gray-600" value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                            <button onClick={() => { setTempFilter(activeFilter); setShowFilterModal(true); }} className={`p-3 border border-gray-100 rounded-full hover:bg-gray-50 transition relative ${(activeFilter.category || activeFilter.status) ? 'text-orange-500 bg-orange-50 border-orange-200' : 'text-gray-500'}`}><FaFilter /></button>
                        </div>
                        <Link to="/add-story" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-md shadow-orange-200 transition"><FaPlus className="text-sm"/> Add Story</Link>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm overflow-visible min-h-[500px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white border-b border-gray-100">
                            <tr><th className="w-16 px-6 py-5">No</th><th className="w-24 px-6 py-5">Cover</th><th className="px-6 py-5">Title</th><th className="px-6 py-5">Writers</th><th className="px-6 py-5">Category</th><th className="px-6 py-5">Keyword</th><th className="px-6 py-5">Status</th><th className="px-6 py-5"></th></tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="8" className="py-20 text-center text-gray-400">Loading...</td></tr> : currentStories.length > 0 ? currentStories.map((story, index) => {
                                const isLastRow = index >= currentStories.length - 2;
                                return (
                                    <tr key={story.id} className="relative transition border-b border-gray-50 hover:bg-gray-50">
                                        <td className="px-6 py-5 text-sm text-gray-500">{indexOfFirstItem + index + 1}</td>
                                        <td className="px-6 py-5">{story.cover_image ? <img src={`http://localhost:5000/uploads/${story.cover_image}`} className="object-cover w-12 h-12 border border-gray-100 rounded-lg" /> : <div className="flex items-center justify-center w-12 h-12 text-gray-400 bg-gray-100 rounded-lg"><FaImage /></div>}</td>
                                        <td className="px-6 py-5 font-medium text-gray-800">{story.title}</td>
                                        <td className="px-6 py-5 text-gray-500">{story.author}</td>
                                        <td className="px-6 py-5 text-gray-500">{story.category}</td>
                                        <td className="px-6 py-5"><div className="flex gap-2 flex-wrap max-w-[200px]">{story.tags ? story.tags.split(',').slice(0, 2).map((tag, idx) => <span key={idx} className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full whitespace-nowrap">{tag.trim()}</span>) : '-'}</div></td>
                                        <td className="px-6 py-5"><span className={`px-4 py-1.5 rounded-full text-xs font-bold ${story.status === 'Publish' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{story.status}</span></td>
                                        <td className="relative px-6 py-5 text-center">
                                            <button onClick={() => toggleActionMenu(story.id)} className="p-2 text-gray-400 hover:text-gray-800"><FaEllipsisH /></button>
                                            {activeActionId === story.id && (
                                                <div className={`absolute right-10 ${isLastRow ? 'bottom-10' : 'top-10'} bg-white shadow-xl rounded-lg border border-gray-100 w-48 z-50 text-left overflow-hidden`}>
                                                    <button onClick={() => navigate('/add-chapter', { state: { storyId: story.id, storyTitle: story.title } })} className="flex items-center w-full gap-2 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-orange-500"><FaPlus className="text-xs"/> Add Chapter</button>
                                                    <button onClick={() => navigate(`/edit-story/${story.id}`)} className="flex items-center w-full gap-2 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-500"><FaEdit className="text-xs"/> Edit Story</button>
                                                    <button onClick={() => handleDeleteClick(story.id)} className="flex items-center w-full gap-2 px-4 py-3 text-sm text-gray-600 border-t hover:bg-gray-50 hover:text-red-500"><FaTrash className="text-xs"/> Delete</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : <tr><td colSpan="8" className="py-20 text-center text-gray-400">Tidak ada cerita.</td></tr>}
                        </tbody>
                    </table>
                </div>
                {!loading && (
                    <div className="flex items-center justify-end gap-2 mt-6">
                         <div className="mr-4 text-sm text-gray-500">Menampilkan {currentStories.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredStories.length)} dari {filteredStories.length}</div>
                         <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex items-center justify-center w-8 h-8 text-orange-500 bg-orange-100 rounded disabled:opacity-50"><FaChevronLeft className="text-xs" /></button>
                         <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="flex items-center justify-center w-8 h-8 text-orange-500 bg-orange-100 rounded disabled:opacity-50"><FaChevronRight className="text-xs" /></button>
                    </div>
                )}
            </main>
            {showFilterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl w-[500px] shadow-2xl">
                        <div className="flex items-center justify-between mb-8"><h2 className="text-2xl font-bold text-gray-800">Filter</h2><button onClick={() => setShowFilterModal(false)} className="text-3xl text-gray-400">&times;</button></div>
                        <div className="mb-6"><label className="block mb-3 font-bold">Category</label><select className="w-full px-4 py-3 border rounded-lg" value={tempFilter.category} onChange={(e) => setTempFilter({...tempFilter, category: e.target.value})}><option value="">All</option><option value="Financial">Financial</option><option value="Technology">Technology</option><option value="Health">Health</option></select></div>
                        <div className="mb-10"><label className="block mb-3 font-bold">Status</label><select className="w-full px-4 py-3 border rounded-lg" value={tempFilter.status} onChange={(e) => setTempFilter({...tempFilter, status: e.target.value})}><option value="">All</option><option value="Publish">Publish</option><option value="Draft">Draft</option></select></div>
                        <div className="flex justify-between gap-4"><button onClick={handleResetFilter} className="px-8 py-3 font-bold border rounded-full">Reset</button><div className="flex gap-3"><button onClick={() => setShowFilterModal(false)} className="px-8 py-3 font-bold border rounded-full">Cancel</button><button onClick={handleApplyFilter} className="px-8 py-3 font-bold text-white bg-orange-500 rounded-full">Filter</button></div></div>
                    </div>
                </div>
            )}
            {activeActionId && <div className="fixed inset-0 z-10" onClick={() => setActiveActionId(null)}></div>}
        </div>
    );
}