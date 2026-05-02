import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function translateToRequest(critique: string, userTranslation: string) {
  const prompt = `
    당신은 비폭력 대화(NVC) 전문가입니다.
    사용자는 상대방의 비난 섞인 말을 '부탁'이나 '감사'로 번역하는 연습을 하고 있습니다.
    
    상대방의 비난: "${critique}"
    사용자의 번역: "${userTranslation}"
    
    사용자의 번역이 상대방의 숨겨진 욕구를 잘 파악하고 '부탁'이나 '감사'의 형태로 적절하게 번역되었는지 피드백을 주세요.
    부드럽고 격려하는 톤으로 답변해 주세요.
    
    출력 형식 (JSON):
    {
      "isGood": boolean,
      "feedback": "피드백 내용",
      "betterExample": "더 나은 번역 예시"
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function suggestActionPlans(need: string, feeling: string, thought: string) {
  const prompt = `
    사용자가 현재 '${feeling}' 감정을 느끼고 있고, 그 배경에는 '${need}'의 욕구가 있습니다.
    원래 생각은 "${thought}" 이었습니다.
    
    이 사용자가 자신의 '${need}' 욕구를 건강하게 충족할 수 있는 구체적인 실천 계획 3가지를 제안해 주세요.
    1. 상대방에게 정중하게 부탁(Request)하는 방법
    2. 상대와 상관없이 자기 스스로 그 욕구를 돌보는 방법 (Self-care)
    3. 일상에서 실천할 수 있는 아주 작은 행동 패턴
    
    부드럽고 공감하는 말투로 답변해 주세요.
    결과는 반드시 아래 JSON 형식으로만 출력하세요:
    {
      "suggestions": ["제안1", "제안2", "제안3"]
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{\"suggestions\": []}");
}

export async function startLabChat(history: ChatMessage[]) {
  const systemInstruction = `
    당신은 '연결의 대화 365'의 [관계 실전 훈련]을 돕는 '공감 조력자'입니다.
    
    훈련 목표:
    사용자가 타인의 비난(판단, 비난, 강요) 속에 숨겨진 욕구를 찾아내어 '부탁(Please)' 혹은 '감사(Thank you)'로 번역하는 능력을 기르는 것입니다.
    
    대화 흐름 및 규칙:
    1. 비난의 다양성: 단순히 "왜 늦었어?" 수준을 넘어, 아래와 같은 다양한 뉘앙스의 비난을 구사하세요.
       - 책임 전가: "이게 다 네 탓이잖아, 넌 왜 항상 문제를 만드니?"
       - 인신 공격: "넌 참 이기적인 것 같아. 남 생각은 아예 안 하니?"
       - 지능/능력 비하: "말을 해도 못 알아듣네. 몇 번을 말해야 하니?", "네가 하는 일이 다 그렇지 뭐."
       - 냉소와 무시: "됐어, 너랑 무슨 말을 하겠니. 그냥 관두자.", "넌 왜 그렇게 예민해?"
    2. 번역 유도: 사용자가 이 말을 듣고 어떻게 번역할지(부탁 혹은 감사) 기다리세요.
    3. 심층 피드백 (NVC 관점):
       - 사용자의 번역이 상대의 '핵심 욕구'를 정확히 짚었는지 평가하세요.
       - [평가]: 잘된 점과 아쉬운 점 (부드럽고 공감적인 톤)
       - [더 나은 예시]: 관찰-느낌-욕구-부탁의 흐름이 잘 드러나는 문장 제안
       - [오늘의 한 줄]: 이번 훈련의 핵심 원칙 요약
    4. 다음 단계: 피드백 후에는 다시 일상적인 상황극으로 돌아가 새로운 비난 문장을 제시하세요.
  `;

  const contents = history.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }]
  }));

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents.length > 0 ? contents : "훈련을 시작해줘.",
    config: {
      systemInstruction,
    },
  });

  return response.text;
}
