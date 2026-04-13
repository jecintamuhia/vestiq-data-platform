import { Radio, ArrowRight } from 'lucide-react';
import { PipelineMetrics } from '../types';

interface IngestionPanelProps {
  metrics: PipelineMetrics;
}

function DataFlow({ from, to, rate, color }: { from: string; to: string; rate: string; color: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
      <span className="text-slate-400 text-[10px] font-medium w-20 truncate">{from}</span>
      <div className="flex-1 relative h-0.5 bg-slate-800 rounded overflow-hidden">
        <div className={`absolute inset-y-0 left-0 w-1/3 ${color} rounded animate-flow`} />
      </div>
      <ArrowRight className={`w-3 h-3 ${color.replace('bg-', 'text-')}`} />
      <span className="text-slate-400 text-[10px] font-medium w-16 truncate">{to}</span>
      <span className="text-slate-500 text-[10px] ml-auto">{rate}</span>
    </div>
  );
}

export default function IngestionPanel({ metrics }: IngestionPanelProps) {
  return (
    <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <h2 className="text-white font-semibold text-sm">Data Ingestion Layer</h2>
        </div>
        <span className="text-cyan-400 text-xs bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">Kafka Producer</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Topics', value: '6', sub: 'Active' },
          { label: 'Partitions', value: `${metrics.active_partitions}`, sub: 'Distributed' },
          { label: 'Lag', value: '0ms', sub: 'Consumer lag' },
        ].map(item => (
          <div key={item.label} className="text-center p-2 rounded-lg bg-slate-800/50 border border-slate-700/30">
            <p className="text-white font-bold font-mono text-base">{item.value}</p>
            <p className="text-slate-500 text-[10px]">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <DataFlow from="BTC/USD" to="Kafka" rate={`${(metrics.messages_per_second / 6).toFixed(1)}/s`} color="bg-cyan-500" />
        <DataFlow from="ETH/USD" to="Kafka" rate={`${(metrics.messages_per_second / 6).toFixed(1)}/s`} color="bg-cyan-500" />
        <DataFlow from="AAPL" to="Kafka" rate={`${(metrics.messages_per_second / 6).toFixed(1)}/s`} color="bg-cyan-500" />
        <DataFlow from="TSLA" to="Kafka" rate={`${(metrics.messages_per_second / 6).toFixed(1)}/s`} color="bg-cyan-500" />
        <DataFlow from="EUR/USD" to="Kafka" rate={`${(metrics.messages_per_second / 6).toFixed(1)}/s`} color="bg-cyan-500" />
        <DataFlow from="GOLD" to="Kafka" rate={`${(metrics.messages_per_second / 6).toFixed(1)}/s`} color="bg-cyan-500" />
      </div>
    </div>
  );
}
