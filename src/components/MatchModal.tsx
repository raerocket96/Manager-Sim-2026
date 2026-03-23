import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Play, Pause, SkipForward, Users, Settings, Trophy, AlertCircle, AlertTriangle, Zap, ChevronRight, Activity } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Player, Tactics } from '../types';

const MatchModal = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useGame();
  const [minute, setMinute] = useState(0);
  const [events, setEvents] = useState<{min: number, text: string, type: string}[]>([]);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [stats, setStats] = useState({
    player: { shots: 0, onTarget: 0, possession: 50 },
    opponent: { shots: 0, onTarget: 0, possession: 50 }
  });
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(true); // Start paused for team talk
  const [matchPhase, setMatchPhase] = useState<'pre' | 'live' | 'halftime' | 'post'>('pre');
  const [teamTalkEffect, setTeamTalkEffect] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  // Match State
  const [currentTactics, setCurrentTactics] = useState<Tactics>(state.tactics);
  const [onPitch, setOnPitch] = useState<Player[]>(state.squad.filter(p => p.isStarting && p.injuryWeeks === 0 && p.suspensionWeeks === 0));
  const [bench, setBench] = useState<Player[]>(state.squad.filter(p => !p.isStarting && p.injuryWeeks === 0 && p.suspensionWeeks === 0));
  const [subsMade, setSubsMade] = useState<{in: string, out: string}[]>([]);
  
  const [selectedSubOut, setSelectedSubOut] = useState<string | null>(null);
  const [selectedSubIn, setSelectedSubIn] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<'tactics' | 'stats'>('tactics');

  const currentFixture = state.fixtures.find(f => f.week === state.week && (f.homeTeamId === state.selectedClubId || f.awayTeamId === state.selectedClubId));
  const opponentId = currentFixture?.homeTeamId === state.selectedClubId ? currentFixture.awayTeamId : currentFixture?.homeTeamId;
  const opponent = state.teams.find(t => t.id === opponentId);
  const isHome = currentFixture?.homeTeamId === state.selectedClubId;

  const teamRating = onPitch.reduce((acc, p) => acc + p.rating, 0) / 11;
  const opponentRating = opponent ? opponent.rating + (isHome ? 0 : 3) : 80; // Home advantage

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [events]);

  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [playerPositions, setPlayerPositions] = useState<{ id: string, x: number, y: number }[]>([]);

  // Initialize player positions based on formation
  useEffect(() => {
    const formation = currentTactics.formation;
    const defs = onPitch.filter(p => p.position === 'DEF');
    const mids = onPitch.filter(p => p.position === 'MID');
    const fwds = onPitch.filter(p => p.position === 'FWD');
    const gk = onPitch.find(p => p.position === 'GK');

    const initialPositions: { id: string, x: number, y: number }[] = [];

    if (gk) initialPositions.push({ id: gk.id, x: 8, y: 50 });

    const getPos = (p: Player, idx: number) => {
      if (formation === '4-4-2') {
        if (p.position === 'DEF') return { x: 25, y: [20, 40, 60, 80][idx] };
        if (p.position === 'MID') return { x: 55, y: [20, 40, 60, 80][idx] };
        if (p.position === 'FWD') return { x: 85, y: [40, 60][idx] };
      }
      if (formation === '4-3-3') {
        if (p.position === 'DEF') return { x: 25, y: [20, 40, 60, 80][idx] };
        if (p.position === 'MID') return { x: 50, y: [30, 50, 70][idx] };
        if (p.position === 'FWD') return { x: 80, y: [20, 50, 80][idx] };
      }
      if (formation === '4-2-3-1') {
        if (p.position === 'DEF') return { x: 25, y: [20, 40, 60, 80][idx] };
        if (p.position === 'MID') return { x: idx < 2 ? 45 : 70, y: idx < 2 ? [35, 65][idx] : [20, 50, 80][idx - 2] };
        if (p.position === 'FWD') return { x: 90, y: 50 };
      }
      if (formation === '3-5-2') {
        if (p.position === 'DEF') return { x: 20, y: [30, 50, 70][idx] };
        if (p.position === 'MID') return { x: idx < 2 ? 50 : 55, y: idx < 2 ? [15, 85][idx] : [35, 50, 65][idx - 2] };
        if (p.position === 'FWD') return { x: 85, y: [40, 60][idx] };
      }
      return { x: 50, y: 50 };
    };

    onPitch.forEach(p => {
      if (p.position !== 'GK') {
        const posIdx = onPitch.filter(op => op.position === p.position).indexOf(p);
        const pos = getPos(p, posIdx);
        initialPositions.push({ id: p.id, ...pos });
      }
    });

    setPlayerPositions(initialPositions);
  }, [onPitch, currentTactics.formation]);

  useEffect(() => {
    if (minute < 90 && !isPaused && matchPhase === 'live') {
      const timer = setTimeout(() => {
        setMinute(m => m + 1);
        
        // Update player positions slightly for "movement"
        setPlayerPositions(prev => prev.map(p => ({
          ...p,
          x: Math.max(0, Math.min(100, p.x + (Math.random() - 0.5) * 2)),
          y: Math.max(0, Math.min(100, p.y + (Math.random() - 0.5) * 2)),
        })));

        // Move ball
        setBallPos(prev => ({
          x: Math.max(5, Math.min(95, prev.x + (Math.random() - 0.45) * 5)),
          y: Math.max(5, Math.min(95, prev.y + (Math.random() - 0.5) * 5)),
        }));

        if (minute === 45) {
          setIsPaused(true);
          setMatchPhase('halftime');
          return;
        }

        const rng = Math.random();
        const diff = teamRating - opponentRating;
        
        // Tactical modifiers - INCREASED WEIGHTS & COUNTERS
        let attackMod = 0;
        let defenseMod = 0;
        
        // Mentality
        if (currentTactics.mentality === 'Attacking') { attackMod += 0.05; defenseMod -= 0.04; }
        if (currentTactics.mentality === 'Defensive') { attackMod -= 0.04; defenseMod += 0.06; }
        
        // Pressing vs Tempo Counter
        if (currentTactics.pressing === 'High') { 
          attackMod += 0.02; defenseMod -= 0.02; 
          // High press works well against slow tempo
          if (currentTactics.tempo === 'Slow') attackMod += 0.02;
        }
        if (currentTactics.pressing === 'Low') { 
          attackMod -= 0.02; defenseMod += 0.03; 
          // Low block works well against fast tempo (counter-attack)
          if (currentTactics.tempo === 'Fast') attackMod += 0.03;
        }

        // Formation bonus (simplified)
        if (currentTactics.formation === '4-3-3' && currentTactics.mentality === 'Attacking') attackMod += 0.02;
        if (currentTactics.formation === '3-5-2' && currentTactics.pressing === 'High') attackMod += 0.02;

        // Morale and Team Talk effect
        const moraleMod = (state.squadMorale + teamTalkEffect - 50) / 2000;

        // Realistic goal chances per minute (standard is ~0.015 - 0.03 per minute for a team)
        const baseChance = 0.012;
        const playerChance = Math.max(0.002, Math.min(0.06, baseChance + (diff * 0.0015) + attackMod + moraleMod));
        const opponentChance = Math.max(0.002, Math.min(0.06, baseChance - (diff * 0.0015) - defenseMod));

        // Update possession slightly
        setStats(s => {
          const basePossession = 50 + diff;
          const currentPossession = s.player.possession;
          const targetPossession = Math.max(30, Math.min(70, basePossession + (Math.random() - 0.5) * 10));
          const newPossession = currentPossession + (targetPossession - currentPossession) * 0.1;
          return {
            ...s,
            player: { ...s.player, possession: Math.round(newPossession) },
            opponent: { ...s.opponent, possession: 100 - Math.round(newPossession) }
          };
        });

        // Red Card Logic in match
        if (rng < 0.001 && onPitch.length > 7) {
          const redCarded = onPitch[Math.floor(Math.random() * onPitch.length)];
          setEvents(e => [...e, { min: minute, text: `RED CARD! ${redCarded.name} is sent off!`, type: 'goal-opponent' }]);
          setOnPitch(prev => prev.filter(p => p.id !== redCarded.id));
          return;
        }

        if (rng < playerChance) {
          setScore(s => ({ ...s, player: s.player + 1 }));
          setStats(s => ({ ...s, player: { ...s.player, shots: s.player.shots + 1, onTarget: s.player.onTarget + 1 } }));
          const scorers = onPitch.filter(p => p.position === 'FWD' || p.position === 'MID');
          const scorer = scorers.length > 0 ? scorers[Math.floor(Math.random() * scorers.length)].name : (onPitch[Math.floor(Math.random() * onPitch.length)]?.name || state.clubProfile?.shortName);
          setEvents(e => [...e, { min: minute, text: `GOAL! ${scorer} finds the net for ${state.clubProfile?.shortName}!`, type: 'goal-player' }]);
        } else if (rng > 1 - opponentChance) {
          setScore(s => ({ ...s, opponent: s.opponent + 1 }));
          setStats(s => ({ ...s, opponent: { ...s.opponent, shots: s.opponent.shots + 1, onTarget: s.opponent.onTarget + 1 } }));
          setEvents(e => [...e, { min: minute, text: `Goal conceded. ${opponent?.name || 'The opponent'} scores.`, type: 'goal-opponent' }]);
        } else if (rng > 0.4 && rng < 0.42) {
          setStats(s => ({ ...s, player: { ...s.player, shots: s.player.shots + 1, onTarget: Math.random() > 0.5 ? s.player.onTarget + 1 : s.player.onTarget } }));
          setEvents(e => [...e, { min: minute, text: `Big chance for ${state.clubProfile?.shortName}, but the shot goes wide!`, type: 'chance' }]);
        } else if (rng > 0.6 && rng < 0.62) {
          setStats(s => ({ ...s, opponent: { ...s.opponent, shots: s.opponent.shots + 1, onTarget: Math.random() > 0.5 ? s.opponent.onTarget + 1 : s.opponent.onTarget } }));
          setEvents(e => [...e, { min: minute, text: `Dangerous attack from ${opponent?.name || 'the opponent'}, but the defense clears.`, type: 'chance' }]);
        }

      }, 100); 
      return () => clearTimeout(timer);
    } else if (minute >= 90) {
      setIsFinished(true);
      setMatchPhase('post');
      setEvents(e => {
        if (e.length > 0 && e[e.length - 1].type === 'full-time') return e;
        return [...e, { min: 90, text: `FULL TIME! Result: ${score.player} - ${score.opponent}`, type: 'full-time' }];
      });
    }
  }, [minute, isPaused, teamRating, opponentRating, currentTactics, onPitch, opponent, matchPhase, state.squadMorale, teamTalkEffect]);

  const handleFinish = () => {
    let result: 'win' | 'draw' | 'loss' = 'draw';
    if (score.player > score.opponent) result = 'win';
    if (score.player < score.opponent) result = 'loss';
    
    dispatch({ 
      type: 'SIMULATE_MATCH', 
      payload: { 
        result, 
        opponentId: opponentId || 'UNK', 
        goalsFor: score.player, 
        goalsAgainst: score.opponent,
        subsMade,
        teamTalkEffect
      } 
    });
    onClose();
  };

  const handleTeamTalk = (effect: number, text: string) => {
    setTeamTalkEffect(prev => prev + effect);
    setEvents(e => [...e, { min: minute, text: `TEAM TALK: ${text}`, type: 'neutral' }]);
    setMatchPhase('live');
    setIsPaused(false);
  };

  const handleShout = (shout: 'Encourage' | 'Demand More' | 'Focus') => {
    let effect = 0;
    let text = '';
    if (shout === 'Encourage') { effect = 5; text = 'ENCOURAGE: "Come on boys, we can do this!"'; }
    if (shout === 'Demand More') { effect = 8; text = 'DEMAND MORE: "More effort! We need to win those duels!"'; }
    if (shout === 'Focus') { effect = 3; text = 'FOCUS: "Concentrate now, don\'t let them in!"'; }
    
    setTeamTalkEffect(prev => prev + effect);
    setEvents(e => [...e, { min: minute, text, type: 'neutral' }]);
  };

  const handlePostMatchDecision = (type: 'praise_team' | 'criticize_team') => {
    dispatch({ type: 'MATCH_DECISION', payload: { type } });
    handleFinish();
  };

  const handleSub = () => {
    if (!selectedSubIn || !selectedSubOut) return;
    if (subsMade.length >= 5) {
      // Using a simple state for error instead of alert if possible, but for now just translate
      return;
    }

    const playerIn = bench.find(p => p.id === selectedSubIn);
    const playerOut = onPitch.find(p => p.id === selectedSubOut);

    if (playerIn && playerOut) {
      setOnPitch(prev => [...prev.filter(p => p.id !== selectedSubOut), playerIn]);
      setBench(prev => prev.filter(p => p.id !== selectedSubIn)); // Remove from bench so they can't come on again
      setSubsMade(prev => [...prev, { in: selectedSubIn, out: selectedSubOut }]);
      setEvents(e => [...e, { min: minute, text: `SUBSTITUTION: ${playerIn.name} on for ${playerOut.name}.`, type: 'sub' }]);
      
      setSelectedSubIn(null);
      setSelectedSubOut(null);
    }
  };

  if (!currentFixture) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-[2.5rem] text-center max-w-lg">
          <div 
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border"
            style={{ backgroundColor: `${state.clubProfile?.primaryColor}1a`, borderColor: `${state.clubProfile?.primaryColor}33` }}
          >
            <AlertTriangle size={40} style={{ color: state.clubProfile?.primaryColor }} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">No match this week</h2>
          <p className="text-zinc-500 font-bold italic mb-8">There are no scheduled matches in the calendar at the moment.</p>
          <button 
            onClick={onClose} 
            className="w-full py-4 bg-zinc-950 hover:bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] border border-zinc-800 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] w-full flex flex-col overflow-hidden shadow-2xl min-h-[800px]">
        
        {/* Scoreboard - Broadcast Style */}
        <div className="bg-zinc-950/80 p-10 border-b border-zinc-800/50 relative shrink-0">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1.5 rounded-b-full shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            style={{ backgroundColor: state.clubProfile?.primaryColor, boxShadow: `0 0 40px ${state.clubProfile?.primaryColor}80` }}
          ></div>
          
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-10 flex-1">
              <div 
                className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl font-black italic shadow-2xl rotate-3 border-2 border-white/10"
                style={{ backgroundColor: state.clubProfile?.primaryColor, color: state.clubProfile?.secondaryColor }}
              >
                {state.clubProfile?.shortName.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left">
                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{state.clubProfile?.shortName}</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.3em]">{isHome ? 'Home' : 'Away'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 px-16">
              <div className="flex items-center gap-12">
                <span className="text-9xl font-black text-white tabular-nums tracking-tighter italic drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">{score.player}</span>
                <div className="flex flex-col items-center">
                  <div className="px-6 py-2 bg-zinc-900 rounded-full border border-zinc-800 mb-3 shadow-xl">
                    <span className="text-sm font-black uppercase tracking-[0.3em] tabular-nums" style={{ color: state.clubProfile?.primaryColor }}>{minute}'</span>
                  </div>
                  <div className="w-1.5 h-12 bg-gradient-to-b from-zinc-800 to-transparent rounded-full"></div>
                </div>
                <span className="text-9xl font-black text-white tabular-nums tracking-tighter italic drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">{score.opponent}</span>
              </div>
              {isPaused && (
                <div className="flex items-center gap-3 text-yellow-500 text-xs font-black uppercase tracking-[0.4em] animate-pulse bg-yellow-500/5 px-6 py-2 rounded-full border border-yellow-500/20">
                  <Pause size={14} fill="currentColor" /> MATCH PAUSED
                </div>
              )}
            </div>

            <div className="flex items-center gap-10 flex-1 justify-end">
              <div className="text-right">
                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{opponent?.name?.toUpperCase()}</h3>
                <div className="flex items-center gap-2 justify-end">
                  <p className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.3em]">{isHome ? 'Away' : 'Home'}</p>
                  <span className="w-2 h-2 rounded-full bg-zinc-700"></span>
                </div>
              </div>
              <div className="w-24 h-24 bg-zinc-800 rounded-[2rem] flex items-center justify-center text-4xl font-black italic shadow-2xl shadow-black/60 -rotate-3 border-2 border-zinc-700">
                {opponent?.name?.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content: Pitch & Feed */}
          <div className="flex-1 flex flex-col relative border-r border-zinc-800/50 bg-zinc-950">
            {/* 2D Match Visualizer */}
            <div className="h-[380px] bg-[#142d14] relative overflow-hidden shrink-0 group border-b border-zinc-800/50">
              {/* Grass Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.3) 40px, rgba(0,0,0,0.3) 80px)' }}></div>
              
              {/* Pitch Lines */}
              <div className="absolute inset-6 border-2 border-white/10 rounded-sm">
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white/10 rounded-full"></div>
                <div className="absolute top-1/4 bottom-1/4 left-0 w-20 border-2 border-white/10 border-l-0"></div>
                <div className="absolute top-1/4 bottom-1/4 right-0 w-20 border-2 border-white/10 border-r-0"></div>
              </div>

              {/* Players & Ball */}
              {playerPositions.map(p => (
                <motion.div 
                  key={p.id}
                  className="absolute w-4 h-4 rounded-full border-2 border-white shadow-2xl z-20 flex items-center justify-center"
                  animate={{ left: `${p.x}%`, top: `${p.y}%` }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  style={{ transform: 'translate(-50%, -50%)', backgroundColor: state.clubProfile?.primaryColor, boxShadow: `0 0 15px ${state.clubProfile?.primaryColor}80` }}
                >
                  <div className="text-[6px] font-bold text-white pointer-events-none">
                    {onPitch.find(pl => pl.id === p.id)?.name.split(' ').pop()?.substring(0, 3)}
                  </div>
                </motion.div>
              ))}

              <motion.div 
                className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)] z-30 flex items-center justify-center"
                animate={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
                transition={{ duration: 0.3, ease: "linear" }}
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                <div className="w-1 h-1 bg-black/20 rounded-full"></div>
              </motion.div>

              {/* Weather Overlay */}
              {state.weather === 'Rain' && (
                <div className="absolute inset-0 pointer-events-none bg-blue-500/5 animate-pulse">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
                </div>
              )}
            </div>

            {/* Feed - Live Commentary Style */}
            <div ref={feedRef} className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-zinc-950/20 relative">
              {matchPhase === 'pre' && (
                <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 z-40">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl shadow-red-600/10 text-center"
                  >
                    <div 
                      className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border shadow-2xl"
                      style={{ backgroundColor: `${state.clubProfile?.primaryColor}1a`, borderColor: `${state.clubProfile?.primaryColor}33`, boxShadow: `0 0 30px ${state.clubProfile?.primaryColor}33` }}
                    >
                      <MessageSquare size={48} style={{ color: state.clubProfile?.primaryColor }} />
                    </div>
                    <h4 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter italic">Pre-Match Team Talk</h4>
                    <p className="text-zinc-500 mb-10 text-center font-bold italic">Inspire the boys before they step out at {state.clubProfile?.stadium}.</p>
                    <div className="grid grid-cols-1 gap-4 w-full">
                      <button 
                        onClick={() => handleTeamTalk(15, `"This is ${state.clubProfile?.stadium}! Go out there and show them who owns this pitch!"`)} 
                        className="group relative p-6 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 shadow-xl overflow-hidden"
                        style={{ backgroundColor: state.clubProfile?.primaryColor }}
                      >
                        <span className="relative z-10">Passionate</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </button>
                      <button onClick={() => handleTeamTalk(8, '"We have trained well. Follow the plan, and the result will follow."')} className="p-6 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 border border-zinc-700">Calm</button>
                      <button onClick={() => handleTeamTalk(-10, '"If I see one player not giving 100%, you are finished at this club."')} className="p-6 bg-zinc-950 hover:bg-zinc-900 text-red-500 border border-red-900/30 rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1">Aggressive</button>
                    </div>
                  </motion.div>
                </div>
              )}

              {matchPhase === 'halftime' && (
                <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 z-40">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl shadow-yellow-600/10 text-center"
                  >
                    <div className="w-24 h-24 bg-yellow-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-yellow-500/20 shadow-[0_0_30px_rgba(202,138,4,0.2)]">
                      <MessageSquare size={48} className="text-yellow-500" />
                    </div>
                    <h4 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter italic">Half Time: {score.player} - {score.opponent}</h4>
                    <p className="text-zinc-500 mb-10 font-bold italic">Dressing room talk. How do you react to the scoreline?</p>
                    <div className="grid grid-cols-1 gap-4 w-full">
                      {score.player > score.opponent ? (
                        <>
                          <button onClick={() => handleTeamTalk(10, '"Fantastic first half! Keep it up and we will crush them."')} className="p-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1">Praising</button>
                          <button onClick={() => handleTeamTalk(-5, '"Don\'t think this is over. One mistake and they are back in the game."')} className="p-6 bg-yellow-700 hover:bg-yellow-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1">Warning</button>
                        </>
                      ) : score.player === score.opponent ? (
                        <>
                          <button onClick={() => handleTeamTalk(12, '"We are the better team. Go out and prove it in the second half!"')} className="p-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1">Motivating</button>
                          <button onClick={() => handleTeamTalk(5, '"We need to up the tempo. The ball must move faster."')} className="p-6 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 border border-zinc-700">Instructing</button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleTeamTalk(20, `"This is not worthy of ${state.clubProfile?.name}! I expect a total turnaround!"`)} 
                            className="p-6 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 shadow-xl"
                            style={{ backgroundColor: state.clubProfile?.primaryColor }}
                          >
                            Inspiring
                          </button>
                          <button onClick={() => handleTeamTalk(-20, '"You should be ashamed. If this continues, many of you will be gone by summer."')} className="p-6 bg-red-900 hover:bg-red-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1">Furious</button>
                        </>
                      )}
                      <button onClick={() => { setMatchPhase('live'); setIsPaused(false); }} className="p-4 bg-zinc-950 hover:bg-zinc-900 text-zinc-600 rounded-2xl font-black uppercase tracking-widest transition-all text-xs">No comment</button>
                    </div>
                  </motion.div>
                </div>
              )}

              {events.map((ev, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-500 ${
                    ev.type === 'goal-player' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 
                    ev.type === 'goal-opponent' ? 'bg-red-950/40 border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 
                    ev.type === 'full-time' ? 'bg-yellow-950/40 border-yellow-500/30 text-yellow-400 font-black text-center text-xl uppercase tracking-tighter' : 
                    ev.type === 'sub' ? 'bg-blue-950/40 border-blue-500/30 text-blue-400' :
                    'bg-zinc-900/50 border-zinc-800/50 text-zinc-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="font-mono font-bold text-lg opacity-40 shrink-0 w-10">
                      {ev.min}'
                    </div>
                    <div className="flex-1 font-medium leading-relaxed">
                      {ev.text}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="p-8 bg-zinc-950 border-t border-zinc-900/50 flex flex-col gap-6 shrink-0">
            {!isFinished && !isPaused && (
              <div className="grid grid-cols-3 gap-3">
                {(['Encourage', 'Demand More', 'Focus'] as const).map(shout => (
                  <button 
                    key={shout}
                    onClick={() => handleShout(shout)}
                    className="py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-600 transition-all shadow-lg"
                  >
                    {shout}
                  </button>
                ))}
              </div>
            )}
            {!isFinished ? (
              <div className="flex items-center gap-6 w-full">
                <button 
                  onClick={() => setIsPaused(!isPaused)} 
                  className={`flex-1 flex items-center justify-center gap-4 py-5 font-black uppercase tracking-[0.3em] rounded-[2rem] transition-all shadow-2xl text-xs ${isPaused ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'}`}
                >
                  {isPaused ? <><Play size={24} fill="currentColor" /> Resume Match</> : <><Pause size={24} fill="currentColor" /> Pause Match</>}
                </button>
                <div className="px-8 py-5 bg-zinc-900 rounded-[2rem] border border-zinc-800/50 flex items-center gap-8 shadow-xl">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1">Identity</span>
                    <span className="text-white font-black italic">{state.clubIdentityScore}%</span>
                  </div>
                  <div className="w-px h-8 bg-zinc-800"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1">Talk Effect</span>
                    <span className={`font-black italic ${teamTalkEffect > 0 ? 'text-emerald-500' : teamTalkEffect < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                      {teamTalkEffect > 0 ? '+' : ''}{teamTalkEffect}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handlePostMatchDecision('praise_team')}
                    className="py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.3em] rounded-[2rem] transition-all shadow-2xl text-xs"
                  >
                    Praise team
                  </button>
                  <button 
                    onClick={() => handlePostMatchDecision('criticize_team')}
                    className="py-5 bg-red-900 hover:bg-red-800 text-white font-black uppercase tracking-[0.3em] rounded-[2rem] transition-all shadow-2xl text-xs"
                  >
                    Criticize team
                  </button>
                </div>
                <button onClick={handleFinish} className="w-full py-6 bg-zinc-950 hover:bg-zinc-900 text-zinc-500 font-black uppercase tracking-[0.4em] rounded-[2rem] transition-all border border-zinc-800 text-[10px]">
                  Go to dressing room (Neutral)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Tactics & Subs */}
        <div className={`w-96 flex flex-col bg-zinc-950/30 transition-all duration-500 ${!isPaused && !isFinished ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
          <div className="flex border-b border-zinc-800/50">
            <button 
              onClick={() => setRightTab('tactics')}
              className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${rightTab === 'tactics' ? 'bg-zinc-950 border-b-2' : 'text-zinc-500 hover:text-zinc-300'}`}
              style={rightTab === 'tactics' ? { color: state.clubProfile?.primaryColor, borderColor: state.clubProfile?.primaryColor } : {}}
            >
              Tactics
            </button>
            <button 
              onClick={() => setRightTab('stats')}
              className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${rightTab === 'stats' ? 'bg-zinc-950 border-b-2' : 'text-zinc-500 hover:text-zinc-300'}`}
              style={rightTab === 'stats' ? { color: state.clubProfile?.primaryColor, borderColor: state.clubProfile?.primaryColor } : {}}
            >
              Statistics
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
            {rightTab === 'tactics' ? (
              <>
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Zap size={16} style={{ color: state.clubProfile?.primaryColor }} />
                      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Live Tactics</span>
                    </div>
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">{currentTactics.formation}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <TacticButton label="Full Press" active={currentTactics.pressing === 'High'} />
                    <TacticButton label="Counter Focus" active={currentTactics.tempo === 'Fast'} />
                    <TacticButton label="Possession" active={currentTactics.passing === 'Short'} />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Users size={16} style={{ color: state.clubProfile?.primaryColor }} />
                      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Substitutions</span>
                    </div>
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">{subsMade.length} / 5</span>
                  </div>
                  <div className="space-y-4">
                    {onPitch.slice(0, 6).map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => setSelectedSubOut(p.id)}
                        className={`p-5 rounded-[1.5rem] border transition-all cursor-pointer flex items-center justify-between group ${selectedSubOut === p.id ? 'bg-zinc-900' : 'bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700'}`}
                        style={selectedSubOut === p.id ? { borderColor: state.clubProfile?.primaryColor, backgroundColor: `${state.clubProfile?.primaryColor}1a` } : {}}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-[11px] font-black text-zinc-600 border border-zinc-800">
                            {p.position}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-zinc-200 uppercase tracking-tight">{p.name}</span>
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Rating: {p.rating}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-zinc-700 group-hover:text-white transition-colors" style={{ color: selectedSubOut === p.id ? state.clubProfile?.primaryColor : undefined }} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-10">
                <div className="flex items-center gap-3 mb-6">
                  <Activity size={16} style={{ color: state.clubProfile?.primaryColor }} />
                  <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Match Data</span>
                </div>
                <div className="space-y-10">
                  <StatBar label="Shots" v1={stats.player.shots} v2={stats.opponent.shots} />
                  <StatBar label="On Target" v1={stats.player.onTarget} v2={stats.opponent.onTarget} />
                  <StatBar label="Possession" v1={stats.player.possession} v2={stats.opponent.possession} />
                  <StatBar label="xG" v1={(score.player * 0.8 + stats.player.shots * 0.05).toFixed(2)} v2={(score.opponent * 0.7 + stats.opponent.shots * 0.05).toFixed(2)} />
                  <StatBar label="Corners" v1={Math.floor(stats.player.shots / 3)} v2={Math.floor(stats.opponent.shots / 3)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TacticButton = ({ label, active = false }: { label: string, active?: boolean }) => {
  const { state } = useGame();
  return (
    <button 
      className={`w-full p-4 rounded-2xl border transition-all text-left group ${active ? 'text-white shadow-lg' : 'bg-zinc-950/50 border-zinc-800/50 text-zinc-400 hover:border-zinc-700'}`}
      style={active ? { backgroundColor: state.clubProfile?.primaryColor, borderColor: state.clubProfile?.primaryColor, boxShadow: `0 10px 20px ${state.clubProfile?.primaryColor}33` } : {}}
    >
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white animate-pulse' : 'bg-zinc-800'}`}></div>
      </div>
    </button>
  );
};

const StatBar = ({ label, v1, v2 }: { label: string, v1: any, v2: any }) => {
  const { state } = useGame();
  const val1 = parseFloat(v1);
  const val2 = parseFloat(v2);
  const total = val1 + val2 || 1;
  const p1 = (val1 / total) * 100;
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        <span>{v1}</span>
        <span className="text-zinc-400">{label}</span>
        <span>{v2}</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden flex gap-0.5">
        <div className="h-full transition-all duration-1000" style={{ width: `${p1}%`, backgroundColor: state.clubProfile?.primaryColor }}></div>
        <div className="h-full bg-zinc-700 transition-all duration-1000 flex-1"></div>
      </div>
    </div>
  );
};

export default MatchModal;
