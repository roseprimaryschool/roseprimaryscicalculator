import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, History, Settings, Info, ChevronRight, RotateCcw } from 'lucide-react';

// Scientific Calculator Component
export default function App() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [inputSequence, setInputSequence] = useState('');
  const [isScientific, setIsScientific] = useState(true);

  const handleNumber = (num: string) => {
    setDisplay((prev) => (prev === '0' ? num : prev + num));
    setInputSequence((prev) => prev + num);
  };

  const handleOperator = (op: string) => {
    setDisplay((prev) => prev + ' ' + op + ' ');
    setInputSequence((prev) => prev + op);
  };

  const handleClear = () => {
    // SECRET TRIGGER: If "50326" was entered and then Clear is clicked
    if (inputSequence.endsWith('50326')) {
      window.location.href = 'games/';
      return;
    }
    
    setDisplay('0');
    setInputSequence('');
  };

  const handleCalculate = () => {
    try {
      // Basic sanitization and evaluation
      // Using Function constructor as a safer alternative to eval for simple math
      // In a real app, a math parser library would be better
      const sanitized = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/\^/g, '**');

      const result = new Function(`return ${sanitized}`)();
      const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, '');
      
      setHistory((prev) => [display + ' = ' + formattedResult, ...prev].slice(0, 10));
      setDisplay(formattedResult);
      setInputSequence(''); // Reset sequence after calculation
    } catch (error) {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1500);
    }
  };

  const handleScientific = (func: string) => {
    if (func === 'π') {
      setDisplay((prev) => (prev === '0' ? 'π' : prev + 'π'));
      setInputSequence((prev) => prev + 'π');
    } else if (func === 'e') {
      setDisplay((prev) => (prev === '0' ? 'e' : prev + 'e'));
      setInputSequence((prev) => prev + 'e');
    } else {
      setDisplay((prev) => (prev === '0' ? func + '(' : prev + func + '('));
      setInputSequence((prev) => prev + func);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Grid Overlay for Technical Feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#141414 1px, transparent 1px), linear-gradient(90deg, #141414 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Header & Info */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-[#141414] flex items-center justify-center rounded-sm">
                <Calculator className="text-[#E4E3E0] w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight uppercase">Precision-X</h1>
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Scientific Computing Unit v4.0</p>
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="font-serif italic text-sm opacity-50 mb-2 uppercase tracking-wider">System Overview</h2>
                <p className="text-sm leading-relaxed max-w-xs">
                  Advanced mathematical processing environment with support for trigonometric, logarithmic, and exponential operations.
                </p>
              </section>

              <section className="p-4 border border-[#141414] border-opacity-10 bg-white bg-opacity-30">
                <h3 className="text-[10px] font-mono font-bold uppercase mb-3 flex items-center gap-2">
                  <Info className="w-3 h-3" /> Operation Logs
                </h3>
                <div className="space-y-2">
                  {history.length === 0 ? (
                    <p className="text-[10px] opacity-40 italic">No recent calculations detected.</p>
                  ) : (
                    history.map((item, i) => (
                      <div key={i} className="text-[10px] font-mono border-b border-[#141414] border-opacity-5 pb-1 flex justify-between">
                        <span className="opacity-60">{item.split('=')[0]}</span>
                        <span className="font-bold">{item.split('=')[1]}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#141414] border-opacity-10">
            <div className="flex items-center justify-between text-[10px] font-mono opacity-40 uppercase tracking-widest">
              <span>Status: Operational</span>
              <span>Ref: 50326-SEC</span>
            </div>
          </div>
        </div>

        {/* Right Column: Calculator Interface */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-[#141414] shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-1">
            {/* Display Area */}
            <div className="bg-[#141414] text-[#E4E3E0] p-8 mb-1 relative overflow-hidden">
              <div className="absolute top-2 right-4 text-[9px] font-mono opacity-30 uppercase tracking-widest">Output Matrix</div>
              <div className="text-right font-mono text-4xl tracking-tighter truncate">
                {display}
              </div>
              <div className="mt-2 text-right text-[10px] font-mono opacity-40 h-4">
                {inputSequence && `SEQ: ${inputSequence}`}
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-4 gap-1">
              {/* Scientific Row */}
              <CalcButton label="sin" onClick={() => handleScientific('sin')} className="bg-[#f0f0f0] text-[11px] font-mono" />
              <CalcButton label="cos" onClick={() => handleScientific('cos')} className="bg-[#f0f0f0] text-[11px] font-mono" />
              <CalcButton label="tan" onClick={() => handleScientific('tan')} className="bg-[#f0f0f0] text-[11px] font-mono" />
              <CalcButton label="√" onClick={() => handleScientific('√')} className="bg-[#f0f0f0] text-[11px] font-mono" />

              <CalcButton label="log" onClick={() => handleScientific('log')} className="bg-[#f0f0f0] text-[11px] font-mono" />
              <CalcButton label="ln" onClick={() => handleScientific('ln')} className="bg-[#f0f0f0] text-[11px] font-mono" />
              <CalcButton label="π" onClick={() => handleScientific('π')} className="bg-[#f0f0f0] text-[11px] font-mono" />
              <CalcButton label="e" onClick={() => handleScientific('e')} className="bg-[#f0f0f0] text-[11px] font-mono" />

              {/* Standard Layout */}
              <CalcButton label="C" onClick={handleClear} className="bg-[#ff4444] text-white font-bold" />
              <CalcButton label="(" onClick={() => handleNumber('(')} className="bg-[#e0e0e0]" />
              <CalcButton label=")" onClick={() => handleNumber(')')} className="bg-[#e0e0e0]" />
              <CalcButton label="÷" onClick={() => handleOperator('/')} className="bg-[#141414] text-white" />

              <CalcButton label="7" onClick={() => handleNumber('7')} />
              <CalcButton label="8" onClick={() => handleNumber('8')} />
              <CalcButton label="9" onClick={() => handleNumber('9')} />
              <CalcButton label="×" onClick={() => handleOperator('*')} className="bg-[#141414] text-white" />

              <CalcButton label="4" onClick={() => handleNumber('4')} />
              <CalcButton label="5" onClick={() => handleNumber('5')} />
              <CalcButton label="6" onClick={() => handleNumber('6')} />
              <CalcButton label="-" onClick={() => handleOperator('-')} className="bg-[#141414] text-white" />

              <CalcButton label="1" onClick={() => handleNumber('1')} />
              <CalcButton label="2" onClick={() => handleNumber('2')} />
              <CalcButton label="3" onClick={() => handleNumber('3')} />
              <CalcButton label="+" onClick={() => handleOperator('+')} className="bg-[#141414] text-white" />

              <CalcButton label="0" onClick={() => handleNumber('0')} className="col-span-2" />
              <CalcButton label="." onClick={() => handleNumber('.')} />
              <CalcButton label="=" onClick={handleCalculate} className="bg-[#141414] text-white font-bold" />
            </div>
          </div>

          <div className="mt-8 flex justify-between items-end">
            <div className="text-[10px] font-mono opacity-30 max-w-xs">
              CAUTION: HIGH PRECISION MODE ACTIVE. ALL CALCULATIONS ARE LOGGED FOR SYSTEM AUDIT.
            </div>
            <button 
              onClick={() => setHistory([])}
              className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
            >
              <RotateCcw className="w-3 h-3" /> Purge Cache
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function CalcButton({ label, onClick, className = "", colSpan = 1 }: { label: string, onClick: () => void, className?: string, colSpan?: number }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        h-14 flex items-center justify-center text-sm font-medium transition-colors
        border border-[#141414] border-opacity-10 hover:bg-[#141414] hover:text-[#E4E3E0]
        ${className}
        ${colSpan === 2 ? 'col-span-2' : ''}
      `}
    >
      {label}
    </motion.button>
  );
}
