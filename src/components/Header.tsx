import { Activity, Zap, Database, Server, Radio } from 'lucide-react';

interface HeaderProps {
  ingestionStatus: 'active' | 'idle';
  processingStatus: 'active' | 'idle';
  totalTicks: number;
  alertCount: number;
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-2 w-2">
      {active && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      )}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
    </span>
  );
}

export default function Header({ ingestionStatus, processingStatus, totalTicks, alertCount }: HeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-wide">TRADING INTELLIGENCE PLATFORM</h1>
            <p className="text-slate-500 text-xs">Real-Time Market Analytics</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs">
            <StatusDot active={ingestionStatus === 'active'} />
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Kafka Ingestion</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <StatusDot active={processingStatus === 'active'} />
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Spark Processing</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <StatusDot active />
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Data Warehouse</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <StatusDot active />
            <Server className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-slate-400">FastAPI Serving</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-slate-500 text-xs">Events Processed</p>
            <p className="text-white font-mono font-semibold text-sm">{totalTicks.toLocaleString()}</p>
          </div>
          {alertCount > 0 && (
            <div className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 rounded-md px-2.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400" />
              </span>
              <span className="text-rose-400 text-xs font-semibold">{alertCount} Alerts</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
