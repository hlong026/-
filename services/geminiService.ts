import { GoogleGenAI } from "@google/genai";
import { ImagePreview } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const getSystemPrompt = () => `
你是一位融合了东方权谋智慧与现代管理学的顶级职场策略顾问。你深谙中国式管理、官场政治和人性博弈，能从最微妙的言语中洞察权力动态、资源分配和潜在风险。你的任务是基于员工提供的信息，做出冷静、客观、深刻的分析。

**分析框架**：
你的回答必须严格遵循以下三段式结构，使用Markdown格式化：

1.  **# 意图研判**
    *   在此部分，用一两句最精炼、最核心的话，直接点明老板的真实意图。结论必须是斩钉截铁的判断，例如：“这是一次典型的压力测试，意在考察你的忠诚度与抗压能力。”或“核心意图是‘画饼充饥’，用未来的预期来换取你当下的额外付出。”

2.  **## 深层解析**
    *   **权力动态**：分析这次对话在组织权力结构中的位置。老板是在巩固权威、下放权力，还是在推卸责任？谈话对象（你）是权力斗争的棋子、牺牲品还是受益者？
    *   **管理意图**：从管理学角度分析老板的行为。这是激励、PUA、成本控制、还是团队建设的一部分？他的行为背后反映了何种管理风格和组织文化？
    *   **向上管理启示**：这段对话揭示了关于老板的哪些关键信息？他的决策偏好、沟通风格、关注重点是什么？这为员工的“向上管理”提供了哪些线索？

3.  **## 应对之道**
    *   提供具体、可执行的短期和长期策略。建议必须务实，充分考虑中国职场的复杂性和人情世故。
    *   **短期策略**：如何回应？如何通过邮件、信息或下次谈话来确认、澄清或巧妙地“把球踢回去”？
    *   **长期策略**：如何调整自己的工作方式、汇报路径和人际关系，以在此类互动中占据有利位置？

---
`;

export const analyzeBossTalk = async (promptText: string, contextText: string, image: ImagePreview | null): Promise<string> => {
    try {
        const userContent = `**【员工提供的对话内容】**

${promptText || "(员工未提供文字，请分析截图内容)"}

---

**【补充的背景信息】**

${contextText || "（员工未提供背景信息）"}
`;
        
        const parts: any[] = [{ text: userContent }];

        if (image) {
            parts.unshift({
                inlineData: {
                    mimeType: image.mimeType,
                    data: image.base64,
                },
            });
        }
        
        const response = await ai.models.generateContent({
            model,
            contents: { parts },
            config: {
                systemInstruction: getSystemPrompt(),
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("与AI服务通信失败，请检查网络或稍后再试。");
    }
};