import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'motion/react';

const LeagueTable = () => {
  const { state } = useGame();

  const sortedTable = [...state.leagueTable].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.gf - a.ga;
    const gdB = b.gf - b.ga;
    if (gdB !== gdA) return gdB - gdA;
    return b.gf - a.gf;
  });

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900/50 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Premier League</span>
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
            League<span style={{ color: state.clubProfile?.primaryColor || '#dc2626' }}>Table</span>
          </h2>
          <p className="text-zinc-500 mt-4 font-bold italic text-lg">The battle for the title and Champions League spots.</p>
        </div>
      </header>

      <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/50 border-b border-zinc-800/50">
              <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pos</th>
              <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Team</th>
              <th className="px-4 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">P</th>
              <th className="px-4 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">W</th>
              <th className="px-4 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">D</th>
              <th className="px-4 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">L</th>
              <th className="px-4 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">GD</th>
              <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Pts</th>
            </tr>
          </thead>
          <tbody>
            {sortedTable.map((entry, idx) => {
              const team = state.teams.find(t => t.id === entry.teamId);
              const isPlayerClub = entry.teamId === state.selectedClubId;
              const gd = entry.gf - entry.ga;
              
              return (
                <motion.tr 
                  key={entry.teamId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`border-b border-zinc-800/30 transition-colors hover:bg-zinc-800/20 ${isPlayerClub ? 'bg-zinc-800/40' : ''}`}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-black italic ${idx < 4 ? 'text-emerald-500' : idx > 17 ? 'text-red-500' : 'text-zinc-500'}`}>
                        {idx + 1}
                      </span>
                      {idx < 4 && <div className="w-1 h-4 bg-emerald-500/50 rounded-full"></div>}
                      {idx >= 17 && <div className="w-1 h-4 bg-red-500/50 rounded-full"></div>}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div 
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] border ${isPlayerClub ? 'text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                        style={isPlayerClub ? { backgroundColor: state.clubProfile?.primaryColor, borderColor: state.clubProfile?.primaryColor } : {}}
                      >
                        {team?.id.substring(0, 2)}
                      </div>
                      <span className={`text-sm font-black uppercase tracking-tight italic ${isPlayerClub ? 'text-white' : 'text-zinc-300'}`}>
                        {team?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center text-sm font-bold text-zinc-400 tabular-nums">{entry.played}</td>
                  <td className="px-4 py-5 text-center text-sm font-bold text-zinc-400 tabular-nums">{entry.won}</td>
                  <td className="px-4 py-5 text-center text-sm font-bold text-zinc-400 tabular-nums">{entry.drawn}</td>
                  <td className="px-4 py-5 text-center text-sm font-bold text-zinc-400 tabular-nums">{entry.lost}</td>
                  <td className="px-4 py-5 text-center text-sm font-bold text-zinc-400 tabular-nums">
                    <span className={gd > 0 ? 'text-emerald-500' : gd < 0 ? 'text-red-500' : 'text-zinc-500'}>
                      {gd > 0 ? '+' : ''}{gd}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span 
                      className="text-lg font-black italic tracking-tighter"
                      style={isPlayerClub ? { color: state.clubProfile?.primaryColor } : { color: 'white' }}
                    >
                      {entry.points}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LegendItem color="bg-emerald-500" label="Champions League" />
        <LegendItem color="bg-blue-500" label="Europa League" />
        <LegendItem color="bg-red-500" label="Relegation" />
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
  </div>
);

export default LeagueTable;
