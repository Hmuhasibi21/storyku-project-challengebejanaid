import React from 'react';

export default function Preloader() {
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-500">
            <div className="flex flex-col items-center animate-bounce-slow">
                <div className="flex items-center justify-center w-24 h-24 mb-6 border rounded-full shadow-xl bg-cyan-50 shadow-cyan-100 border-cyan-100">
                    <svg className="w-12 h-12 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">STORY<span className="text-cyan-600">KU</span></h1>
                <p className="mt-2 text-sm font-medium tracking-widest text-gray-400 uppercase">Management System</p>
            </div>
            <div className="mt-12 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-1/2 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full"></div>
            </div>
        </div>
    );
}