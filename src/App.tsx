/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  Sun, 
  ShieldAlert, 
  Plus,
  ArrowRight,
  TrendingUp,
  Heart,
  Quote
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { JournalEntry, SunRecord, ThoughtPattern } from "./types";
import { THOUGHT_PATTERNS, CORE_NEEDS, EMOTIONS, STABILIZATION_TECHNIQUES } from "./constants";
import { startLabChat, suggestActionPlans, translateToRequest } from "./services/geminiService";

// --- Components ---

const Navigation = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: "dashboard", icon: Home, label: "K365N" },
    { id: "journal", icon: BookOpen, label: "저널" },
    { id: "lab", icon: MessageSquare, label: "AI 랩" },
    { id: "sun", icon: Sun, label: "태양" },
    { id: "safety", icon: ShieldAlert, label: "안정" },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 bg-white/60 backdrop-blur-xl border border-brand-olive/5 px-6 py-4 z-50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] max-w-md mx-auto">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              activeTab === tab.id ? "text-brand-sun scale-110" : "text-brand-olive/40 hover:text-brand-olive/60"
            }`}
          >
            <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[9px] font-bold tracking-tight">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const Dashboard = ({ entries, sunRecords, streak }: { entries: JournalEntry[], sunRecords: SunRecord[], streak: number }) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const todayDone = entries.some(
    (e) => new Date(e.createdAt).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-3">
        <h1 className="text-4xl font-light text-brand-ink leading-tight">안녕하세요, <span className="text-brand-sun font-normal">지현</span>님</h1>
        <p className="text-brand-olive/70 text-lg leading-relaxed">오늘 당신의 마음이라는 하늘은 <br/>어떤 구름에 가려져 있나요?</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-brand-olive/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-2">
          <div className="flex items-center gap-2 text-brand-sun">
            <BookOpen size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">저널 기록</span>
          </div>
          <p className="text-4xl font-serif text-brand-ink">{entries.length}</p>
          <p className="text-[10px] text-brand-olive/40 font-medium">마음을 들여다본 횟수</p>
        </div>
        <div className="bg-brand-sun/5 p-8 rounded-[2.5rem] border border-brand-sun/10 shadow-[0_8px_30px_rgb(232,160,88,0.05)] space-y-2">
          <div className="flex items-center gap-2 text-brand-sun">
            <Sun size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">태양 포인트</span>
          </div>
          <p className="text-4xl font-serif text-brand-ink">{sunRecords.length}</p>
          <p className="text-[10px] text-brand-sun/40 font-medium">회복된 자아 효능감</p>
        </div>
      </div>

      <div className={`p-6 rounded-[2rem] flex items-center justify-between transition-all ${
        todayDone
          ? "bg-brand-ink text-brand-cream"
          : "bg-white border border-brand-olive/10"
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp size={13} className={todayDone ? "text-brand-sun" : "text-brand-olive/30"} />
            <p className={`text-[10px] font-bold uppercase tracking-widest ${todayDone ? "text-brand-cream/40" : "text-brand-olive/40"}`}>나의 루틴</p>
          </div>
          <p className={`text-3xl font-serif ${todayDone ? "text-brand-cream" : "text-brand-ink"}`}>
            {streak}<span className="text-base ml-1.5 opacity-50">일 연속</span>
          </p>
          <p className={`text-[11px] ${todayDone ? "text-brand-cream/50" : "text-brand-olive/40"}`}>
            {todayDone ? "오늘 루틴 완료" : "오늘 루틴이 기다리고 있어요"}
          </p>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          todayDone ? "bg-brand-sun/20" : "bg-brand-olive/5"
        }`}>
          <TrendingUp size={26} className={todayDone ? "text-brand-sun" : "text-brand-olive/20"} />
        </div>
      </div>

      <section className="bg-brand-olive/95 text-brand-cream p-10 rounded-[3rem] relative overflow-hidden group shadow-xl">
        <div className="relative z-10 space-y-6">
          <Quote size={28} className="text-brand-sun opacity-60" />
          <p className="text-xl font-serif leading-relaxed italic pr-4">
            "자극과 반응 사이에는 공간이 있다. 그 공간에는 우리의 반응을 선택할 수 있는 자유와 힘이 있다."
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 text-brand-cream">— 빅터 프랭클</span>
          </div>
        </div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-brand-sun/20 blur-[80px] group-hover:bg-brand-sun/30 transition-all duration-1000" />
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl">최근 기록</h2>
        </div>
        <div className="space-y-3">
          {entries.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-brand-olive/10 rounded-3xl text-brand-olive/40 italic">
              아직 기록된 저널이 없습니다.
            </div>
          ) : (
            entries.slice().reverse().slice(0, 5).map((entry) => (
              <button 
                key={entry.id} 
                onClick={() => setSelectedEntry(entry)}
                className="w-full bg-white p-5 rounded-2xl border border-brand-olive/5 shadow-sm flex items-center justify-between group hover:border-brand-sun/30 transition-colors text-left"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium line-clamp-1">{entry.automaticThought}</p>
                  <p className="text-[10px] text-brand-olive/50 flex items-center gap-1 uppercase tracking-wider">
                    {entry.coreNeed} · {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ArrowRight size={16} className="text-brand-olive/20 group-hover:text-brand-sun transition-colors" />
              </button>
            ))
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 bg-brand-ink/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-brand-cream w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl relative"
            >
              <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
                <header className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-brand-sun uppercase tracking-widest">{new Date(selectedEntry.createdAt).toLocaleDateString()}</p>
                    <h3 className="text-2xl">내 마음 리포트</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedEntry(null)}
                    className="p-2 bg-brand-olive/5 rounded-full text-brand-olive/40 hover:text-brand-ink transition-colors"
                  >
                    <Plus size={20} className="rotate-45" />
                  </button>
                </header>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-brand-olive/40 uppercase tracking-widest">자동적 생각</h4>
                    <p className="text-sm bg-white p-4 rounded-2xl border border-brand-olive/5 italic">"{selectedEntry.automaticThought}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-brand-olive/5">
                      <p className="text-[9px] font-bold text-brand-olive/30 uppercase tracking-wider mb-1">감정</p>
                      <p className="text-sm font-semibold">{selectedEntry.feeling}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-brand-olive/5">
                      <p className="text-[9px] font-bold text-brand-olive/30 uppercase tracking-wider mb-1">핵심 욕구</p>
                      <p className="text-sm font-semibold text-brand-sun">{selectedEntry.coreNeed}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-brand-sun uppercase tracking-widest">번역된 대화 (나-전달법)</h4>
                    <p className="text-lg font-serif italic bg-brand-sun/5 p-6 rounded-3xl border border-brand-sun/10 leading-relaxed">
                      "{selectedEntry.iMessage}"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-brand-olive/40 uppercase tracking-widest">실천 계획 (Action Plan)</h4>
                    <p className="text-sm bg-brand-ink text-white p-6 rounded-3xl leading-relaxed">
                      {selectedEntry.actionPlan}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Journal = ({ onSave }: { onSave: (entry: JournalEntry) => void }) => {
  const [step, setStep] = useState(1);
  const [thought, setThought] = useState("");
  const [selectedPatterns, setSelectedPatterns] = useState<ThoughtPattern[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [selectedNeed, setSelectedNeed] = useState("");
  const [iMessage, setIMessage] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [refiningPhase, setRefiningPhase] = useState(false);
  const [firstStep, setFirstStep] = useState("");
  const [whenWhere, setWhenWhere] = useState("");

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => {
    if (step === 5 && refiningPhase) {
      setRefiningPhase(false);
    } else {
      setStep(s => s - 1);
    }
  };

  const handleSave = () => {
    const finalPlan = `${actionPlan}\n\n[실천 디테일]\n- 첫 번째 작은 발걸음: ${firstStep}\n- 언제/어디서: ${whenWhere}`;
    const entry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      automaticThought: thought,
      patterns: selectedPatterns,
      feeling: selectedFeeling,
      coreNeed: selectedNeed,
      iMessage: iMessage,
      actionPlan: finalPlan
    };
    onSave(entry);
    // Reset
    setStep(1);
    setThought("");
    setSelectedPatterns([]);
    setSelectedFeeling("");
    setSelectedNeed("");
    setIMessage("");
    setActionPlan("");
  };

  const generateIMessage = () => {
    setIMessage(`내 안에 '${selectedNeed}'(이)라는 욕구가 중요해서, 지금 내 마음이 '${selectedFeeling}'해.`);
  };

  const generateActionPlan = async () => {
    setIsSuggesting(true);
    try {
      const result = await suggestActionPlans(selectedNeed, selectedFeeling, thought);
      setAiSuggestions(result.suggestions || []);
      if (result.suggestions && result.suggestions.length > 0) {
        setActionPlan(result.suggestions[0]);
      }
    } catch (e) {
      console.error(e);
      setActionPlan(`${selectedNeed}의 욕구를 채우기 위해, 나 스스로 혹은 상대방에게 구체적으로 무엇을 부탁할 수 있을까요?`);
    } finally {
      setIsSuggesting(false);
    }
  };

  useEffect(() => {
    if (step === 4 && selectedFeeling && selectedNeed && !iMessage) {
      generateIMessage();
    }
    if (step === 5 && !actionPlan) {
      generateActionPlan();
    }
  }, [step]);

  return (
    <div className="min-h-[80vh] flex flex-col pt-4">
      <div className="mb-8 flex justify-between items-center text-xs font-semibold text-brand-olive/40 uppercase tracking-widest">
        <span>단계 {step}/5</span>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(s => (
            <div key={s} className={`w-8 h-1 rounded-full transition-all ${s <= step ? "bg-brand-sun" : "bg-brand-olive/10"}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6 flex-1"
          >
            <div className="space-y-2">
              <h2 className="text-3xl">불쑥 올라온 나의 마음</h2>
              <p className="text-brand-olive/60 text-sm">판단이나 비난, 혹은 나를 힘들게 하는 그 생각을 가만히 적어보세요.</p>
            </div>
            <textarea
              className="w-full h-40 p-6 rounded-3xl bg-white border border-brand-olive/10 focus:border-brand-sun focus:ring-1 focus:ring-brand-sun text-brand-ink resize-none text-lg leading-relaxed placeholder:text-brand-olive/20"
              placeholder="예: '왜 저 사람은 내 말을 안 듣지?', '난 역시 안 되나 봐...'"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              {THOUGHT_PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (selectedPatterns.includes(p.id)) {
                      setSelectedPatterns(selectedPatterns.filter(v => v !== p.id));
                    } else {
                      setSelectedPatterns([...selectedPatterns, p.id]);
                    }
                  }}
                  className={`p-3 rounded-xl border text-[11px] text-left transition-all ${
                    selectedPatterns.includes(p.id) 
                      ? "bg-brand-sun text-white border-brand-sun" 
                      : "bg-white text-brand-olive border-brand-olive/10 hover:border-brand-sun/30"
                  }`}
                >
                  <p className="font-bold mb-1">{p.id}</p>
                  <p className="opacity-80 leading-snug">{p.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6 flex-1"
          >
            <div className="space-y-2">
              <h2 className="text-3xl">내 마음의 온도</h2>
              <p className="text-brand-olive/60 text-sm">그 생각 뒤에 숨어있는 진짜 감정은 어떤 색인가요?</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setSelectedFeeling(e)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    selectedFeeling === e
                      ? "bg-brand-ink text-white border-brand-ink"
                      : "bg-white text-brand-olive border-brand-olive/10 hover:border-brand-ink/30"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6 flex-1"
          >
            <div className="space-y-2">
              <h2 className="text-3xl">내가 진짜 바라는 것</h2>
              <p className="text-brand-olive/60 text-sm">이 불편한 마음은 어떤 욕구를 채워달라고 신호를 보내는 걸까요?</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {CORE_NEEDS.map((n) => (
                <button
                  key={n}
                  onClick={() => setSelectedNeed(n)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    selectedNeed === n
                      ? "bg-brand-sun text-white border-brand-sun"
                      : "bg-white text-brand-olive border-brand-olive/10 hover:border-brand-sun/30"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6 flex-1"
          >
            <div className="space-y-2">
              <h2 className="text-3xl">내 진심의 형태</h2>
              <p className="text-brand-olive/60 text-sm">비난의 가시를 걷어내고 나의 욕구를 부드럽게 담아보세요.</p>
            </div>
            <div className="p-8 bg-brand-sun/5 rounded-[40px] border border-brand-sun/10 space-y-4">
              <p className="text-xs font-bold text-brand-sun uppercase tracking-widest">번역된 진심</p>
              <textarea
                className="w-full bg-transparent border-none text-2xl font-serif focus:ring-0 text-brand-ink p-0 resize-none h-40 leading-relaxed"
                value={iMessage}
                onChange={(e) => setIMessage(e.target.value)}
              />
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6 flex-1"
          >
            <div className="space-y-2">
              <h2 className="text-3xl">{refiningPhase ? "실천 계획 구체화" : "나를 위한 작은 약속"}</h2>
              <p className="text-brand-olive/60 text-sm">
                {refiningPhase 
                  ? "생각만으로는 바뀌지 않습니다. 아주 구체적인 실행 단위를 정해볼까요?" 
                  : `'${selectedNeed}'의 욕구를 어떻게 채워주면 좋을까요?`}
              </p>
            </div>
            
            <div className="space-y-4">
              {isSuggesting ? (
                <div className="py-12 bg-white rounded-3xl border border-brand-olive/10 flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-4 border-brand-sun/10 border-t-brand-sun rounded-full animate-spin" />
                  <p className="text-xs text-brand-olive/40 animate-pulse">당신의 욕구를 빛낼 방법을 찾고 있어요...</p>
                </div>
              ) : !refiningPhase ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-[10px] font-bold text-brand-sun uppercase tracking-widest px-2">AI가 추천하는 실천 방법 (하나를 선택해 주세요)</p>
                  <div className="space-y-2">
                    {aiSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActionPlan(s);
                          setRefiningPhase(true);
                        }}
                        className="w-full text-left p-5 rounded-2xl border bg-white text-brand-olive border-brand-olive/10 hover:border-brand-sun/40 hover:bg-brand-sun/[0.02] transition-all group shadow-sm"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-xs font-medium leading-relaxed">{s}</span>
                          <ArrowRight size={14} className="text-brand-olive/20 group-hover:text-brand-sun shrink-0 mt-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="pt-4 px-2 space-y-2">
                    <p className="text-[10px] font-bold text-brand-olive/40 uppercase tracking-widest">직접 입력하고 싶다면</p>
                    <button 
                      onClick={() => setRefiningPhase(true)}
                      className="w-full p-4 rounded-xl border border-dashed border-brand-olive/20 text-[11px] text-brand-olive/50 hover:bg-white transition-colors"
                    >
                      새로운 계획 직접 작성하기
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-brand-sun uppercase tracking-widest px-2">기본 계획</p>
                    <textarea
                      className="w-full p-4 rounded-2xl bg-white border border-brand-olive/10 text-xs focus:ring-0 focus:border-brand-sun resize-none"
                      value={actionPlan}
                      onChange={(e) => setActionPlan(e.target.value)}
                      placeholder="무엇을 할지 적어주세요..."
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-brand-olive/60 uppercase tracking-widest px-2">Q1. 당장 실천할 아주 작은 첫 걸음은?</p>
                      <input
                        type="text"
                        className="w-full p-4 rounded-2xl bg-white border border-brand-olive/10 text-xs focus:ring-0 focus:border-brand-sun"
                        placeholder="예: 휴대폰 화면 끄기, 신발 신기, 짧게 메모하기..."
                        value={firstStep}
                        onChange={(e) => setFirstStep(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-brand-olive/60 uppercase tracking-widest px-2">Q2. 언제, 어디서 할까요?</p>
                      <input
                        type="text"
                        className="w-full p-4 rounded-2xl bg-white border border-brand-olive/10 text-xs focus:ring-0 focus:border-brand-sun"
                        placeholder="예: 오늘 저녁 8시 침대 위에서, 사무실 복도에서..."
                        value={whenWhere}
                        onChange={(e) => setWhenWhere(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto pt-8 pb-20 flex gap-3">
        {step > 1 && (
          <button
            onClick={handlePrev}
            className="flex-1 py-4 px-6 rounded-2xl border border-brand-olive/10 text-brand-olive font-semibold text-sm hover:bg-brand-olive/5 transition-colors"
          >
            이전
          </button>
        )}
        {step < 5 ? (
          <button
            onClick={handleNext}
            disabled={(step === 1 && !thought) || (step === 2 && !selectedFeeling) || (step === 3 && !selectedNeed)}
            className="flex-[2] py-4 px-6 rounded-2xl bg-brand-ink text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            다음 단계
          </button>
        ) : !refiningPhase ? (
          <button
            onClick={() => setRefiningPhase(true)}
            className="flex-[2] py-4 px-6 rounded-2xl bg-brand-ink text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            직접 작성하기
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={!actionPlan || !firstStep || !whenWhere}
            className="flex-[2] py-4 px-6 rounded-2xl bg-brand-sun text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            기록 완료하기
          </button>
        )}
      </div>
    </div>
  );
};

type LabMessage =
  | { type: "chat"; role: "user" | "model"; content: string }
  | { type: "feedback"; isGood: boolean; feedback: string; betterExample: string };

const AiLab = () => {
  const [messages, setMessages] = useState<LabMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const getLastCritique = (msgs: LabMessage[]) => {
    for (let i = msgs.length - 1; i >= 0; i--) {
      const m = msgs[i];
      if (m.type === "chat" && m.role === "model") return m.content;
    }
    return "";
  };

  const handleSend = async () => {
    if (!input || loading) return;

    const critique = getLastCritique(messages);
    const userTranslation = input;
    const userMsg: LabMessage = { type: "chat", role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const chatHistory = newMessages
        .filter((m): m is Extract<LabMessage, { type: "chat" }> => m.type === "chat")
        .map((m) => ({ role: m.role, content: m.content }));

      const [response, feedbackResult] = await Promise.all([
        startLabChat(chatHistory),
        critique ? translateToRequest(critique, userTranslation).catch(() => null) : Promise.resolve(null),
      ]);

      const next: LabMessage[] = [...newMessages];
      if (feedbackResult) next.push({ type: "feedback", ...feedbackResult });
      next.push({ type: "chat", role: "model", content: response || "" });
      setMessages(next);
    } catch (e) {
      console.error(e);
      setMessages([...newMessages, { type: "chat", role: "model", content: "AI와 연결 중 오류가 발생했습니다. 다시 시도해 주세요." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const response = await startLabChat([]);
        setMessages([{ type: "chat", role: "model", content: response || "" }]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <header className="mb-6 space-y-2">
        <h2 className="text-2xl">관계 실전 훈련</h2>
        <p className="text-brand-olive/60 text-xs leading-relaxed">
          어떤 비난이 들리더라도 그 속의 '부탁'이나 '감사'를 찾아낼 수 있다면, <br/>
          당신은 관계의 주도권을 갖게 됩니다.
        </p>
      </header>

      <div className="mb-4 flex gap-2">
        <div className="flex-1 bg-white/50 border border-brand-olive/5 p-3 rounded-2xl">
          <p className="text-[9px] font-bold text-brand-sun uppercase tracking-widest mb-1">TIP: 부탁으로 번역하기</p>
          <p className="text-[10px] text-brand-olive/60 font-medium">"~해줄 수 있을까?" 라고 구체적으로 요청하기</p>
        </div>
        <div className="flex-1 bg-white/50 border border-brand-olive/5 p-3 rounded-2xl">
          <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest mb-1">TIP: 감사로 번역하기</p>
          <p className="text-[10px] text-brand-olive/60 font-medium">"~를 소중히 여기는 마음이 느껴져요" 라고 말하기</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-hide">
        {messages.map((m, i) => {
          if (m.type === "feedback") {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mx-2 p-4 rounded-2xl border text-xs space-y-2 ${
                  m.isGood
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-brand-sun/5 border-brand-sun/20 text-brand-ink"
                }`}
              >
                <p className="font-bold">
                  {m.isGood ? "✅ 훌륭한 번역이에요!" : "💡 이렇게 해보면 어떨까요?"}
                </p>
                <p className="leading-relaxed">{m.feedback}</p>
                {!m.isGood && m.betterExample && (
                  <div className="bg-white/70 p-3 rounded-xl border border-current/10 space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">더 나은 표현</p>
                    <p className="italic">{m.betterExample}</p>
                  </div>
                )}
              </motion.div>
            );
          }

          return (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-brand-sun text-white rounded-tr-none"
                    : "bg-white border border-brand-olive/10 text-brand-ink rounded-tl-none shadow-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/50 border border-brand-olive/5 px-4 py-2 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1 h-1 bg-brand-olive/40 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-brand-olive/40 rounded-full animate-bounce [animation-delay:-.3s]" />
              <div className="w-1 h-1 bg-brand-olive/40 rounded-full animate-bounce [animation-delay:-.5s]" />
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="나의 대화를 입력하세요..."
          className="w-full bg-white border border-brand-olive/10 rounded-2xl px-6 py-4 pr-16 text-sm focus:border-brand-sun focus:ring-brand-sun shadow-sm"
        />
        <button
          onClick={handleSend}
          disabled={!input || loading}
          className="absolute right-2 top-2 bottom-2 px-4 bg-brand-ink text-white rounded-xl hover:bg-brand-ink/80 transition-colors disabled:opacity-20"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

const SunRecords = ({ records, onSave }: { records: SunRecord[], onSave: (r: SunRecord) => void }) => {
  const [content, setContent] = useState("");
  const [type, setType] = useState<"gratitude" | "service" | "compassion">("gratitude");

  const handleSave = () => {
    if (!content) return;
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      type,
      content
    });
    setContent("");
  };

  const types = [
    { id: "gratitude", label: "고마운 순간", color: "text-green-600 bg-green-50" },
    { id: "service", label: "나눔과 배려", color: "text-blue-600 bg-blue-50" },
    { id: "compassion", label: "나를 향한 응원", color: "text-brand-sun bg-brand-sun/5" },
  ];

  return (
    <div className="space-y-8 pb-32">
      <header className="space-y-4">
        <h2 className="text-3xl italic font-serif">태양의 기록</h2>
        <p className="text-brand-olive/60 text-sm leading-relaxed">
          구름에 가려져 있던 당신의 가치를 다시 발견하는 시간입니다. <br />
          나에게, 혹은 타인에게 건넨 따뜻한 시선을 기록해 보세요.
        </p>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-brand-olive/10 shadow-sm space-y-6">
        <div className="flex gap-2">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id as any)}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${
                type === t.id ? t.color : "bg-brand-cream/50 text-brand-olive/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-32 p-0 bg-transparent border-none focus:ring-0 text-lg font-serif italic text-brand-ink resize-none placeholder:text-brand-olive/20"
          placeholder="내면의 따뜻한 목소리를 적어보세요..."
        />
        <button
          onClick={handleSave}
          disabled={!content}
          className="w-full py-4 bg-brand-sun text-white font-bold rounded-2xl hover:opacity-90 disabled:opacity-20 transition-all shadow-lg shadow-brand-sun/20 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          기록 남기기
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-brand-olive/40 uppercase tracking-widest">나의 태양 조각들</h3>
        <div className="grid grid-cols-1 gap-3">
          {records.length === 0 ? (
            <div className="py-12 border border-dashed border-brand-olive/10 rounded-3xl text-center italic text-brand-olive/30">
              아직 기록이 없습니다.
            </div>
          ) : (
            records.slice().reverse().map(r => (
              <div key={r.id} className="bg-white p-4 rounded-2xl border border-brand-olive/5 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    r.type === 'gratitude' ? "bg-green-50 text-green-600" : 
                    r.type === 'service' ? "bg-blue-50 text-blue-600" : "bg-brand-sun/5 text-brand-sun"
                  }`}>
                    {types.find(t => t.id === r.type)?.label}
                  </span>
                  <span className="text-[9px] text-brand-olive/30">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm font-serif italic">{r.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Safety = () => {
  return (
    <div className="space-y-8 pb-32">
      <header className="space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-3xl">마음의 숨 고르기</h2>
        <p className="text-brand-olive/60 text-sm leading-relaxed">
          감정의 파도가 너무 높게 일어 감당하기 힘들 때가 있습니다. <br />
          지금 이 순간으로 안전하게 돌아올 수 있게 도와드릴게요.
        </p>
      </header>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[40px] border border-brand-olive/5 shadow-sm space-y-4">
          <h3 className="text-xl">깊게 숨 쉬기 (Abdominal Breathing)</h3>
          <p className="text-sm text-brand-olive/60 leading-relaxed">코로 숨을 깊게 들이마시고, 배가 부풀어 오르는 것을 느끼며 입으로 천천히 내뱉습니다.</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-sun" /><span className="text-sm font-medium">4초간 숨 들이마시기</span></div>
            <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-sun" /><span className="text-sm font-medium">2초간 멈추기</span></div>
            <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-sun" /><span className="text-sm font-medium">6초간 천천히 내뱉기</span></div>
          </div>
          <div className="pt-4 flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 bg-brand-sun rounded-full blur-xl"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-brand-olive/5 shadow-sm space-y-4">
          <h3 className="text-xl">지금 여기로 돌아오기 (Grounding)</h3>
          <p className="text-sm text-brand-olive/60 leading-relaxed">눈에 보이는 것과 들리는 것에 집중하며 요동치는 생각을 잠재웁니다.</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-sun" /><span className="text-sm font-medium">보이는 것 5가지 말해보기</span></div>
            <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-sun" /><span className="text-sm font-medium">들리는 것 4가지 들어보기</span></div>
            <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-sun" /><span className="text-sm font-medium">느껴지는 것 3가지 감각하기</span></div>
          </div>
        </div>
      </div>

      <div className="p-8 bg-brand-olive text-brand-cream rounded-3xl space-y-4">
        <h3 className="text-lg">전문가의 도움이 필요한 신호</h3>
        <ul className="text-xs space-y-2 opacity-80 list-disc pl-4">
          <li>지속적으로 자신이나 타인을 해치고 싶은 충동이 들 때</li>
          <li>일상 생활을 유지하기 어려울 정도의 깊은 우울감이 계속될 때</li>
          <li>특정 상황이 반복적으로 트라우마를 자극하여 일상이 마비될 때</li>
          <li>상대가 신체적, 정신적 폭력을 동반한 독성 관계임을 인지했을 때</li>
        </ul>
        <p className="text-[10px] italic border-t border-white/10 pt-4 opacity-50 text-center">
          이 앱은 심리 치료를 대체할 수 없습니다. 위와 같은 상황에서는 반드시 전문 상담사를 찾아가세요.
        </p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [sunRecords, setSunRecords] = useState<SunRecord[]>([]);
  const [lastSavedEntry, setLastSavedEntry] = useState<JournalEntry | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    const savedRecords = localStorage.getItem("sunRecords");
    const savedStreak = localStorage.getItem("streakData");
    if (savedEntries) setJournalEntries(JSON.parse(savedEntries));
    if (savedRecords) setSunRecords(JSON.parse(savedRecords));
    if (savedStreak) setStreak(JSON.parse(savedStreak).streak ?? 0);
  }, []);

  const updateStreak = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const stored = localStorage.getItem("streakData");
    const data = stored ? JSON.parse(stored) : { lastDate: "", streak: 0 };
    if (data.lastDate === today) return;
    const newStreak = data.lastDate === yesterday ? data.streak + 1 : 1;
    localStorage.setItem("streakData", JSON.stringify({ lastDate: today, streak: newStreak }));
    setStreak(newStreak);
  };

  const saveJournal = (entry: JournalEntry) => {
    const newEntries = [...journalEntries, entry];
    setJournalEntries(newEntries);
    localStorage.setItem("journalEntries", JSON.stringify(newEntries));
    updateStreak();
    setLastSavedEntry(entry);
    setActiveTab("dashboard");
  };

  const saveSunRecord = (record: SunRecord) => {
    const newRecords = [...sunRecords, record];
    setSunRecords(newRecords);
    localStorage.setItem("sunRecords", JSON.stringify(newRecords));
  };

  return (
    <div className="min-h-screen bg-brand-cream font-sans">
      <header className="sticky top-0 bg-brand-cream/80 backdrop-blur-lg z-30 pt-6 pb-2 px-6 flex justify-between items-center max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab("dashboard")} 
          className="text-2xl font-black text-brand-sun tracking-tighter hover:scale-105 transition-transform"
        >
          K365N
        </button>
        <div className="w-8 h-8 rounded-full bg-brand-olive/5 flex items-center justify-center">
          <Heart size={16} className="text-brand-sun/60" />
        </div>
      </header>
      <main className="max-w-md mx-auto px-6 pt-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeTab === "dashboard" && <Dashboard entries={journalEntries} sunRecords={sunRecords} streak={streak} />}
            {activeTab === "journal" && <Journal onSave={saveJournal} />}
            {activeTab === "lab" && <AiLab />}
            {activeTab === "sun" && <SunRecords records={sunRecords} onSave={saveSunRecord} />}
            {activeTab === "safety" && <Safety />}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {activeTab === "dashboard" && lastSavedEntry && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-brand-ink/20 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl p-8 space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-brand-sun" />
              
              <header className="space-y-1 text-center">
                <p className="text-[10px] font-bold text-brand-sun uppercase tracking-widest">오늘의 마음 정리</p>
                <h3 className="text-2xl">참 애쓰셨어요.</h3>
              </header>

              <div className="space-y-4 pt-2">
                <div className="bg-brand-sun/5 p-5 rounded-3xl border border-brand-sun/10 space-y-2">
                  <p className="text-[9px] font-bold text-brand-sun uppercase tracking-widest italic">오늘의 한 줄 요약</p>
                  <p className="text-sm font-serif italic text-brand-ink leading-relaxed">
                    "{lastSavedEntry.iMessage}"
                  </p>
                </div>

                <div className="bg-brand-ink text-white p-5 rounded-3xl space-y-2">
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">핵심 실천 과제</p>
                  <p className="text-xs leading-relaxed font-medium">
                    {lastSavedEntry.actionPlan.split('\n').find(l => l.includes('첫 번째'))?.replace('- ', '') || '작은 실천부터 시작해 보세요.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setLastSavedEntry(null)}
                className="w-full py-4 bg-brand-cream border border-brand-olive/10 text-brand-ink font-bold rounded-2xl hover:bg-brand-olive/5 transition-colors text-sm"
              >
                확인했습니다
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
