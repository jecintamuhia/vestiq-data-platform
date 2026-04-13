import { ArrowDown, ArrowRight } from 'lucide-react';

interface PipelineFlowProps {
  ingestionStatus: 'active' | 'idle';
  processingStatus: 'active' | 'idle';
  messagesPerSec: number;
  latency: number;
}

function FlowArrow({ color, label, vertical = true }: { color: string; label: string; vertical?: boolean }) {
  return (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} items-center gap-1 px-2`}>
      <span className={`text-[10px] font-medium ${color}`}>{label}</span>
      <div className={`w-px h-6 ${vertical ? '' : 'rotate-90'} bg-gradient-to-b ${color === 'text-cyan-400' ? 'from-cyan-500/60 to-cyan-500/20' : color === 'text-emerald-400' ? 'from-emerald-500/60 to-emerald-500/20' : color === 'text-pink-400' ? 'from-pink-500/60 to-pink-500/20' : 'from-orange-500/60 to-orange-500/20'}`} />
      {vertical
        ? <ArrowDown className={`w-3 h-3 ${color}`} />
        : <ArrowRight className={`w-3 h-3 ${color}`} />}
    </div>
  );
}

function PipelineNode({
  label,
  sublabel,
  features,
  color,
  active,
  icon,
}: {
  label: string;
  sublabel: string;
  features?: string[];
  color: string;
  active: boolean;
  icon: string;
}) {
  const borderColor = color === 'cyan' ? 'border-cyan-500/40 bg-cyan-500/5' :
    color === 'emerald' ? 'border-emerald-500/40 bg-emerald-500/5' :
    color === 'blue' ? 'border-blue-500/40 bg-blue-500/5' :
    color === 'amber' ? 'border-amber-500/40 bg-amber-500/5' :
    color === 'orange' ? 'border-orange-500/40 bg-orange-500/5' :
    'border-slate-600/40 bg-slate-800/40';

  const textColor = color === 'cyan' ? 'text-cyan-400' :
    color === 'emerald' ? 'text-emerald-400' :
    color === 'blue' ? 'text-blue-400' :
    color === 'amber' ? 'text-amber-400' :
    color === 'orange' ? 'text-orange-400' :
    'text-slate-400';

  return (
    <div className={`relative border rounded-xl p-3 ${borderColor} transition-all duration-500 ${active ? 'shadow-lg' : 'opacity-70'}`}>
      {active && (
        <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${color === 'cyan' ? 'bg-cyan-400' : color === 'emerald' ? 'bg-emerald-400' : color === 'amber' ? 'bg-amber-400' : color === 'orange' ? 'bg-orange-400' : 'bg-slate-400'} animate-pulse`} />
      )}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <div>
          <p className={`text-xs font-bold ${textColor}`}>{label}</p>
          <p className="text-slate-500 text-[10px]">{sublabel}</p>
        </div>
      </div>
      {features && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {features.map(f => (
            <span key={f} className={`text-[9px] px-1.5 py-0.5 rounded bg-slate-800 ${textColor} border border-slate-700`}>{f}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PipelineFlow({ ingestionStatus, processingStatus, messagesPerSec, latency }: PipelineFlowProps) {
  return (
    <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-sm">System Architecture Pipeline</h2>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-cyan-500 inline-block" /> Stream</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-emerald-500 inline-block" /> Batch</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-pink-500 inline-block" /> Quality</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-orange-500 inline-block" /> Serve</span>
        </div>
      </div>

      <div className="flex items-start justify-center gap-2 overflow-x-auto pb-2">
        <div className="flex flex-col items-center min-w-[130px]">
          <PipelineNode label="Live Market Data" sublabel="Feed Provider" icon="📡" color="slate" active />
          <FlowArrow color="text-cyan-400" label="Stream" />
          <PipelineNode label="Data Ingestion" sublabel="Kafka Producer" icon="⚡" color="cyan" active={ingestionStatus === 'active'} features={[`${messagesPerSec.toFixed(1)} msg/s`]} />
          <FlowArrow color="text-emerald-400" label="Batch" />
          <PipelineNode label="Stream Processing" sublabel="Apache Spark" icon="🔥" color="emerald" active={processingStatus === 'active'} features={['EMA', 'RSI', 'MACD', 'Anomaly']} />
        </div>

        <div className="flex flex-col items-center mt-[160px] min-w-[10px]">
          <ArrowRight className="w-4 h-4 text-emerald-400 mt-1" />
        </div>

        <div className="flex flex-col items-center min-w-[240px] mt-[156px]">
          <div className="border border-slate-700/60 rounded-xl p-3 bg-slate-800/30 w-full">
            <p className="text-slate-400 text-[10px] font-semibold text-center mb-2">STORAGE LAYER</p>
            <div className="grid grid-cols-2 gap-2">
              <PipelineNode label="Data Lake" sublabel="Parquet Files" icon="🗄️" color="blue" active features={['Raw Storage']} />
              <PipelineNode label="Data Warehouse" sublabel="PostgreSQL" icon="❄️" color="blue" active features={['Analytics']} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-[232px] min-w-[10px]">
          <ArrowRight className="w-4 h-4 text-pink-400" />
        </div>

        <div className="flex flex-col items-center min-w-[130px]">
          <div className="mt-[228px] flex flex-col items-center">
            <PipelineNode label="Data Monitoring" sublabel="Quality Checks" icon="🔍" color="amber" active features={['Anomaly Det.', `${latency.toFixed(0)}ms`]} />
            <FlowArrow color="text-orange-400" label="Serve" />
            <PipelineNode label="API Layer" sublabel="FastAPI REST" icon="🚀" color="orange" active features={['/v1/signals', '/v1/prices']} />
            <FlowArrow color="text-orange-400" label="" />
            <PipelineNode label="Dashboard" sublabel="Client App" icon="📊" color="orange" active features={['Live Price', 'Signals', 'Alerts']} />
          </div>
        </div>
      </div>
    </div>
  );
}
