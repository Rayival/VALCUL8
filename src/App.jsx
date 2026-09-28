import React, { useState } from 'react';

const ScientificCalculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isError, setIsError] = useState(false);
  const [ans, setAns] = useState('0');
  const [justCalculated, setJustCalculated] = useState(false);
  const [theme, setTheme] = useState('pink'); // 'pink' or 'navy'

  // Definisi Tema Warna
  const themes = {
    pink: {
      body: 'bg-[#fbd4dd] border-[#f5b3c5]',
      shadow: 'shadow-[10px_20px_30px_rgba(200,150,160,0.4),inset_-5px_-5px_15px_rgba(255,255,255,0.7)]',
      brand: 'text-slate-800',
      brandModel: 'text-slate-700',
      brandSci: 'text-red-500',
      screenBg: 'bg-[#9ba98f]',
      screenBorder: 'border-[#e8bac7]',
      screenText: 'text-slate-900',
      replayRing: 'bg-[#f2bbc9] border-[#f7ccd7]',
      replayBtn: 'bg-[#fbd4dd]',
      btnTop: 'bg-[#fbd4dd] text-slate-700 border-[#ebacbc]',
      btnSci: 'bg-[#f5bbc9] text-slate-800 border-[#db96a8]',
      btnNum: 'bg-[#fcf0f3] text-slate-800 border-[#e3c3cc]',
      btnAcc: 'bg-[#ff5c8a] text-white border-[#cc305b]',
      btnTextLabel: 'text-slate-600',
      shiftText: 'text-[#d9a05b]',
      alphaText: 'text-[#c94f6f]'
    },
    navy: {
      body: 'bg-[#1e293b] border-[#0f172a]',
      shadow: 'shadow-[10px_20px_30px_rgba(0,0,0,0.6),inset_-5px_-5px_15px_rgba(255,255,255,0.1)]',
      brand: 'text-gray-200',
      brandModel: 'text-gray-400',
      brandSci: 'text-blue-400',
      screenBg: 'bg-[#899c7d]', // Tetap hijau LCD tapi sedikit lebih gelap
      screenBorder: 'border-[#334155]',
      screenText: 'text-slate-900',
      replayRing: 'bg-[#334155] border-[#1e293b]',
      replayBtn: 'bg-[#475569]',
      btnTop: 'bg-[#334155] text-gray-300 border-[#1e293b]',
      btnSci: 'bg-[#475569] text-gray-200 border-[#334155]',
      btnNum: 'bg-[#64748b] text-white border-[#475569]',
      btnAcc: 'bg-[#3b82f6] text-white border-[#2563eb]', // Aksen biru terang
      btnTextLabel: 'text-gray-400',
      shiftText: 'text-yellow-500',
      alphaText: 'text-red-400'
    }
  };

  const currentTheme = themes[theme];

  const evaluateExpression = (expr) => {
    try {
      if (!expr) return '0';
      
      let parsedExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/EXP/g, '*10**')
        .replace(/\^/g, '**')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(');

      // Tutup kurung otomatis
      const openParens = (parsedExpr.match(/\(/g) || []).length;
      const closeParens = (parsedExpr.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        parsedExpr += ')'.repeat(openParens - closeParens);
      }

      // Evaluasi matematika
      // eslint-disable-next-line no-new-func
      let calcResult = new Function('return ' + parsedExpr)();

      if (!isFinite(calcResult) || isNaN(calcResult)) throw new Error('Math Error');

      // Hindari angka desimal yang terlalu panjang
      calcResult = Math.round(calcResult * 1e10) / 1e10;
      return calcResult.toString();
    } catch (error) {
      return 'Error';
    }
  };

  const handleInput = (val) => {
    if (isError) handleClear();

    if (justCalculated) {
      if (/^[0-9(a-z]/.test(val) || val === 'π' || val === '√(') {
        setExpression(val);
      } else {
        setExpression(result + val);
      }
      setJustCalculated(false);
      setResult('0');
      return;
    }
    setExpression((prev) => prev + val);
  };

  const handleEqual = () => {
    if (!expression) return;
    const res = evaluateExpression(expression);
    if (res === 'Error') {
      setIsError(true);
      setResult('Syntax Error');
    } else {
      setResult(res);
      setAns(res);
      setJustCalculated(true);
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
    setIsError(false);
  };

  const handleDelete = () => {
    if (justCalculated || isError) {
      handleClear();
      return;
    }
    setExpression((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4 font-sans transition-colors duration-500">
      
      {/* Theme Toggle Button */}
      <div className="mb-6 flex bg-white rounded-full shadow-md p-1 border border-gray-200">
        <button 
          onClick={() => setTheme('pink')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${theme === 'pink' ? 'bg-[#fbd4dd] text-slate-800 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Pink Theme
        </button>
        <button 
          onClick={() => setTheme('navy')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${theme === 'navy' ? 'bg-[#1e293b] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Navy Theme
        </button>
      </div>

      {/* Calculator Body */}
      <div className={`w-full max-w-md ${currentTheme.body} p-5 pb-6 rounded-[2rem] ${currentTheme.shadow} border-2 relative flex flex-col gap-4 transition-colors duration-500`}>
        
        {/* Header / Branding */}
        <div className="flex justify-between items-end px-2 pt-1">
          <div className="flex items-center gap-1">
            <span className={`font-bold italic text-xl tracking-wider ${currentTheme.brand}`}>VΛLCUL8</span>
            <span className={`text-xs ${currentTheme.brandModel} mb-1`}>®</span>
          </div>
          <div className={`text-xs font-semibold ${currentTheme.brandModel} uppercase tracking-widest`}>
            KK-82MS-B-C
          </div>
        </div>
        <div className={`text-center text-[10px] font-bold ${currentTheme.brandSci} uppercase tracking-widest -mt-3`}>
          Scientific Calculator
        </div>

        {/* Display Screen */}
        <div className={`${currentTheme.screenBg} rounded-xl p-3 h-24 shadow-[inset_0px_5px_12px_rgba(0,0,0,0.3)] flex flex-col justify-between border-4 ${currentTheme.screenBorder} font-mono relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)] bg-[size:3px_3px] pointer-events-none"></div>
          
          <div className={`text-right ${currentTheme.screenText} text-base min-h-[1.5rem] tracking-widest break-all font-semibold`}>
            {expression || ' '}
          </div>
          <div className={`text-right ${currentTheme.screenText} text-4xl font-bold tracking-widest`}>
            {result}
          </div>
        </div>

        {}
        {/* Top Controls Layout (Shift, Alpha, Replay, Mode, On) */}
        <div className="flex justify-between items-start mt-2 px-1 relative">
          
          {/* Left Controls */}
          <div className="flex flex-col gap-6 pt-1">
             <div className="flex flex-col items-center">
                <span className={`text-[9px] font-bold mb-1 ${currentTheme.shiftText}`}>SHIFT</span>
                <CalcButton text="SHIFT" onClick={() => {}} styleClass={`${currentTheme.btnTop} w-10 h-7 text-[9px] rounded-[4px]`} />
             </div>
             <div className="flex flex-col items-center">
                <span className={`text-[9px] font-bold mb-1 ${currentTheme.alphaText}`}>ALPHA</span>
                <CalcButton text="ALPHA" onClick={() => {}} styleClass={`${currentTheme.btnTop} w-10 h-7 text-[9px] rounded-[4px]`} />
             </div>
          </div>

          {/* Replay Button (Center Circle) */}
          <div className="relative w-28 h-28 -mt-2 flex justify-center items-center">
             <div className={`w-full h-full ${currentTheme.replayRing} rounded-full border shadow-md flex items-center justify-center relative`}>
                <div className={`w-[70%] h-[70%] ${currentTheme.replayBtn} rounded-full shadow-[inset_2px_5px_5px_rgba(255,255,255,0.2),inset_-2px_-5px_5px_rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer active:scale-95 transition-transform`}>
                   <span className={`text-[10px] font-bold ${currentTheme.brandModel}`}>REPLAY</span>
                </div>
                {/* D-Pad Arrows (Decorative) */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-6 border-transparent border-b-gray-400"></div>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-gray-400"></div>
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-6 border-transparent border-r-gray-400"></div>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-gray-400"></div>
             </div>
          </div>

          {/* Right Controls */}
          <div className="flex flex-col gap-6 pt-1">
             <div className="flex flex-col items-center">
                <span className={`text-[9px] font-bold mb-1 opacity-0`}>MODE</span>
                <CalcButton text="MODE" onClick={() => {}} styleClass={`${currentTheme.btnTop} w-10 h-7 text-[9px] rounded-[4px]`} />
             </div>
             <div className="flex flex-col items-center">
                <span className={`text-[9px] font-bold mb-1 opacity-0`}>ON</span>
                <CalcButton text="ON" onClick={handleClear} styleClass={`${currentTheme.btnTop} w-10 h-7 text-[9px] rounded-[4px]`} />
             </div>
          </div>

        </div>

        {/* Pre-Scientific extra row (flanking Replay bottom) */}
        <div className="grid grid-cols-6 gap-2 px-1 mt-1">
             <CalcButton text="x⁻¹" onClick={() => handleInput('^-1')} styleClass={`${currentTheme.btnSci} h-7 text-xs rounded-md col-start-1`} />
             <CalcButton text="nCr" onClick={() => {}} styleClass={`${currentTheme.btnSci} h-7 text-xs rounded-md col-start-2`} />
             {/* Spasi untuk bagian bawah Replay di tengah */}
             <div className="col-span-2"></div> 
             <CalcButton text="Pol" onClick={() => {}} styleClass={`${currentTheme.btnSci} h-7 text-xs rounded-md col-start-5`} />
             <CalcButton text="x³" onClick={() => handleInput('^3')} styleClass={`${currentTheme.btnSci} h-7 text-xs rounded-md col-start-6`} />
        </div>

        {/* 6-Column Scientific Functions Grid */}
        <div className="grid grid-cols-6 gap-2 gap-y-3 mb-2 px-1">
          <CalcButton text="ab/c" onClick={() => {}} styleClass={`${currentTheme.btnSci} h-7 text-[10px] rounded-md`} />
          <CalcButton text="√" onClick={() => handleInput('√(')} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
          <CalcButton text="x²" onClick={() => handleInput('^2')} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
          <CalcButton text="^" onClick={() => handleInput('^')} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
          <CalcButton text="log" onClick={() => handleInput('log(')} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
          <CalcButton text="ln" onClick={() => handleInput('ln(')} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />

          <CalcButton text="(-)" onClick={() => handleInput('-')} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
          <CalcButton text="°'”" onClick={() => {}} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
          <CalcButton text="hyp" onClick={() => {}} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
          <CalcButton text="sin" onClick={() => handleInput('sin(')} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
          <CalcButton text="cos" onClick={() => handleInput('cos(')} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
          <CalcButton text="tan" onClick={() => handleInput('tan(')} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />

          <CalcButton text="RCL" onClick={() => {}} styleClass={`${currentTheme.btnSci} h-7 text-[10px] rounded-md`} />
          <CalcButton text="ENG" onClick={() => {}} styleClass={`${currentTheme.btnSci} h-7 text-[10px] rounded-md`} />
          <CalcButton text="(" onClick={() => handleInput('(')} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
          <CalcButton text=")" onClick={() => handleInput(')')} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
          <CalcButton text="," onClick={() => handleInput(',')} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
          <CalcButton text="M+" onClick={() => {}} styleClass={`${currentTheme.btnSci} h-7 text-[11px] rounded-md`} />
        </div>

        {}
        {/* 5-Column Numpad & Basic Operations */}
        <div className="grid grid-cols-5 gap-3 px-1 mt-2">
          {/* Row 1 */}
          <CalcButton text="7" onClick={() => handleInput('7')} styleClass={`${currentTheme.btnNum} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="8" onClick={() => handleInput('8')} styleClass={`${currentTheme.btnNum} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="9" onClick={() => handleInput('9')} styleClass={`${currentTheme.btnNum} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="DEL" onClick={handleDelete} styleClass={`${currentTheme.btnAcc} h-11 text-sm rounded-xl border-b-4`} />
          <CalcButton text="AC" onClick={handleClear} styleClass={`${currentTheme.btnAcc} h-11 text-sm rounded-xl border-b-4`} />

          {/* Row 2 */}
          <CalcButton text="4" onClick={() => handleInput('4')} styleClass={`${currentTheme.btnNum} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="5" onClick={() => handleInput('5')} styleClass={`${currentTheme.btnNum} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="6" onClick={() => handleInput('6')} styleClass={`${currentTheme.btnNum} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="×" onClick={() => handleInput('×')} styleClass={`${currentTheme.btnSci} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="÷" onClick={() => handleInput('÷')} styleClass={`${currentTheme.btnSci} h-11 text-xl rounded-xl border-b-4`} />

          {/* Row 3 */}
          <CalcButton text="1" onClick={() => handleInput('1')} styleClass={`${currentTheme.btnNum} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="2" onClick={() => handleInput('2')} styleClass={`${currentTheme.btnNum} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="3" onClick={() => handleInput('3')} styleClass={`${currentTheme.btnNum} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="+" onClick={() => handleInput('+')} styleClass={`${currentTheme.btnSci} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="-" onClick={() => handleInput('-')} styleClass={`${currentTheme.btnSci} h-11 text-xl rounded-xl border-b-4`} />

          {/* Row 4 */}
          <CalcButton text="0" onClick={() => handleInput('0')} styleClass={`${currentTheme.btnNum} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="." onClick={() => handleInput('.')} styleClass={`${currentTheme.btnNum} h-11 text-xl rounded-xl border-b-4`} />
          <CalcButton text="EXP" onClick={() => handleInput('EXP')} styleClass={`${currentTheme.btnNum} h-11 text-[13px] rounded-xl border-b-4`} />
          <CalcButton text="Ans" onClick={() => handleInput(ans)} styleClass={`${currentTheme.btnNum} h-11 text-[13px] rounded-xl border-b-4`} />
          <CalcButton text="=" onClick={handleEqual} styleClass={`${currentTheme.btnSci} h-11 text-xl rounded-xl border-b-4`} />
        </div>
        
      </div>
    </div>
  );
};

// Komponen Reusable untuk Tombol
const CalcButton = ({ text, onClick, styleClass }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center font-bold shadow-md transition-all active:translate-y-[2px] active:border-b-0 cursor-pointer select-none focus:outline-none hover:brightness-110 ${styleClass}`}
    >
      {text}
    </button>
  );
};

export default ScientificCalculator;