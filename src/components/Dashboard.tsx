import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, StatCard } from './ui/Card';
import ObjectivesPanel from './ObjectivesPanel';
import { 
  ShieldCheck, 
  Users, 
  Dna, 
  PoundSterling, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  ArrowRight,
  Trophy,
  Activity
} from 'lucide-react';
import NarrativeFeed from './NarrativeFeed';
import SocialFeed from './SocialFeed';
import { MediaPanel } from './MediaPanel';

const Dashboard = () => {
  const { state } = useGame();

  const nextFixture = state.fixtures.find(f => f.week === state.week && (f.homeTeamId === state.selectedClubId || f.awayTeamId === state.selectedClubId));
  const opponentId = nextFixture?.homeTeamId === state.selectedClubId ? nextFixture.awayTeamId : nextFixture?.homeTeamId;
  const opponent = state.teams.find(t => t.id === opponentId);

  const injuredPlayers = state.squad.filter(p => p.injuryWeeks > 0);
  const lowStaminaPlayers = state.squad.filter(p => p.stamina < 60 && p.injuryWeeks === 0);

  const { dispatch } = useGame();

  const handleQuickDecision = (type: 'morale_boost' | 'rest_squad' | 'press_conf') => {
    dispatch({ type: 'QUICK_DECISION', payload: { type } });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Crisis Alert */}
      {(state.boardTrust < 30 || state.psrHeadroom < 10) && (
        <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-2xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-4">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Crisis Alert</h3>
              <p className="text-xs text-red-400 font-bold">
                {state.boardTrust < 30 ? "The board has lost confidence. You are at risk of being sacked!" : "Financial crisis. PSR breach is imminent."}
              </p>
            </div>
          </div>
          <button className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest transition-colors">
            Take action now
          </button>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Board Trust" 
          value={`${state.boardTrust}%`} 
          icon={ShieldCheck} 
          color={state.boardTrust > 70 ? 'text-emerald-500' : state.boardTrust > 40 ? 'text-yellow-500' : 'text-red-500'}
        />
        <StatCard 
          label="Supporter Atmosphere" 
          value={`${state.supporterAtmosphere}%`} 
          icon={Users} 
          color={state.supporterAtmosphere > 70 ? 'text-emerald-500' : state.supporterAtmosphere > 40 ? 'text-yellow-500' : 'text-red-500'}
        />
        <StatCard 
          label="Club Identity" 
          value={`${state.clubIdentityScore}%`} 
          icon={Dna} 
          color={state.clubProfile?.primaryColor || '#dc2626'}
        />
        <StatCard 
          label="PSR Headroom" 
          value={`£${state.psrHeadroom}M`} 
          icon={PoundSterling} 
          color={state.psrHeadroom > 50 ? 'text-emerald-500' : 'text-yellow-500'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Next Match & Squad Status */}
        <div className="lg:col-span-8 space-y-8">
          <ObjectivesPanel />
          
          {/* Quick Decisions Panel */}
          <Card title="Quick Decisions" subtitle="Managerial Choices" badge="Active">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => handleQuickDecision('morale_boost')}
                className="flex flex-col items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-red-500/50 transition-all group"
              >
                <div className="w-10 h-10 bg-emerald-900/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-900/40">
                  <TrendingUp className="text-emerald-500" size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-white uppercase tracking-widest">Boost Morale</p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Cost: £10M PSR</p>
                </div>
              </button>

              <button 
                onClick={() => handleQuickDecision('rest_squad')}
                className="flex flex-col items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-red-500/50 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-900/20 rounded-xl flex items-center justify-center group-hover:bg-blue-900/40">
                  <Activity className="text-blue-500" size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-white uppercase tracking-widest">Rest Squad</p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Reduces tactical focus</p>
                </div>
              </button>

              <button 
                onClick={() => handleQuickDecision('press_conf')}
                className="flex flex-col items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-red-500/50 transition-all group"
              >
                <div className="w-10 h-10 bg-purple-900/20 rounded-xl flex items-center justify-center group-hover:bg-purple-900/40">
                  <Users className="text-purple-500" size={20} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-white uppercase tracking-widest">Press Conference</p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Lowers media pressure</p>
                </div>
              </button>
            </div>
          </Card>

          {/* Next Match Card */}
          <Card title="Next Match" subtitle="Premier League" badge="Matchday" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 flex items-center justify-between py-6">
              <div className="flex flex-col items-center gap-4 flex-1">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl shadow-2xl border border-white/10"
                  style={{ backgroundColor: state.clubProfile?.primaryColor, color: state.clubProfile?.secondaryColor }}
                >
                  {state.clubProfile?.shortName.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-black text-white uppercase tracking-widest">{state.clubProfile?.shortName}</span>
              </div>

              <div className="flex flex-col items-center gap-2 px-10">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">VS</span>
                <div className="text-xs font-bold text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">{state.clubProfile?.stadium}</div>
              </div>

              <div className="flex flex-col items-center gap-4 flex-1">
                <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-3xl border border-zinc-700">
                  {opponent?.id.substring(0, 2)}
                </div>
                <span className="text-sm font-black text-white uppercase tracking-widest">{opponent?.name}</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-between items-center">
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Weather</span>
                  <span className="text-xs text-white font-bold uppercase">{state.weather}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Referee</span>
                  <span className="text-xs text-white font-bold uppercase">Michael Oliver</span>
                </div>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors">
                Go to tactics <ArrowRight size={14} />
              </button>
            </div>
          </Card>

          {/* Squad Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Medical Report" subtitle="Injuries & Recovery" badge={`${injuredPlayers.length} Out`}>
              {injuredPlayers.length > 0 ? (
                <div className="space-y-3">
                  {injuredPlayers.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-900/20 rounded-lg flex items-center justify-center">
                          <AlertCircle size={14} className="text-red-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{p.name}</p>
                          <p className="text-[9px] text-zinc-500 uppercase font-black">{p.injuryWeeks} weeks left</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-red-500 uppercase">Out</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                  <ShieldCheck size={32} className="mb-2 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No injuries</p>
                </div>
              )}
            </Card>

            <Card title="Fitness Status" subtitle="Low Stamina" badge={`${lowStaminaPlayers.length} Tired`}>
              {lowStaminaPlayers.length > 0 ? (
                <div className="space-y-3">
                  {lowStaminaPlayers.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-900/20 rounded-lg flex items-center justify-center">
                          <TrendingUp size={14} className="text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{p.name}</p>
                          <p className="text-[9px] text-zinc-500 uppercase font-black">{p.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500" style={{ width: `${p.stamina}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-yellow-500">{p.stamina}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                  <Activity size={32} className="mb-2 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Squad is rested</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Right Column: Feeds */}
        <div className="lg:col-span-4 space-y-8">
          <div className="h-[400px]">
            <MediaPanel />
          </div>
          <Card title="News Feed" subtitle="Latest from the club" className="h-[400px]">
            <NarrativeFeed />
          </Card>
          <Card title="Social Media" subtitle="Fan reactions" className="h-[400px]">
            <SocialFeed />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
