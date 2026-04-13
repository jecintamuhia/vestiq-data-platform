import { SymbolState } from '../types';

interface MarketTickerProps {
  symbols: SymbolState[];
}

function formatPrice(symbol: string, price: number): string {
  if (symbol.includes('EUR') || symbol.includes('USD/')) return price.toFixed(4);
  if (price > 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toFixed(2);
}

export default function MarketTicker({ symbols }: MarketTickerProps) {
  const doubled = [...symbols, ...symbols];

  return (
    <div className="border-b border-t border-slate-800 bg-slate-950/60 overflow-hidden py-2.5">
      <div className="flex animate-ticker gap-8 w-max">
        {doubled.map((s, i) => {
          const isPos = s.changePct24h >= 0;
          const isUp = s.price >= s.prevPrice;
          return (
            <div key={i} className="flex items-center gap-3 px-2 flex-shrink-0">
              <span className="text-slate-400 text-xs font-semibold">{s.symbol}</span>
              <span className={`text-xs font-mono font-bold transition-colors duration-200 ${isUp ? 'text-emerald-300' : 'text-rose-300'}`}>
                {formatPrice(s.symbol, s.price)}
              </span>
              <span className={`text-[10px] font-medium ${isPos ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isPos ? '▲' : '▼'} {Math.abs(s.changePct24h).toFixed(2)}%
              </span>
              <span className="text-slate-700">|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
