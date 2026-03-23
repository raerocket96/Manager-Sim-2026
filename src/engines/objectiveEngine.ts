import { GameState, ClubObjective, ClubProfile } from '../types';

export const generateSeasonObjectives = (club: ClubProfile): ClubObjective[] => {
  const objectives: ClubObjective[] = [];

  // League Objective based on board expectations
  const targetPos = club.difficulty === 1 ? 1 : club.difficulty === 2 ? 4 : club.difficulty === 3 ? 10 : 17;
  objectives.push({
    id: 'league_pos',
    title: `League Position: Top ${targetPos}`,
    description: `The board requires us to finish at least ${targetPos}. this season.`,
    type: 'league' as const,
    target: targetPos,
    progress: 20,
    reward: { boardTrust: 25, psrHeadroom: 40 },
    penalty: { boardTrust: -40, psrHeadroom: -20 },
    deadline: 38,
    status: 'pending' as const
  });

  // Philosophy Objective
  if (club.philosophy.includes('Academy') || club.philosophy.includes('Youth')) {
    objectives.push({
      id: 'academy_focus',
      title: 'Promote 2 Academy Players',
      description: 'The club\'s identity is built on young talent.',
      type: 'academy' as const,
      target: 2,
      progress: 0,
      reward: { clubIdentityScore: 20, boardTrust: 10 },
      penalty: { clubIdentityScore: -15 },
      deadline: 38,
      status: 'pending' as const
    });
  }

  if (club.philosophy.includes('Attacking')) {
    objectives.push({
      id: 'goals_target',
      title: 'Attacking Football',
      description: 'Score at least 65 goals this season.',
      type: 'goals' as const,
      target: 65,
      progress: 0,
      reward: { supporterAtmosphere: 15, clubIdentityScore: 10 },
      penalty: { supporterAtmosphere: -10 },
      deadline: 38,
      status: 'pending' as const
    });
  }

  // Financial Objective for modern era or struggling clubs
  if (club.transferBudget < 50000000) {
    objectives.push({
      id: 'financial_stability',
      title: 'Financial Control',
      description: 'Keep PSR headroom above £10M at season end.',
      type: 'psr' as const,
      target: 10,
      progress: 0,
      reward: { boardTrust: 15, psrHeadroom: 20 },
      penalty: { boardTrust: -20 },
      deadline: 38,
      status: 'pending' as const
    });
  }

  return objectives;
};

export const updateObjectiveProgress = (state: GameState): ClubObjective[] => {
  return state.objectives.map(obj => {
    if (obj.status !== 'pending') return obj;
    
    let newProgress = obj.progress;
    let newStatus: 'pending' | 'completed' | 'failed' = 'pending';

    switch (obj.id) {
      case 'league_pos': {
        const sortedTable = [...state.leagueTable].sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          const gdA = a.gf - a.ga;
          const gdB = b.gf - b.ga;
          if (gdB !== gdA) return gdB - gdA;
          return b.gf - a.gf;
        });
        const pos = sortedTable.findIndex(e => e.teamId === state.selectedClubId) + 1;
        newProgress = pos > 0 ? pos : 20;
        
        if (state.week >= obj.deadline) {
          newStatus = newProgress <= obj.target ? 'completed' : 'failed';
        }
        break;
      }
      case 'goals_target': {
        const entry = state.leagueTable.find(e => e.teamId === state.selectedClubId);
        if (entry) {
          newProgress = entry.gf;
          if (newProgress >= obj.target) {
            newStatus = 'completed';
          } else if (state.week >= obj.deadline) {
            newStatus = 'failed';
          }
        }
        break;
      }
      case 'academy_focus':
        if (obj.progress >= obj.target) {
          newStatus = 'completed';
        } else if (state.week >= obj.deadline) {
          newStatus = 'failed';
        }
        break;
      case 'financial_stability':
        newProgress = state.psrHeadroom;
        if (state.week >= obj.deadline) {
          newStatus = newProgress >= obj.target ? 'completed' : 'failed';
        }
        break;
    }

    return { ...obj, progress: newProgress, status: newStatus };
  });
};
