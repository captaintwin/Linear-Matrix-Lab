
import React, { useState, useMemo, useEffect } from 'react';
import VectorCanvas from './components/VectorCanvas';
import VectorCanvas3D from './components/VectorCanvas3D';
import ControlPanel from './components/ControlPanel';
import GeminiInsights from './components/GeminiInsights';
import { 
  INITIAL_MATRIX_2D, INITIAL_VECTORS_2D, 
  INITIAL_MATRIX_3D, INITIAL_VECTORS_3D 
} from './constants';
import { Matrix2x2, Matrix3x3, Vector2D, Vector3D, GeminiInsight, DimensionMode } from './types';
import { getMatrixInsights } from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<DimensionMode>('2D');
  const [matrix2D, setMatrix2D] = useState<Matrix2x2>(INITIAL_MATRIX_2D);
  const [matrixB2D, setMatrixB2D] = useState<Matrix2x2>(INITIAL_MATRIX_2D);
  const [vectors2D, setVectors2D] = useState<Vector2D[]>(INITIAL_VECTORS_2D);
  
  const [matrix3D, setMatrix3D] = useState<Matrix3x3>(INITIAL_MATRIX_3D);
  const [vectors3D, setVectors3D] = useState<Vector3D[]>(INITIAL_VECTORS_3D);
  
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [insight, setInsight] = useState<GeminiInsight | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Load state from URL Hash
  useEffect(() => {
    try {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const data = JSON.parse(atob(hash));
        if (data.mode) setMode(data.mode);
        if (data.matrix2D) setMatrix2D(data.matrix2D);
        if (data.vectors2D) setVectors2D(data.vectors2D);
        if (data.matrix3D) setMatrix3D(data.matrix3D);
        if (data.vectors3D) setVectors3D(data.vectors3D);
      }
    } catch (e) {
      console.warn("Failed to restore state from URL", e);
    }
  }, []);

  const handleShare = () => {
    const state = {
      mode,
      matrix2D,
      vectors2D,
      matrix3D,
      vectors3D
    };
    const hash = btoa(JSON.stringify(state));
    window.location.hash = hash;
    
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard! Share it with your friends.");
    });
  };

  const matrixStats = useMemo(() => {
    if (mode === '2D') {
      const [[a, b], [c, d]] = matrix2D;
      const det = a * d - b * c;
      const trace = a + d;
      const normA = Math.sqrt(a*a + b*b + c*c + d*d);
      return { det, trace, norm: normA };
    }
    return { det: 1, trace: 3, norm: 0 };
  }, [matrix2D, mode]);

  const handleMultiply = () => {
    if (mode === '2D') {
      const A = matrix2D;
      const B = matrixB2D;
      const result: Matrix2x2 = [
        [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
        [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
      ];
      setMatrix2D(result);
    }
  };

  const handleTranspose = () => {
    if (mode === '2D') {
      setMatrix2D([[matrix2D[0][0], matrix2D[1][0]], [matrix2D[0][1], matrix2D[1][1]]]);
    } else {
      setMatrix3D([
        [matrix3D[0][0], matrix3D[1][0], matrix3D[2][0]],
        [matrix3D[0][1], matrix3D[1][1], matrix3D[2][1]],
        [matrix3D[0][2], matrix3D[1][2], matrix3D[2][2]]
      ]);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    const result = mode === '2D' 
      ? await getMatrixInsights(matrix2D, vectors2D)
      : await getMatrixInsights(matrix3D as any, vectors3D as any);
    if (result) setInsight(result);
    setLoading(false);
  };

  const handleResetMatrix = () => mode === '2D' ? setMatrix2D([[1, 0], [0, 1]]) : setMatrix3D([[1,0,0],[0,1,0],[0,0,1]]);
  const handleResetVector = (i: number) => {
    if (mode === '2D') {
      const v = [...vectors2D]; v[i] = {...INITIAL_VECTORS_2D[i]}; setVectors2D(v);
    } else {
      const v = [...vectors3D]; v[i] = {...INITIAL_VECTORS_3D[i]}; setVectors3D(v);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-lg font-black text-white tracking-tight hidden sm:block">Linear Matrix Lab</h1>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
          {['2D', '3D'].map(m => (
            <button key={m} onClick={() => setMode(m as DimensionMode)} className={`px-4 py-1 rounded text-[10px] font-bold transition-all ${mode === m ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>{m}</button>
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="flex-[1.2] lg:flex-1 p-3 lg:p-6 flex flex-col gap-4 overflow-y-auto order-1 lg:order-2 bg-slate-950 relative z-10">
          <div className="h-64 sm:h-80 md:h-[450px] lg:flex-1 relative group shrink-0">
            <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-none">
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-2xl min-w-[140px]">
                <div className="flex justify-between items-center mb-2"><span className="text-[10px] text-slate-500 font-bold uppercase">Matrix Analysis</span></div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span className="text-[10px] text-slate-400">Determinant</span><span className={`text-xs font-mono ${Math.abs(matrixStats.det) < 0.01 ? 'text-rose-400' : 'text-emerald-400'}`}>{matrixStats.det.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-[10px] text-slate-400">Trace</span><span className="text-xs font-mono text-indigo-400">{matrixStats.trace.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-[10px] text-slate-400">Frobenius Norm</span><span className="text-xs font-mono text-orange-400">{matrixStats.norm.toFixed(2)}</span></div>
                </div>
              </div>
            </div>

            {mode === '2D' ? (
              <VectorCanvas matrix={matrix2D} vectors={vectors2D} setVectors={setVectors2D} showGrid={showGrid} />
            ) : (
              <VectorCanvas3D matrix={matrix3D} vectors={vectors3D} setVectors={setVectors3D} showGrid={showGrid} />
            )}
          </div>
          <GeminiInsights insight={insight} loading={loading} />
        </div>

        <aside className="flex-1 lg:w-96 bg-slate-900/40 border-t lg:border-t-0 lg:border-r border-slate-800 overflow-hidden order-2 lg:order-1 flex flex-col">
          <ControlPanel 
            mode={mode}
            matrix2D={matrix2D} setMatrix2D={setMatrix2D}
            matrixB2D={matrixB2D} setMatrixB2D={setMatrixB2D}
            matrix3D={matrix3D} setMatrix3D={setMatrix3D}
            vectors2D={vectors2D} setVectors2D={setVectors2D}
            vectors3D={vectors3D} setVectors3D={setVectors3D}
            showGrid={showGrid} setShowGrid={setShowGrid}
            onAnalyze={handleAnalyze}
            onResetMatrix={handleResetMatrix}
            onResetVector={handleResetVector}
            onResetAll={() => { handleResetMatrix(); setVectors2D([...INITIAL_VECTORS_2D]); setInsight(null); window.location.hash = ''; }}
            onTranspose={handleTranspose}
            onMultiply={handleMultiply}
            onShare={handleShare}
            isAnalyzing={loading}
          />
        </aside>
      </main>
    </div>
  );
};

export default App;
