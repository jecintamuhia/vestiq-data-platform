import { Database, HardDrive, FileStack } from 'lucide-react';
import { PipelineMetrics } from '../types';

interface StoragePanelProps {
  metrics: PipelineMetrics;
}

function StorageBar({ label, used, total, color }: { label: string; used: number; total: number; color: string }) {
  const pct = Math.min(100, (used / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-400 text-xs">{label}</span>
        <span className="text-slate-400 text-xs">{used.toFixed(2)} / {total.toFixed(1)} GB</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function StoragePanel({ metrics }: StoragePanelProps) {
  const warehouseGb = metrics.warehouse_records * 0.000000512;

  return (
    <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/60">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-sm">Storage Layer</h2>
        <span className="text-slate-500 text-xs">Lake + Warehouse</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold">Data Lake</span>
          </div>
          <p className="text-white font-bold text-lg font-mono">{metrics.storage_gb.toFixed(3)} <span className="text-slate-400 text-xs font-normal">GB</span></p>
          <p className="text-slate-500 text-xs mt-1">Raw Parquet Files</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500">Partitions</span>
              <span className="text-blue-400">{metrics.active_partitions}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500">Format</span>
              <span className="text-blue-400">Parquet</span>
            </div>
          </div>
        </div>

        <div className="border border-cyan-500/20 bg-cyan-500/5 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-xs font-semibold">Warehouse</span>
          </div>
          <p className="text-white font-bold text-lg font-mono">{(warehouseGb * 1000).toFixed(2)} <span className="text-slate-400 text-xs font-normal">MB</span></p>
          <p className="text-slate-500 text-xs mt-1">Analytics Storage</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500">Records</span>
              <span className="text-cyan-400">{metrics.warehouse_records.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-500">Engine</span>
              <span className="text-cyan-400">PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <StorageBar
          label="Data Lake Utilization"
          used={metrics.storage_gb}
          total={10}
          color="bg-blue-500"
        />
        <StorageBar
          label="Warehouse Utilization"
          used={warehouseGb * 1000}
          total={500}
          color="bg-cyan-500"
        />
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Tables', value: '5', color: 'text-cyan-400' },
          { label: 'Indexes', value: '10', color: 'text-blue-400' },
          { label: 'Queries/s', value: (metrics.messages_per_second * 1.4).toFixed(1), color: 'text-emerald-400' },
        ].map(item => (
          <div key={item.label}>
            <p className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</p>
            <p className="text-slate-500 text-[10px]">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
