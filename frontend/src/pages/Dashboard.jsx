import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaImage, FaChevronLeft, FaChevronRight, FaFilter, FaPenFancy } from 'react-icons/fa';
import { BsGrid1X2Fill, BsJournalBookmarkFill } from "react-icons/bs";

export default function Dashboard() {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', 'Financial', 'Technology', 'Health'];
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; 

    useEffect(() => { fetchStories(); }, []);

    const fetchStories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/stories');
            setStories(res.data); setFilteredStories(res.data); setLoading(false);
        } catch (error) { setLoading(false); }
    };

    useEffect(() => {
        let temp = [...stories];
        if (selectedCategory !== 'All') temp = temp.filter(s => s.category === selectedCategory);
        if (search) temp = temp.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.author.toLowerCase().includes(search.toLowerCase()));
        setFilteredStories(temp); setCurrentPage(1); 
    }, [search, selectedCategory, stories]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredStories.length / itemsPerPage);

    return (
        <div className="flex h-screen overflow-hidden font-sans bg-gray-50">
            <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="p-6">
                    <div className="flex items-center gap-2 text-2xl font-bold text-cyan-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        STORYKU
                    </div>
                </div>
                <nav className="flex-1 px-4 mt-2 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 font-semibold transition shadow-sm bg-cyan-50 text-cyan-700 rounded-xl"><BsGrid1X2Fill className="text-lg"/> <span>Dashboard</span></Link>
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900 rounded-xl"><BsJournalBookmarkFill className="text-lg"/> <span>Story Management</span></Link>
                </nav>
                <div className="p-6">
                    <div className="p-4 text-center bg-gray-900 shadow-lg rounded-2xl">
                        <p className="mb-3 text-xs font-medium text-gray-400">Need Help?</p>
                        <button className="w-full px-4 py-2 text-xs font-semibold text-white transition rounded-lg bg-white/10 hover:bg-white/20">Contact Support</button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto relative flex flex-col bg-[#F8FAFC]">
                <div className="sticky top-0 z-10 bg-[#F8FAFC]/90 backdrop-blur-md px-8 py-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <p className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 transition pointer-events-none group-hover:text-cyan-600"><FaFilter /></div>
                                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 shadow-sm appearance-none cursor-pointer hover:border-cyan-500 transition text-sm font-medium text-gray-600">
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="relative w-64 group">
                                <FaSearch className="absolute text-gray-400 transition -translate-y-1/2 left-4 top-1/2 group-hover:text-cyan-600" />
                                <input type="text" placeholder="Search stories..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 shadow-sm text-sm transition" value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-2">
                    <div className="relative p-8 mb-10 overflow-hidden text-white border shadow-xl bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl shadow-slate-200 animate-fade-in border-slate-700">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-orange-500/20 rounded-full blur-[60px] -ml-10 -mb-10"></div>
                        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                            <div className="max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold border rounded-full bg-white/10 backdrop-blur-md border-white/10 text-cyan-200"><span>👋</span> <span>Welcome Back, Haris!</span></div>
                                <h2 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">Manage your creative <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Masterpieces</span> here.</h2>
                                <p className="mb-6 text-sm leading-relaxed text-slate-300 md:text-base">You have posted <strong>{stories.length} stories</strong> so far. Keep writing and inspire the world with your imagination.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => navigate('/add-story')} className="flex items-center gap-2 px-6 py-3 font-bold text-white transition shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-orange-500/30 hover:scale-105"><FaPenFancy /> Create Story</button>
                                    <button onClick={() => navigate('/')} className="px-6 py-3 font-bold text-white transition border bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-md border-white/10">View Table List</button>
                                </div>
                            </div>
                            <div className="hidden gap-4 lg:flex">
                                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center min-w-[140px] shadow-lg">
                                    <div className="mb-1 text-4xl font-bold text-cyan-400">{stories.filter(s => s.status === 'Publish').length}</div>
                                    <div className="text-xs font-bold tracking-wider uppercase text-slate-300">Published</div>
                                </div>
                                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center min-w-[140px] shadow-lg">
                                    <div className="mb-1 text-4xl font-bold text-orange-400">{stories.filter(s => s.status === 'Draft').length}</div>
                                    <div className="text-xs font-bold tracking-wider uppercase text-slate-300">Drafts</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? <div className="py-20 text-center text-gray-400 animate-pulse">Loading amazing stories...</div> : currentItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {currentItems.map((story) => (
                                <div key={story.id} className="bg-white rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full">
                                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                        {story.cover_image ? <img src={`http://localhost:5000/uploads/${story.cover_image}`} alt={story.title} className="object-cover w-full h-full transition duration-700 group-hover:scale-110" /> : <div className="flex flex-col items-center justify-center w-full h-full text-gray-300"><FaImage className="mb-2 text-4xl opacity-50" /><span className="text-sm">No Cover</span></div>}
                                        <div className="absolute top-3 right-3"><span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide shadow-sm backdrop-blur-md border border-white/20 ${story.status === 'Publish' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>{story.status}</span></div>
                                    </div>
                                    <div className="flex flex-col flex-1 p-5">
                                        <div className="flex items-start justify-between mb-2"><span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded uppercase tracking-wider">{story.category}</span></div>
                                        <h3 className="mb-1 text-lg font-bold leading-snug text-gray-800 transition cursor-pointer line-clamp-2 hover:text-orange-500" onClick={() => navigate(`/story-detail/${story.id}`)} title={story.title}>{story.title}</h3>
                                        <p className="mb-4 text-xs font-medium text-gray-400">By <span className="text-gray-600">{story.author}</span></p>
                                        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-50">
                                            <div className="flex gap-1 overflow-hidden">{story.tags ? story.tags.split(',').slice(0, 1).map((tag, idx) => <span key={idx} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100 font-medium">{tag}</span>) : null}</div>
                                            <button onClick={() => navigate(`/story-detail/${story.id}`)} className="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-100 hover:border-orange-200 px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1">Detail</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white border-2 border-gray-200 border-dashed rounded-3xl">
                            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-50"><FaSearch className="text-xl text-gray-300"/></div>
                            <p className="font-medium">No stories found matching your criteria.</p>
                            <button onClick={() => setSearch('')} className="mt-2 text-sm font-bold text-cyan-600 hover:underline">Clear Search</button>
                        </div>
                    )}

                    {!loading && currentItems.length > 0 && (
                        <div className="flex items-center justify-center gap-4 pb-8 mt-12">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-3 transition bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 disabled:opacity-50"><FaChevronLeft className="text-gray-600"/></button>
                            <span className="px-6 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 shadow-sm rounded-xl">Page {currentPage} of {totalPages}</span>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-3 transition bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 disabled:opacity-50"><FaChevronRight className="text-gray-600"/></button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}