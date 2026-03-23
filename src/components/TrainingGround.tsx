import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Target, Zap, Activity, Users, Settings2 } from 'lucide-react';
import { useGame } from '../context/GameContext';

const TrainingGround = () => {
  const { state, dispatch } = useGame();

  const handleIntensityChange = (intensity: 'Low' | 'Normal' | 'High') => {
    dispatch({ type: 'SET_TRAINING_CONFIG', payload: { intensity } });
  };

  const handleFocusChange = (focus: 'Tactical' | 'Physical' | 'Technical') => {
    dispatch({ type: 'SET_TRAINING_CONFIG', payload: { focus } });
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">Training Ground</h2>
          <p className="text-zinc-500 font-bold italic uppercase tracking-widest text-xs">Optimize squad development and fitness</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col items-end">
            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">Intensity</span>
            <span className={`text-sm font-black uppercase italic ${state.trainingIntensity === 'High' ? 'text-red-500' : state.trainingIntensity === 'Low' ? 'text-emerald-500' : 'text-white'}`} style={state.trainingIntensity === 'High' ? { color: state.clubProfile?.primaryColor } : {}}>
              {state.trainingIntensity}
            </span>
          </div>
          <div className="px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col items-end">
            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">Focus</span>
            <span className="text-sm font-black text-white uppercase italic">{state.trainingFocus}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Controls */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Training Intensity" subtitle="Balance fitness against injury risk" icon={Zap}>
              <div className="grid grid-cols-3 gap-3">
                {(['Low', 'Normal', 'High'] as const).map(intensity => (
                  <button
                    key={intensity}
                    onClick={() => handleIntensityChange(intensity)}
                    className={`py-4 rounded-2xl border font-black uppercase tracking-widest text-[10px] transition-all ${
                      state.trainingIntensity === intensity 
                        ? 'text-white shadow-lg' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                    }`}
                    style={state.trainingIntensity === intensity ? { backgroundColor: state.clubProfile?.primaryColor || '#dc2626', borderColor: state.clubProfile?.primaryColor || '#dc2626' } : {}}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-[9px] text-zinc-500 font-bold italic leading-relaxed">
                {state.trainingIntensity === 'High' && "High intensity increases development but carries high risk of injury and fatigue."}
                {state.trainingIntensity === 'Normal' && "Standard routine. Balanced development and recovery."}
                {state.trainingIntensity === 'Low' && "Focus on recovery. Low injury risk but minimal development."}
              </p>
            </Card>

            <Card title="Main Focus" subtitle="Team priority this week" icon={Target}>
              <div className="grid grid-cols-3 gap-3">
                {(['Tactical', 'Physical', 'Technical'] as const).map(focus => (
                  <button
                    key={focus}
                    onClick={() => handleFocusChange(focus)}
                    className={`py-4 rounded-2xl border font-black uppercase tracking-widest text-[10px] transition-all ${
                      state.trainingFocus === focus 
                        ? 'text-white shadow-lg' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                    }`}
                    style={state.trainingFocus === focus ? { backgroundColor: state.clubProfile?.primaryColor || '#dc2626', borderColor: state.clubProfile?.primaryColor || '#dc2626' } : {}}
                  >
                    {focus}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-[9px] text-zinc-500 font-bold italic leading-relaxed">
                {state.trainingFocus === 'Tactical' && "Improves cohesion and tactical familiarity faster."}
                {state.trainingFocus === 'Physical' && "Increases player stamina and physical attributes."}
                {state.trainingFocus === 'Technical' && "Focus on ball handling, passing and finishing."}
              </p>
            </Card>
          </div>

          <Card title="Player Development" subtitle="Individual programs" icon={Users}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/50">
                    <th className="py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Player</th>
                    <th className="py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Focus</th>
                    <th className="py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Intensity</th>
                    <th className="py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Morale</th>
                    <th className="py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {state.squad.slice(0, 8).map(player => (
                    <tr key={player.id} className="group hover:bg-zinc-900/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-[10px] font-black text-zinc-500">
                            {player.position}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{player.name}</p>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">OVR: {player.rating}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{player.trainingFocus || 'Standard'}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                            <div className="h-full" style={{ backgroundColor: state.clubProfile?.primaryColor || '#dc2626', width: `${player.stamina}%` }}></div>
                          </div>
                          <span className="text-[9px] font-bold text-zinc-500">{player.stamina}%</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${player.morale > 70 ? 'text-emerald-500' : player.morale < 40 ? 'text-red-500' : 'text-zinc-500'}`}>
                          {player.morale > 70 ? 'High' : player.morale < 40 ? 'Low' : 'Normal'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => dispatch({ type: 'SET_TRAINING_FOCUS', payload: { playerId: player.id, focus: 'Shooting' } })}
                          className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[8px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                          style={{ borderColor: `${state.clubProfile?.primaryColor}33` }}
                        >
                          Change Focus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card title="Facilities" subtitle="Infrastructure" icon={Settings2}>
            <div className="space-y-4">
              <FacilityItem 
                label="Training Ground" 
                level={state.facilities.training} 
                onUpgrade={() => dispatch({ type: 'INFRASTRUCTURE_UPGRADE', payload: { type: 'training' } })}
              />
              <FacilityItem 
                label="Youth Academy" 
                level={state.facilities.youth} 
                onUpgrade={() => dispatch({ type: 'INFRASTRUCTURE_UPGRADE', payload: { type: 'youth' } })}
              />
              <FacilityItem 
                label="Medical Center" 
                level={state.facilities.medical} 
                onUpgrade={() => dispatch({ type: 'INFRASTRUCTURE_UPGRADE', payload: { type: 'medical' } })}
              />
            </div>
          </Card>

          <Card title="Coaching Team" subtitle="Support Staff" icon={Activity}>
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl text-center">
              <Dumbbell size={32} className="text-zinc-700 mx-auto mb-4" />
              <p className="text-[10px] text-zinc-500 font-bold italic">Your coaching team works to maximize the potential of your players.</p>
              <button 
                className="mt-6 w-full py-3 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                style={{ backgroundColor: state.clubProfile?.primaryColor || '#dc2626' }}
              >
                Hire Specialist (£5M)
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, subtitle, icon: Icon, children, badge }: any) => {
  const { state } = useGame();
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
      <div className="p-8 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-950/20">
        <div className="flex items-center gap-4">
          {Icon && (
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center border"
              style={{ backgroundColor: `${state.clubProfile?.primaryColor}1a`, borderColor: `${state.clubProfile?.primaryColor}33` }}
            >
              <Icon size={20} style={{ color: state.clubProfile?.primaryColor }} />
            </div>
          )}
          <div>
            <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">{title}</h3>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{subtitle}</p>
          </div>
        </div>
        {badge && (
          <div className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: state.clubProfile?.primaryColor }}>{badge}</span>
          </div>
        )}
      </div>
      <div className="p-8 flex-1">
        {children}
      </div>
    </div>
  );
};

const FacilityItem = ({ label, level, onUpgrade }: any) => {
  const { state } = useGame();
  return (
    <div className="p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl flex items-center justify-between group transition-all">
      <div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`w-3 h-1 rounded-full ${i <= level ? '' : 'bg-zinc-800'}`} style={{ backgroundColor: i <= level ? state.clubProfile?.primaryColor : undefined }}></div>
          ))}
        </div>
      </div>
      <button 
        onClick={onUpgrade}
        className="px-4 py-2 bg-zinc-900 hover:text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
        style={{ backgroundColor: state.clubProfile?.primaryColor, color: state.clubProfile?.secondaryColor }}
      >
        Upgrade
      </button>
    </div>
  );
};

export default TrainingGround;
