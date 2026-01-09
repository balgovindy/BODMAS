
import React, { useState, useEffect, useRef } from 'react';
import { AppState, Difficulty, Platform, BgStyle, LogoPosition, ViralityAnalysis, FoodType, RankPosition } from './types';
import { FONTS, HEADLINES, BG_PRESETS } from './constants';
import { generateBODMAS } from './services/mathGenerator';
import { analyzeVirality } from './services/geminiService';

// Sub-components
import Sidebar from './components/Sidebar';
import CanvasPreview from './components/CanvasPreview';
import { Loader2, Sparkles, Download, RefreshCcw } from 'lucide-react';

// Helper to determine if a color is dark
const isDarkColor = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

const App: React.FC = () => {
  // Generate a fresh initial question
  const initialQuestion = generateBODMAS(Difficulty.TRICKY, false, false, false);

  const [state, setState] = useState<AppState>({
    question: initialQuestion.question,
    answer: initialQuestion.answer,
    difficulty: Difficulty.TRICKY,
    platform: Platform.SQUARE,
    useFactorials: false,
    useExponents: false,
    useFractions: false,
    fontFamily: FONTS[0].family, // Poppins
    fontSize: 50,
    fontWeight: "700",
    letterSpacing: 0,
    lineSpacing: 1.2,
    fontColor: "#000000",
    autoColor: true,
    headerEnabled: true,
    headerText: HEADLINES[0],
    headerFont: FONTS[0].family,
    headerStyle: 'badge',
    questionBgStyle: 'none',
    questionPaddingX: 12, // Default 12px
    questionPaddingY: 12, // Default 12px
    questionYOffset: 0,
    questionBorderRadius: 24,
    bgStyle: BgStyle.GRADIENT,
    bgColors: BG_PRESETS[BgStyle.GRADIENT].colors,
    customBgColor: '#4f46e5',
    foodType: FoodType.VEG,
    foodVariant: 0,
    logoUrl: null,
    logoPosition: LogoPosition.BOTTOM_RIGHT,
    showGlow: true,
    showShadow: true,
    showCommentFooter: true,
    showRankBadge: false,
    rankPosition: RankPosition.TOP_LEFT,
    showWatermark: false,
    watermarkText: 'Maths Mint',
    watermarkAlign: 'right',
    watermarkOffset: 5, // Default 5px
  });

  const [virality, setVirality] = useState<ViralityAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    // Ensure we always get a different question by looping until it's new (simple version)
    let newQ = generateBODMAS(state.difficulty, state.useFactorials, state.useExponents, state.useFractions);
    while (newQ.question === state.question) {
      newQ = generateBODMAS(state.difficulty, state.useFactorials, state.useExponents, state.useFractions);
    }
    setState(prev => ({ ...prev, question: newQ.question, answer: newQ.answer }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeVirality(state);
    setVirality(result);
    setIsAnalyzing(false);
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await (window as any).html2canvas(canvasRef.current, {
        useCORS: true,
        scale: 3,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `math-challenge-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Smart UI logic: When food background is enabled, suggest a badge for the question automatically
  useEffect(() => {
    if (state.bgStyle === BgStyle.FOOD && state.questionBgStyle === 'none') {
      setState(prev => ({ ...prev, questionBgStyle: 'badge' }));
    }
  }, [state.bgStyle]);

  // Smart Font Color Logic
  useEffect(() => {
    if (!state.autoColor) return;
    
    let dark = false;
    if (state.bgStyle === BgStyle.CUSTOM) {
      dark = isDarkColor(state.customBgColor);
    } else if (state.bgStyle === BgStyle.FOOD) {
      dark = true; 
    } else {
      dark = [BgStyle.GRADIENT, BgStyle.CHALKBOARD, BgStyle.NEON, BgStyle.VIBRANT].includes(state.bgStyle);
    }
    
    // If there is a question container, font color should contrast with the container instead of the bg
    if (state.questionBgStyle !== 'none') {
        const isDarkContainer = ['badge', 'ribbon'].includes(state.questionBgStyle);
        setState(prev => ({ ...prev, fontColor: isDarkContainer ? '#ffffff' : '#000000' }));
    } else {
        setState(prev => ({ ...prev, fontColor: dark ? '#ffffff' : '#000000' }));
    }
  }, [state.bgStyle, state.customBgColor, state.autoColor, state.foodType, state.questionBgStyle]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row md:h-screen overflow-hidden">
      <div className="w-full md:w-[450px] bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar p-6 flex-shrink-0 relative z-50">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            BODMAS PRO
          </h1>
          <button 
            onClick={handleGenerate}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            title="Regenerate Question"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>

        <Sidebar state={state} setState={setState} onGenerate={handleGenerate} />
      </div>

      <div className="flex-1 bg-slate-100 flex flex-col items-center justify-center p-4 md:p-12 relative overflow-y-auto md:overflow-hidden">
        <div className="absolute top-6 left-6 right-6 flex flex-wrap gap-4 justify-between items-center z-10 pointer-events-auto">
          <div className="flex gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
              state.difficulty === Difficulty.ULTRA_TRICKY ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {state.difficulty}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-all text-sm disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              AI Analyze
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-sm disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export PNG
            </button>
          </div>
        </div>

        <div className="w-full h-full flex items-center justify-center p-8 mt-12 md:mt-0">
          <CanvasPreview state={state} canvasRef={canvasRef} />
        </div>

        {virality && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/90 backdrop-blur shadow-2xl rounded-2xl p-4 border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-500 z-20 pointer-events-auto">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-black">
                {virality.score}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Virality Score</p>
                <p className="text-sm text-slate-700 leading-relaxed italic">"{virality.suggestion}"</p>
                <p className="mt-2 text-xs text-slate-400">Try headline: <span className="text-slate-900 font-semibold">{virality.bestHeadline}</span></p>
              </div>
              <button onClick={() => setVirality(null)} className="text-xl text-slate-400 hover:text-slate-600">&times;</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
