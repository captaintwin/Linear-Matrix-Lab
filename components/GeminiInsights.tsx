
import React from 'react';
import { GeminiInsight } from '../types';

interface GeminiInsightsProps {
  insight: GeminiInsight | null;
  loading: boolean;
}

const GeminiInsights: React.FC<GeminiInsightsProps> = ({ insight, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4 p-6 bg-slate-800/30 rounded-xl border border-slate-700">
        <div className="h-6 bg-slate-700 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!insight) return null;

  return (
    <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">{insight.title}</h2>
      </div>
      
      <p className="text-slate-300 leading-relaxed mb-6">
        {insight.explanation}
      </p>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Key Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insight.mathDetails.map((detail, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-slate-400 bg-slate-900/50 p-2 rounded border border-slate-700">
              <span className="text-blue-500">•</span>
              {detail}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeminiInsights;
