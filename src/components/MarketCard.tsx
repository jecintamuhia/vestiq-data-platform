import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import SparkLine from './SparkLine';
import { SymbolState } from '../types';

function formatPrice(symbol: string, price: number): string {
  if (symbol.includes('EUR') || symbol.includes('USD/')) return price.toFixed(4);
  if (price > 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toFixed(2);
}

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toFixed(0);
}

interface MarketCardProps {
  data: SymbolState;
}

export default function MarketCard({ data }: MarketCardProps) {
  const isUp = data.price >= data.prevPrice;
  const pctChange = data.changePct24h;
  const isPositive = pctChange >= 0;

  const signalColor = data.signal === 'BUY'
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : data.signal === 'SELL'
    ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    : 'text-slate-400 bg-slate-700/30 border-slate-600/30';

  const sparkColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60 hover:border-slate-700 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-white font-bold text-sm">{data.symbol}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '+' : ''}{pctChange.toFixed(2)}%
            </span>
            <span className="text-slate-600 text-xs">24h</span>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${signalColor}`}>
          {data.signal}
        </span>
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <p className={`font-mono font-bold text-xl transition-colors duration-200 ${isUp ? 'text-emerald-300' : 'text-rose-300'}`}>
            {formatPrice(data.symbol, data.price)}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">
            {isPositive ? '+' : ''}{data.change24h.toFixed(data.symbol.includes('EUR') ? 4 : 2)} 24h
          </p>
        </div>
        <SparkLine data={data.priceHistory} width={100} height={36} color={sparkColor} />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800">
        <div>
          <p className="text-slate-500 text-[10px]">RSI</p>
          <p className={`text-xs font-semibold ${data.rsi > 70 ? 'text-rose-400' : data.rsi < 30 ? 'text-emerald-400' : 'text-slate-300'}`}>
            {data.rsi.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-slate-500 text-[10px]">Volume</p>
          <p className="text-xs font-semibold text-slate-300">{formatVolume(data.volume)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-[10px]">Strength</p>
          <p className="text-xs font-semibold text-slate-300">{data.signalStrength.toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
}
