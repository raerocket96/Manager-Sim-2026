import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PoundSterling, Search, TrendingUp, Users, ShieldAlert, Zap, ChevronRight, X, Check, AlertCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Player, TransferTarget } from '../types';

const Transfers = () => {
  const { state, dispatch } = useGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<TransferTarget | null>(null);
  const [negotiationStep, setNegotiationStep] = useState<'scout' | 'offer' | 'success' | 'fail'>('scout');
  const [offerAmount, setOfferAmount] = useState(0);

  const filteredTargets = state.transferTargets.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartNegotiation = (player: TransferTarget) => {
    setSelectedPlayer(player);
    setOfferAmount(player.value);
    setNegotiationStep(player.isScouted ? 'offer' : 'scout');
  };

  const handleScout = (playerId: string) => {
    dispatch({ type: 'SCOUT_PLAYER', payload: playerId });
    setNegotiationStep('offer');
  };

  const handleMakeOffer = () => {
    if (!selectedPlayer) return;
    
    const successChance = (offerAmount / selectedPlayer.value) * 0.7;
    const success = Math.random() < successChance;
    
    dispatch({ 
      type: 'MAKE_TRANSFER', 
      payload: { 
        player: selectedPlayer, 
        cost: offerAmount, 
        success 
      } 
    });

    setNegotiationStep(success ? 'success' : 'fail');
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">Transfer Market</h2>
        <p className="text-zinc-500 font-bold italic uppercase tracking-widest text-xs">Build the future of {state.clubProfile?.name}</p>
      </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col items-end">
            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">PSR Headroom</span>
            <span className={`text-sm font-black uppercase italic ${state.psrHeadroom < 20 ? 'text-red-500' : 'text-emerald-500'}`}>
              £{state.psrHeadroom}M
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Search & List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search size={18} className="text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="SEARCH FOR PLAYERS OR CLUBS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-3xl py-6 pl-16 pr-8 text-xs font-black uppercase tracking-widest text-white focus:outline-none transition-all placeholder:text-zinc-700"
          style={{ borderColor: state.clubProfile?.primaryColor ? `${state.clubProfile.primaryColor}50` : undefined }}
        />
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTargets.map(player => (
              <motion.div 
                layoutId={player.id}
                key={player.id}
                onClick={() => handleStartNegotiation(player)}
                className="p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] transition-all cursor-pointer group relative overflow-hidden"
                style={{ borderColor: state.clubProfile?.primaryColor ? `${state.clubProfile.primaryColor}30` : undefined }}
              >
                <div 
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-12 -mt-12 transition-all"
                  style={{ backgroundColor: state.clubProfile?.primaryColor ? `${state.clubProfile.primaryColor}10` : 'rgba(220, 38, 38, 0.05)' }}
                ></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-xs font-black text-zinc-500 border border-zinc-800 transition-all"
                      style={{ borderColor: state.clubProfile?.primaryColor ? `${state.clubProfile.primaryColor}30` : undefined }}
                    >
                      {player.position}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">{player.name}</h4>
                      <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{player.club}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white italic">£{player.value}M</p>
                    <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Market Value</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">OVR</span>
                      <span className="text-xs font-black text-zinc-400">{player.isScouted ? player.rating : '??'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Age</span>
                      <span className="text-xs font-black text-zinc-400">{player.age}</span>
                    </div>
                  </div>
                  {!player.isScouted && (
                    <div className="flex items-center gap-2 text-[8px] font-black text-yellow-600 uppercase tracking-widest">
                      <AlertCircle size={10} /> Requires Scouting
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div className="lg:col-span-4 space-y-8">
          <Card title="Market Trends" subtitle="Latest movements" icon={TrendingUp}>
            <div className="space-y-4">
              <TrendItem label="Price Growth: Youth" trend="up" value="+12%" />
              <TrendItem label="Agent Demands" trend="up" value="High" />
              <TrendItem label="PSR Pressure" trend="down" value="-5%" />
            </div>
          </Card>

          <div className="p-8 bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] relative overflow-hidden group">
            <div 
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 transition-all"
              style={{ backgroundColor: state.clubProfile?.primaryColor ? `${state.clubProfile.primaryColor}10` : 'rgba(220, 38, 38, 0.05)' }}
            ></div>
            <ShieldAlert size={48} className="mb-6 opacity-20" style={{ color: state.clubProfile?.primaryColor }} />
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3">PSR Warning</h3>
            <p className="text-zinc-500 font-bold italic text-xs leading-relaxed mb-8">
              Remember that every transfer affects the club's PSR balance. Big signings often require selling existing players.
            </p>
            <button className="w-full py-4 bg-zinc-950 hover:bg-zinc-900 text-zinc-500 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-zinc-800 transition-all">
              View Financials
            </button>
          </div>
        </div>
      </div>

      {/* Negotiation Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlayer(null)}
              className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-zinc-800/50 bg-zinc-950/30 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div 
                    className="w-20 h-20 rounded-3xl flex items-center justify-center border"
                    style={{ backgroundColor: `${state.clubProfile?.primaryColor}10`, borderColor: `${state.clubProfile?.primaryColor}20` }}
                  >
                    <PoundSterling size={32} style={{ color: state.clubProfile?.primaryColor }} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedPlayer.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">{selectedPlayer.club} • {selectedPlayer.position}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPlayer(null)} className="p-4 bg-zinc-950 hover:bg-zinc-900 text-zinc-600 rounded-2xl border border-zinc-800 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-10">
                {negotiationStep === 'scout' && (
                  <div className="text-center py-10">
                    <div className="w-24 h-24 bg-yellow-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-yellow-500/20">
                      <Search size={40} className="text-yellow-500" />
                    </div>
                    <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Limited Insight</h4>
                    <p className="text-zinc-500 mb-10 font-bold italic">We need more information about {selectedPlayer.name} before making an offer. Scouting will reveal exact rating and personality.</p>
                    <button 
                      onClick={() => handleScout(selectedPlayer.id)}
                      className="w-full py-6 bg-yellow-600 hover:bg-yellow-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-yellow-900/20"
                    >
                      Start Scouting (1 Week)
                    </button>
                  </div>
                )}

                {negotiationStep === 'offer' && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl">
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-2">Market Value</p>
                        <p className="text-2xl font-black text-white italic">£{selectedPlayer.value}M</p>
                      </div>
                      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl">
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-2">Agent Ego</p>
                        <p className="text-2xl font-black italic" style={{ color: state.clubProfile?.primaryColor }}>{selectedPlayer.agentEgo}%</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Your Offer</label>
                        <span className="text-3xl font-black text-white italic">£{offerAmount}M</span>
                      </div>
                      <input 
                        type="range" 
                        min={Math.floor(selectedPlayer.value * 0.5)} 
                        max={Math.floor(selectedPlayer.value * 2)} 
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(parseInt(e.target.value))}
                        className="w-full h-2 bg-zinc-950 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: state.clubProfile?.primaryColor }}
                      />
                      <div className="flex justify-between text-[8px] font-black text-zinc-700 uppercase tracking-widest">
                        <span>Low Offer</span>
                        <span>Overprice</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => setSelectedPlayer(null)}
                        className="flex-1 py-6 bg-zinc-950 hover:bg-zinc-900 text-zinc-500 rounded-2xl font-black uppercase tracking-widest border border-zinc-800 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleMakeOffer}
                        disabled={state.psrHeadroom < offerAmount}
                        className="flex-[2] py-6 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl"
                        style={{ 
                          backgroundColor: state.psrHeadroom < offerAmount ? '#27272a' : state.clubProfile?.primaryColor,
                          color: state.psrHeadroom < offerAmount ? '#52525b' : 'white',
                          cursor: state.psrHeadroom < offerAmount ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Send Offer
                      </button>
                    </div>
                    {state.psrHeadroom < offerAmount && (
                      <p className="text-center text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                        Not enough PSR headroom for this offer
                      </p>
                    )}
                  </div>
                )}

                {negotiationStep === 'success' && (
                  <div className="text-center py-10">
                    <div className="w-24 h-24 bg-emerald-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                      <Check size={40} className="text-emerald-500" />
                    </div>
                    <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Offer Accepted!</h4>
                    <p className="text-zinc-500 mb-10 font-bold italic">{selectedPlayer.name} has signed for {state.clubProfile?.name}. He is ready for training immediately.</p>
                    <button 
                      onClick={() => setSelectedPlayer(null)}
                      className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-900/20"
                    >
                      Finalize Transfer
                    </button>
                  </div>
                )}

                {negotiationStep === 'fail' && (
                  <div className="text-center py-10">
                    <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                      <X size={40} className="text-red-500" />
                    </div>
                    <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Offer Rejected</h4>
                    <p className="text-zinc-500 mb-10 font-bold italic">The club or agent felt the offer was too low. They have withdrawn from negotiations for now.</p>
                    <button 
                      onClick={() => setSelectedPlayer(null)}
                      className="w-full py-6 bg-zinc-950 hover:bg-zinc-900 text-zinc-500 rounded-2xl font-black uppercase tracking-widest border border-zinc-800 transition-all"
                    >
                      Close Negotiations
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
              style={{ backgroundColor: `${state.clubProfile?.primaryColor}10`, borderColor: `${state.clubProfile?.primaryColor}20` }}
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

const TrendItem = ({ label, trend, value }: any) => {
  const { state } = useGame();
  return (
    <div className="flex justify-between items-center p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl">
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <span 
          className={`text-xs font-black uppercase italic ${trend === 'up' ? '' : 'text-emerald-500'}`}
          style={trend === 'up' ? { color: state.clubProfile?.primaryColor } : {}}
        >
          {value}
        </span>
        {trend === 'up' ? <TrendingUp size={12} style={{ color: state.clubProfile?.primaryColor }} /> : <TrendingUp size={12} className="text-emerald-500 rotate-180" />}
      </div>
    </div>
  );
};

export default Transfers;
