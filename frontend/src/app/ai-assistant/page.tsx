'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import {
  Sparkles,
  Bot,
  Send,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileText,
  Lightbulb,
  ShieldCheck,
  Check,
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  GraduationCap
} from 'lucide-react';

export default function AiAssistantPage() {
  const { tenantId, notifyRecomputed } = useApp();
  const [activeTab, setActiveTab] = useState<'worksheet' | 'copilot'>('worksheet');
  const [genAiStatus, setGenAiStatus] = useState<any | null>(null);

  // Remedial Generator State
  const [selectedTopic, setSelectedTopic] = useState('Rotational Dynamics & Torque');
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [selectedExam, setSelectedExam] = useState('JEE Advanced');
  const [selectedStudent, setSelectedStudent] = useState('Ananya Pandey');
  const [weaknessReason, setWeaknessReason] = useState('Topic mastery slump (42%) after Milestone Test 4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<any | null>(null);
  const [commitSuccess, setCommitSuccess] = useState(false);

  // Copilot Chat State
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string; provider?: string }>>([
    {
      role: 'assistant',
      text: 'Namaste! I am your Intelliprivart AI Teaching Copilot. I analyze your batch psychometrics to help generate targeted remedial worksheets, diagnose conceptual traps, and plan student interventions. How can I assist your teaching today?',
      provider: 'Pedagogical Intelligence Core'
    }
  ]);

  useEffect(() => {
    api.getGenAiStatus().then(setGenAiStatus).catch(() => {});

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const topicParam = params.get('topic');
      const subjectParam = params.get('subject');
      const studentParam = params.get('student');
      if (topicParam) setSelectedTopic(topicParam);
      if (subjectParam) setSelectedSubject(subjectParam);
      if (studentParam) setSelectedStudent(studentParam);
    }
  }, []);

  const handleGenerateWorksheet = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setCommitSuccess(false);
    try {
      const res = await api.generateAiWorksheet(
        {
          topic: selectedTopic,
          subject: selectedSubject,
          target_exam: selectedExam,
          student_name: selectedStudent,
          weakness_reason: weaknessReason,
        },
        tenantId
      );
      setGeneratedWorksheet(res.worksheet);
    } catch (err) {
      console.error('Worksheet generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCommitAsIntervention = async () => {
    if (!generatedWorksheet) return;
    try {
      await api.createIntervention(
        {
          student_id: 'STD_PAT_001',
          intervention_type: 'AI-Generated Remedial Worksheet',
          reason: `Remedial Worksheet on ${selectedTopic}: ${weaknessReason}`,
          assigned_to: 'Er. R. K. Verma (Physics)',
          follow_up_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          outcome_notes: `Assigned 3 practice questions on ${selectedTopic}. Core focus: ${generatedWorksheet.concept_core?.slice(0, 100)}...`
        },
        tenantId
      );
      setCommitSuccess(true);
      notifyRecomputed(undefined, `Assigned AI Remedial Worksheet to ${selectedStudent}!`);
    } catch (err) {
      alert('Failed to log intervention to database.');
    }
  };

  const handleSendChat = async (promptToSend?: string) => {
    const query = promptToSend || chatPrompt;
    if (!query.trim()) return;

    const userMsg = { role: 'user' as const, text: query };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatPrompt('');
    setChatLoading(true);

    try {
      const res = await api.askAiCopilot(query, 'Apex JEE Academy, 12th Achievers Top-30', tenantId);
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', text: res.answer, provider: res.provider }
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Unable to reach GenAI backend. Fallback rule: Focus 1-on-1 faculty mentor sessions on the lowest BKT mastery topics.',
          provider: 'Offline Pedagogical Rule'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-teal-100 text-teal-800">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-semibold text-teal-800 tracking-wide uppercase">
              Generative AI Pedagogical Layer
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {genAiStatus?.default_model || 'Google Gemini 3.8-Flash'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            AI Teaching Assistant & Remedial Worksheet Generator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generates personalized concept catch-up worksheets, resolves student misconceptions, and answers faculty pedagogical queries.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('worksheet')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'worksheet'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Remedial Worksheet
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'copilot'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faculty Copilot Chat
          </button>
        </div>
      </div>

      {/* WORKSHEET GENERATOR TAB */}
      {activeTab === 'worksheet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Controls */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <BrainCircuit className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">Configure Remedial Parameters</h2>
            </div>

            <form onSubmit={handleGenerateWorksheet} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Syllabus Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => {
                    setSelectedTopic(e.target.value);
                    if (e.target.value.includes('Rotational') || e.target.value.includes('Kinematics')) setSelectedSubject('Physics');
                    else if (e.target.value.includes('Thermodynamics') || e.target.value.includes('Bonding')) setSelectedSubject('Chemistry');
                    else setSelectedSubject('Mathematics');
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  <option value="Rotational Dynamics & Torque">Rotational Dynamics & Torque (Physics)</option>
                  <option value="Kinematics & Projectile Motion">Kinematics & Projectile Motion (Physics)</option>
                  <option value="Chemical Thermodynamics & Enthalpy">Chemical Thermodynamics & Enthalpy (Chemistry)</option>
                  <option value="Chemical Bonding & Hybridization">Chemical Bonding & Hybridization (Chemistry)</option>
                  <option value="Calculus: Limits & Continuity">Calculus: Limits & Continuity (Mathematics)</option>
                  <option value="Integral Calculus & Areas">Integral Calculus & Areas (Mathematics)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  <option value="Ananya Pandey">Ananya Pandey (STD_PAT_001)</option>
                  <option value="Shaurya Pandey">Shaurya Pandey (STD_PAT_002)</option>
                  <option value="Khushi Sen">Khushi Sen (STD_PAT_003)</option>
                  <option value="Advait Chatterjee">Advait Chatterjee (STD_PAT_004)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Examination</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  <option value="JEE Advanced">JEE Advanced (Rigorous Multi-Concept)</option>
                  <option value="JEE Main">JEE Main (Standard Speed & Accuracy)</option>
                  <option value="NEET-UG">NEET-UG (Medical Concept Precision)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Diagnostic Reason / Trigger</label>
                <textarea
                  value={weaknessReason}
                  onChange={(e) => setWeaknessReason(e.target.value)}
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-xs disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Generating with Gemini...' : 'Generate AI Remedial Worksheet'}</span>
              </button>
            </form>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <span className="font-semibold text-slate-700 block">DPDP Act Section 9 Guardrail:</span>
              <span>All generated explanations and worksheets focus strictly on growth and conceptual mastery with zero shaming or public comparisons.</span>
            </div>
          </div>

          {/* Right 2 Columns: Generated Worksheet Display */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            {isGenerating ? (
              <div className="py-24 text-center text-xs text-slate-400 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600" />
                <p className="font-semibold text-slate-700">Synthesizing tailored pedagogical worksheet with Google Gemini...</p>
                <p className="text-[11px] text-slate-400">Extracting core theorems, misconception traps, and 3 graded JEE questions.</p>
              </div>
            ) : generatedWorksheet ? (
              <div className="space-y-5">
                {/* Worksheet Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase font-mono">
                      Generated by {generatedWorksheet.provider}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {selectedTopic}: Remedial Action Plan
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tailored for <strong>{selectedStudent}</strong> • Target: {selectedExam}
                    </p>
                  </div>

                  <button
                    onClick={handleCommitAsIntervention}
                    disabled={commitSuccess}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                      commitSuccess
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                    }`}
                  >
                    {commitSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved to Database!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Assign as Intervention</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 1. Core Concept */}
                <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-teal-900 block flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5 text-teal-700" />
                    1. Core Concept & Theorem Summary
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {generatedWorksheet.concept_core}
                  </p>
                </div>

                {/* 2. Common Misconceptions */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-900 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                    2. Common Student Misconception Traps
                  </span>
                  <div className="space-y-1">
                    {(generatedWorksheet.common_misconceptions || []).map((m: string, idx: number) => (
                      <div key={idx} className="p-2 bg-amber-50/60 border border-amber-200/70 rounded-lg text-[11px] text-amber-900 flex items-start space-x-2">
                        <span className="font-bold text-amber-700">{idx + 1}.</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Formula Cheat Sheet */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-900 flex items-center">
                    <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    3. Essential Equations & Principles
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(generatedWorksheet.formula_cheat_sheet || []).map((f: string, idx: number) => (
                      <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-800 text-center">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Graded Practice Problems */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-900 flex items-center">
                    <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    4. Graded Diagnostic Practice Problems
                  </span>
                  <div className="space-y-2">
                    {(generatedWorksheet.practice_questions || []).map((q: any) => (
                      <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Problem #{q.id}</span>
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                            {q.level}
                          </span>
                        </div>
                        <p className="text-slate-700 text-[11px]">{q.question}</p>
                        <p className="text-[10px] text-teal-700 italic">
                          <strong>Faculty Hint:</strong> {q.hint}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-slate-400 space-y-3">
                <BrainCircuit className="w-10 h-10 mx-auto text-slate-300" />
                <p className="font-medium text-slate-600">Select a topic on the left and click "Generate AI Remedial Worksheet".</p>
                <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                  Google Gemini will craft a multi-part concept breakdown with formula sheets and graded questions ready to assign to students.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COPILOT CHAT TAB */}
      {activeTab === 'copilot' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[560px]">
          {/* Quick Prompt Chips */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 text-[11px]">Suggested Inquiries:</span>
            {[
              'How to recover 12th Achievers Rotational Dynamics slump?',
              'Recommend intervention plan for 42% attendance drop in Month 3',
              'What are the key misconceptions in Chemical Thermodynamics?',
              'How to structure a 15-minute 1-on-1 mentor check-in?'
            ].map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(promptText)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-400 text-slate-700 text-[11px] transition shadow-2xs"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.provider && (
                    <span className="text-[10px] text-teal-700 font-mono mt-1 block">
                      Powered by {msg.provider}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs italic">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span>AI Copilot is thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask AI Copilot for coaching advice, student interventions, or lesson pacing..."
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendChat();
              }}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={chatLoading || !chatPrompt.trim()}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition disabled:opacity-50 flex items-center space-x-1"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
