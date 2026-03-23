import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Tactics, Player } from '../types';
import { Card } from './ui/Card';
import { Target, Settings2, UserCheck, ChevronRight } from 'lucide-react';

const FORMATION_CONFIG: Record<string, Record<string, number>> = {
  '4-4-2': { DEF: 4, MID: 4, FWD: 2, GK: 1 },
  '4-3-3': { DEF: 4, MID: 3, FWD: 3, GK: 1 },
  '4-2-3-1': { DEF: 4, MID: 5, FWD: 1, GK: 1 },
  '3-5-2': { DEF: 3, MID: 5, FWD: 2, GK: 1 }
};

const TacticsBoard = () => {
  const { state, dispatch } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleTacticChange = (key: keyof Tactics, value: string) => {
    dispatch({ type: 'CHANGE_TACTICS', payload: { [key]: value } });
  };

  const applyPreset = (preset: 'High Risk' | 'Balanced' | 'Defensive') => {
    if (preset === 'High Risk') {
      dispatch({ type: 'CHANGE_TACTICS', payload: { mentality: 'Attacking', tempo: 'Fast', pressing: 'High' } });
    } else if (preset === 'Balanced') {
      dispatch({ type: 'CHANGE_TACTICS', payload: { mentality: 'Balanced', tempo: 'Normal', pressing: 'Mid' } });
    } else {
      dispatch({ type: 'CHANGE_TACTICS', payload: { mentality: 'Defensive', tempo: 'Slow', pressing: 'Low' } });
    }
  };

  const handleInstructionChange = (playerId: string, instruction: string) => {
    const newInstructions = { ...state.tactics.playerInstructions, [playerId]: instruction };
    dispatch({ type: 'CHANGE_TACTICS', payload: { playerInstructions: newInstructions } });
  };

  const executeSwap = (idA: string, idB: string) => {
    const playerA = state.squad.find(p => p.id === idA);
    const playerB = state.squad.find(p => p.id === idB);

    if (playerA && playerB) {
      const newSquad = [...state.squad];
      const indexA = newSquad.findIndex(p => p.id === playerA.id);
      const indexB = newSquad.findIndex(p => p.id === playerB.id);

      if (indexA !== -1 && indexB !== -1) {
        // Case 1: Both are starters
        if (playerA.isStarting && playerB.isStarting) {
          if (playerA.position === playerB.position) {
            const temp = newSquad[indexA];
            newSquad[indexA] = newSquad[indexB];
            newSquad[indexB] = temp;
          } else {
            const posA = playerA.position;
            const posB = playerB.position;
            newSquad[indexA] = { ...playerA, position: posB };
            newSquad[indexB] = { ...playerB, position: posA };
          }
        } 
        // Case 2: One starter, one bench (Replacement)
        else if (playerA.isStarting !== playerB.isStarting) {
          const starter = playerA.isStarting ? playerA : playerB;
          const bencher = playerA.isStarting ? playerB : playerA;
          const sIdx = newSquad.findIndex(p => p.id === starter.id);
          const bIdx = newSquad.findIndex(p => p.id === bencher.id);

          newSquad[sIdx] = { ...starter, isStarting: false };
          newSquad[bIdx] = { ...bencher, isStarting: true, position: starter.position };
        }
        // Case 3: Both bench (Swap bench order)
        else {
          const temp = newSquad[indexA];
          newSquad[indexA] = newSquad[indexB];
          newSquad[indexB] = temp;
        }

        dispatch({ type: 'LOAD_GAME', payload: { ...state, squad: newSquad } });
      }
    }
  };

  const sendToBench = (playerId: string) => {
    const player = state.squad.find(p => p.id === playerId);
    if (!player || !player.isStarting) return;

    const benchPlayers = state.squad.filter(p => !p.isStarting && p.injuryWeeks === 0 && p.suspensionWeeks === 0);
    if (benchPlayers.length === 0) return;

    // Find best replacement from bench
    let replacement = benchPlayers.find(p => p.position === player.position);
    if (!replacement) replacement = benchPlayers[0];

    executeSwap(player.id, replacement.id);
    setSelectedPlayer(null);
  };

  const handlePlayerClick = (clickedPlayer: Player) => {
    setSelectedPlayer(clickedPlayer);

    if (!selectedPlayerId) {
      setSelectedPlayerId(clickedPlayer.id);
    } else if (selectedPlayerId === clickedPlayer.id) {
      setSelectedPlayerId(null);
    } else {
      executeSwap(selectedPlayerId, clickedPlayer.id);
      setSelectedPlayerId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, playerId: string) => {
    e.dataTransfer.setData('playerId', playerId);
    setSelectedPlayerId(playerId);
  };

  const handleDrop = (e: React.DragEvent, targetPlayerId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('playerId');
    if (draggedId && draggedId !== targetPlayerId) {
      executeSwap(draggedId, targetPlayerId);
    }
    setSelectedPlayerId(null);
  };

  const handleDropToEmptySlot = (e: React.DragEvent, posType: 'GK' | 'DEF' | 'MID' | 'FWD') => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('playerId');
    if (draggedId) {
      const player = state.squad.find(p => p.id === draggedId);
      if (player) {
        const newSquad = state.squad.map(p => 
          p.id === draggedId ? { ...p, isStarting: true, position: posType } : p
        );
        dispatch({ type: 'LOAD_GAME', payload: { ...state, squad: newSquad } });
      }
    }
    setSelectedPlayerId(null);
  };

  const starters = state.squad.filter(p => p.isStarting);
  const bench = state.squad.filter(p => !p.isStarting && p.injuryWeeks === 0 && p.suspensionWeeks === 0);
  
  const gk = starters.find(p => p.position === 'GK');
  const defs = starters.filter(p => p.position === 'DEF');
  const mids = starters.filter(p => p.position === 'MID');
  const fwds = starters.filter(p => p.position === 'FWD');

  const getPositionStyle = (posType: string, index: number) => {
    const formation = state.tactics.formation;
    
    if (posType === 'GK') return { bottom: '8%', left: '50%' };

    if (formation === '4-4-2') {
      if (posType === 'DEF') {
        const xPos = [15, 38, 62, 85];
        return { bottom: '25%', left: `${xPos[index]}%` };
      }
      if (posType === 'MID') {
        const xPos = [15, 38, 62, 85];
        return { bottom: '50%', left: `${xPos[index]}%` };
      }
      if (posType === 'FWD') {
        const xPos = [35, 65];
        return { bottom: '82%', left: `${xPos[index]}%` };
      }
    }

    if (formation === '4-3-3') {
      if (posType === 'DEF') {
        const xPos = [15, 38, 62, 85];
        return { bottom: '25%', left: `${xPos[index]}%` };
      }
      if (posType === 'MID') {
        const xPos = [25, 50, 75];
        const yPos = [48, 42, 48];
        return { bottom: `${yPos[index]}%`, left: `${xPos[index]}%` };
      }
      if (posType === 'FWD') {
        const xPos = [15, 50, 85];
        const yPos = [78, 85, 78];
        return { bottom: `${yPos[index]}%`, left: `${xPos[index]}%` };
      }
    }

    if (formation === '4-2-3-1') {
      if (posType === 'DEF') {
        const xPos = [15, 38, 62, 85];
        return { bottom: '25%', left: `${xPos[index]}%` };
      }
      if (posType === 'MID') {
        const xPos = [35, 65, 15, 50, 85];
        const yPos = [42, 42, 65, 70, 65];
        return { bottom: `${yPos[index]}%`, left: `${xPos[index]}%` };
      }
      if (posType === 'FWD') {
        return { bottom: '88%', left: '50%' };
      }
    }

    if (formation === '3-5-2') {
      if (posType === 'DEF') {
        const xPos = [25, 50, 75];
        return { bottom: '22%', left: `${xPos[index]}%` };
      }
      if (posType === 'MID') {
        const xPos = [12, 32, 50, 68, 88];
        const yPos = [48, 42, 55, 42, 48];
        return { bottom: `${yPos[index]}%`, left: `${xPos[index]}%` };
      }
      if (posType === 'FWD') {
        const xPos = [35, 65];
        return { bottom: '82%', left: `${xPos[index]}%` };
      }
    }

    return { bottom: '50%', left: '50%' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Pitch View */}
      <Card title="Tactical Setup" subtitle={state.tactics.formation} badge="Live Pitch" className="lg:col-span-8 h-full min-h-[600px]">
        <div className="flex-1 relative bg-zinc-950 border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-inner">
          {/* Pitch Markings */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 border-4 border-white/40 m-4 rounded-lg"></div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-white/40"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-64 h-32 border-2 border-t-0 border-white/40"></div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-32 border-2 border-b-0 border-white/40"></div>
          </div>

          {/* Empty Formation Slots */}
          {Object.entries(FORMATION_CONFIG[state.tactics.formation]).map(([posType, count]) => {
            const currentCount = starters.filter(p => p.position === posType).length;
            if (currentCount < count) {
              return Array.from({ length: count - currentCount }).map((_, i) => {
                const pos = getPositionStyle(posType, currentCount + i);
                return (
                  <div 
                    key={`empty-${posType}-${i}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl border-2 border-dashed border-zinc-800/50 flex items-center justify-center z-0"
                    style={{ left: pos.left, bottom: pos.bottom }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropToEmptySlot(e, posType as any)}
                  >
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></div>
                  </div>
                );
              });
            }
            return null;
          })}

          {/* Players */}
          {starters.map((p, idx) => {
            const posIdx = p.position === 'GK' ? 0 : 
                          p.position === 'DEF' ? defs.indexOf(p) :
                          p.position === 'MID' ? mids.indexOf(p) :
                          fwds.indexOf(p);
            const pos = getPositionStyle(p.position, posIdx);
            return (
              <div 
                key={p.id} 
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out z-10"
                style={{ left: pos.left, bottom: pos.bottom }}
              >
                <PlayerDot 
                  player={p} 
                  isGk={p.position === 'GK'} 
                  onClick={() => handlePlayerClick(p)} 
                  hasInstruction={!!state.tactics.playerInstructions[p.id]} 
                  isSelected={selectedPlayerId === p.id}
                  isDragOver={dragOverId === p.id}
                  onDragStart={(e) => handleDragStart(e, p.id)}
                  onDrop={(e) => handleDrop(e, p.id)}
                  onDragEnter={() => setDragOverId(p.id)}
                  onDragLeave={() => setDragOverId(null)}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Instructions & Settings */}
      <div className="lg:col-span-4 space-y-6">
        <Card title="Tactical Familiarity" subtitle="Team Cohesion" badge={`${state.tacticalFamiliarity}%`}>
          <div className="space-y-2">
            <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 shadow-inner">
              <div 
                className="h-full transition-all duration-1000" 
                style={{ width: `${state.tacticalFamiliarity}%`, backgroundColor: state.clubProfile?.primaryColor || '#10b981' }}
              ></div>
            </div>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Low familiarity leads to more misplaced passes</p>
          </div>
        </Card>

        <Card title="Tactical Presets" subtitle="Quick changes" icon={Target}>
          <div className="grid grid-cols-3 gap-2">
            {(['High Risk', 'Balanced', 'Defensive'] as const).map(preset => (
              <button 
                key={preset}
                onClick={() => applyPreset(preset)}
                className="py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all"
                style={{ borderColor: state.clubProfile?.primaryColor ? `${state.clubProfile.primaryColor}30` : undefined }}
              >
                {preset}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Team Instructions" subtitle="Global Philosophy" icon={Settings2}>
          <div className="space-y-4">
            <TacticSelect 
              label="Formation" 
              value={state.tactics.formation} 
              options={['4-2-3-1', '4-3-3', '4-4-2', '3-5-2']} 
              onChange={(v) => handleTacticChange('formation', v)} 
            />
            <TacticSelect 
              label="Mentality" 
              value={state.tactics.mentality} 
              options={['Attacking', 'Balanced', 'Defensive']} 
              onChange={(v) => handleTacticChange('mentality', v)} 
            />
            <TacticSelect 
              label="Pressing Height" 
              value={state.tactics.pressing} 
              options={['High', 'Mid', 'Low']} 
              onChange={(v) => handleTacticChange('pressing', v)} 
            />
            <TacticSelect 
              label="Passing Style" 
              value={state.tactics.passing} 
              options={['Short', 'Mixed', 'Direct']} 
              onChange={(v) => handleTacticChange('passing', v)} 
            />
            <TacticSelect 
              label="Tempo" 
              value={state.tactics.tempo} 
              options={['Slow', 'Normal', 'Fast']} 
              onChange={(v) => handleTacticChange('tempo', v)} 
            />
          </div>
        </Card>

        {selectedPlayer && (
          <Card title="Player Instruction" subtitle={selectedPlayer.name} badge={selectedPlayer.position} className="animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Role & Task</label>
              <select 
                value={state.tactics.playerInstructions[selectedPlayer.id] || ''}
                onChange={(e) => handleInstructionChange(selectedPlayer.id, e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 text-xs font-bold outline-none transition-all"
                style={{ borderColor: state.clubProfile?.primaryColor ? `${state.clubProfile.primaryColor}50` : undefined }}
              >
                <option value="">Standard Role</option>
                {selectedPlayer.position === 'FWD' && (
                  <>
                    <option value="Get Behind">Run in behind</option>
                    <option value="Target Man">Target man</option>
                    <option value="Drift Wide">Drift wide</option>
                  </>
                )}
                {selectedPlayer.position === 'MID' && (
                  <>
                    <option value="Stay Back">Stay back while attacking</option>
                    <option value="Get Forward">Get forward</option>
                    <option value="Hold Width">Hold width</option>
                    <option value="Free Roam">Free roam</option>
                  </>
                )}
                {selectedPlayer.position === 'DEF' && (
                  <>
                    <option value="Stay Back">Stay back</option>
                    <option value="Overlap">Overlap</option>
                    <option value="Inverted">Inverted</option>
                  </>
                )}
                {selectedPlayer.position === 'GK' && (
                  <>
                    <option value="Sweeper">Sweeper Keeper</option>
                    <option value="Defend">Traditional Keeper</option>
                  </>
                )}
              </select>
              
              {selectedPlayer.isStarting && (
                <button 
                  onClick={() => sendToBench(selectedPlayer.id)}
                  className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-2"
                  style={{ 
                    backgroundColor: state.clubProfile?.primaryColor ? `${state.clubProfile.primaryColor}10` : 'rgba(220, 38, 38, 0.1)',
                    color: state.clubProfile?.primaryColor || '#ef4444',
                    border: `1px solid ${state.clubProfile?.primaryColor ? `${state.clubProfile.primaryColor}30` : 'rgba(239, 68, 68, 0.3)'}`
                  }}
                >
                  Send to bench
                </button>
              )}

              <button 
                onClick={() => setSelectedPlayer(null)}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Close Panel
              </button>
            </div>
          </Card>
        )}

        <Card title="Substitutes" subtitle={`${bench.length} players available`} icon={UserCheck}>
          <div className="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {bench.map(p => (
              <PlayerDot 
                key={p.id}
                player={p}
                isGk={p.position === 'GK'}
                onClick={() => handlePlayerClick(p)}
                hasInstruction={!!state.tactics.playerInstructions[p.id]}
                isSelected={selectedPlayerId === p.id}
                isDragOver={dragOverId === p.id}
                onDragStart={(e) => handleDragStart(e, p.id)}
                onDrop={(e) => handleDrop(e, p.id)}
                onDragEnter={() => setDragOverId(p.id)}
                onDragLeave={() => setDragOverId(null)}
              />
            ))}
            {bench.length === 0 && (
              <div className="col-span-4 py-8 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">No substitutes</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const TacticSelect = ({ label, value, options, onChange }: any) => (
  <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/50 group hover:border-zinc-700 transition-all">
    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer text-right"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt} className="bg-zinc-900">{opt}</option>
      ))}
    </select>
  </div>
);

interface PlayerDotProps {
  key?: string | number;
  player: Player;
  isGk?: boolean;
  onClick: () => void;
  hasInstruction: boolean;
  isSelected: boolean;
  isDragOver?: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
}

const PlayerDot = ({ 
  player, 
  isGk, 
  onClick, 
  hasInstruction, 
  isSelected,
  isDragOver,
  onDragStart,
  onDrop,
  onDragEnter,
  onDragLeave
}: PlayerDotProps) => {
  const { state } = useGame();
  return (
    <div 
      className={`flex flex-col items-center gap-2 cursor-pointer group transition-all ${isDragOver ? 'scale-110' : ''}`} 
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <div 
        className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black shadow-2xl border-2 transition-all group-hover:scale-110 group-hover:-translate-y-1 ${isGk ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'text-white'} ${hasInstruction ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : ''} ${isSelected || isDragOver ? 'ring-4 ring-offset-2 ring-offset-zinc-950 scale-110 -translate-y-1' : ''}`}
        style={{ 
          backgroundColor: !isGk ? (state.clubProfile?.primaryColor ? `${state.clubProfile.primaryColor}20` : 'rgba(220, 38, 38, 0.2)') : undefined,
          borderColor: !isGk ? (state.clubProfile?.primaryColor || '#dc2626') : undefined,
          boxShadow: (isSelected || isDragOver) ? `0 0 20px ${state.clubProfile?.primaryColor || '#ef4444'}80` : undefined,
          '--tw-ring-color': state.clubProfile?.primaryColor || '#ef4444'
        } as any}
      >
        {player.rating}
        {hasInstruction && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-zinc-950"></div>
        )}
      </div>
      <div 
        className={`bg-zinc-900/80 backdrop-blur-sm px-2 py-1 rounded-lg border shadow-xl transition-all ${isSelected || isDragOver ? 'border-transparent' : 'border-zinc-800'}`}
        style={{ 
          backgroundColor: (isSelected || isDragOver) ? state.clubProfile?.primaryColor : undefined,
          borderColor: (isSelected || isDragOver) ? state.clubProfile?.primaryColor : undefined
        }}
      >
        <span className="text-[9px] font-black text-white uppercase tracking-tighter whitespace-nowrap">{player.name.split(' ').pop()}</span>
      </div>
    </div>
  );
};

export default TacticsBoard;
