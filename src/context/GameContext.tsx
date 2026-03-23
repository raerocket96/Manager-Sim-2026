import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { GameState, ActionType, NewsItem, Player, Team, Fixture, LeagueTableEntry, TransferTarget, ManagerPerk, Weather, SocialPost, HallOfFameEntry, AcademyPlayer, Staff, Trophy, Facilities, Personality, SaveMetadata } from '../types';
import { DATABASES } from '../constants/databases';
import { generateFixtures } from '../utils';
import { applyRuleEffect } from '../ruleEngine';
import { generateSeasonObjectives, updateObjectiveProgress } from '../engines/objectiveEngine';
import { generateWeeklyEvent } from '../engines/eventEngine';
import { generateMediaReaction, generatePressConference } from '../engines/mediaEngine';

import { INITIAL_SQUAD, PREMIER_LEAGUE_TEAMS, INITIAL_FIXTURES } from '../constants';

const generateAttributes = (rating: number) => ({
  pace: Math.max(50, rating - 10 + Math.floor(Math.random() * 20)),
  shooting: Math.max(50, rating - 10 + Math.floor(Math.random() * 20)),
  passing: Math.max(50, rating - 10 + Math.floor(Math.random() * 20)),
  dribbling: Math.max(50, rating - 10 + Math.floor(Math.random() * 20)),
  defending: Math.max(50, rating - 10 + Math.floor(Math.random() * 20)),
  physical: Math.max(50, rating - 10 + Math.floor(Math.random() * 20)),
});

const createPlayer = (id: string, name: string, position: 'GK' | 'DEF' | 'MID' | 'FWD', rating: number, isStarting: boolean, age: number, potential: number): Player => {
  const personalities: Personality[] = ['Professional', 'Ego', 'Loyal', 'Troublemaker', 'Leader'];
  const personality = personalities[Math.floor(Math.random() * personalities.length)];
  
  return {
    id, name, position, rating, isStarting,
    attributes: generateAttributes(rating),
    stamina: 100, form: 7, morale: 80, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0,
    age, potential, value: Math.floor(rating * rating / 10), wage: Math.floor(rating / 10),
    contractYears: 3 + Math.floor(Math.random() * 3),
    personality,
    traits: [],
    happiness: {
      playingTime: 80,
      wage: 80,
      clubStatus: 80
    }
  };
};

const generateAcademyPlayer = (year: number): AcademyPlayer => {
  const firstNames = ['James', 'Marcus', 'Jack', 'Luke', 'Thomas', 'Daniel', 'William', 'Oliver', 'Harry', 'George'];
  const lastNames = ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright'];
  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  const position = (['GK', 'DEF', 'MID', 'FWD'] as const)[Math.floor(Math.random() * 4)];
  const rating = 55 + Math.floor(Math.random() * 15);
  return {
    id: `acad-${Date.now()}-${Math.random()}`,
    name,
    position,
    rating,
    potential: rating + 15 + Math.floor(Math.random() * 15),
    age: 16 + Math.floor(Math.random() * 3),
    clubIdentityMatch: 70 + Math.floor(Math.random() * 30)
  };
};

const squad2008: Player[] = [
  createPlayer('08-1', 'Van der Sar', 'GK', 89, true, 37, 89),
  createPlayer('08-2', 'Brown', 'DEF', 82, true, 28, 83),
  createPlayer('08-3', 'Ferdinand', 'DEF', 90, true, 29, 91),
  createPlayer('08-4', 'Vidic', 'DEF', 89, true, 26, 91),
  createPlayer('08-5', 'Evra', 'DEF', 87, true, 26, 89),
  createPlayer('08-6', 'Carrick', 'MID', 85, true, 26, 88),
  createPlayer('08-7', 'Scholes', 'MID', 88, true, 33, 88),
  createPlayer('08-8', 'Ronaldo', 'MID', 94, true, 23, 96),
  createPlayer('08-9', 'Giggs', 'MID', 86, true, 34, 86),
  createPlayer('08-10', 'Rooney', 'FWD', 90, true, 22, 94),
  createPlayer('08-11', 'Tevez', 'FWD', 88, true, 24, 91),
  createPlayer('08-12', 'Kuszczak', 'GK', 76, false, 26, 80),
  createPlayer('08-13', "O'Shea", 'DEF', 80, false, 27, 82),
  createPlayer('08-14', 'Evans', 'DEF', 78, false, 20, 85),
  createPlayer('08-15', 'Fletcher', 'MID', 82, false, 24, 86),
  createPlayer('08-16', 'Anderson', 'MID', 80, false, 20, 88),
  createPlayer('08-17', 'Nani', 'MID', 83, false, 21, 90),
  createPlayer('08-18', 'Park', 'MID', 82, false, 27, 84),
  createPlayer('08-19', 'Saha', 'FWD', 81, false, 29, 81),
];

const squad2025: Player[] = INITIAL_SQUAD.map(p => {
  const personalities: Personality[] = ['Professional', 'Ego', 'Loyal', 'Troublemaker', 'Leader'];
  const personality = personalities[Math.floor(Math.random() * personalities.length)];
  
  return {
    ...p,
    age: p.age || 25,
    potential: p.potential || (p.rating + Math.floor(Math.random() * 10)),
    injuryWeeks: p.injuryWeeks || 0,
    suspensionWeeks: p.suspensionWeeks || 0,
    value: p.value || Math.floor(p.rating * p.rating / 10),
    wage: p.wage || Math.floor(p.rating / 10),
    traits: p.traits || [],
    personality: p.personality || personality,
    attributes: p.attributes || generateAttributes(p.rating),
    contractYears: p.contractYears || 3,
    happiness: p.happiness || {
      playingTime: 80,
      wage: 80,
      clubStatus: 80
    }
  };
});

const transferTargets2008: TransferTarget[] = [
  { id: 'tt08-1', name: 'Luka Modric', position: 'MID', rating: 83, value: 25, age: 22, club: 'Dinamo Zagreb', agentEgo: 30, interest: 80 },
  { id: 'tt08-2', name: 'Karim Benzema', position: 'FWD', rating: 82, value: 30, age: 20, club: 'Lyon', agentEgo: 40, interest: 70 },
  { id: 'tt08-3', name: 'Sergio Ramos', position: 'DEF', rating: 86, value: 45, age: 22, club: 'Real Madrid', agentEgo: 70, interest: 30 },
  { id: 'tt08-4', name: 'David Villa', position: 'FWD', rating: 88, value: 50, age: 26, club: 'Valencia', agentEgo: 50, interest: 60 },
  { id: 'tt08-5', name: 'Gareth Bale', position: 'DEF', rating: 78, value: 15, age: 18, club: 'Tottenham', agentEgo: 20, interest: 90 },
];

const transferTargets2025: TransferTarget[] = [
  { id: 'tt25-1', name: 'Alphonso Davies', position: 'DEF', rating: 85, value: 70, age: 23, club: 'Bayern Munich', agentEgo: 80, interest: 70 },
  { id: 'tt25-2', name: 'Florian Wirtz', position: 'MID', rating: 87, value: 110, age: 21, club: 'Bayer Leverkusen', agentEgo: 60, interest: 40 },
  { id: 'tt25-3', name: 'Viktor Gyökeres', position: 'FWD', rating: 84, value: 80, age: 25, club: 'Sporting CP', agentEgo: 40, interest: 85 },
  { id: 'tt25-4', name: 'Nico Williams', position: 'FWD', rating: 85, value: 65, age: 21, club: 'Athletic Bilbao', agentEgo: 90, interest: 30 },
  { id: 'tt25-5', name: 'Joao Neves', position: 'MID', rating: 82, value: 60, age: 19, club: 'PSG', agentEgo: 30, interest: 90 },
  { id: 'tt25-6', name: 'Antonio Silva', position: 'DEF', rating: 81, value: 50, age: 20, club: 'Benfica', agentEgo: 20, interest: 80 },
  { id: 'tt25-7', name: 'Diogo Costa', position: 'GK', rating: 86, value: 55, age: 24, club: 'Porto', agentEgo: 40, interest: 75 },
];

const teams: Team[] = PREMIER_LEAGUE_TEAMS;

const initialLeagueTable = teams.map(t => ({
  teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
}));

const initialState: GameState = {
  databaseYear: null,
  selectedClubId: null,
  clubProfile: null,
  managerPerk: null,
  squad: [],
  academyPlayers: [],
  staff: [],
  trophies: [],
  facilities: {
    stadium: 1,
    training: 1,
    youth: 1,
    medical: 1,
  },
  teams: [],
  fixtures: [],
  leagueTable: [],
  boardTrust: 70,
  supporterAtmosphere: 70,
  clubIdentityScore: 70,
  psrHeadroom: 100,
  squadMorale: 70,
  newsFeed: [],
  socialFeed: [],
  hallOfFame: [],
  week: 1,
  weather: 'Clear',
  tactics: {
    formation: '4-2-3-1',
    mentality: 'Balanced',
    pressing: 'Mid',
    passing: 'Mixed',
    tempo: 'Normal',
    defensiveLine: 'Standard',
    playerInstructions: {}
  },
  captainId: null,
  history: [],
  weeklyIncome: 0,
  transferTargets: [],
  isPaused: false,
  loading: false,
  momentum: 0,
  tacticalFamiliarity: 50,
  boardObjectives: [],
  playerPromises: {},
  rivalryMatches: [],
  trainingIntensity: 'Normal',
  trainingFocus: 'Fitness',
  dressingRoomCliques: [
    { name: 'The Core', playerIds: [], influence: 50 },
    { name: 'The Rebels', playerIds: [], influence: 20 },
    { name: 'The Youth', playerIds: [], influence: 30 }
  ],
  mediaPressure: 30,
  activeEvent: null,
  activePressConference: null,
  mediaHeadlines: [],
  eventCooldowns: {},
  objectives: [],
  moraleConsistency: 0,
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function generateSocialPost(state: GameState, text: string): SocialPost {
  const handles = ['@FootyFan', '@LeagueReport', '@TheTerrace', '@MatchDay', '@GoalAlert'];
  const names = ['Football Fan', 'League Report', 'The Terrace', 'Match Day', 'Goal Alert'];
  const index = Math.floor(Math.random() * handles.length);
  
  return {
    id: Date.now().toString() + Math.random(),
    handle: handles[index],
    name: names[index],
    text,
    likes: Math.floor(Math.random() * 500),
    retweets: Math.floor(Math.random() * 100),
    timestamp: Date.now(),
    isVerified: Math.random() > 0.7
  };
}

function generateGenericPlayerName() {
  const firstNames = ['Thomas', 'Lars', 'Erik', 'Morten', 'Andreas', 'Marcus', 'Daniel', 'Jonas', 'Kristian', 'Magnus', 'Sander', 'Henrik', 'Oliver', 'Filip', 'William', 'Lucas', 'Emil', 'Isak', 'Jakob', 'Noah'];
  const lastNames = ['Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen', 'Nilsen', 'Pedersen', 'Kristiansen', 'Jensen', 'Karlsen', 'Johnsen', 'Pettersen', 'Eriksen', 'Berg', 'Haugen', 'Hagen', 'Johannessen', 'Andreassen', 'Jacobsen', 'Dahl'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function gameReducer(state: GameState, action: ActionType): GameState {
  switch (action.type) {
    case 'SELECT_DATABASE': {
      return {
        ...state,
        databaseYear: action.payload.year,
        loading: false,
      };
    }
    case 'SELECT_CLUB': {
      const { clubId, perk } = action.payload;
      const db = DATABASES[state.databaseYear || 2025];
      const club = db.clubs.find(c => c.id === clubId);
      if (!club) return state;

      const is2008 = state.databaseYear === 2008;
      const hasAuthoredSquad = clubId === 'MUN';

      // Generate Squad
      let squad: Player[] = [];
      if (hasAuthoredSquad && is2008) {
        squad = squad2008.map(p => ({ ...p, contractYears: p.contractYears || 3 }));
      } else if (hasAuthoredSquad && !is2008) {
        squad = squad2025.map(p => ({ ...p, contractYears: p.contractYears || 3 }));
      } else {
        // Generate believable generic squad based on club strength
        const positions: ('GK' | 'DEF' | 'MID' | 'FWD')[] = ['GK', 'GK', 'DEF', 'DEF', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'MID', 'MID', 'MID', 'FWD', 'FWD', 'FWD', 'FWD', 'FWD'];
        squad = positions.map((pos, i) => {
          const rating = club.squadStrength - 5 + Math.floor(Math.random() * 10);
          return createPlayer(`${clubId}-${i}`, generateGenericPlayerName(), pos, rating, i < 11, 18 + Math.floor(Math.random() * 15), rating + Math.floor(Math.random() * 10));
        });
      }

      const initialAcademy = [generateAcademyPlayer(state.databaseYear || 2025), generateAcademyPlayer(state.databaseYear || 2025), generateAcademyPlayer(state.databaseYear || 2025)];
      
      const transferTargets = is2008 ? transferTargets2008 : transferTargets2025;

      const teams: Team[] = db.clubs.map(c => ({ id: c.id, name: c.name, rating: c.squadStrength }));
      const initialLeagueTable = teams.map(t => ({
        teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
      }));

      const fixtures = generateFixtures(teams);

      return {
        ...state,
        selectedClubId: clubId,
        clubProfile: club,
        managerPerk: perk,
        squad,
        transferTargets,
        academyPlayers: initialAcademy,
        teams,
        fixtures,
        leagueTable: initialLeagueTable,
        boardTrust: 70,
        supporterAtmosphere: 70,
        clubIdentityScore: (club.historicalTrophies?.league || 0) > 10 ? 80 : 60,
        psrHeadroom: club.transferBudget / 1000000,
        squadMorale: 70,
        week: 1,
        loading: false,
        objectives: generateSeasonObjectives(club),
        newsFeed: [
          { 
            id: Date.now().toString(), 
            text: `Welcome to ${club.name}. ${club.boardExpectations}`, 
            type: 'neutral', 
            timestamp: Date.now() 
          }
        ],
        socialFeed: [
          generateSocialPost(state, `New manager appointed at ${club.name}! Profile: ${perk}.`),
        ]
      };
    }
    case 'TOGGLE_STARTING': {
      const player = state.squad.find(p => p.id === action.payload);
      if (!player) return state;
      
      const currentlyStarting = state.squad.filter(p => p.isStarting).length;
      
      if (!player.isStarting && currentlyStarting >= 11) {
        return state; // Can't start more than 11
      }
      
      return {
        ...state,
        squad: state.squad.map(p => p.id === action.payload ? { ...p, isStarting: !p.isStarting } : p)
      };
    }
    case 'CHANGE_TACTICS': {
      return {
        ...state,
        tactics: { ...state.tactics, ...action.payload },
        tacticalFamiliarity: Math.max(0, state.tacticalFamiliarity - 15) // Changing tactics hurts familiarity
      };
    }
    case 'SET_CAPTAIN': {
      return {
        ...state,
        captainId: action.payload
      };
    }
    case 'SIMULATE_MATCH': {
      const { result, opponentId, goalsFor, goalsAgainst, subsMade, teamTalkEffect = 0 } = action.payload;
      const opponent = state.teams.find(t => t.id === opponentId);
      
      // KPI Logic
      let boardDelta = 0;
      let fanDelta = 0;
      let moraleDelta = teamTalkEffect;
      let identityDelta = 0;
      let mediaDelta = 0;

      // Identity Scoring based on tactics
      const isAttacking = state.tactics.mentality === 'Attacking';
      const isHighTempo = state.tactics.tempo === 'Fast';
      const startingAcademy = state.squad.filter(p => p.isStarting && p.id.startsWith('acad')).length;
      
      if (isAttacking) identityDelta += 3;
      if (isHighTempo) identityDelta += 2;
      identityDelta += startingAcademy * 4;

      if (result === 'win') {
        boardDelta = 5; fanDelta = 8; moraleDelta += 10; 
        if (goalsFor >= 3) { identityDelta += 5; fanDelta += 5; }
        mediaDelta = -10;
      } else if (result === 'draw') {
        boardDelta = -2; fanDelta = -5; moraleDelta -= 5;
        mediaDelta = 5;
      } else {
        boardDelta = -12; fanDelta = -18; moraleDelta -= 20;
        mediaDelta = 20;
      }

      // Style penalty for defensive wins if club philosophy is attacking
      if (result === 'win' && goalsFor === 1 && state.tactics.mentality === 'Defensive' && state.clubProfile?.philosophy === 'Attacking') {
        identityDelta -= 8;
        fanDelta -= 5;
        boardDelta += 2; // Board cares about results, fans care about style
      }

      // Weather effects
      let staminaModifier = 0;
      let injuryModifier = 0;
      if (state.weather === 'Rain') { staminaModifier = -5; injuryModifier = 0.02; }
      if (state.weather === 'Snow') { staminaModifier = -10; injuryModifier = 0.05; }
      if (state.weather === 'Heatwave') { staminaModifier = -15; injuryModifier = 0.03; }

      const income = Math.floor((state.supporterAtmosphere / 10) + (result === 'win' ? 5 : 2));

      // Update Squad
      const updatedSquad = state.squad.map(p => {
        let newStamina = p.stamina + 20;
        let newMorale = p.morale + moraleDelta;
        let newForm = p.form;
        let newRating = p.rating;
        let newInjuryWeeks = Math.max(0, p.injuryWeeks - 1);
        
        const played = p.isStarting || subsMade.some((s: any) => s.in === p.id);
        
        // Personality logic & Happiness
        if (!played) {
          if (p.personality === 'Ego') newMorale -= 15;
          if (p.personality === 'Professional') newMorale -= 2;
          if (p.personality === 'Leader') newMorale -= 5;
          
          // Happiness decay for lack of playing time
          const happinessPenalty = p.rating > 85 ? 10 : 5;
          p.happiness.playingTime = clamp(p.happiness.playingTime - happinessPenalty);
        } else {
          if (p.personality === 'Loyal') newMorale += 8;
          if (p.personality === 'Professional') newMorale += 3;
          
          // Happiness boost for playing
          p.happiness.playingTime = clamp(p.happiness.playingTime + 5);
        }

        // Morale affects performance indirectly (simulated here by rating drift)
        if (newMorale < 30 && Math.random() < 0.1) {
          newRating = Math.max(p.rating - 1, 40); // Performance drop due to unhappiness
        }

        if (played) {
          newStamina -= (30 + Math.abs(staminaModifier));
          if (result === 'win') newForm = Math.min(10, newForm + 1);
          if (result === 'loss') newForm = Math.max(1, newForm - 1);

          const devChance = state.managerPerk === 'Youth Specialist' ? 0.2 : 0.1;
          if (newRating < p.potential && Math.random() < devChance) {
            newRating += 1;
          }

          if (Math.random() < (0.04 + injuryModifier)) {
            newInjuryWeeks = Math.floor(Math.random() * 4) + 1;
          }
        } else {
          newMorale -= 2;
          newStamina = Math.min(100, newStamina + 15);
        }

        return {
          ...p,
          rating: newRating,
          stamina: clamp(newStamina),
          morale: clamp(newMorale),
          form: newForm,
          injuryWeeks: newInjuryWeeks,
        };
      });

      // Clique Update (Randomly shift players between cliques)
      const updatedCliques = state.dressingRoomCliques.map(clique => {
        const influenceShift = (Math.random() - 0.5) * 5;
        return { ...clique, influence: clamp(clique.influence + influenceShift) };
      });

      // Random Weekly Event Generator (Enhanced)
      let eventNews: NewsItem | null = null;
      let eventEffects: any = {};
      const eventRng = Math.random();
      
      if (eventRng < 0.3) {
        const events = [
          { text: 'Media Storm: Rumors of a dressing room split!', effects: { mediaPressure: 25, squadMorale: -15, dressingRoomCliques: state.dressingRoomCliques.map(c => ({ ...c, influence: c.name === 'The Rebels' ? c.influence + 10 : c.influence })) } },
          { text: 'Board Pressure: The board demands better results immediately.', effects: { boardTrust: -20, mediaPressure: 15 } },
          { text: 'Supporter Protest: Fans are protesting ticket prices.', effects: { supporterAtmosphere: -25, psrHeadroom: state.psrHeadroom - 5 } },
          { text: 'Sponsorship Deal: New funds available from main sponsor.', effects: { psrHeadroom: state.psrHeadroom + 40, boardTrust: 10 } },
          { text: 'Leak: Your tactics were sold to the press by an anonymous player.', effects: { mediaPressure: 20, boardTrust: -10, squadMorale: -5 } },
          { text: 'Academy Breakthrough: A new generation of talent is on the way.', effects: { clubIdentityScore: state.clubIdentityScore + 15, supporterAtmosphere: 10 } },
          { text: 'Agent Trouble: A key player\'s agent publicly demands a new contract.', effects: { mediaPressure: 15, squadMorale: -10 } },
          { text: 'Training Conflict: Two players clashed on the training ground.', effects: { squadMorale: -15, mediaPressure: 10 } },
          { text: 'Legend Criticism: A club legend slams the team\'s effort on TV.', effects: { supporterAtmosphere: -15, mediaPressure: 20, squadMorale: -5 } },
          { text: 'PSR Warning: The Premier League is investigating the club\'s accounts.', effects: { psrHeadroom: state.psrHeadroom - 20, boardTrust: -10 } },
          { text: 'Dressing Room Harmony: The team went out for dinner and bonds are strengthened.', effects: { squadMorale: 20, clubIdentityScore: state.clubIdentityScore + 5 } }
        ];
        const ev = events[Math.floor(Math.random() * events.length)];
        eventNews = { id: `ev-${Date.now()}`, text: ev.text, type: 'urgent', timestamp: Date.now() };
        eventEffects = ev.effects;
      }

      // Update Fixture
      const updatedFixtures = state.fixtures.map(f => {
        if (f.week === state.week && (f.homeTeamId === state.selectedClubId || f.awayTeamId === state.selectedClubId)) {
          return { ...f, played: true, homeScore: f.homeTeamId === state.selectedClubId ? goalsFor : goalsAgainst, awayScore: f.awayTeamId === state.selectedClubId ? goalsFor : goalsAgainst };
        }
        return f;
      });

      // Update League Table
      const updatedTable = [...state.leagueTable].map(entry => {
        if (entry.teamId === state.selectedClubId) {
          return {
            ...entry,
            played: entry.played + 1,
            won: entry.won + (result === 'win' ? 1 : 0),
            drawn: entry.drawn + (result === 'draw' ? 1 : 0),
            lost: entry.lost + (result === 'loss' ? 1 : 0),
            gf: entry.gf + goalsFor,
            ga: entry.ga + goalsAgainst,
            points: entry.points + (result === 'win' ? 3 : result === 'draw' ? 1 : 0)
          };
        }
        if (entry.teamId === opponentId) {
          return {
            ...entry,
            played: entry.played + 1,
            won: entry.won + (result === 'loss' ? 1 : 0),
            drawn: entry.drawn + (result === 'draw' ? 1 : 0),
            lost: entry.lost + (result === 'win' ? 1 : 0),
            gf: entry.gf + goalsAgainst,
            ga: entry.ga + goalsFor,
            points: entry.points + (result === 'loss' ? 3 : result === 'draw' ? 1 : 0)
          };
        }
        return entry;
      });

      // Simulate other matches in the week
      const otherFixtures = state.fixtures.filter(f => f.week === state.week && f.homeTeamId !== state.selectedClubId && f.awayTeamId !== state.selectedClubId);
      otherFixtures.forEach(f => {
        const homeTeam = state.teams.find(t => t.id === f.homeTeamId);
        const awayTeam = state.teams.find(t => t.id === f.awayTeamId);
        if (homeTeam && awayTeam) {
          const homeAdvantage = 3;
          const diff = (homeTeam.rating + homeAdvantage) - awayTeam.rating;
          let hScore = 0; let aScore = 0;
          const rng = Math.random();
          if (diff > 5) {
            if (rng > 0.3) { hScore = 2; aScore = 0; } else if (rng > 0.1) { hScore = 1; aScore = 1; } else { hScore = 0; aScore = 1; }
          } else if (diff < -5) {
            if (rng > 0.3) { hScore = 0; aScore = 2; } else if (rng > 0.1) { hScore = 1; aScore = 1; } else { hScore = 1; aScore = 0; }
          } else {
            if (rng > 0.6) { hScore = 1; aScore = 0; } else if (rng > 0.3) { hScore = 1; aScore = 1; } else { hScore = 0; aScore = 1; }
          }
          
          const hEntry = updatedTable.find(t => t.teamId === f.homeTeamId);
          const aEntry = updatedTable.find(t => t.teamId === f.awayTeamId);
          if (hEntry && aEntry) {
            hEntry.played++; aEntry.played++;
            hEntry.gf += hScore; hEntry.ga += aScore;
            aEntry.gf += aScore; aEntry.ga += hScore;
            if (hScore > aScore) { hEntry.won++; hEntry.points += 3; aEntry.lost++; }
            else if (hScore < aScore) { aEntry.won++; aEntry.points += 3; hEntry.lost++; }
            else { hEntry.drawn++; aEntry.drawn++; hEntry.points++; aEntry.points++; }
          }
        }
      });

      // Sort table
      updatedTable.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const aGd = a.gf - a.ga;
        const bGd = b.gf - b.ga;
        if (bGd !== aGd) return bGd - aGd;
        return b.gf - a.gf;
      });

      const opponentName = opponent?.name || 'Opponent';
      const isRival = state.rivalryMatches.includes(opponentId);
      
      // Momentum logic
      let newMomentum = state.momentum;
      if (result === 'win') newMomentum = Math.min(100, newMomentum + 20);
      else if (result === 'loss') newMomentum = Math.max(-100, newMomentum - 25);
      else newMomentum = Math.max(-100, newMomentum - 5);

      // Familiarity boost
      const newFamiliarity = Math.min(100, state.tacticalFamiliarity + 2);
      
      // Media Reactions
      const newHeadlines = generateMediaReaction(state, { result, opponent: opponentName, goalsFor, goalsAgainst });

      // Morale Consistency
      const newMoraleConsistency = state.squadMorale > 80 ? state.moraleConsistency + 1 : state.moraleConsistency;

      // Generate Weekly Event
      const weeklyEvent = generateWeeklyEvent(state);

      // Press Conference Trigger
      let activePressConference = null;
      if (result === 'loss' && goalsAgainst >= 3) {
        activePressConference = generatePressConference(state, { type: 'post_loss' });
      } else if (state.boardTrust < 35) {
        activePressConference = generatePressConference(state, { type: 'board_pressure' });
      } else if (state.week % 10 === 0) {
        activePressConference = generatePressConference(state, { type: 'pre_match' });
      }

      // Rivalry multiplier
      if (isRival) {
        boardDelta *= 2;
        fanDelta *= 2;
        moraleDelta *= 1.5;
      }

      const newState = {
        ...state,
        ...eventEffects,
        squad: updatedSquad,
        dressingRoomCliques: updatedCliques,
        fixtures: updatedFixtures,
        leagueTable: updatedTable,
        boardTrust: clamp(state.boardTrust + boardDelta + (eventEffects.boardTrust || 0)),
        supporterAtmosphere: clamp(state.supporterAtmosphere + fanDelta + (eventEffects.supporterAtmosphere || 0)),
        squadMorale: clamp(state.squadMorale + moraleDelta + (eventEffects.squadMorale || 0)),
        clubIdentityScore: clamp(state.clubIdentityScore + identityDelta + (eventEffects.clubIdentityScore || 0)),
        psrHeadroom: clamp(state.psrHeadroom + income + (eventEffects.psrHeadroom || 0)),
        mediaPressure: clamp(state.mediaPressure + mediaDelta + (eventEffects.mediaPressure || 0)),
        momentum: newMomentum,
        tacticalFamiliarity: newFamiliarity,
        week: state.week + 1,
        activeEvent: weeklyEvent,
        activePressConference,
        mediaHeadlines: [...newHeadlines, ...state.mediaHeadlines].slice(0, 7),
        moraleConsistency: newMoraleConsistency,
        eventCooldowns: { ...state.eventCooldowns },
        objectives: updateObjectiveProgress({ ...state, leagueTable: updatedTable, squadMorale: clamp(state.squadMorale + moraleDelta + (eventEffects.squadMorale || 0)), moraleConsistency: newMoraleConsistency } as any),
        newsFeed: [
          ...(eventNews ? [eventNews] : []),
          { id: Date.now().toString(), text: `Match Week ${state.week}: ${result.toUpperCase()} against ${opponentName} (${goalsFor}-${goalsAgainst})`, type: result === 'win' ? 'positive' : 'negative', timestamp: Date.now() },
          ...state.newsFeed
        ],
        socialFeed: [generateSocialPost(state, result === 'win' ? `Victory against ${opponentName}!` : `Disappointing against ${opponentName}`), ...state.socialFeed.slice(0, 19)]
      };

      // Apply objective effects if any finished this week
      const finalObjectives = updateObjectiveProgress(newState as any);
      let finalState = { ...newState, objectives: finalObjectives };
      
      finalObjectives.forEach(obj => {
        const oldObj = state.objectives.find(o => o.id === obj.id);
        if (oldObj && oldObj.status === 'pending' && obj.status !== 'pending') {
          const effect = obj.status === 'completed' ? obj.reward : obj.penalty;
          finalState = applyRuleEffect(finalState as any, effect);
          finalState.newsFeed = [
            { 
              id: `obj-${obj.id}-${Date.now()}`, 
              text: `Objective ${obj.status === 'completed' ? 'completed' : 'failed'}: ${obj.title}`, 
              type: obj.status === 'completed' ? 'positive' : 'negative', 
              timestamp: Date.now() 
            },
            ...finalState.newsFeed
          ];
        }
      });

      return finalState as any;
    }
    case 'TRIGGER_EVENT': {
      const { newsText, effects } = action.payload;
      return {
        ...state,
        ...effects,
        newsFeed: [{ id: Date.now().toString(), text: newsText, type: 'urgent', timestamp: Date.now() }, ...state.newsFeed]
      };
    }
    case 'SELL_PLAYER': {
      const { playerId, price } = action.payload;
      const player = state.squad.find(p => p.id === playerId);
      if (!player) return state;

      return {
        ...state,
        squad: state.squad.filter(p => p.id !== playerId),
        psrHeadroom: state.psrHeadroom + price,
        newsFeed: [{ id: Date.now().toString(), text: `Sold ${player.name} for £${price}M.`, type: 'positive', timestamp: Date.now() }, ...state.newsFeed],
        socialFeed: [generateSocialPost(state, `${player.name} sold! Finally getting rid of the deadwood.`), ...state.socialFeed.slice(0, 19)]
      };
    }
    case 'ADD_SOCIAL_POST':
      return { ...state, socialFeed: [action.payload, ...state.socialFeed.slice(0, 19)] };
    case 'ADD_TO_HALL_OF_FAME':
      return { ...state, hallOfFame: [action.payload, ...state.hallOfFame] };
    case 'PRESS_CONFERENCE': {
      const { boardEffect, fanEffect, moraleEffect, newsText } = action.payload;
      const news: NewsItem = {
        id: Date.now().toString(),
        text: newsText,
        type: fanEffect > 0 ? 'positive' : 'negative',
        timestamp: Date.now()
      };
      return {
        ...state,
        boardTrust: clamp(state.boardTrust + boardEffect),
        supporterAtmosphere: clamp(state.supporterAtmosphere + fanEffect),
        squadMorale: clamp(state.squadMorale + moraleEffect),
        newsFeed: [news, ...state.newsFeed]
      };
    }
    case 'MAKE_TRANSFER': {
      const { player, cost, success } = action.payload;
      
      // Transfer Friction Logic
      const agentFee = Math.floor(cost * (player.agentEgo / 100));
      const totalCost = cost + agentFee;
      
      if (!success || state.psrHeadroom < totalCost) {
        const reason = state.psrHeadroom < totalCost ? 'Financial restrictions (PSR)' : 'Negotiation breakdown';
        return {
          ...state,
          newsFeed: [{ id: Date.now().toString(), text: `Transfer for ${player.name} collapsed: ${reason}.`, type: 'negative', timestamp: Date.now() }, ...state.newsFeed]
        };
      }
      
      const personalities: Personality[] = ['Professional', 'Ego', 'Loyal', 'Troublemaker', 'Leader'];
      const personality = personalities[Math.floor(Math.random() * personalities.length)];

      const newPlayer: Player = {
        ...player,
        stamina: 100,
        form: 7,
        morale: 80,
        personality,
        isStarting: false,
        matchesPlayed: 0,
        injuryWeeks: 0,
        suspensionWeeks: 0,
        potential: player.rating + Math.floor(Math.random() * 5),
        wage: Math.floor(player.rating / 10),
        contractYears: 4,
        traits: [],
        attributes: generateAttributes(player.rating),
        happiness: {
          playingTime: 80,
          wage: 80,
          clubStatus: 80
        }
      };

      // Board & Fan reaction to transfer
      let boardDelta = 0;
      let fanDelta = 0;
      let identityDelta = 0;

      if (cost > 80) {
        boardDelta = -10; // High risk
        fanDelta = 15; // Excitement
        identityDelta = -5; // Mercenary risk
      } else if (player.age < 21) {
        boardDelta = 5;
        fanDelta = 10;
        identityDelta = 10; // Youth focus
      }

      return {
        ...state,
        squad: [...state.squad, newPlayer],
        transferTargets: state.transferTargets.filter(t => t.id !== player.id),
        psrHeadroom: clamp(state.psrHeadroom - totalCost),
        clubIdentityScore: clamp(state.clubIdentityScore + identityDelta),
        boardTrust: clamp(state.boardTrust + boardDelta),
        supporterAtmosphere: clamp(state.supporterAtmosphere + fanDelta),
        squadMorale: clamp(state.squadMorale + 5),
        newsFeed: [{ id: Date.now().toString(), text: `Signed ${player.name} for £${cost}M (+£${agentFee}M agent fee).`, type: 'positive', timestamp: Date.now() }, ...state.newsFeed]
      };
    }
    case 'SAVE_GAME': {
      const { name, isAutosave } = action.payload;
      return {
        ...state,
        newsFeed: [
          { 
            id: `save-${Date.now()}`, 
            text: `${isAutosave ? 'Autosave' : 'Game saved'}: ${name || 'Career'}`, 
            type: 'positive', 
            timestamp: Date.now() 
          },
          ...state.newsFeed
        ]
      };
    }
    case 'LOAD_GAME': {
      return { ...action.payload, loading: false };
    }
    case 'SET_TRANSFER_LIST':
      return {
        ...state,
        squad: state.squad.map(p => p.id === action.payload.playerId ? { ...p, isOnTransferList: action.payload.status } : p)
      };
    case 'RENEW_CONTRACT':
      return {
        ...state,
        squad: state.squad.map(p => p.id === action.payload.playerId ? { ...p, wage: action.payload.wage, contractYears: action.payload.years } : p),
        psrHeadroom: state.psrHeadroom - (action.payload.wage * 0.5) // Signing bonus
      };
    case 'PROMOTE_ACADEMY': {
      const acadPlayer = state.academyPlayers.find(p => p.id === action.payload);
      if (!acadPlayer) return state;
      
      // If squad is full, release the worst player (lowest rating) who isn't starting
      let updatedSquad = [...state.squad];
      if (updatedSquad.length >= 25) {
        const worstPlayer = updatedSquad
          .filter(p => !p.isStarting)
          .sort((a, b) => a.rating - b.rating)[0];
        
        if (worstPlayer) {
          updatedSquad = updatedSquad.filter(p => p.id !== worstPlayer.id);
        } else {
          // If all are starting (unlikely), release the worst overall
          const absoluteWorst = updatedSquad.sort((a, b) => a.rating - b.rating)[0];
          updatedSquad = updatedSquad.filter(p => p.id !== absoluteWorst.id);
        }
      }

      const personalities: Personality[] = ['Professional', 'Ego', 'Loyal', 'Troublemaker', 'Leader'];
      const personality = personalities[Math.floor(Math.random() * personalities.length)];

      const newPlayer: Player = {
        ...acadPlayer,
        stamina: 100, form: 7, morale: 90, isStarting: false, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0,
        value: Math.floor(acadPlayer.rating * acadPlayer.rating / 10),
        wage: Math.floor(acadPlayer.rating / 15),
        contractYears: 5,
        personality,
        traits: [],
        attributes: generateAttributes(acadPlayer.rating),
        happiness: {
          playingTime: 100,
          wage: 100,
          clubStatus: 100
        }
      };
      
      const updatedObjectives = state.objectives.map(obj => {
        if (obj.id === 'academy2') {
          return { ...obj, progress: Math.min(obj.target, obj.progress + 1) };
        }
        return obj;
      });

      return {
        ...state,
        squad: [...updatedSquad, newPlayer],
        academyPlayers: state.academyPlayers.filter(p => p.id !== action.payload),
        clubIdentityScore: clamp(state.clubIdentityScore + 10),
        objectives: updatedObjectives,
        newsFeed: [{ id: Date.now().toString(), text: `${acadPlayer.name} promoted from the academy!`, type: 'positive', timestamp: Date.now() }, ...state.newsFeed]
      };
    }
    case 'SET_TRAINING_FOCUS':
      return {
        ...state,
        squad: state.squad.map(p => p.id === action.payload.playerId ? { ...p, trainingFocus: action.payload.focus } : p)
      };
    case 'UPGRADE_FACILITY': {
      const type = action.payload;
      const currentLevel = state.facilities[type];
      const cost = currentLevel * 50;
      if (state.psrHeadroom < cost) return state;
      return {
        ...state,
        facilities: { ...state.facilities, [type]: currentLevel + 1 },
        psrHeadroom: state.psrHeadroom - cost,
        newsFeed: [{ id: Date.now().toString(), text: `Oppgraderte ${type}-fasiliteter til nivå ${currentLevel + 1}.`, type: 'positive', timestamp: Date.now() }, ...state.newsFeed]
      };
    }
    case 'SCOUT_PLAYER':
      return {
        ...state,
        transferTargets: state.transferTargets.map(t => t.id === action.payload ? { ...t, isScouted: true } : t)
      };
    case 'MEDICAL_TREATMENT': {
      const { playerId, type } = action.payload;
      return {
        ...state,
        squad: state.squad.map(p => {
          if (p.id !== playerId) return p;
          if (type === 'injection') return { ...p, injuryWeeks: 0, morale: p.morale - 10, stamina: p.stamina - 20 };
          return { ...p, stamina: Math.min(100, p.stamina + 30) };
        })
      };
    }
    case 'NEW_SEASON': {
      const retiredPlayers = state.squad.filter(p => p.age > 34 && Math.random() > 0.5);
      const remainingSquad = state.squad.filter(p => !retiredPlayers.some(rp => rp.id === p.id)).map(p => ({
        ...p,
        age: p.age + 1,
        contractYears: Math.max(0, p.contractYears - 1),
        matchesPlayed: 0
      }));
      
      const newAcademy = [generateAcademyPlayer(state.databaseYear || 2025), generateAcademyPlayer(state.databaseYear || 2025), generateAcademyPlayer(state.databaseYear || 2025)];
      
      const newFixtures = generateFixtures(state.teams);
      const newTable = state.teams.map(t => ({
        teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
      }));

      return {
        ...state,
        week: 1,
        squad: remainingSquad,
        academyPlayers: newAcademy,
        fixtures: newFixtures,
        leagueTable: newTable,
        newsFeed: [
          { id: Date.now().toString(), text: 'Ny sesong er i gang. Blanke ark.', type: 'neutral', timestamp: Date.now() },
          ...retiredPlayers.map(p => ({ id: `ret-${p.id}`, text: `${p.name} har lagt opp.`, type: 'neutral' as const, timestamp: Date.now() }))
        ]
      };
    }
    case 'ADD_NEWS':
      return { ...state, newsFeed: [action.payload, ...state.newsFeed] };
    case 'PLAYER_ACTION': {
      const { playerId, action: pAction } = action.payload;
      return {
        ...state,
        squad: state.squad.map(p => {
          if (p.id !== playerId) return p;
          if (pAction === 'fine') return { ...p, morale: clamp(p.morale - 20) };
          if (pAction === 'praise') return { ...p, morale: clamp(p.morale + 15) };
          return p;
        }),
        squadMorale: clamp(state.squadMorale + (pAction === 'fine' ? -5 : 2))
      };
    }
    case 'QUICK_DECISION': {
      const { type } = action.payload;
      if (type === 'morale_boost') {
        return {
          ...state,
          psrHeadroom: state.psrHeadroom - 10,
          squadMorale: clamp(state.squadMorale + 15),
          boardTrust: clamp(state.boardTrust - 5)
        };
      }
      if (type === 'rest_squad') {
        return {
          ...state,
          squad: state.squad.map(p => ({ ...p, stamina: 100 })),
          tacticalFamiliarity: Math.max(0, state.tacticalFamiliarity - 10)
        };
      }
      if (type === 'press_conf') {
        return {
          ...state,
          mediaPressure: clamp(state.mediaPressure - 20),
          supporterAtmosphere: clamp(state.supporterAtmosphere + 5)
        };
      }
      return state;
    }
    case 'INFRASTRUCTURE_UPGRADE': {
      const { type } = action.payload;
      const cost = 50;
      if (state.psrHeadroom < cost) return state;
      return {
        ...state,
        psrHeadroom: state.psrHeadroom - cost,
        facilities: { ...state.facilities, [type]: state.facilities[type as keyof typeof state.facilities] + 1 },
        boardTrust: clamp(state.boardTrust + 10)
      };
    }
    case 'SET_TRAINING_CONFIG': {
      return {
        ...state,
        trainingIntensity: action.payload.intensity || state.trainingIntensity,
        trainingFocus: action.payload.focus || state.trainingFocus
      };
    }
    case 'MEDICAL_ACTION': {
      const { playerId, type } = action.payload;
      return {
        ...state,
        squad: state.squad.map(p => {
          if (p.id !== playerId) return p;
          if (type === 'specialist') return { ...p, injuryWeeks: 0 };
          if (type === 'force_play') return { ...p, injuryWeeks: 0, stamina: 50, morale: clamp(p.morale - 10) };
          return p;
        }),
        psrHeadroom: state.psrHeadroom - (type === 'specialist' ? 15 : 0)
      };
    }
    case 'ACADEMY_ACTION': {
      const { type, payload } = action.payload;
      if (type === 'invest') {
        if (state.psrHeadroom < 10) return state;
        return {
          ...state,
          psrHeadroom: state.psrHeadroom - 10,
          clubIdentityScore: clamp(state.clubIdentityScore + 5),
          newsFeed: [{ id: Date.now().toString(), text: 'Investerte £10M i akademi-scouting.', type: 'positive', timestamp: Date.now() }, ...state.newsFeed]
        };
      }
      if (type === 'mentor') {
        const playerId = payload;
        return {
          ...state,
          academyPlayers: state.academyPlayers.map(p => p.id === playerId ? { ...p, potential: Math.min(99, p.potential + 2) } : p),
          newsFeed: [{ id: Date.now().toString(), text: 'Tildelte mentor til akademispiller.', type: 'neutral', timestamp: Date.now() }, ...state.newsFeed]
        };
      }
      return state;
    }
    case 'DRESSING_ROOM_ACTION': {
      const { type } = action.payload;
      if (type === 'resolve_conflict') return { ...state, squadMorale: clamp(state.squadMorale + 10), mediaPressure: clamp(state.mediaPressure + 5) };
      if (type === 'punish') return { ...state, squadMorale: clamp(state.squadMorale - 5), boardTrust: clamp(state.boardTrust + 5) };
      if (type === 'leadership') return { ...state, clubIdentityScore: clamp(state.clubIdentityScore + 5) };
      return state;
    }
    case 'MATCH_DECISION': {
      const { type } = action.payload;
      if (type === 'praise_team') return { ...state, squadMorale: clamp(state.squadMorale + 10) };
      if (type === 'criticize_team') return { ...state, squadMorale: clamp(state.squadMorale - 10), boardTrust: clamp(state.boardTrust + 5) };
      return state;
    }
    case 'RESOLVE_PRESS_QUESTION': {
      const { questionIndex, optionIndex } = action.payload;
      if (!state.activePressConference) return state;
      
      const option = state.activePressConference.questions[questionIndex].options[optionIndex];
      const newState = applyRuleEffect(state as any, option.effects);
      
      // Remove the question or close if done
      const updatedQuestions = [...state.activePressConference.questions];
      updatedQuestions.splice(questionIndex, 1);
      
      if (updatedQuestions.length === 0) {
        return { ...newState, activePressConference: null };
      }
      
      return { ...newState, activePressConference: { ...state.activePressConference, questions: updatedQuestions } };
    }
    case 'RESOLVE_EVENT': {
      const { choiceIndex } = action.payload;
      if (!state.activeEvent) return state;
      const choice = state.activeEvent.choices[choiceIndex];
      const baseId = state.activeEvent.id.split('_')[0];
      const newState = applyRuleEffect(state, choice.effects);
      return {
        ...newState,
        activeEvent: null,
        eventCooldowns: {
          ...state.eventCooldowns,
          [baseId]: state.week + 4 // 4 week cooldown
        },
        newsFeed: [
          { id: Date.now().toString(), text: `Beslutning tatt: ${choice.label}`, type: 'neutral', timestamp: Date.now() },
          ...state.newsFeed
        ]
      };
    }
    case 'UPDATE_OBJECTIVES': {
      const updatedObjectives = updateObjectiveProgress(state);
      let newState = { ...state, objectives: updatedObjectives };
      
      // Apply rewards/penalties for newly completed/failed objectives
      updatedObjectives.forEach((obj, idx) => {
        const oldObj = state.objectives.find(o => o.id === obj.id);
        if (oldObj && oldObj.status === 'pending' && obj.status !== 'pending') {
          const effect = obj.status === 'completed' ? obj.reward : obj.penalty;
          newState = applyRuleEffect(newState, effect);
          newState.newsFeed = [
            { 
              id: `obj-${obj.id}-${Date.now()}`, 
              text: `Mål ${obj.status === 'completed' ? 'fullført' : 'mislyktes'}: ${obj.title}`, 
              type: obj.status === 'completed' ? 'positive' : 'negative', 
              timestamp: Date.now() 
            },
            ...newState.newsFeed
          ];
        }
      });

      return newState;
    }
    case 'ADD_OBJECTIVE': {
      return {
        ...state,
        objectives: [...state.objectives, action.payload]
      };
    }
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<ActionType>;
  saveGame: (name: string, isAutosave?: boolean) => void;
  loadGame: (saveId: string) => boolean;
  deleteSave: (saveId: string) => void;
  getSaveSlots: () => SaveMetadata[];
}>({ 
  state: initialState, 
  dispatch: () => null,
  saveGame: () => {},
  loadGame: () => false,
  deleteSave: () => {},
  getSaveSlots: () => []
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const getSaveSlots = (): SaveMetadata[] => {
    try {
      const index = localStorage.getItem('fm_save_index');
      return index ? JSON.parse(index) : [];
    } catch (e) {
      console.error('Failed to parse save index', e);
      return [];
    }
  };

  const saveGame = (name: string, isAutosave: boolean = false) => {
    if (!state.selectedClubId) return;

    const saveId = isAutosave ? 'autosave' : `save_${Date.now()}`;
    const metadata: SaveMetadata = {
      id: saveId,
      name: isAutosave ? 'Autosave' : (name || `Save ${new Date().toLocaleString()}`),
      clubName: state.clubProfile?.name || 'Unknown Club',
      databaseYear: state.databaseYear || 2025,
      week: state.week,
      timestamp: Date.now(),
      isAutosave
    };

    try {
      // Save the actual state
      localStorage.setItem(`fm_save_data_${saveId}`, JSON.stringify(state));

      // Update the index
      const slots = getSaveSlots();
      const existingIndex = slots.findIndex(s => s.id === saveId);
      
      if (existingIndex >= 0) {
        slots[existingIndex] = metadata;
      } else {
        slots.unshift(metadata);
      }

      localStorage.setItem('fm_save_index', JSON.stringify(slots));
      dispatch({ type: 'SAVE_GAME', payload: { name: metadata.name, isAutosave } });
    } catch (e) {
      console.error('Failed to save game', e);
    }
  };

  const loadGame = (saveId: string): boolean => {
    try {
      const data = localStorage.getItem(`fm_save_data_${saveId}`);
      if (!data) return false;

      const parsedState = JSON.parse(data) as GameState;
      
      // Basic validation
      if (!parsedState.selectedClubId || !parsedState.squad) {
        throw new Error('Invalid save data');
      }

      dispatch({ type: 'LOAD_GAME', payload: parsedState });
      return true;
    } catch (e) {
      console.error('Failed to load game', e);
      return false;
    }
  };

  const deleteSave = (saveId: string) => {
    try {
      localStorage.removeItem(`fm_save_data_${saveId}`);
      const slots = getSaveSlots().filter(s => s.id !== saveId);
      localStorage.setItem('fm_save_index', JSON.stringify(slots));
    } catch (e) {
      console.error('Failed to delete save', e);
    }
  };

  // Autosave triggers
  const lastAutosaveRef = React.useRef<{ week: number, matchId?: string, lastEventId?: string, inPressConf?: boolean }>({ week: state.week });

  useEffect(() => {
    // Try to load the most recent save on mount
    const slots = getSaveSlots();
    if (slots.length > 0) {
      // Sort by timestamp and load the most recent one
      const mostRecent = [...slots].sort((a, b) => b.timestamp - a.timestamp)[0];
      loadGame(mostRecent.id);
    }
  }, []);

  useEffect(() => {
    if (!state.selectedClubId) return;

    const currentMatchId = state.matchResult?.id;
    const currentEventId = state.activeEvent?.id;
    const inPressConf = !!state.activePressConference;
    
    // Autosave when:
    // 1. Week changes
    // 2. Match completes
    // 3. Event is resolved
    // 4. Press conference is resolved
    const shouldAutosave = 
      state.week !== lastAutosaveRef.current.week || 
      (currentMatchId && currentMatchId !== lastAutosaveRef.current.matchId) ||
      (!currentEventId && lastAutosaveRef.current.lastEventId) ||
      (!inPressConf && lastAutosaveRef.current.inPressConf);

    if (shouldAutosave) {
      saveGame('Autosave', true);
      lastAutosaveRef.current = { 
        week: state.week, 
        matchId: currentMatchId,
        lastEventId: currentEventId,
        inPressConf
      };
    } else {
      // Update refs for tracking
      lastAutosaveRef.current.lastEventId = currentEventId;
      lastAutosaveRef.current.inPressConf = inPressConf;
    }
  }, [state.week, state.matchResult, state.activeEvent, state.activePressConference]);

  return (
    <GameContext.Provider value={{ state, dispatch, saveGame, loadGame, deleteSave, getSaveSlots }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
