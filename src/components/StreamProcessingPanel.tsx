import { Zap, Activity, Cpu, BarChart2 } from 'lucide-react';
import { PipelineMetrics } from '../types';

interface StreamProcessingPanelProps {
  metrics: PipelineMetrics;
}

function Gauge({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#1e293b" strokeWidth="5" />
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xs">{pct.toFixed(0)}%</span>
        </div>
      </div>
      <span className="text-slate-500 text-[10px] text-center leading-tight">{label}</span>
    </div>
  );
}

export default function StreamProcessingPanel({ metrics }: StreamProcessingPanelProps) {
  const utilizationPct = Math.min(100, (metrics.messages_per_second / 10) * 100);
  const latencyPct = Math.min(100, (metrics.avg_latency_ms / 50) * 100);
  const qualityPct = Math.max(0, 100 - (metrics.error_rate * 10000));

  const stats = [
    { icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />, label: 'Throughput', value: `${metrics.messages_per_second.toFixed(1)} msg/s`, sub: 'Kafka → Spark' },
    { icon: <Activity className="w-3.5 h-3.5 text-emerald-400" />, label: 'Latency', value: `${metrics.avg_latency_ms.toFixed(1)}ms`, sub: 'P99 end-to-end' },
    { icon: <Cpu className="w-3.5 h-3.5 text-amber-400" />, label: 'Events Total', value: metrics.processed_count.toLocaleString(), sub: 'Processed' },
    { icon: <BarChart2 className="w-3.5 h-3.5 text-orange-400" />, label: 'Error Rate', value: `${(metrics.error_rate * 100).toFixed(3)}%`, sub: 'Dropped msgs' },
  ];

  return (
    <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/60">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-sm">Stream Processing</h2>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-emerald-400 text-xs">Spark Active</span>
        </div>
      </div>

      <div className="flex items-center justify-around mb-4 py-2">
        <Gauge value={utilizationPct} max={100} label="CPU Util" color="#06b6d4" />
        <Gauge value={latencyPct} max={100} label="Latency" color="#10b981" />
        <Gauge value={qualityPct} max={100} label="Quality" color="#f59e0b" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {stats.map(stat => (
          <div key={stat.label} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/30">
            {stat.icon}
            <div>
              <p className="text-white font-mono font-semibold text-xs">{stat.value}</p>
              <p className="text-slate-500 text-[10px]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800">
        <p className="text-slate-500 text-xs mb-2">Active Compute Tasks</p>
        <div className="flex flex-wrap gap-1.5">
          {['EMA-20 Calc', 'EMA-50 Calc', 'RSI-14', 'MACD', 'Anomaly Det.', 'Vol. Analysis'].map(task => (
            <span key={task} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              {task}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
