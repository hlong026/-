
import React from 'react';
import { XIcon, ChevronRightIcon } from './IconComponents';
import { Example } from '../types';

interface ExampleModalProps {
    isOpen: boolean;
    onClose: () => void;
    examples: Example[];
    onSelect: (example: Example) => void;
}

export const ExampleModal: React.FC<ExampleModalProps> = ({ isOpen, onClose, examples, onSelect }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-100">选择参考场景</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="overflow-y-auto p-6">
                    <ul className="space-y-3">
                        {examples.map((example, index) => (
                            <li key={index}>
                                <button 
                                    onClick={() => onSelect(example)}
                                    className="w-full text-left p-4 bg-slate-900 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-all duration-200 group flex justify-between items-center"
                                >
                                    <span className="font-semibold text-slate-200">{example.title}</span>
                                    <ChevronRightIcon className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
