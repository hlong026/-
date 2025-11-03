import React from 'react';
import { LightBulbIcon, TargetIcon, ScaleIcon, ClipboardListIcon, CheckCircleIcon } from './IconComponents';

interface OutputPanelProps {
    analysisResult: string;
    isLoading: boolean;
    error: string;
}

const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse space-y-8">
        <div className="space-y-4">
            <div className="h-8 bg-slate-700 rounded w-1/3"></div>
            <div className="h-5 bg-slate-700 rounded w-5/6"></div>
            <div className="h-5 bg-slate-700 rounded w-full"></div>
        </div>
        <div className="space-y-4">
            <div className="h-8 bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-4/6"></div>
        </div>
        <div className="space-y-4">
            <div className="h-8 bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        </div>
    </div>
);

const parseAnalysis = (content: string) => {
    const sections = {
        judgment: '',
        analysis: '',
        strategy: '',
    };

    const judgmentMatch = content.match(/# 意图研判([\s\S]*?)## 深层解析/);
    const analysisMatch = content.match(/## 深层解析([\s\S]*?)## 应对之道/);
    const strategyMatch = content.match(/## 应对之道([\s\S]*)/);

    if (judgmentMatch) sections.judgment = judgmentMatch[1].trim();
    if (analysisMatch) sections.analysis = analysisMatch[1].trim();
    if (strategyMatch) sections.strategy = strategyMatch[1].trim();
    
    // Fallback for cases where regex fails
    if (!judgmentMatch && !analysisMatch && !strategyMatch && content) {
        return { raw: content };
    }

    return sections;
};


const FormattedContent: React.FC<{ content: string }> = ({ content }) => {
    if (!content) return null;
    return (
        <div className="space-y-3 text-slate-300 leading-relaxed">
            {content.split('\n').map((line, index) => {
                if (line.trim() === '') return null;

                if (line.startsWith('* ') || line.startsWith('- ')) {
                    return (
                        <div key={index} className="flex items-start my-3">
                            <CheckCircleIcon className="w-5 h-5 mr-3 mt-1 text-cyan-500 flex-shrink-0" />
                            <span>{line.substring(2)}</span>
                        </div>
                    );
                }

                if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                        <p key={index}>
                            {parts.map((part, i) =>
                                i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-100">{part}</strong> : part
                            )}
                        </p>
                    );
                }

                return <p key={index}>{line}</p>;
            })}
        </div>
    );
};

const AnalysisDisplay: React.FC<{ content: string }> = ({ content }) => {
    const sections = parseAnalysis(content);

    // FIX: Use `in` operator for type guarding to correctly handle the union type returned by `parseAnalysis`.
    if ('raw' in sections) {
         return <div className="prose prose-invert max-w-none prose-p:text-slate-300 leading-relaxed">{sections.raw}</div>;
    }

    return (
        <div className="space-y-8">
            {sections.judgment && (
                <section className="bg-gradient-to-br from-slate-700/50 to-slate-800/60 p-5 rounded-xl border border-cyan-500/30 shadow-lg">
                    <h2 className="flex items-center text-2xl font-bold text-cyan-300 mb-3">
                        <TargetIcon className="w-7 h-7 mr-3" />
                        意图研判
                    </h2>
                    <p className="text-slate-100 text-lg leading-relaxed font-semibold">{sections.judgment}</p>
                </section>
            )}

            {sections.analysis && (
                <section>
                    <h2 className="flex items-center text-2xl font-bold text-cyan-300 mb-4">
                        <ScaleIcon className="w-7 h-7 mr-3" />
                        深层解析
                    </h2>
                    <FormattedContent content={sections.analysis} />
                </section>
            )}

            {sections.strategy && (
                <section>
                    <h2 className="flex items-center text-2xl font-bold text-cyan-300 mb-4">
                        <ClipboardListIcon className="w-7 h-7 mr-3" />
                        应对之道
                    </h2>
                    <FormattedContent content={sections.strategy} />
                </section>
            )}
        </div>
    );
};

export const OutputPanel: React.FC<OutputPanelProps> = ({ analysisResult, isLoading, error }) => {
    const renderContent = () => {
        if (isLoading) {
            return <SkeletonLoader />;
        }
        if (error) {
            return <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>;
        }
        if (analysisResult) {
            return <AnalysisDisplay content={analysisResult} />;
        }
        return (
            <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full">
                <LightBulbIcon className="w-16 h-16 mb-4 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-400">AI 意图分析</h3>
                <p>你的分析结果将显示在这里</p>
            </div>
        );
    };

    return (
         <div className="bg-slate-800/50 rounded-2xl shadow-lg p-6 border border-slate-700 h-full">
            <div className="overflow-y-auto h-full max-h-[calc(100vh-250px)] pr-2">
                {renderContent()}
            </div>
        </div>
    );
};
