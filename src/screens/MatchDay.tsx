import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Play, FastForward, CheckCircle } from 'lucide-react';

const MatchDay = ({ setCurrentScreen }: { setCurrentScreen: (s: string) => void }) => {
  const { state, dispatch } = useGame();
  const [isSimulating, setIsSimulating] = useState(false);
  const [matchResult, setMatchResult] = useState<{ clubGoals: number, opponentGoals: number } | null>(null);

  const fixture = state.fixtures[state.currentFixtureIndex];
  const startingXI = state.squad.filter(p => p.isStarting);

  if (!fixture) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <CheckCircle size={64} className="text-emerald-500 mb-4" />
        <h2 className="text-3xl font-bold mb-2">The season is over!</h2>
        <p className="text-zinc-400">You have survived (maybe) a season at {state.clubProfile?.name}.</p>
      </div>
    );
  }

  const handleSimulate = () => {
    if (startingXI.length !== 11) {
      alert("You must select exactly 11 players before the match!");
      setCurrentScreen('squad');
      return;
    }

    setIsSimulating(true);
    
    setTimeout(() => {
      const teamRating = startingXI.reduce((acc, p) => acc + p.rating, 0) / 11;
      const moraleBonus = (state.squadMorale - 50) / 10;
      const homeAdvantage = fixture.isHome ? 3 : 0;
      
      let tacticBonus = 0;
      if (state.tactics.mentality === 'Attacking') tacticBonus = 2;
      if (state.tactics.mentality === 'Defensive') tacticBonus = -2;

      const totalClubStrength = teamRating + moraleBonus + homeAdvantage + tacticBonus;
      const totalOpponentStrength = fixture.opponentRating + (fixture.isHome ? 0 : 3);

      const diff = totalClubStrength - totalOpponentStrength;
      
      const rngClub = Math.random() * 20;
      const rngOpponent = Math.random() * 20;

      let clubGoals = 0;
      let opponentGoals = 0;

      const cScore = diff + rngClub;
      const oScore = -diff + rngOpponent;

      if (cScore > 15) clubGoals = 3 + Math.floor(Math.random() * 2);
      else if (cScore > 5) clubGoals = 1 + Math.floor(Math.random() * 2);
      else if (cScore > -5) clubGoals = Math.floor(Math.random() * 2);

      if (oScore > 15) opponentGoals = 3 + Math.floor(Math.random() * 2);
      else if (oScore > 5) opponentGoals = 1 + Math.floor(Math.random() * 2);
      else if (oScore > -5) opponentGoals = Math.floor(Math.random() * 2);

      if (state.tactics.mentality === 'Defensive') {
        clubGoals = Math.max(0, clubGoals - 1);
        opponentGoals = Math.max(0, opponentGoals - 1);
      }
      if (state.tactics.mentality === 'Attacking') {
        opponentGoals += Math.floor(Math.random() * 2);
      }

      setMatchResult({ clubGoals, opponentGoals });
      setIsSimulating(false);
    }, 2000);
  };

  const handleContinue = () => {
    if (matchResult) {
      dispatch({ 
        type: 'SIMULATE_MATCH', 
        payload: { 
          result: matchResult.clubGoals > matchResult.opponentGoals ? 'win' : matchResult.clubGoals < matchResult.opponentGoals ? 'loss' : 'draw',
          opponentId: fixture.opponentId,
          goalsFor: matchResult.clubGoals,
          goalsAgainst: matchResult.opponentGoals,
          subsMade: []
        } 
      });
      setMatchResult(null);
      setCurrentScreen('dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1518605368461-1ee7c532066d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent"></div>

        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: state.clubProfile?.primaryColor }}>Premier League - Week {state.week}</h2>
            <p className="text-zinc-400">{fixture.isHome ? state.clubProfile?.stadium : 'Away'}</p>
          </div>

          <div className="flex items-center justify-center gap-12 mb-16">
            <div className="text-center flex-1">
              <div 
                className="w-32 h-32 mx-auto bg-zinc-800 rounded-full flex items-center justify-center text-4xl font-black mb-4 border-4 border-zinc-700 shadow-lg"
                style={fixture.isHome ? { borderColor: `${state.clubProfile?.primaryColor}4D`, backgroundColor: `${state.clubProfile?.primaryColor}1A` } : {}}
              >
                {fixture.isHome ? state.clubProfile?.shortName.slice(0, 2).toUpperCase() : fixture.opponent.substring(0, 3).toUpperCase()}
              </div>
              <h3 className="text-2xl font-bold">{fixture.isHome ? state.clubProfile?.shortName : fixture.opponent}</h3>
              <p className="text-zinc-500 mt-1">Rating: {fixture.isHome ? Math.round(startingXI.reduce((a,b)=>a+b.rating,0)/11) : fixture.opponentRating}</p>
            </div>

            <div className="text-center">
              {matchResult ? (
                <div className="text-6xl font-black tracking-tighter flex items-center gap-4">
                  <span>{fixture.isHome ? matchResult.clubGoals : matchResult.opponentGoals}</span>
                  <span className="text-zinc-600">-</span>
                  <span>{!fixture.isHome ? matchResult.clubGoals : matchResult.opponentGoals}</span>
                </div>
              ) : (
                <div className="text-4xl font-black text-zinc-600">VS</div>
              )}
            </div>

            <div className="text-center flex-1">
              <div 
                className="w-32 h-32 mx-auto bg-zinc-800 rounded-full flex items-center justify-center text-4xl font-black mb-4 border-4 border-zinc-700 shadow-lg"
                style={!fixture.isHome ? { borderColor: `${state.clubProfile?.primaryColor}4D`, backgroundColor: `${state.clubProfile?.primaryColor}1A` } : {}}
              >
                {!fixture.isHome ? state.clubProfile?.shortName.slice(0, 2).toUpperCase() : fixture.opponent.substring(0, 3).toUpperCase()}
              </div>
              <h3 className="text-2xl font-bold">{!fixture.isHome ? state.clubProfile?.shortName : fixture.opponent}</h3>
              <p className="text-zinc-500 mt-1">Rating: {!fixture.isHome ? Math.round(startingXI.reduce((a,b)=>a+b.rating,0)/11) : fixture.opponentRating}</p>
            </div>
          </div>

          <div className="flex justify-center">
            {!matchResult ? (
              <button 
                onClick={handleSimulate}
                disabled={isSimulating}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all ${
                  isSimulating 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'text-white hover:-translate-y-1'
                }`}
                style={!isSimulating ? { 
                  backgroundColor: state.clubProfile?.primaryColor,
                  boxShadow: `0 0 30px ${state.clubProfile?.primaryColor}66`
                } : {}}
              >
                {isSimulating ? (
                  <>Simulating match...</>
                ) : (
                  <><Play fill="currentColor" /> Play Match</>
                )}
              </button>
            ) : (
              <button 
                onClick={handleContinue}
                className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg bg-white text-black hover:bg-zinc-200 transition-all hover:-translate-y-1"
              >
                <FastForward fill="currentColor" /> Continue
              </button>
            )}
          </div>
          
          {startingXI.length !== 11 && !matchResult && (
            <p className="text-red-500 text-center mt-6 font-medium">You must select exactly 11 players in the Squad menu!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDay;
