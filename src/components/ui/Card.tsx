import React from 'react';
import { useGame } from '../../context/GameContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle, badge, badgeColor }) => {
  const { state } = useGame();
  const defaultBadgeColor = state.clubProfile?.primaryColor || '#dc2626';

  return (
    <div className={`bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col ${className}`}>
      {(title || subtitle || badge) && (
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div>
            {title && <h3 className="text-sm font-black text-white uppercase tracking-widest">{title}</h3>}
            {subtitle && <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">{subtitle}</p>}
          </div>
          {badge && (
            <span 
              className="px-2 py-1 rounded text-[9px] font-black text-white uppercase tracking-tighter"
              style={{ backgroundColor: badgeColor || defaultBadgeColor }}
            >
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  color?: string;
  subValue?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, color = 'text-white', subValue }) => {
  const isHex = color.startsWith('#');
  
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-5 rounded-2xl flex items-center gap-4 hover:border-zinc-700 transition-all group">
      <div 
        className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${!isHex ? color.replace('text-', 'bg-').replace('500', '500/10') : 'bg-zinc-800'}`}
        style={isHex ? { backgroundColor: `${color}1A` } : undefined}
      >
        <Icon className={!isHex ? color : ''} style={isHex ? { color } : undefined} size={24} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-black tracking-tighter" style={{ color: isHex ? color : undefined }}>{value}</h4>
          {subValue && <span className="text-xs text-zinc-500 font-bold">{subValue}</span>}
        </div>
      </div>
      {trend !== undefined && (
        <div className={`text-xs font-bold ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  );
};
