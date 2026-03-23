import React from 'react';
import { motion } from 'motion/react';
import { Activity, Heart, ShieldAlert, Zap, Thermometer, UserCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';

const MedicalCenter = () => {
  const { state, dispatch } = useGame();

  const injuredPlayers = state.squad.filter(p => p.injuryWeeks > 0);
  const tiredPlayers = state.squad.filter(p => p.stamina < 70 && p.injuryWeeks === 0);

  const handleMedicalAction = (playerId: string, type: 'specialist' | 'force_play' | 'rest') => {
    if (type === 'rest') {
      dispatch({ type: 'MEDICAL_TREATMENT', payload: { playerId, type: 'rest' } });
    } else {
      dispatch({ type: 'MEDICAL_ACTION', payload: { playerId, type } });
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">Medisinsk Senter</h2>
          <p className="text-zinc-500 font-bold italic uppercase tracking-widest text-xs">Behandling, restitusjon og skadeforebygging</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col items-end">
            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">Skader</span>
            <span className="text-sm font-black text-red-500 uppercase italic">{injuredPlayers.length} Spillere</span>
          </div>
          <div className="px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col items-end">
            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">Slitasje</span>
            <span className="text-sm font-black text-yellow-500 uppercase italic">{tiredPlayers.length} Spillere</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Injured Players */}
        <div className="lg:col-span-8 space-y-8">
          <Card title="Skadestue" subtitle="Spillere under behandling" icon={ShieldAlert} badge={injuredPlayers.length.toString()}>
            {injuredPlayers.length > 0 ? (
              <div className="space-y-4">
                {injuredPlayers.map(player => (
                  <div key={player.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-between group hover:border-red-900/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                        <Thermometer size={24} className="text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">{player.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">
                          Ute i <span className="text-red-500">{player.injuryWeeks} uker</span> • {player.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleMedicalAction(player.id, 'specialist')}
                        className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-zinc-800 transition-all"
                      >
                        Send til Spesialist (£15M)
                      </button>
                      <button 
                        onClick={() => handleMedicalAction(player.id, 'force_play')}
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/20"
                      >
                        Sprøyte (Spill nå)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-emerald-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                  <UserCheck size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Ingen skader i troppen</h3>
                <p className="text-zinc-500 font-bold italic mt-2">Medisinsk personell har full kontroll.</p>
              </div>
            )}
          </Card>

          <Card title="Restitusjonsrom" subtitle="Spillere med lav stamina" icon={Zap}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiredPlayers.length > 0 ? tiredPlayers.map(player => (
                <div key={player.id} className="p-5 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl flex items-center justify-between group hover:border-yellow-900/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-[10px] font-black text-zinc-500">
                      {player.position}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{player.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500" style={{ width: `${player.stamina}%` }}></div>
                        </div>
                        <span className="text-[8px] font-bold text-yellow-500">{player.stamina}%</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleMedicalAction(player.id, 'rest')}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[8px] font-black uppercase tracking-widest border border-zinc-800 transition-all"
                  >
                    Hvil Spiller
                  </button>
                </div>
              )) : (
                <div className="col-span-2 py-10 text-center">
                  <p className="text-zinc-500 font-bold italic text-xs">Alle spillere er uthvilte og klare for kamp.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card title="Medisinsk Status" subtitle="Lagets helse" icon={Activity}>
            <div className="space-y-6">
              <HealthStat label="Gjennomsnittlig Stamina" value={`${Math.round(state.squad.reduce((acc, p) => acc + p.stamina, 0) / state.squad.length)}%`} color="emerald" />
              <HealthStat label="Skaderisiko" value={state.trainingIntensity === 'High' ? 'Høy' : 'Lav'} color={state.trainingIntensity === 'High' ? 'red' : 'emerald'} />
              <HealthStat label="Medisinsk Nivå" value={`Nivå ${state.facilities.medical}`} color="red" />
            </div>
          </Card>

          <div className="p-8 bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-600/10 transition-all"></div>
            <Heart size={48} className="text-red-600/20 mb-6" />
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3">Forebygging</h3>
            <p className="text-zinc-500 font-bold italic text-xs leading-relaxed mb-8">
              Invester i bedre fasiliteter for å redusere sjansen for muskelskader under trening og kamp.
            </p>
            <button 
              onClick={() => dispatch({ type: 'INFRASTRUCTURE_UPGRADE', payload: { type: 'medical' } })}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-red-900/20"
            >
              Oppgrader Senter (£50M)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, subtitle, icon: Icon, children, badge }: any) => (
  <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
    <div className="p-8 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-950/20">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
            <Icon size={20} className="text-red-500" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">{title}</h3>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
      </div>
      {badge && (
        <div className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full">
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{badge}</span>
        </div>
      )}
    </div>
    <div className="p-8 flex-1">
      {children}
    </div>
  </div>
);

const HealthStat = ({ label, value, color }: any) => (
  <div className="flex justify-between items-center p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl">
    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
    <span className={`text-xs font-black uppercase italic ${color === 'red' ? 'text-red-500' : color === 'emerald' ? 'text-emerald-500' : 'text-white'}`}>
      {value}
    </span>
  </div>
);

export default MedicalCenter;
