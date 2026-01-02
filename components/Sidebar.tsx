
import React, { useState } from 'react';
import { AppState, Difficulty, Platform, BgStyle, LogoPosition, FoodType, RankPosition } from '../types';
import { FONTS, HEADLINES, FOOD_IMAGES } from '../constants';
import { 
  Palette, 
  Type, 
  Layout, 
  Image as ImageIcon, 
  Sparkles, 
  Binary, 
  ChevronDown, 
  ChevronUp,
  Settings,
  Rocket,
  Plus,
  Minus,
  RefreshCw,
  Box,
  MoveVertical,
  Edit3
} from 'lucide-react';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onGenerate: () => void;
}

const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ title, icon, children, isOpen, onToggle }) => (
  <div className="border-b border-slate-100 last:border-0">
    <button
      onClick={onToggle}
      className="w-full py-4 flex items-center justify-between text-slate-800 font-bold text-sm uppercase tracking-wider hover:bg-slate-50 transition-colors px-1"
    >
      <div className="flex items-center gap-3">
        <span className="text-indigo-600">{icon}</span>
        {title}
      </div>
      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1400px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
      <div className="px-1 pt-1">
        {children}
      </div>
    </div>
  </div>
);

const Sidebar: React.FC<Props> = ({ state, setState, onGenerate }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    logo: false,
    general: true,
    bg: false,
    header: false,
    boosters: false,
    typo: false,
    qstyling: true
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const update = (key: keyof AppState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        update('logoUrl', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const adjustFontSize = (delta: number) => {
    update('fontSize', Math.min(250, Math.max(10, state.fontSize + delta)));
  };

  const adjustLayoutValue = (key: 'questionYOffset' | 'questionPaddingX' | 'questionPaddingY', delta: number) => {
    const limits: Record<string, { min: number, max: number }> = {
      questionYOffset: { min: -300, max: 300 },
      questionPaddingX: { min: 0, max: 150 },
      questionPaddingY: { min: 0, max: 100 }
    };
    const { min, max } = limits[key];
    update(key, Math.min(max, Math.max(min, (state[key] as number) + delta)));
  };

  const shuffleFood = () => {
    const poolSize = FOOD_IMAGES[state.foodType].length;
    update('foodVariant', (state.foodVariant + 1) % poolSize);
  };

  const selectClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:border-indigo-300 transition-colors";

  return (
    <div className="space-y-1 pb-10">
      {/* 1. Logo Selection */}
      <CollapsibleSection
        title="Brand Logo"
        icon={<ImageIcon className="w-4 h-4" />}
        isOpen={openSections.logo}
        onToggle={() => toggleSection('logo')}
      >
        <div className="space-y-4">
          <div className="bg-white border-2 border-dashed border-slate-200 p-4 rounded-xl text-center hover:border-indigo-400 transition-colors">
            <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
            <label htmlFor="logo-upload" className="cursor-pointer text-indigo-600 font-bold text-sm hover:text-indigo-700 block">
              {state.logoUrl ? 'Change Logo' : 'Upload 1:1 Logo'}
            </label>
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">Logo Position</label>
            <select 
              value={state.logoPosition}
              onChange={(e) => update('logoPosition', e.target.value)}
              className={selectClass}
            >
              {Object.values(LogoPosition).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </CollapsibleSection>

      {/* 2. General Information */}
      <CollapsibleSection
        title="General Info"
        icon={<Settings className="w-4 h-4" />}
        isOpen={openSections.general}
        onToggle={() => toggleSection('general')}
      >
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Manual Question Input</label>
            <div className="relative">
              <textarea 
                value={state.question}
                onChange={(e) => update('question', e.target.value)}
                placeholder="Enter math equation e.g. (1+2)/3"
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
              <Edit3 className="absolute right-3 bottom-3 w-4 h-4 text-slate-300 pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-400 italic">Use / for fractions, e.g., (8+4)/3</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Difficulty</label>
              <select 
                value={state.difficulty}
                onChange={(e) => update('difficulty', e.target.value)}
                className={selectClass}
              >
                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Platform</label>
              <select 
                value={state.platform}
                onChange={(e) => update('platform', e.target.value)}
                className={selectClass}
              >
                {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200 mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-600 font-bold flex items-center gap-1">
                <Binary className="w-3 h-3" /> Factorials (n!)
              </label>
              <input 
                type="checkbox" 
                checked={state.useFactorials}
                onChange={(e) => update('useFactorials', e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-600 font-bold flex items-center gap-1">
                <Binary className="w-3 h-3" /> Exponents (x^y)
              </label>
              <input 
                type="checkbox" 
                checked={state.useExponents}
                onChange={(e) => update('useExponents', e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-600 font-bold flex items-center gap-1">
                <Binary className="w-3 h-3" /> Fractions (a/b)
              </label>
              <input 
                type="checkbox" 
                checked={state.useFractions}
                onChange={(e) => update('useFractions', e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* 3. Background System */}
      <CollapsibleSection
        title="Background Style"
        icon={<Palette className="w-4 h-4" />}
        isOpen={openSections.bg}
        onToggle={() => toggleSection('bg')}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {Object.values(BgStyle).map(style => (
              <button
                key={style}
                onClick={() => update('bgStyle', style)}
                className={`px-3 py-3 rounded-xl text-xs font-bold transition-all border-2 text-center flex items-center justify-center ${
                  state.bgStyle === style ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
          
          {state.bgStyle === BgStyle.CUSTOM && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Custom BG Color</label>
              <input 
                type="color" 
                value={state.customBgColor}
                onChange={(e) => update('customBgColor', e.target.value)}
                className="w-full h-10 p-1 rounded-lg bg-white border border-slate-200 cursor-pointer shadow-sm"
              />
            </div>
          )}

          {state.bgStyle === BgStyle.FOOD && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Food Category</label>
                <select 
                  value={state.foodType}
                  onChange={(e) => update('foodType', e.target.value)}
                  className={selectClass}
                >
                  {Object.values(FoodType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <button
                onClick={shuffleFood}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-indigo-600 font-bold py-2 rounded-lg text-xs hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Next Background Image
              </button>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* 4. Question Container styling */}
      <CollapsibleSection
        title="Question Visibility"
        icon={<Box className="w-4 h-4" />}
        isOpen={openSections.qstyling}
        onToggle={() => toggleSection('qstyling')}
      >
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <label className="text-xs text-slate-400 font-semibold block uppercase">Container Style</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'none', label: 'No Container' },
              { id: 'ribbon', label: 'Ribbon' },
              { id: 'badge', label: 'Badge' },
              { id: 'glass', label: 'Glassmorphism' },
              { id: 'minimal', label: 'Minimal Box' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => update('questionBgStyle', s.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                  state.questionBgStyle === s.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Vertical Position</label>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => adjustLayoutValue('questionYOffset', -1)}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 active:scale-95 transition-all text-slate-600"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-mono text-indigo-600 w-10 text-center">{state.questionYOffset}px</span>
                <button 
                  onClick={() => adjustLayoutValue('questionYOffset', 1)}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 active:scale-95 transition-all text-slate-600"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MoveVertical className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input 
                type="range" min="-300" max="300" step="1"
                value={state.questionYOffset}
                onChange={(e) => update('questionYOffset', parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {state.questionBgStyle !== 'none' && (
              <>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-400 font-semibold uppercase">H-Padding (Passing)</label>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => adjustLayoutValue('questionPaddingX', -1)}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 active:scale-95 transition-all text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono text-indigo-600 w-10 text-center">{state.questionPaddingX}px</span>
                      <button 
                        onClick={() => adjustLayoutValue('questionPaddingX', 1)}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 active:scale-95 transition-all text-slate-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <input 
                    type="range" min="0" max="150" step="1"
                    value={state.questionPaddingX}
                    onChange={(e) => update('questionPaddingX', parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-400 font-semibold uppercase">V-Padding (Passing)</label>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => adjustLayoutValue('questionPaddingY', -1)}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 active:scale-95 transition-all text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono text-indigo-600 w-10 text-center">{state.questionPaddingY}px</span>
                      <button 
                        onClick={() => adjustLayoutValue('questionPaddingY', 1)}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 active:scale-95 transition-all text-slate-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="1"
                    value={state.questionPaddingY}
                    onChange={(e) => update('questionPaddingY', parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* 5. Header & Title */}
      <CollapsibleSection
        title="Header Settings"
        icon={<Sparkles className="w-4 h-4" />}
        isOpen={openSections.header}
        onToggle={() => toggleSection('header')}
      >
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-700">Enable Header</label>
            <input 
              type="checkbox" 
              checked={state.headerEnabled}
              onChange={(e) => update('headerEnabled', e.target.checked)}
              className="w-4 h-4 accent-indigo-600 cursor-pointer"
            />
          </div>
          {state.headerEnabled && (
            <>
              <select 
                value={state.headerText}
                onChange={(e) => update('headerText', e.target.value)}
                className={selectClass}
              >
                {HEADLINES.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['ribbon', 'badge', 'glow', 'minimal'].map(style => (
                  <button
                    key={style}
                    onClick={() => update('headerStyle', style)}
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold capitalize transition-all border-2 ${
                      state.headerStyle === style ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* 6. Boosters */}
      <CollapsibleSection
        title="Viral Boosters"
        icon={<Rocket className="w-4 h-4" />}
        isOpen={openSections.boosters}
        onToggle={() => toggleSection('boosters')}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Glow Effect', key: 'showGlow' },
              { label: 'Text Shadow', key: 'showShadow' },
              { label: 'Comment Footer', key: 'showCommentFooter' },
              { label: 'Verified Rank', key: 'showRankBadge' },
            ].map(feature => (
              <button
                key={feature.key}
                onClick={() => update(feature.key as any, !state[feature.key as keyof AppState])}
                className={`px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all flex items-center justify-center ${
                  state[feature.key as keyof AppState] ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-100 bg-white text-slate-400 hover:border-indigo-200'
                }`}
              >
                {feature.label}
              </button>
            ))}
          </div>
          {state.showRankBadge && (
            <div className="pt-2">
              <label className="text-xs text-slate-400 font-semibold block mb-1">Rank Badge Position</label>
              <select 
                value={state.rankPosition}
                onChange={(e) => update('rankPosition', e.target.value)}
                className={selectClass}
              >
                {Object.values(RankPosition).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* 7. Typography (Font Size Reordered to Bottom) */}
      <CollapsibleSection
        title="Typography"
        icon={<Type className="w-4 h-4" />}
        isOpen={openSections.typo}
        onToggle={() => toggleSection('typo')}
      >
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-2">Font Family</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
              {FONTS.map(f => (
                <button
                  key={f.name}
                  onClick={() => update('fontFamily', f.family)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all text-center truncate ${state.fontFamily === f.family ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'}`}
                  style={{ fontFamily: f.family }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Weight</label>
              <select 
                value={state.fontWeight}
                onChange={(e) => update('fontWeight', e.target.value)}
                className={selectClass}
              >
                <option value="400">Regular</option>
                <option value="600">Semi-Bold</option>
                <option value="800">Extra Bold</option>
                <option value="900">Black</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-600 font-bold">Auto Color Logic</label>
            <input 
              type="checkbox" 
              checked={state.autoColor}
              onChange={(e) => update('autoColor', e.target.checked)}
              className="w-4 h-4 accent-indigo-600 cursor-pointer"
            />
          </div>
          {!state.autoColor && (
            <input 
              type="color" 
              value={state.fontColor}
              onChange={(e) => update('fontColor', e.target.value)}
              className="w-full h-10 p-1 rounded bg-white border border-slate-200 cursor-pointer shadow-sm"
            />
          )}

          {/* Font Size section at the bottom of Typography */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400 font-semibold block uppercase tracking-tight">Font Size ({state.fontSize}px)</label>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => adjustFontSize(-1)}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 active:scale-95 transition-all text-slate-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => adjustFontSize(1)}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 active:scale-95 transition-all text-slate-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <input 
              type="range" min="10" max="250" 
              value={state.fontSize} 
              onChange={(e) => update('fontSize', parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      </CollapsibleSection>

      <div className="mt-8 px-1 pt-4">
        <button
          onClick={onGenerate}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
        >
          <RefreshCw className="w-5 h-5" />
          Generate New Question
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
