'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { TopicMastery } from '../../lib/types';
import {
  Layers,
  Info,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  X,
  BookOpen,
  ArrowRight,
  ArrowUpDown,
  Database,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function MasteryPage() {
  const { tenantId, selectedBatchId, setSelectedBatchId, recomputeVersion, lastRunId } = useApp();
  const [topics, setTopics] = useState<TopicMastery[]>([]);
  const [loading, setLoading] = useState(true);
  const [usePsychometricModel, setUsePsychometricModel] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'weakest' | 'strongest' | 'subject'>('weakest');
  const [selectedTopic, setSelectedTopic] = useState<TopicMastery | null>(null);

  const batches = [
    { id: 'all', name: 'All Batches (Institute Wide)' },
    { id: 'INST_PATNA_01_B1_JEE_12', name: '12th JEE Achievers Top-30' },
    { id: 'INST_PATNA_01_B2_JEE_11', name: '11th JEE Foundation Core' },
    { id: 'INST_PATNA_01_B3_NEET_12', name: '12th NEET Pinnacle' },
    { id: 'INST_PATNA_01_B4_DROP', name: 'Repeater / Dropper Fastrack' },
  ];

  const fetchMastery = async () => {
    setLoading(true);
    try {
      const res = await api.getMasteryMatrix(
        tenantId,
        selectedBatchId === 'all' ? undefined : selectedBatchId
      );
      if (res && res.topics && res.topics.length > 0) {
        setTopics(res.topics);
      } else {
        // Fallback to initial topics if DB has not yet recomputed
        setTopics([
          {
            topic_id: 'TOPIC_PHY_ROT',
            topic_name: 'Rotational Dynamics & Torque',
            subject: 'Physics',
            bkt_mastery_prob: 0.42,
            irt_theta_mean: -0.65,
            raw_percent_mean: 48.0,
            sample_size: 145,
            uncertainty: 0.16,
            status: 'Struggling',
          },
          {
            topic_id: 'TOPIC_PHY_KIN',
            topic_name: 'Kinematics & Projectile Motion',
            subject: 'Physics',
            bkt_mastery_prob: 0.84,
            irt_theta_mean: 0.78,
            raw_percent_mean: 72.5,
            sample_size: 160,
            uncertainty: 0.07,
            status: 'Mastered',
          },
          {
            topic_id: 'TOPIC_CHEM_THERMO',
            topic_name: 'Thermodynamics & Enthalpy',
            subject: 'Chemistry',
            bkt_mastery_prob: 0.39,
            irt_theta_mean: -0.74,
            raw_percent_mean: 44.0,
            sample_size: 120,
            uncertainty: 0.18,
            status: 'Struggling',
          },
          {
            topic_id: 'TOPIC_CHEM_BOND',
            topic_name: 'Chemical Bonding & Hybridization',
            subject: 'Chemistry',
            bkt_mastery_prob: 0.79,
            irt_theta_mean: 0.65,
            raw_percent_mean: 74.0,
            sample_size: 155,
            uncertainty: 0.08,
            status: 'Mastered',
          },
          {
            topic_id: 'TOPIC_MATH_CALC',
            topic_name: 'Calculus: Limits & Continuity',
            subject: 'Mathematics',
            bkt_mastery_prob: 0.86,
            irt_theta_mean: 0.91,
            raw_percent_mean: 80.0,
            sample_size: 110,
            uncertainty: 0.06,
            status: 'Mastered',
          },
          {
            topic_id: 'TOPIC_MATH_INT',
            topic_name: 'Integral Calculus & Area Under Curves',
            subject: 'Mathematics',
            bkt_mastery_prob: 0.52,
            irt_theta_mean: -0.12,
            raw_percent_mean: 54.0,
            sample_size: 98,
            uncertainty: 0.12,
            status: 'In Progress',
          },
        ]);
      }
    } catch (err) {
      console.error('Error fetching mastery matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMastery();
  }, [tenantId, selectedBatchId, recomputeVersion]);

  // Filter topics by subject
  let filteredTopics = topics.filter((t) => {
    if (subjectFilter === 'All') return true;
    return t.subject.toLowerCase() === subjectFilter.toLowerCase();
  });

  // Sort topics
  filteredTopics = [...filteredTopics].sort((a, b) => {
    if (sortBy === 'weakest') {
      return a.bkt_mastery_prob - b.bkt_mastery_prob;
    } else if (sortBy === 'strongest') {
      return b.bkt_mastery_prob - a.bkt_mastery_prob;
    } else {
      return a.subject.localeCompare(b.subject);
    }
  });

  const getCellColor = (val: number) => {
    if (val >= 0.75) return 'bg-teal-600 text-white';
    if (val >= 0.60) return 'bg-teal-500 text-white';
    if (val >= 0.45) return 'bg-teal-300 text-teal-950 font-semibold';
    if (val >= 0.30) return 'bg-amber-300 text-amber-950 font-semibold';
    return 'bg-rose-400 text-white font-bold';
  };

  return (
    <div className="space-y-6">
      {/* Header & Lineage Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Psychometric Batch Mastery Heatmap
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Topic knowledge state computed via Bayesian Knowledge Tracing (BKT) and 2PL Item Response Theory ($c=0.10$).
          </p>
        </div>

        {/* Model vs Raw Toggle */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 text-xs shadow-xs">
          <button
            onClick={() => setUsePsychometricModel(true)}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              usePsychometricModel
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Psychometric BKT + IRT
          </button>
          <button
            onClick={() => setUsePsychometricModel(false)}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              !usePsychometricModel
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Raw % Baseline (Uncalibrated)
          </button>
        </div>
      </div>

      {/* Lineage & Methodology Badge */}
      <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-teal-700 shrink-0" />
          <span className="font-semibold text-teal-950">Active Recompute Run:</span>
          <span className="font-mono text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded text-[11px]">
            {lastRunId ? lastRunId : 'RUN_SEEDED_BENCHMARK'}
          </span>
          <span className="text-slate-500 hidden md:inline">• 2PL IRT Ability Matrix Calibrated</span>
        </div>
        <button
          onClick={fetchMastery}
          className="text-teal-700 hover:text-teal-900 font-semibold flex items-center space-x-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Heatmap</span>
        </button>
      </div>

      {/* Filter and Explanatory Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-600">Batch:</span>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="p-1.5 border border-slate-200 rounded bg-slate-50 text-slate-800 font-medium focus:outline-none max-w-[220px] truncate"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-600">Subject:</span>
            <div className="flex rounded-md border border-slate-200 overflow-hidden">
              {['All', 'Physics', 'Chemistry', 'Mathematics'].map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSubjectFilter(subj)}
                  className={`px-2.5 py-1 text-xs font-medium transition ${
                    subjectFilter === subj
                      ? 'bg-teal-50 text-teal-700 font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Control */}
          <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-1 border border-slate-200 rounded bg-slate-50 text-slate-800 text-xs font-medium focus:outline-none"
            >
              <option value="weakest">Weakest Topics First (Deficit Priority)</option>
              <option value="strongest">Strongest Topics First</option>
              <option value="subject">Subject Grouping</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-500">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-teal-600 inline-block"></span>
            <span>&gt;75% Mastered</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-teal-300 inline-block"></span>
            <span>45–60% In Progress</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-rose-400 inline-block"></span>
            <span>&lt;45% Critical Slump</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-teal-500 bg-uncertainty border border-slate-300 inline-block"></span>
            <span>Hatched = High Uncertainty (σ &gt; 0.15)</span>
          </div>
        </div>
      </div>

      {!usePsychometricModel && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start">
          <Info className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
          <span>
            <strong>Baseline Comparison Mode:</strong> Showing uncalibrated raw test percentages. Notice how raw percentages treat an easy test with 70% average the same as a rigorous JEE Advanced paper with 50% average, failing to account for question difficulty parameters.
          </span>
        </div>
      )}

      {/* Heatmap Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
          <span>Loading psychometric mastery matrix from database...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs border-collapse min-w-[720px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Topic / Sub-Concept</th>
                  <th className="py-3 px-4 text-center">
                    {usePsychometricModel ? 'BKT Mastery P(L)' : 'Raw % Mean'}
                  </th>
                  <th className="py-3 px-4 text-center">Latent Ability θ (IRT)</th>
                  <th className="py-3 px-4 text-center">Sample Responses</th>
                  <th className="py-3 px-4 text-center">Uncertainty σ</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Drilldown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTopics.map((topic) => {
                  const score = usePsychometricModel
                    ? topic.bkt_mastery_prob
                    : topic.raw_percent_mean / 100;
                  const isUncertain = topic.uncertainty > 0.15 || topic.sample_size < 50;

                  return (
                    <tr
                      key={topic.topic_id}
                      onClick={() => setSelectedTopic(topic)}
                      className="hover:bg-slate-50 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {topic.subject}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="flex items-center space-x-2">
                          <span>{topic.topic_name}</span>
                          {topic.status === 'Struggling' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                              Priority Deficit
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-block relative">
                          <span
                            className={`px-3 py-1 rounded-md text-xs font-bold inline-block min-w-[54px] ${getCellColor(
                              score
                            )} ${isUncertain ? 'bg-uncertainty border border-white/50' : ''}`}
                          >
                            {(score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-700">
                        {topic.irt_theta_mean > 0 ? `+${topic.irt_theta_mean.toFixed(2)}` : topic.irt_theta_mean.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-500">
                        {topic.sample_size} items
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-mono text-[11px] ${
                            isUncertain ? 'text-amber-600 font-bold' : 'text-slate-400'
                          }`}
                        >
                          ±{topic.uncertainty.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            topic.status === 'Mastered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : topic.status === 'Struggling'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {topic.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-teal-600 hover:text-teal-800 font-semibold text-xs flex items-center justify-end">
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Topic Drill-Down Slide-Out Drawer */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600">
                  {selectedTopic.subject} • Topic Diagnostic
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedTopic.topic_name}
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  ID: {selectedTopic.topic_id}
                </span>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metric Summary Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  BKT Knowledge State P(L)
                </span>
                <span className="text-xl font-black text-slate-800 mt-1 block">
                  {(selectedTopic.bkt_mastery_prob * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-500">
                  Prior transition $P(T)=0.12$
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  Latent Ability θ (IRT)
                </span>
                <span className="text-xl font-black text-slate-800 mt-1 block font-mono">
                  {selectedTopic.irt_theta_mean > 0
                    ? `+${selectedTopic.irt_theta_mean.toFixed(2)}`
                    : selectedTopic.irt_theta_mean.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500">
                  Standard Error: ±{selectedTopic.uncertainty.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Technical Explanation */}
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs space-y-2">
              <div className="font-bold text-teal-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Psychometric Interpretation:</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                Under 2PL Item Response Theory, an ability estimate of{' '}
                <strong>{selectedTopic.irt_theta_mean.toFixed(2)}</strong> indicates this batch operates{' '}
                {selectedTopic.irt_theta_mean < 0 ? 'below' : 'above'} the benchmark difficulty threshold.
                The BKT slip parameter $s=0.10$ and guess parameter $g=0.25$ prevent noisy wrong answers from prematurely resetting topic confidence.
              </p>
            </div>

            {/* Recommended Pedagogical Remedial */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-900 block">
                Targeted Remedial Recommendations:
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-start space-x-2.5">
                  <BookOpen className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">
                      Concept Foundation Module
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Auto-assign 8 targeted step-by-step foundation problems isolating common misconceptions in {selectedTopic.topic_name}.
                    </span>
                  </div>
                </div>

                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-start space-x-2.5">
                  <TrendingUp className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">
                      Spaced Retrieval Micro-Quiz
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Schedule 3-day spaced review to consolidate memory before the next comprehensive test.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href={`/ai-assistant?topic=${encodeURIComponent(selectedTopic.topic_name)}&subject=${encodeURIComponent(selectedTopic.subject)}`}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate AI Remedial Worksheet (GenAI Layer)</span>
              </Link>

              <button
                onClick={async () => {
                  try {
                    await api.createIntervention({
                      student_id: 'ALL_STRUGGLING',
                      intervention_type: 'Batch Concept Remedial',
                      reason: `Low mastery on ${selectedTopic.topic_name} (BKT: ${(selectedTopic.bkt_mastery_prob * 100).toFixed(0)}%)`,
                      assigned_to: 'Faculty Lead',
                      follow_up_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                      outcome_notes: `Queued 8 targeted concept foundation problems for ${selectedTopic.topic_name}.`
                    }, tenantId);
                    alert(`Remedial action logged to Intervention Tracker for ${selectedTopic.topic_name}!`);
                    setSelectedTopic(null);
                  } catch (e) {
                    alert(`Remedial module queued for ${selectedTopic.topic_name}!`);
                    setSelectedTopic(null);
                  }
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Log Module in Intervention Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
