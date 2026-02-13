
import React, { useState } from 'react';
import { Matrix2x2, Matrix3x3, Vector2D, Vector3D, DimensionMode, ControlTab } from '../types';
import { PRESET_TRANSFORMATIONS_2D, PRESET_TRANSFORMATIONS_3D } from '../constants';

interface ControlPanelProps {
  mode: DimensionMode;
  matrix2D: Matrix2x2; setMatrix2D: (m: Matrix2x2) => void;
  matrixB2D: Matrix2x2; setMatrixB2D: (m: Matrix2x2) => void;
  matrix3D: Matrix3x3; setMatrix3D: (m: Matrix3x3) => void;
  vectors2D: Vector2D[]; setVectors2D: (v: Vector2D[]) => void;
  vectors3D: Vector3D[]; setVectors3D: (v: Vector3D[]) => void;
  showGrid: boolean; setShowGrid: (b: boolean) => void;
  onAnalyze: () => void;
  onResetMatrix: () => void;
  onResetVector: (index: number) => void;
  onResetAll: () => void;
  onTranspose: () => void;
  onMultiply: () => void;
  onShare: () => void;
  isAnalyzing: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const [activeTab, setActiveTab] = useState<ControlTab>('transform');

  // Fix: Removed API key management local states and functions as they are prohibited by the guidelines

  const handleMatrixChange = (row: number, col: number, val: string, isB = false) => {
    const num = parseFloat(val) || 0;
    if (props.mode === '2D') {
      const target = isB ? props.matrixB2D : props.matrix2D;
      const newM = [...target.map(r => [...r])] as Matrix2x2;
      newM[row][col] = num;
      isB ? props.setMatrixB2D(newM) : props.setMatrix2D(newM);
    } else {
      const newM = [...props.matrix3D.map(r => [...r])] as Matrix3x3;
      newM[row][col] = num;
      props.setMatrix3D(newM);
    }
  };

  const handleVectorChange = (index: number, field: string, val: string) => {
    const num = parseFloat(val) || 0;
    if (props.mode === '2D') {
      const newVectors = [...props.vectors2D];
      newVectors[index] = { ...newVectors[index], [field]: num } as Vector2D;
      props.setVectors2D(newVectors);
    } else {
      const newVectors = [...props.vectors3D];
      newVectors[index] = { ...newVectors[index], [field]: num } as Vector3D;
      props.setVectors3D(newVectors);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-slate-800 bg-slate-900/60">
        {(['transform', 'operations', 'analysis'] as ControlTab[]).map(t => (
          <button 
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === t ? 'text-indigo-400 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8">
        {activeTab === 'transform' && (
          <>
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Matrix (A)</h3>
                <div className="flex gap-2">
                  <button onClick={props.onTranspose} className="text-[9px] bg-slate-800 p-1.5 rounded hover:bg-slate-700 text-slate-400" title="Transpose">T</button>
                  <button onClick={props.onResetMatrix} className="text-[9px] bg-slate-800 p-1.5 rounded hover:bg-slate-700 text-slate-400">↺</button>
                </div>
              </div>
              <div className={`grid ${props.mode === '2D' ? 'grid-cols-2' : 'grid-cols-3'} gap-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800`}>
                {(props.mode === '2D' ? [0, 1] : [0, 1, 2]).map(r => 
                  (props.mode === '2D' ? [0, 1] : [0, 1, 2]).map(c => (
                    <input key={`${r}-${c}`} type="number" step="0.1" value={props.mode === '2D' ? props.matrix2D[r][c] : props.matrix3D[r][c]}
                      onChange={(e) => handleMatrixChange(r, c, e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded py-1.5 text-center text-indigo-400 font-mono text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  ))
                )}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Active Vectors</h3>
              <div className="space-y-3">
                {(props.mode === '2D' ? props.vectors2D : props.vectors3D).map((v, i) => (
                  <div key={v.label} className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 group/vec">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: v.color }}>Vector {v.label}</span>
                      <button 
                        onClick={() => props.onResetVector(i)}
                        className="text-[8px] opacity-0 group-hover/vec:opacity-100 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-1.5 py-0.5 rounded border border-slate-700 transition-all uppercase font-bold"
                      >
                        Reset
                      </button>
                    </div>
                    <div className={`grid ${props.mode === '2D' ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
                      {['x', 'y', ...(props.mode === '3D' ? ['z'] : [])].map(axis => (
                        <div key={axis} className="flex items-center gap-1.5">
                          <span className="text-[9px] text-slate-600 font-bold uppercase">{axis}</span>
                          <input
                            type="number"
                            step="0.1"
                            value={(v as any)[axis]}
                            onChange={(e) => handleVectorChange(i, axis, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] focus:outline-none font-mono text-slate-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Presets & Kernels</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(props.mode === '2D' ? PRESET_TRANSFORMATIONS_2D : PRESET_TRANSFORMATIONS_3D).map(n => (
                  <button key={n} onClick={() => props.mode === '2D' ? props.setMatrix2D(PRESET_TRANSFORMATIONS_2D[n]) : props.setMatrix3D(PRESET_TRANSFORMATIONS_3D[n])}
                    className="text-[9px] bg-slate-800/50 hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-300 px-2 py-1 rounded border border-slate-800 transition-all">
                    {n}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'operations' && (
          <div className="space-y-6">
            {props.mode === '2D' && (
              <section className="animate-in fade-in duration-300">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Matrix B (Multiplicand)</h3>
                <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800 mb-4">
                  {[0, 1].map(r => [0, 1].map(c => (
                    <input key={`b-${r}-${c}`} type="number" step="0.1" value={props.matrixB2D[r][c]}
                      onChange={(e) => handleMatrixChange(r, c, e.target.value, true)}
                      className="bg-slate-950 border border-slate-700 rounded py-1.5 text-center text-orange-400 font-mono text-xs outline-none"
                    />
                  )))}
                </div>
                <button onClick={props.onMultiply} className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-[10px] font-black uppercase rounded border border-emerald-500/30">
                  Execute: A = A × B
                </button>
              </section>
            )}
            <section>
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Vector Norms</h3>
               <div className="space-y-3">
                  {(props.mode === '2D' ? props.vectors2D : props.vectors3D).map((v, i) => {
                    const norm = Math.sqrt(v.x**2 + v.y**2 + (props.mode === '3D' ? (v as any).z**2 : 0));
                    return (
                      <div key={v.label} className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold" style={{color: v.color}}>{v.label} Norm (L2)</span>
                          <span className="text-xs font-mono text-slate-400">{norm.toFixed(2)}</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-current transition-all duration-500" style={{width: `${Math.min(norm*10, 100)}%`, color: v.color}} />
                        </div>
                      </div>
                    )
                  })}
               </div>
            </section>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Fix: Simplified Analysis tab as API key is now strictly environment-based */}
            <button
              onClick={props.onAnalyze}
              disabled={props.isAnalyzing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-xl shadow-indigo-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {props.isAnalyzing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Deep AI Insight'}
            </button>
            
            <button
              onClick={props.onShare}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Current Scene
            </button>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={props.showGrid}
                  onChange={(e) => props.setShowGrid(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400 font-medium">Show Grid</span>
              </label>
              <button onClick={props.onResetAll} className="text-rose-500 hover:text-rose-400 text-[10px] font-bold uppercase tracking-widest">
                Full Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
