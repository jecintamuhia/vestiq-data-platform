import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SymbolState } from '../types';

interface SignalsPanelProps {
  symbols: SymbolState[];
}

function SignalBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function SignalsPanel({ symbols }: SignalsPanelProps) {
  const buys = symbols.filter(s => s.signal === 'BUY').length;
  const sells = symbols.filter(s => s.signal === 'SELL').length;
  const holds = symbols.filter(s => s.signal === 'HOLD').length;

  return (
    <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/60 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-sm">Trading Signals</h2>
        <span className="text-slate-500 text-xs">Stream Processing Output</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
          <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <p className="text-emerald-400 font-bold text-xl">{buys}</p>
          <p className="text-slate-500 text-xs">BUY</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-3 text-center">
          <Minus className="w-4 h-4 text-slate-400 mx-auto mb-1" />
          <p className="text-slate-300 font-bold text-xl">{holds}</p>
          <p className="text-slate-500 text-xs">HOLD</p>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-center">
          <TrendingDown className="w-4 h-4 text-rose-400 mx-auto mb-1" />
          <p className="text-rose-400 font-bold text-xl">{sells}</p>
          <p className="text-slate-500 text-xs">SELL</p>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {symbols.map(s => {
          const signalColor = s.signal === 'BUY'
            ? { badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', bar: 'bg-emerald-500' }
            : s.signal === 'SELL'
            ? { badge: 'text-rose-400 bg-rose-500/10 border-rose-500/25', bar: 'bg-rose-500' }
            : { badge: 'text-slate-400 bg-slate-700/30 border-slate-600/25', bar: 'bg-slate-500' };

          return (
            <div key={s.symbol} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/30">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-xs font-semibold truncate">{s.symbol}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${signalColor.badge}`}>
                    {s.signal}
                  </span>
                </div>
                <SignalBar value={s.signalStrength} max={100} color={signalColor.bar} />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-500 text-[10px]">RSI: {s.rsi.toFixed(1)}</span>
                  <span className="text-slate-500 text-[10px]">{s.signalStrength.toFixed(0)}% confidence</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-500 text-xs">Signals computed via EMA + RSI + MACD cross-strategy</span>
        </div>
      </div>
    </div>
  );
}
