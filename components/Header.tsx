import React from 'react';
import { BrainCircuitIcon } from './IconComponents';

export const Header: React.FC = () => {
    return (
        <header className="py-6 px-4 md:px-8 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="container mx-auto flex items-center justify-center text-center">
                 <BrainCircuitIcon className="w-10 h-10 md:w-12 md:h-12 text-cyan-400 mr-4" />
                <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                        上意之鉴
                    </h1>
                    <p className="text-base md:text-lg text-slate-400 mt-2 hidden md:block">
                        于无声处听惊雷，于无形处见真章
                    </p>
                </div>
            </div>
        </header>
    );
};