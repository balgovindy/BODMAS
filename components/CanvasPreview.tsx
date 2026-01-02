
import React from 'react';
import { AppState, Platform, BgStyle, LogoPosition, Difficulty, RankPosition } from '../types';
import { BG_PRESETS, FOOD_IMAGES } from '../constants';
import { BadgeCheck } from 'lucide-react';

interface Props {
  state: AppState;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const CanvasPreview: React.FC<Props> = ({ state, canvasRef }) => {
  const isPortrait = state.platform === Platform.PORTRAIT;
  
  const containerStyle: React.CSSProperties = {
    aspectRatio: isPortrait ? '9/16' : '1/1',
    maxWidth: isPortrait ? '400px' : '500px',
    width: '100%',
    maxHeight: '80vh',
    fontFamily: state.fontFamily,
    backgroundColor: state.bgStyle === BgStyle.CUSTOM ? state.customBgColor : undefined,
    backgroundImage: state.bgStyle === BgStyle.FOOD ? `url("${FOOD_IMAGES[state.foodType][state.foodVariant]}")` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const getBgClass = () => {
    const preset = BG_PRESETS[state.bgStyle];
    return preset.class;
  };

  const footerOpacity = state.fontColor === '#ffffff' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)';

  // Logic for the question container styling - removed hardcoded paddings
  const getQuestionContainerClass = () => {
    switch (state.questionBgStyle) {
        case 'ribbon':
            return 'bg-red-600 rotate-1 shadow-xl rounded-sm';
        case 'badge':
            return 'bg-indigo-600 rounded-3xl shadow-2xl border-4 border-white/20';
        case 'glass':
            return 'bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg';
        case 'minimal':
            return 'bg-white/90 rounded-xl shadow-lg';
        default:
            return '';
    }
  };

  const getRankInfo = () => {
    switch (state.difficulty) {
      case Difficulty.EASY: return { label: 'Novice', color: 'bg-emerald-500' };
      case Difficulty.MEDIUM: return { label: 'Expert', color: 'bg-blue-500' };
      case Difficulty.TRICKY: return { label: 'Elite', color: 'bg-purple-600' };
      case Difficulty.ULTRA_TRICKY: return { label: 'Legend', color: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' };
      default: return { label: 'Pro', color: 'bg-indigo-600' };
    }
  };

  const getRankPosClass = () => {
    switch (state.rankPosition) {
      case RankPosition.TOP_LEFT: return 'top-6 left-6';
      case RankPosition.TOP_RIGHT: return 'top-6 right-6';
      case RankPosition.BOTTOM_LEFT: return 'bottom-6 left-6';
      case RankPosition.CENTER_RIGHT: return 'top-1/2 -translate-y-1/2 right-6';
      default: return 'top-6 left-6';
    }
  };

  const rank = getRankInfo();

  return (
    <div 
      ref={canvasRef}
      style={containerStyle}
      className={`relative flex flex-col items-center justify-center overflow-hidden transition-all duration-300 rounded-lg shadow-2xl ${getBgClass()}`}
    >
      {/* Background Overlay for Food/Busy Backgrounds */}
      {state.bgStyle === BgStyle.FOOD && (
        <div className="absolute inset-0 bg-black/40 z-0"></div>
      )}

      {/* Background Math Icons Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex flex-wrap gap-12 p-12 justify-center items-center overflow-hidden text-6xl font-black z-0">
        {Array.from({length: 12}).map((_, i) => (
          <span key={i} className="rotate-12">+ − × ÷ √</span>
        ))}
      </div>

      {/* Header */}
      {state.headerEnabled && (
        <div className={`absolute top-6 z-10 w-full px-4 flex justify-center`}>
          <div 
            style={{ 
              fontFamily: state.headerFont,
              color: ['ribbon', 'badge'].includes(state.headerStyle) ? '#ffffff' : (state.bgStyle === BgStyle.FOOD ? '#ffffff' : state.fontColor),
              borderColor: state.headerStyle === 'minimal' ? 'rgba(255,255,255,0.5)' : 'transparent'
            }}
            className={`
              px-4 py-1.5 font-black text-center text-sm uppercase tracking-widest transition-colors duration-300
              ${state.headerStyle === 'ribbon' ? 'bg-red-600 -rotate-2 shadow-md rounded-sm' : ''}
              ${state.headerStyle === 'badge' ? 'bg-indigo-600 rounded-full shadow-md' : ''}
              ${state.headerStyle === 'glow' ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}
              ${state.headerStyle === 'minimal' ? 'border-b-2 pb-1' : ''}
            `}
          >
            {state.headerText}
          </div>
        </div>
      )}

      {/* Logo */}
      {state.logoUrl && (
        <div className={`absolute z-20 ${
          state.logoPosition === LogoPosition.TOP_LEFT ? 'top-4 left-4' : 
          state.logoPosition === LogoPosition.TOP_RIGHT ? 'top-4 right-4' : 
          'bottom-4 right-4'
        }`}>
          <div className="w-12 h-12 rounded-lg shadow-lg bg-white p-1.5 border border-slate-100 overflow-hidden">
            <img src={state.logoUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* Question Content Block with Dynamic Positioning */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full transition-transform duration-300"
        style={{ transform: `translateY(${state.questionYOffset}px)` }}
      >
        <div 
          className={`transition-all duration-500 flex items-center justify-center ${getQuestionContainerClass()}`}
          style={{
             paddingLeft: state.questionBgStyle !== 'none' ? `${state.questionPaddingX}px` : '0px',
             paddingRight: state.questionBgStyle !== 'none' ? `${state.questionPaddingX}px` : '0px',
             paddingTop: state.questionBgStyle !== 'none' ? `${state.questionPaddingY}px` : '0px',
             paddingBottom: state.questionBgStyle !== 'none' ? `${state.questionPaddingY}px` : '0px',
          }}
        >
            <h2 
              style={{ 
                fontSize: `${state.fontSize}px`, 
                color: state.fontColor,
                fontWeight: state.fontWeight,
                letterSpacing: `${state.letterSpacing}px`,
                lineHeight: state.lineSpacing,
                textShadow: state.showShadow && state.questionBgStyle === 'none' ? '0 10px 30px rgba(0,0,0,0.3)' : 'none'
              }}
              className={`
                transition-all duration-300
                ${state.showGlow ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : ''}
              `}
            >
              {state.question}
            </h2>
        </div>
      </div>

      {/* Verified Rank Booster Badge */}
      {state.showRankBadge && (
        <div className={`absolute z-20 transition-all duration-500 ${getRankPosClass()}`}>
          <div className={`${rank.color} text-white font-black px-4 py-2 rounded-xl shadow-2xl flex flex-col items-center transition-all duration-300 border-2 border-white/50 group`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <BadgeCheck className="w-3.5 h-3.5 text-white animate-pulse" />
              <span className="text-[10px] uppercase tracking-tighter opacity-90 leading-none">Verified Rank</span>
            </div>
            <span className="text-xl italic leading-none drop-shadow-sm">{rank.label}</span>
          </div>
          <div className="mt-1.5 text-center">
             <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[7px] font-bold text-white uppercase tracking-[0.2em] border border-white/10">
               Certified Challenge
             </span>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      {state.showCommentFooter && (
        <div className="absolute bottom-6 w-full px-8 text-center z-10">
          <p 
            style={{ color: state.bgStyle === BgStyle.FOOD ? 'rgba(255,255,255,0.9)' : footerOpacity }}
            className="font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-colors duration-300 drop-shadow-md"
          >
            <span>Comment your answer</span>
            <span className="text-lg">👇</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CanvasPreview;
