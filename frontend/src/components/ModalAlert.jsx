import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes, FaQuestionCircle } from 'react-icons/fa';

export default function ModalAlert({ isOpen, type, title, message, onClose, onConfirm }) {
    if (!isOpen) return null;

    let icon, colorClass, btnClass;

    if (type === 'success') {
        icon = <FaCheckCircle className="mx-auto mb-4 text-5xl text-green-500" />;
        colorClass = "border-t-4 border-green-500";
        btnClass = "bg-green-500 hover:bg-green-600";
    } else if (type === 'error') {
        icon = <FaTimes className="mx-auto mb-4 text-5xl text-red-500" />;
        colorClass = "border-t-4 border-red-500";
        btnClass = "bg-red-500 hover:bg-red-600";
    } else if (type === 'confirm') {
        icon = <FaQuestionCircle className="mx-auto mb-4 text-5xl text-orange-500" />;
        colorClass = "border-t-4 border-orange-500";
        btnClass = "bg-orange-500 hover:bg-orange-600";
    } else {
        icon = <FaExclamationCircle className="mx-auto mb-4 text-5xl text-blue-500" />;
        colorClass = "border-t-4 border-blue-500";
        btnClass = "bg-blue-500 hover:bg-blue-600";
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className={`bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 ${colorClass}`}>
                {icon}
                <h2 className="mb-2 text-2xl font-bold text-gray-800">{title}</h2>
                <p className="mb-8 text-sm leading-relaxed text-gray-600">{message}</p>
                <div className="flex justify-center gap-3">
                    {type === 'confirm' && (
                        <button onClick={onClose} className="flex-1 px-4 py-2 font-bold text-gray-600 transition border border-gray-300 rounded-full hover:bg-gray-50">
                            Cancel
                        </button>
                    )}
                    <button onClick={() => { if (type === 'confirm' && onConfirm) onConfirm(); else onClose(); }} className={`flex-1 px-4 py-2 text-white rounded-full font-bold shadow-lg transition ${btnClass}`}>
                        {type === 'confirm' ? 'Yes, Continue' : 'Okay'}
                    </button>
                </div>
            </div>
        </div>
    );
}