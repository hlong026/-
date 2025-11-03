
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { ExampleModal } from './components/ExampleModal';
import { analyzeBossTalk } from './services/geminiService';
import { ImagePreview, Example } from './types';

const EXAMPLES: Example[] = [
    {
        title: '项目委派中的“画饼”',
        inputText: '小王，最近表现不错，很有潜力。这个项目虽然挑战大，但对你是个很好的锻炼机会，好好干，公司不会亏待你的。',
        contextText: '背景：在项目中期汇报后，老板单独找我谈话。项目目前进度有些滞后，团队里有成员对新方案有疑虑。我希望能得到老板的实际支持，比如增加资源或者协调其他部门。',
    },
    {
        title: '周末加班的“团队绑架”',
        inputText: '这个周末大家辛苦一下，一起加个班，把这个项目冲刺一下。咱们团队一向有战斗力，我相信大家！这周就不发加班通知了，我相信大家的自觉性。',
        contextText: '背景：周五下午临下班时，老板在部门群里发了这段话。项目确实很紧张，但并未到火烧眉毛的地步。我个人周末已有安排。',
    },
    {
        title: '会议上的公开敲打',
        inputText: '你这个方案，考虑得还是不够全面。我之前强调的几个重点，好像你没完全理解啊。大家怎么看？都可以提提意见。',
        contextText: '背景：在部门周会上，我正在汇报一个新方案，讲到一半时老板突然打断我并说了这番话。参会的还有其他几个部门的同事。',
    },
    {
        title: '模糊的绩效反馈',
        inputText: '你今年的工作，总体上还是不错的，继续努力。不过，在某些方面，还有提升的空间，要多思考，多复盘。',
        contextText: '背景：年度绩效面谈时，老板给我的反馈。我希望能明确知道自己的优势和不足，以及具体的改进方向，但老板的评价很模糊。',
    },
    {
        title: '请求“私人帮助”',
        inputText: '小李啊，听说你PS技术不错？我儿子学校有个手抄报比赛，你能不能帮忙设计一下？很简单，不费你多少时间。',
        contextText: '背景：午休时间，老板单独找到我，提出了这个请求。这是非工作内容，而且我手头还有紧急的工作任务。',
    },
];

const App: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [contextText, setContextText] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);

    const handleImageUpload = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setImagePreview({
                    dataUrl: reader.result as string,
                    base64: base64String,
                    mimeType: file.type
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const clearInput = () => {
        setInputText('');
        setContextText('');
        setImagePreview(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if(fileInput) {
            fileInput.value = '';
        }
    };

    const handleSelectExample = (example: Example) => {
        setInputText(example.inputText);
        setContextText(example.contextText);
        setImagePreview(null);
        setError('');
        setIsExampleModalOpen(false);
    };

    const handleSubmit = useCallback(async () => {
        if (!inputText && !imagePreview) {
            setError('请输入老板的话或上传截图。');
            return;
        }
        setIsLoading(true);
        setError('');
        setAnalysisResult('');

        try {
            const result = await analyzeBossTalk(inputText, contextText, imagePreview);
            setAnalysisResult(result);
        } catch (err) {
            setError(err instanceof Error ? `分析失败: ${err.message}` : '发生未知错误，请重试。');
        } finally {
            setIsLoading(false);
        }
    }, [inputText, contextText, imagePreview]);

    return (
        <div className="min-h-screen bg-slate-900 font-sans flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                    <InputPanel
                        inputText={inputText}
                        onTextChange={(e) => setInputText(e.target.value)}
                        contextText={contextText}
                        onContextTextChange={(e) => setContextText(e.target.value)}
                        onImageUpload={handleImageUpload}
                        imagePreviewUrl={imagePreview?.dataUrl || null}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        onClear={clearInput}
                        onShowExample={() => setIsExampleModalOpen(true)}
                    />
                    <OutputPanel
                        analysisResult={analysisResult}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>
            </main>
            <ExampleModal
                isOpen={isExampleModalOpen}
                onClose={() => setIsExampleModalOpen(false)}
                examples={EXAMPLES}
                onSelect={handleSelectExample}
            />
        </div>
    );
};

export default App;
