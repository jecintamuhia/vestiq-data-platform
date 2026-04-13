import { CheckCircle, AlertTriangle, XCircle, Shield } from 'lucide-react';
import { DataQualityMetric } from '../types';

interface MonitoringPanelProps {
  metrics: DataQualityMetric[];
}

function StatusIcon({ status }: { status: 'OK' | 'WARNING' | 'ERROR' }) {
  if (status === 'OK') return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
  if (status === 'WARNING') return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
  return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
}

function formatMetricValue(name: string, value: number): string {
  if (name.includes('Rate') || name.includes('Completeness') || name.includes('Validity')) return `${value.toFixed(2)}%`;
  if (name.includes('Latency')) return `${value.toFixed(1)}ms`;
  return value.toFixed(3);
}

export default function MonitoringPanel({ metrics }: MonitoringPanelProps) {
  const okCount = metrics.filter(m => m.status === 'OK').length;
  const warnCount = metrics.filter(m => m.status === 'WARNING').length;
  const errCount = metrics.filter(m => m.status === 'ERROR').length;
  const healthScore = metrics.length > 0 ? Math.round((okCount / metrics.length) * 100) : 100;

  return (
    <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/60 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-sm">Data Monitoring</h2>
        <Shield className="w-4 h-4 text-amber-400" />
      </div>

      <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
        <div>
          <p className="text-slate-400 text-xs mb-1">Overall Health</p>
          <p className={`text-2xl font-bold font-mono ${healthScore >= 90 ? 'text-emerald-400' : healthScore >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
            {healthScore}%
          </p>
        </div>
        <div className="text-right space-y-1">
          <div className="flex items-center gap-1.5 justify-end">
            <span className="text-emerald-400 text-xs font-semibold">{okCount}</span>
            <span className="text-slate-500 text-xs">OK</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <span className="text-amber-400 text-xs font-semibold">{warnCount}</span>
            <span className="text-slate-500 text-xs">WARN</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <span className="text-rose-400 text-xs font-semibold">{errCount}</span>
            <span className="text-slate-500 text-xs">ERR</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto">
        {metrics.map((m, i) => {
          const statusColor = m.status === 'OK'
            ? 'border-emerald-500/20 bg-emerald-500/5'
            : m.status === 'WARNING'
            ? 'border-amber-500/20 bg-amber-500/5'
            : 'border-rose-500/20 bg-rose-500/5';

          return (
            <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg border ${statusColor}`}>
              <div className="flex items-center gap-2">
                <StatusIcon status={m.status} />
                <span className="text-slate-300 text-xs">{m.metric_name}</span>
              </div>
              <span className="text-white font-mono text-xs font-semibold">
                {formatMetricValue(m.metric_name, m.metric_value)}
              </span>
            </div>
          );
        })}
        {metrics.length === 0 && (
          <div className="flex items-center justify-center py-8 text-slate-600 text-xs">
            Loading metrics...
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-slate-500 text-xs">Continuous quality checks every 3s</span>
        </div>
      </div>
    </div>
  );
}
