import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import SquadList from './components/SquadList';
import TacticsBoard from './components/TacticsBoard';
import TrainingGround from './components/TrainingGround';
import Academy from './components/Academy';
import MedicalCenter from './components/MedicalCenter';
import Facilities from './components/Facilities';
import TrophyRoom from './components/TrophyRoom';
import DressingRoom from './components/DressingRoom';
import Transfers from './components/Transfers';
import SocialFeed from './components/SocialFeed';
import NarrativeFeed from './components/NarrativeFeed';
import HallOfFame from './components/HallOfFame';
import Office from './screens/Office';
import MatchModal from './components/MatchModal';
import LeagueTable from './components/LeagueTable';
import Staff from './components/Staff';
import Commercial from './components/Commercial';
import EventModal from './components/EventModal';
import { PressConferenceModal } from './components/PressConferenceModal';
import SaveLoadModal from './components/SaveLoadModal';
import { ManagerPerk } from './types';

import { FolderOpen } from 'lucide-react';
import { DATABASES } from './constants/databases';

const DatabaseSelection = ({ onOpenLoad }: { onOpenLoad: () => void }) => {
  const { dispatch } = useGame();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const handleSelectYear = (year: number) => {
    dispatch({ type: 'SELECT_DATABASE', payload: { year } });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1ee7c532066d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
      
      <div className="relative z-10 text-center mb-12">
        <div className="w-20 h-20 mx-auto bg-red-600 rounded-3xl flex items-center justify-center font-black text-4xl shadow-[0_0_30px_rgba(200,16,46,0.8)] border-2 border-yellow-500 mb-6 rotate-3">
          RL
        </div>
        <h1 className="font-black text-5xl tracking-tighter text-white uppercase drop-shadow-[0_2px_10px_rgba(200,16,46,0.8)] mb-2">
          Red Legacy
        </h1>
        <p className="text-zinc-400 uppercase tracking-widest font-medium">Choose your football era</p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <button 
          onClick={() => handleSelectYear(2008)}
          className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-red-500 rounded-3xl p-8 text-left transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(200,16,46,0.3)]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-red-600/30"></div>
          <h2 className="text-3xl font-black text-white mb-2">2007/08</h2>
          <h3 className="text-red-500 font-bold uppercase tracking-wider mb-4">Golden Era</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Experience the Premier League at its most iconic. Sir Alex, Wenger, Mourinho and Benitez battle for the throne. 
            Great stars fight to become legends at their respective clubs.
          </p>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Classic Football</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Iconic Teams</span>
          </div>
        </button>

        <button 
          onClick={() => handleSelectYear(2025)}
          className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-yellow-500 rounded-3xl p-8 text-left transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(234,179,8,0.2)]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-yellow-500/20"></div>
          <h2 className="text-3xl font-black text-white mb-2">2024/25</h2>
          <h3 className="text-yellow-500 font-bold uppercase tracking-wider mb-4">Modern Era</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            The modern age of tactical innovation, massive budgets and PSR rules. 
            Can you challenge City's dominance or build a new powerhouse?
          </p>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 px-2 py-1 rounded">Tactical Depth</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 px-2 py-1 rounded">PSR Rules</span>
          </div>
        </button>
      </div>

      <div className="relative z-10 mt-12">
        <button 
          onClick={onOpenLoad}
          className="px-12 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-3"
        >
          <FolderOpen size={16} />
          Load Existing Career
        </button>
      </div>
    </div>
  );
};

const ClubSelection = () => {
  const { state, dispatch } = useGame();
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [selectedPerk, setSelectedPerk] = useState<ManagerPerk>('Tactician');

  const db = DATABASES[state.databaseYear || 2025];
  const selectedClub = db.clubs.find(c => c.id === selectedClubId);

  const handleStart = () => {
    if (selectedClubId) {
      dispatch({ type: 'SELECT_CLUB', payload: { clubId: selectedClubId, perk: selectedPerk } });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8 flex flex-col items-center">
      <div className="max-w-6xl w-full">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Select Club</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">Premier League - Season {state.databaseYear}/{((state.databaseYear || 0) + 1).toString().slice(-2)}</p>
          </div>
          <button 
            onClick={() => dispatch({ type: 'SELECT_DATABASE', payload: { year: 0 } })} // Reset to year selection
            className="px-6 py-2 bg-zinc-900 text-zinc-400 font-bold uppercase tracking-widest text-xs rounded-full hover:bg-zinc-800 transition-colors"
          >
            Change Era
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Club List */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            {db.clubs.map(club => (
              <button
                key={club.id}
                onClick={() => setSelectedClubId(club.id)}
                className={`group relative p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-4 ${selectedClubId === club.id ? 'bg-zinc-900 border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-600'}`}
                style={{ borderColor: selectedClubId === club.id ? club.primaryColor : undefined }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg"
                  style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                >
                  {club.shortName.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-black text-white uppercase tracking-widest text-center">{club.name}</span>
                {selectedClubId === club.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}>✓</div>
                )}
              </button>
            ))}
          </div>

          {/* Club Details & Perks */}
          <div className="space-y-8">
            {selectedClub ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-500" style={{ borderColor: `${selectedClub.primaryColor}33` }}>
                <div className="flex items-center gap-6">
                  <div 
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black shadow-2xl"
                    style={{ backgroundColor: selectedClub.primaryColor, color: selectedClub.secondaryColor }}
                  >
                    {selectedClub.shortName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">{selectedClub.name}</h2>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{selectedClub.stadium}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50">
                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Budget</p>
                    <p className="text-lg font-black text-white italic">£{(selectedClub.transferBudget / 1000000).toFixed(0)}M</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50">
                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Difficulty</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i < selectedClub.difficulty ? '' : 'bg-zinc-800'}`} style={{ backgroundColor: i < selectedClub.difficulty ? selectedClub.primaryColor : undefined }}></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-2">Philosophy</p>
                    <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20">
                      {selectedClub.philosophy}
                    </span>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Board Expectations</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{selectedClub.boardExpectations}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 italic">Select Management Style</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'Tactician', name: 'Tactician', icon: '🎯' },
                      { id: 'Motivator', name: 'Motivator', icon: '🔥' },
                      { id: 'Youth Specialist', name: 'Youth Specialist', icon: '🌱' }
                    ].map(perk => (
                      <button
                        key={perk.id}
                        onClick={() => setSelectedPerk(perk.id as ManagerPerk)}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${selectedPerk === perk.id ? 'bg-white text-black border-white' : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                        style={selectedPerk === perk.id ? { backgroundColor: selectedClub.primaryColor, color: selectedClub.secondaryColor, borderColor: selectedClub.primaryColor } : {}}
                      >
                        <span className="text-xl">{perk.icon}</span>
                        <span className="font-black text-[10px] uppercase tracking-widest">{perk.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleStart}
                  className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
                  style={{ backgroundColor: selectedClub.primaryColor, color: selectedClub.secondaryColor }}
                >
                  Start Career
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-[2.5rem]">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-2xl mb-4">⚽</div>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Select a club to see details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GameContent = () => {
  const { state } = useGame();
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: state.clubProfile?.primaryColor || '#dc2626', borderTopColor: 'transparent' }}></div>
          <p className="text-zinc-400 uppercase tracking-widest font-bold animate-pulse">Loading Red Legacy...</p>
        </div>
      </div>
    );
  }

  if (!state.databaseYear || state.databaseYear === 0) {
    return (
      <>
        <DatabaseSelection onOpenLoad={() => setIsSaveLoadOpen(true)} />
        <SaveLoadModal isOpen={isSaveLoadOpen} onClose={() => setIsSaveLoadOpen(false)} />
      </>
    );
  }

  if (!state.selectedClubId) {
    return <ClubSelection />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <Dashboard setCurrentScreen={setCurrentScreen} />;
      case 'squad': return <SquadList />;
      case 'tactics': return <TacticsBoard />;
      case 'match': return <MatchModal onClose={() => setCurrentScreen('dashboard')} />;
      case 'training': return <TrainingGround />;
      case 'academy': return <Academy />;
      case 'medical': return <MedicalCenter />;
      case 'facilities': return <Facilities />;
      case 'trophies': return <TrophyRoom />;
      case 'dressing': return <DressingRoom />;
      case 'history': return <Office />;
      case 'transfers': return <Transfers />;
      case 'league': return <LeagueTable />;
      case 'staff': return <Staff />;
      case 'commercial': return <Commercial />;
      default: return <Dashboard setCurrentScreen={setCurrentScreen} />;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-red-600/30">
      <Sidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar onPlayMatch={() => setCurrentScreen('match')} onOpenSave={() => setIsSaveLoadOpen(true)} />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="w-full">
              {currentScreen !== 'match' && (
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                      {currentScreen.charAt(0).toUpperCase() + currentScreen.slice(1)}
                    </h2>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
                      {state.clubProfile?.name} Football Operations
                    </p>
                  </div>
                </div>
              )}
              
              {renderScreen()}
            </div>
          </div>

          {/* Right Panel: News & Social (Global) */}
          {currentScreen !== 'match' && (
            <div className="w-[400px] bg-zinc-950 border-l border-zinc-900 flex flex-col h-full shrink-0 z-40 p-8 space-y-8 overflow-y-auto custom-scrollbar hidden xl:flex">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse shadow-lg"
                  style={{ backgroundColor: state.clubProfile?.primaryColor || '#dc2626', boxShadow: `0 0 10px ${state.clubProfile?.primaryColor}80` }}
                ></div>
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Live Feed</span>
              </div>
              
              <div className="space-y-8">
                <div className="bg-zinc-900/30 rounded-[2rem] border border-zinc-800/50 overflow-hidden flex flex-col h-[450px]">
                  <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/50">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest italic">News Feed</h3>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Latest from the club</p>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <NarrativeFeed />
                  </div>
                </div>

                <div className="bg-zinc-900/30 rounded-[2rem] border border-zinc-800/50 overflow-hidden flex flex-col h-[450px]">
                  <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/50">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Social Media</h3>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Fan reactions</p>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <SocialFeed />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Match Modal is now a screen, but we keep the component name for now */}
      <EventModal />
      <PressConferenceModal />
      <SaveLoadModal isOpen={isSaveLoadOpen} onClose={() => setIsSaveLoadOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
