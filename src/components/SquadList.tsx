import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  DollarSign, 
  FileText, 
  Trash2, 
  Shield, 
  Zap, 
  Heart, 
  AlertTriangle, 
  Star, 
  Activity, 
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  UserPlus,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/Card';
import ConfirmModal from './ui/ConfirmModal';

const SquadList = () => {
  const { state, dispatch } = useGame();
  const [viewMode, setViewMode] = useState<'overview' | 'attributes' | 'contracts'>('overview');
  const [showContractModal, setShowContractModal] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showSellConfirm, setShowSellConfirm] = useState<string | null>(null);
  const [newWage, setNewWage] = useState(10);
  const [newYears, setNewYears] = useState(3);
  const startersCount = state.squad.filter(p => p.isStarting).length;

  const handlePlayerAction = (playerId: string, action: 'fine' | 'praise' | 'promise' | 'untouchable') => {
    dispatch({ type: 'PLAYER_ACTION', payload: { playerId, action } });
    setShowActionMenu(null);
  };

  const handleRenew = (playerId: string) => {
    dispatch({ type: 'RENEW_CONTRACT', payload: { playerId, wage: newWage, years: newYears } });
    setShowContractModal(null);
  };

  const toggleTransferList = (playerId: string, currentStatus: boolean) => {
    dispatch({ type: 'SET_TRANSFER_LIST', payload: { playerId, status: !currentStatus } });
  };

  const getPersonalityIcon = (personality: string) => {
    switch (personality) {
      case 'Professional': return <Shield size={12} className="text-blue-400" />;
      case 'Ego': return <Zap size={12} className="text-yellow-400" />;
      case 'Loyal': return <Heart size={12} className="text-red-400" />;
      case 'Troublemaker': return <AlertTriangle size={12} className="text-orange-400" />;
      case 'Leader': return <Star size={12} className="text-emerald-400" />;
      default: return <Shield size={12} />;
    }
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900/50 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ 
                backgroundColor: state.clubProfile?.primaryColor,
                boxShadow: `0 0 10px ${state.clubProfile?.primaryColor}80`
              }}
            ></div>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Squad Management</span>
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
            First Team <span style={{ color: state.clubProfile?.primaryColor }}>Squad</span>
          </h2>
          <p className="text-zinc-500 mt-4 font-bold italic text-lg">Manage player contracts, tactical status, and market value.</p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Users size={14} style={{ color: state.clubProfile?.primaryColor }} />
            <span>Selected Starting XI</span>
          </div>
          <div className="flex items-center gap-4">
            <span 
              className={`text-4xl font-black italic tracking-tighter ${startersCount === 11 ? 'text-emerald-500' : ''}`}
              style={startersCount !== 11 ? { color: state.clubProfile?.primaryColor } : {}}
            >
              {startersCount}<span className="text-zinc-700 text-2xl">/11</span>
            </span>
            <div className="w-48 h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(startersCount / 11) * 100}%` }}
                className="h-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                style={{ 
                  backgroundColor: startersCount === 11 ? '#10b981' : state.clubProfile?.primaryColor,
                  boxShadow: startersCount === 11 ? '0 0 15px rgba(16,185,129,0.3)' : `0 0 15px ${state.clubProfile?.primaryColor}4D`
                }}
              ></motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-[2rem] shadow-2xl">
        <div className="flex items-center gap-4 bg-zinc-950/50 px-6 py-3.5 rounded-2xl border border-zinc-800/50 w-full md:w-96 group transition-all" style={{ '--focus-border': `${state.clubProfile?.primaryColor}80` } as any}>
          <Search size={18} className="text-zinc-600 group-focus-within:text-zinc-400 transition-colors" style={{ color: state.clubProfile?.primaryColor }} />
          <input 
            type="text" 
            placeholder="Search squad..." 
            className="bg-transparent border-none outline-none text-xs font-black text-white w-full uppercase tracking-widest placeholder:text-zinc-700 italic" 
          />
        </div>

        <div className="flex items-center gap-2 bg-zinc-950/50 rounded-2xl p-1.5 border border-zinc-800/50 shadow-inner">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'attributes', label: 'Attributes' },
            { id: 'contracts', label: 'Contracts' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 italic ${
                viewMode === tab.id 
                  ? 'text-white shadow-xl' 
                  : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50'
              }`}
              style={viewMode === tab.id ? { 
                backgroundColor: state.clubProfile?.primaryColor,
                boxShadow: `0 10px 20px ${state.clubProfile?.primaryColor}4D`
              } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Squad List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {state.squad.map((player, idx) => (
            <motion.div 
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`group relative flex flex-col lg:flex-row items-center gap-8 p-6 rounded-[2.5rem] border transition-all duration-500 shadow-xl overflow-hidden ${
                player.isStarting 
                  ? 'bg-zinc-900/40' 
                  : 'bg-zinc-900/20 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/30'
              }`}
              style={player.isStarting ? { borderColor: `${state.clubProfile?.primaryColor}4D` } : {}}
            >
              {player.isStarting && (
                <div 
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ 
                    backgroundColor: state.clubProfile?.primaryColor,
                    boxShadow: `0 0 15px ${state.clubProfile?.primaryColor}80`
                  }}
                ></div>
              )}

              {/* Player Rating & Position */}
              <div className="flex items-center gap-6 w-full lg:w-1/4">
                <div className="relative group/rating">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center font-black text-3xl italic border-4 transition-all duration-500 shadow-2xl`}
                    style={{ 
                      backgroundColor: player.position === 'GK' ? 'rgba(234, 179, 8, 0.1)' : 
                                      player.position === 'DEF' ? 'rgba(59, 130, 246, 0.1)' : 
                                      player.position === 'MID' ? 'rgba(16, 185, 129, 0.1)' : 
                                      state.clubProfile?.primaryColor,
                      borderColor: player.position === 'GK' ? 'rgba(234, 179, 8, 0.3)' : 
                                   player.position === 'DEF' ? 'rgba(59, 130, 246, 0.3)' : 
                                   player.position === 'MID' ? 'rgba(16, 185, 129, 0.3)' : 
                                   `${state.clubProfile?.primaryColor}80`,
                      color: player.position === 'FWD' ? 'white' : 
                             player.position === 'GK' ? '#eab308' : 
                             player.position === 'DEF' ? '#3b82f6' : 
                             '#10b981',
                      boxShadow: player.position === 'FWD' ? `0 0 20px ${state.clubProfile?.primaryColor}4D` : 'none'
                    }}
                  >
                    {player.rating}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1 text-[10px] font-black text-white uppercase tracking-tighter shadow-2xl italic">
                    {player.position}
                  </div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 
                      className="font-black text-xl text-white truncate transition-colors italic tracking-tighter uppercase"
                      style={{ '--hover-color': state.clubProfile?.primaryColor } as any}
                    >
                      {player.name}
                    </h4>
                    {player.injuryWeeks > 0 && (
                      <div className="w-6 h-6 bg-red-600/20 rounded-lg flex items-center justify-center animate-pulse">
                        <Activity size={14} className="text-red-500" />
                      </div>
                    )}
                    {player.suspensionWeeks > 0 && (
                      <div className="w-6 h-6 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                        <AlertTriangle size={14} className="text-yellow-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-zinc-950/50 px-3 py-1 rounded-xl border border-zinc-800/50 shadow-inner">
                      {getPersonalityIcon(player.personality)}
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] italic">{player.personality}</span>
                    </div>
                    <span className="text-[10px] text-zinc-700 font-black uppercase tracking-widest italic">{player.age} YEARS</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Stats Content */}
              <div className="flex-1 w-full lg:w-auto px-10 border-x border-zinc-800/30">
                {viewMode === 'overview' ? (
                  <div className="grid grid-cols-4 gap-10">
                    <div className="space-y-3">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                        <span>Physical Status</span>
                        <span className={player.stamina > 80 ? 'text-emerald-500' : player.stamina > 50 ? 'text-yellow-500' : 'text-red-500'}>{player.stamina}%</span>
                      </div>
                      <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${player.stamina}%` }}
                          className={`h-full transition-all duration-1000 ${player.stamina > 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : player.stamina > 50 ? 'bg-yellow-500' : 'bg-red-600'}`}
                        ></motion.div>
                      </div>
                    </div>
                    <div className="text-center group/stat">
                      <span className="text-zinc-600 uppercase tracking-[0.2em] text-[9px] font-black block mb-2 group-hover/stat:text-zinc-400 transition-colors">Form</span>
                      <span className={`text-xl font-black italic tracking-tighter ${player.form > 7 ? 'text-emerald-500' : player.form > 4 ? 'text-yellow-500' : 'text-red-600'}`}>{player.form}/10</span>
                    </div>
                    <div className="text-center group/stat">
                      <span className="text-zinc-600 uppercase tracking-[0.2em] text-[9px] font-black block mb-2 group-hover/stat:text-zinc-400 transition-colors">Morale</span>
                      <span className={`text-xl font-black italic tracking-tighter ${player.morale > 70 ? 'text-emerald-500' : player.morale > 40 ? 'text-yellow-500' : 'text-red-600'}`}>{player.morale}%</span>
                    </div>
                    <div className="text-center group/stat">
                      <span className="text-zinc-600 uppercase tracking-[0.2em] text-[9px] font-black block mb-2 group-hover/stat:text-zinc-400 transition-colors">Potential</span>
                      <div className="flex items-center justify-center gap-2">
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span className="text-xl font-black text-white italic tracking-tighter">{player.potential}</span>
                      </div>
                    </div>
                  </div>
                ) : viewMode === 'attributes' ? (
                  <div className="grid grid-cols-6 gap-4">
                    {[
                      { l: 'PAC', v: player.attributes.pace },
                      { l: 'SHO', v: player.attributes.shooting },
                      { l: 'PAS', v: player.attributes.passing },
                      { l: 'DRI', v: player.attributes.dribbling },
                      { l: 'DEF', v: player.attributes.defending },
                      { l: 'PHY', v: player.attributes.physical }
                    ].map(attr => (
                      <div key={attr.l} className="text-center p-3 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 group/attr hover:border-zinc-700 transition-all">
                        <div className="text-zinc-700 uppercase tracking-[0.2em] text-[8px] font-black mb-1 group-hover/attr:text-zinc-500 transition-colors">{attr.l}</div>
                        <div className={`text-sm font-black italic tracking-tighter ${attr.v > 85 ? 'text-emerald-400' : attr.v > 75 ? 'text-white' : 'text-zinc-600'}`}>{attr.v}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-10">
                    <div className="text-center group/stat">
                      <span className="text-zinc-600 uppercase tracking-[0.2em] text-[9px] font-black block mb-2 group-hover/stat:text-zinc-400 transition-colors">Weekly Wage</span>
                      <span className="text-xl font-black text-white italic tracking-tighter">£{player.wage}k</span>
                    </div>
                    <div className="text-center group/stat">
                      <span className="text-zinc-600 uppercase tracking-[0.2em] text-[9px] font-black block mb-2 group-hover/stat:text-zinc-400 transition-colors">Contract</span>
                      <span className={`text-xl font-black italic tracking-tighter ${player.contractYears <= 1 ? 'text-red-500' : 'text-white'}`}>{player.contractYears} YEARS</span>
                    </div>
                    <div className="text-center group/stat">
                      <span className="text-zinc-600 uppercase tracking-[0.2em] text-[9px] font-black block mb-2 group-hover/stat:text-zinc-400 transition-colors">Market Status</span>
                      <div className="flex justify-center">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border italic ${
                          player.isOnTransferList 
                            ? 'bg-red-600/10 text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(220,38,38,0.1)]' 
                            : 'bg-emerald-600/10 text-emerald-500 border-emerald-500/30'
                        }`}>
                          {player.isOnTransferList ? 'Transfer Listed' : 'Untouchable'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Section */}
              <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
                <div className="flex flex-col items-end mr-4 hidden xl:block">
                  <div className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.3em] mb-1 italic">Valuation</div>
                  <div className="text-2xl font-black text-yellow-500 italic tracking-tighter">£{player.value}M</div>
                </div>

                <div className="flex gap-3 relative">
                  <ActionButton 
                    onClick={() => setShowActionMenu(showActionMenu === player.id ? null : player.id)}
                    icon={Users}
                    tooltip="Manager Actions"
                    active={showActionMenu === player.id}
                  />
                  
                  {showActionMenu === player.id && (
                    <div className="absolute bottom-full right-0 mb-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 flex flex-col gap-1 min-w-[150px]">
                      <button 
                        onClick={() => handlePlayerAction(player.id, 'praise')}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-colors text-left"
                      >
                        Praise Player
                      </button>
                      <button 
                        onClick={() => handlePlayerAction(player.id, 'fine')}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                      >
                        Fine (1 week)
                      </button>
                      <button 
                        onClick={() => handlePlayerAction(player.id, 'promise')}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:bg-blue-500/10 rounded-xl transition-colors text-left"
                      >
                        Promise Game Time
                      </button>
                      <button 
                        onClick={() => handlePlayerAction(player.id, 'untouchable')}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-yellow-500 hover:bg-yellow-500/10 rounded-xl transition-colors text-left"
                      >
                        Mark Untouchable
                      </button>
                    </div>
                  )}

                  <ActionButton 
                    onClick={() => toggleTransferList(player.id, !!player.isOnTransferList)}
                    active={player.isOnTransferList}
                    icon={DollarSign}
                    color="red"
                    tooltip="Transfer List"
                  />
                  <ActionButton 
                    onClick={() => {
                      setShowContractModal(player.id);
                      setNewWage(player.wage);
                    }}
                    icon={FileText}
                    tooltip="Renew Contract"
                  />
                  <ActionButton 
                    onClick={() => setShowSellConfirm(player.id)}
                    icon={Trash2}
                    color="red"
                    tooltip="Sell Player"
                  />
                </div>

                <button 
                  onClick={() => {
                    if (player.injuryWeeks > 0 || player.suspensionWeeks > 0) return;
                    dispatch({ type: 'TOGGLE_STARTING', payload: player.id });
                  }}
                  disabled={player.injuryWeeks > 0 || player.suspensionWeeks > 0}
                  className={`relative group/btn px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 min-w-[160px] border italic overflow-hidden ${
                    player.isStarting 
                      ? 'text-white shadow-2xl' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-white hover:border-zinc-600'
                  } ${(player.injuryWeeks > 0 || player.suspensionWeeks > 0) ? 'opacity-20 cursor-not-allowed' : ''}`}
                  style={player.isStarting ? { 
                    backgroundColor: state.clubProfile?.primaryColor,
                    borderColor: `${state.clubProfile?.primaryColor}80`,
                    boxShadow: `0 10px 30px ${state.clubProfile?.primaryColor}4D`
                  } : {}}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {player.isStarting ? 'First XI' : 'Reserve'}
                    <ChevronRight size={14} className={`transition-transform duration-500 ${player.isStarting ? 'translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Contract Negotiation Modal */}
      <AnimatePresence>
        {showContractModal && (
          <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-2xl flex items-center justify-center z-[100] p-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 p-12 rounded-[3rem] max-w-xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
              
              <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 bg-red-600/10 rounded-[2rem] flex items-center justify-center border border-red-500/20 shadow-2xl">
                  <UserPlus size={40} className="text-red-600" />
                </div>
                <div>
                  <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none mb-3">Contract Negotiation</h4>
                  <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Secure the club's long-term interests</p>
                </div>
              </div>
              
              <div className="space-y-10">
                <div className="group">
                  <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4 group-focus-within:text-red-600 transition-colors">Proposed Weekly Wage (£k)</label>
                  <div className="relative">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-700 font-black text-3xl italic">£</span>
                    <input 
                      type="number" 
                      value={newWage}
                      onChange={(e) => setNewWage(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-8 pl-16 text-white font-black text-5xl italic focus:border-red-600 outline-none transition-all shadow-inner tracking-tighter"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Contract Duration (Years)</label>
                  <div className="grid grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(y => (
                      <button
                        key={y}
                        onClick={() => setNewYears(y)}
                        className={`py-6 rounded-2xl font-black text-xl italic transition-all duration-300 border ${
                          newYears === y 
                            ? 'bg-red-600 border-red-500 text-white shadow-2xl shadow-red-900/40 scale-105' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-700 hover:border-zinc-600 hover:text-zinc-400'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-6 pt-10">
                  <button 
                    onClick={() => setShowContractModal(null)} 
                    className="flex-1 py-6 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] text-zinc-600 hover:text-zinc-400 transition-all italic"
                  >
                    Cancel Negotiation
                  </button>
                  <button 
                    onClick={() => handleRenew(showContractModal)} 
                    className="flex-1 py-6 bg-red-600 hover:bg-red-500 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] text-white shadow-2xl shadow-red-900/40 transition-all transform hover:-translate-y-1 italic"
                  >
                    Sign Agreement
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sell Confirmation Modal */}
      <ConfirmModal 
        isOpen={!!showSellConfirm}
        title="Confirm Sale"
        message={`Are you sure you want to sell ${state.squad.find(p => p.id === showSellConfirm)?.name} for £${state.squad.find(p => p.id === showSellConfirm)?.value}M?`}
        onConfirm={() => {
          const player = state.squad.find(p => p.id === showSellConfirm);
          if (player) {
            dispatch({ type: 'SELL_PLAYER', payload: { playerId: player.id, price: player.value } });
          }
          setShowSellConfirm(null);
        }}
        onCancel={() => setShowSellConfirm(null)}
        confirmText="Sell Player"
        type="danger"
      />
    </div>
  );
};

const ActionButton = ({ onClick, icon: Icon, active, color, tooltip }: any) => {
  const { state } = useGame();
  
  return (
    <button 
      onClick={onClick}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border group relative ${
        active 
          ? 'text-white shadow-xl' 
          : color === 'red' 
            ? 'bg-zinc-950 border-zinc-800 text-zinc-700 hover:bg-red-950/20 hover:text-red-500 hover:border-red-900/30'
            : 'bg-zinc-950 border-zinc-800 text-zinc-700 hover:bg-zinc-900 hover:text-white hover:border-zinc-600'
      }`}
      style={active ? { 
        backgroundColor: color === 'red' ? '#ef4444' : state.clubProfile?.primaryColor,
        borderColor: color === 'red' ? '#f87171' : `${state.clubProfile?.primaryColor}80`,
        boxShadow: `0 10px 20px ${color === 'red' ? '#ef4444' : state.clubProfile?.primaryColor}4D`
      } : {}}
      title={tooltip}
    >
      <Icon size={18} className="group-hover:scale-110 transition-transform" />
    </button>
  );
};

export default SquadList;
