
import React, { useRef } from 'react';
import { UploadIcon, SparklesIcon, XCircleIcon, TrashIcon, BeakerIcon } from './IconComponents';

interface InputPanelProps {
    inputText: string;
    onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    contextText: string;
    onContextTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onImageUpload: (file: File) => void;
    imagePreviewUrl: string | null;
    onSubmit: () => void;
    isLoading: boolean;
    onClear: () => void;
    onShowExample: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
    inputText,
    onTextChange,
    contextText,
    onContextTextChange,
    onImageUpload,
    imagePreviewUrl,
    onSubmit,
    isLoading,
    onClear,
    onShowExample,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageUpload(event.target.files[0]);
        }
    };

    const handleImageRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClear();
    }

    const canSubmit = !isLoading && (inputText.trim() !== '' || imagePreviewUrl !== null);

    return (
        <div className="bg-slate-800/50 rounded-2xl shadow-lg p-6 flex flex-col border border-slate-700 h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-100">输入分析内容</h2>
                <button 
                    onClick={onShowExample} 
                    disabled={isLoading}
                    className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
                >
                   <BeakerIcon className="w-4 h-4 mr-1" />
                   看看示例
                </button>
            </div>
            
            <div className="flex-grow flex flex-col relative space-y-4">
                <textarea
                    value={inputText}
                    onChange={onTextChange}
                    placeholder="在这里输入或粘贴老板说的话..."
                    className="w-full flex-grow p-4 bg-slate-900 rounded-lg border-2 border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-colors duration-300 resize-none text-slate-200"
                    disabled={isLoading}
                    rows={8}
                />
                 <textarea
                    value={contextText}
                    onChange={onContextTextChange}
                    placeholder="（可选）补充对话背景，如会议场景、前后事件、你的目标等，可以让AI分析更精准。"
                    className="w-full p-4 bg-slate-900 rounded-lg border-2 border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-colors duration-300 resize-none text-slate-400 placeholder-slate-500"
                    disabled={isLoading}
                    rows={4}
                />
            </div>
            
            <div className="mt-4">
                <input
                    type="file"
                    id="file-upload"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    disabled={isLoading}
                />
                
                {imagePreviewUrl ? (
                    <div className="relative group mt-2">
                        <img src={imagePreviewUrl} alt="Preview" className="max-h-40 w-auto rounded-lg object-contain" />
                        <button 
                            onClick={handleImageRemove} 
                            className="absolute top-2 right-2 bg-slate-900/50 rounded-full p-1 text-slate-300 hover:text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Remove image"
                        >
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-cyan-500 hover:text-cyan-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <UploadIcon className="w-5 h-5 mr-2" />
                        <span>或上传聊天截图</span>
                    </button>
                )}
            </div>

            <div className="mt-6 flex items-center gap-4">
                <button
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    className="flex-grow flex items-center justify-center px-6 py-4 bg-cyan-600 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-500 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            分析中...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-6 h-6 mr-2" />
                            一键识别老板意图
                        </>
                    )}
                </button>
                <button 
                    onClick={onClear} 
                    disabled={isLoading}
                    className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
                    aria-label="Clear input"
                >
                   <TrashIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
