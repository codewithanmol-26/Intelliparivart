'use client';

import React, { useEffect, useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

export default function MasteryPage() {
  const { tenantId, selectedBatchId, setSelectedBatchId } = useApp();
  const [topics, setTopics] = useState<TopicMastery[]>([]);
  const [loading, setLoading] = useState(true);
  const [usePsychometricModel, setUsePsychometricModel] = useState(true); // Toggle BKT/IRT vs Raw %
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<TopicMastery | null>(null);

  const batches = [
    { id: 'all', name: 'All Batches (Institute Wide)' },
    { id: 'BATCH_01', name: 'BATCH_01: JEE Advanced Super-30' },
    { id: 'BATCH_02', name: 'BATCH_02: JEE Main Foundation' },
    { id: 'BATCH_03', name: 'BATCH_03: NEET Med-Starters' },
    { id: 'BATCH_04', name: 'BATCH_04: NEET Achievers' },
  ];

  const fetchMastery = async () => {
    setLoading(true);
    try {
      const res = await api.getMasteryMatrix(
        tenantId,
        selectedBatchId === 'all' ? undefined : selectedBatchId
      );
      setTopics(res.topics || []);
    } catch {
      // Mock fallback data for topics
      setTopics([
        {
          topic_id: 'TOPIC_PHY_01',
          topic_name: 'Kinematics & Projectile Motion',
          subject: 'Physics',
          bkt_mastery_prob: 0.82,
          irt_theta_mean: 0.74,
          raw_percent_mean: 68.5,
          sample_size: 140,
          uncertainty: 0.08,
          status: 'Mastered',
        },
        {
          topic_id: 'TOPIC_PHY_02',
          topic_name: 'Rotational Dynamics & Torque',
          subject: 'Physics',
          bkt_mastery_prob: 0.44,
          irt_theta_mean: -0.58,
          raw_percent_mean: 52.0,
          sample_size: 135,
          uncertainty: 0.14,
          status: 'Struggling',
        },
        {
          topic_id: 'TOPIC_PHY_03',
          topic_name: 'Electrostatics & Gauss Law',
          subject: 'Physics',
          bkt_mastery_prob: 0.69,
          irt_theta_mean: 0.22,
          raw_percent_mean: 64.0,
          sample_size: 120,
          uncertainty: 0.11,
          status: 'In Progress',
        },
        {
          topic_id: 'TOPIC_CHEM_01',
          topic_name: 'Chemical Bonding & Hybridization',
          subject: 'Chemistry',
          bkt_mastery_prob: 0.78,
          irt_theta_mean: 0.61,
          raw_percent_mean: 72.0,
          sample_size: 142,
          uncertainty: 0.09,
          status: 'Mastered',
        },
        {
          topic_id: 'TOPIC_CHEM_02',
          topic_name: 'Thermodynamics & Enthalpy',
          subject: 'Chemistry',
          bkt_mastery_prob: 0.38,
          irt_theta_mean: -0.72,
          raw_percent_mean: 46.5,
          sample_size: 110,
          uncertainty: 0.18,
          status: 'Struggling',
        },
        {
          topic_id: 'TOPIC_MATH_01',
          topic_name: 'Calculus: Limits & Continuity',
          subject: 'Mathematics',
          bkt_mastery_prob: 0.85,
          irt_theta_mean: 0.89,
          raw_percent_mean: 79.0,
          sample_size: 98,
          uncertainty: 0.07,
          status: 'Mastered',
        },
        {
          topic_id: 'TOPIC_MATH_02',
          topic_name: 'Integral Calculus & Area Under Curves',
          subject: 'Mathematics',
          bkt_mastery_prob: 0.51,
          irt_theta_mean: -0.15,
          raw_percent_mean: 55.0,
          sample_size: 95,
          uncertainty: 0.13,
          status: 'In Progress',
        },
        {
          topic_id: 'TOPIC_BIO_01',
          topic_name: 'Cell Biology & Genetics',
          subject: 'Biology',
          bkt_mastery_prob: 0.74,
          irt_theta_mean: 0.48,
          raw_percent_mean: 71.0,
          sample_size: 80,
          uncertainty: 0.10,
          status: 'In Progress',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMastery();
  }, [tenantId, selectedBatchId]);

  const filteredTopics = topics.filter((t) => {
    if (subjectFilter === 'All') return true;
    return t.subject.toLowerCase() === subjectFilter.toLowerCase();
  });

  // Calculate teal shade based on score
  const getCellColor = (val: number) => {
    if (val >= 0.75) return 'bg-teal-600 text-white';
    if (val >= 0.60) return 'bg-teal-500 text-white';
    if (val >= 0.45) return 'bg-teal-300 text-teal-950 font-semibold';
    if (val >= 0.30) return 'bg-amber-300 text-amber-950 font-semibold';
    return 'bg-rose-400 text-white font-bold';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Psychometric Topic Mastery Matrix
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

      {/* Filter and Explanatory Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-600">Batch:</span>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="p-1.5 border border-slate-200 rounded bg-slate-50 text-slate-800 font-medium focus:outline-none"
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
              {['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'].map((subj) => (
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
            <span>Hatched = High Uncertainty</span>
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
        <div className="p-12 text-center text-xs text-slate-400">
          Loading psychometric mastery matrix...
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
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
                  <th className="py-3 px-4 text-right">Action</th>
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
                        {topic.topic_name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-bold ${getCellColor(
                            score
                          )} ${isUncertain ? 'bg-uncertainty border border-white/40' : ''}`}
                        >
                          {(score * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-700">
                        {topic.irt_theta_mean > 0 ? `+${topic.irt_theta_mean.toFixed(2)}` : topic.irt_theta_mean.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 font-medium">
                        {topic.sample_size} Qs
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-500">
                        ±{topic.uncertainty.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            topic.status === 'Mastered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : topic.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {topic.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center text-xs">
                          <span>Drilldown</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drill-down Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-600 tracking-wider">
                  {selectedTopic.subject} Psychometric Diagnostic
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedTopic.topic_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">BKT Mastery Prob</span>
                <span className="text-base font-bold text-teal-600">
                  {(selectedTopic.bkt_mastery_prob * 100).toFixed(1)}%
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Mean IRT Ability (θ)</span>
                <span className="text-base font-bold text-slate-800">
                  {selectedTopic.irt_theta_mean > 0 ? `+${selectedTopic.irt_theta_mean.toFixed(2)}` : selectedTopic.irt_theta_mean.toFixed(2)}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Confidence Level</span>
                <span className="text-base font-bold text-emerald-600">
                  {((1 - selectedTopic.uncertainty) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Recommended Remedial Action */}
            <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-lg text-xs space-y-1.5">
              <div className="font-bold text-teal-900 flex items-center">
                <BookOpen className="w-4 h-4 mr-1.5 text-teal-700" />
                Targeted Remedial Recommendation for Teacher:
              </div>
              <p className="text-slate-700 leading-relaxed">
                {selectedTopic.bkt_mastery_prob < 0.5
                  ? 'Urgent remedial required. Conduct 45-minute concept walkthrough on fundamental principles followed by 10 scaffolded Level-1 numerical problems before re-testing.'
                  : selectedTopic.bkt_mastery_prob < 0.75
                  ? 'Moderate retention. Assign speed-drills on multi-concept questions with timed sub-intervals to overcome calculation latency.'
                  : 'Solid mastery achieved. Transition batch to high-discrimination (a > 1.8) JEE Advanced PYQs to build contest resilience.'}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
