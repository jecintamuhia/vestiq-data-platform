import { Bell, X, AlertTriangle, AlertOctagon, Info, Zap } from 'lucide-react';
import { AnomalyAlert } from '../types';

interface AlertsPanelProps {
  alerts: AnomalyAlert[];
  onDismiss: (index: number) => void;
}

function SeverityIcon({ severity }: { severity: AnomalyAlert['severity'] }) {
  if (severity === 'CRITICAL') return <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />;
  if (severity === 'HIGH') return <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />;
  if (severity === 'MEDIUM') return <Zap className="w-3.5 h-3.5 text-amber-400" />;
  return <Info className="w-3.5 h-3.5 text-blue-400" />;
}

function severityStyles(severity: AnomalyAlert['severity']) {
  if (severity === 'CRITICAL') return 'border-rose-500/30 bg-rose-500/5';
  if (severity === 'HIGH') return 'border-orange-500/30 bg-orange-500/5';
  if (severity === 'MEDIUM') return 'border-amber-500/30 bg-amber-500/5';
  return 'border-blue-500/30 bg-blue-500/5';
}

function severityBadge(severity: AnomalyAlert['severity']) {
  if (severity === 'CRITICAL') return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
  if (severity === 'HIGH') return 'text-orange-400 bg-orange-500/15 border-orange-500/30';
  if (severity === 'MEDIUM') return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
  return 'text-blue-400 bg-blue-500/15 border-blue-500/30';
}

function formatTime(timestamp?: string): string {
  if (!timestamp) return 'Just now';
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function AlertsPanel({ alerts, onDismiss }: AlertsPanelProps) {
  const active = alerts.filter(a => !a.resolved);
  const criticalCount = active.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length;

  return (
    <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/60 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h2 className="text-white font-semibold text-sm">Anomaly Alerts</h2>
          {criticalCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400">
              {criticalCount} critical
            </span>
          )}
        </div>
        <span className="text-slate-500 text-xs">{active.length} active</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 max-h-[320px]">
        {active.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-slate-500 text-xs">No active alerts</p>
          </div>
        ) : (
          active.slice(0, 15).map((alert, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${severityStyles(alert.severity)} group`}
            >
              <SeverityIcon severity={alert.severity} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {alert.symbol && (
                    <span className="text-white text-xs font-semibold">{alert.symbol}</span>
                  )}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${severityBadge(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-slate-600 text-[10px] ml-auto">{formatTime(alert.timestamp)}</span>
                </div>
                <p className="text-slate-400 text-[10px] leading-tight">{alert.description}</p>
                <p className="text-slate-600 text-[9px] mt-0.5">{alert.alert_type.replace(/_/g, ' ')}</p>
              </div>
              <button
                onClick={() => onDismiss(i)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-slate-400 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
          <span className="text-slate-500 text-xs">Anomaly detection via statistical analysis</span>
        </div>
      </div>
    </div>
  );
}
