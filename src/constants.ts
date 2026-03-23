import { Player, Fixture, Team } from './types';
import { generateFixtures } from './utils';

export const PREMIER_LEAGUE_TEAMS: Team[] = [
  { id: 'ARS', name: 'Arsenal', rating: 86 },
  { id: 'AVL', name: 'Aston Villa', rating: 81 },
  { id: 'BOU', name: 'Bournemouth', rating: 76 },
  { id: 'BRE', name: 'Brentford', rating: 76 },
  { id: 'BHA', name: 'Brighton', rating: 79 },
  { id: 'CHE', name: 'Chelsea', rating: 82 },
  { id: 'CRY', name: 'Crystal Palace', rating: 77 },
  { id: 'EVE', name: 'Everton', rating: 76 },
  { id: 'FUL', name: 'Fulham', rating: 77 },
  { id: 'IPS', name: 'Ipswich Town', rating: 73 },
  { id: 'LEI', name: 'Leicester City', rating: 75 },
  { id: 'LIV', name: 'Liverpool', rating: 85 },
  { id: 'MCI', name: 'Manchester City', rating: 88 },
  { id: 'MUN', name: 'Manchester United', rating: 82 },
  { id: 'NEW', name: 'Newcastle United', rating: 82 },
  { id: 'NFO', name: 'Nottingham Forest', rating: 76 },
  { id: 'SOU', name: 'Southampton', rating: 74 },
  { id: 'TOT', name: 'Tottenham Hotspur', rating: 83 },
  { id: 'WHU', name: 'West Ham United', rating: 79 },
  { id: 'WOL', name: 'Wolverhampton Wanderers', rating: 76 },
];

export const INITIAL_SQUAD: any[] = [
  { id: '1', name: 'Andre Onana', position: 'GK', rating: 82, form: 6, morale: 70, isStarting: true, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 50, shooting: 20, passing: 80, dribbling: 50, defending: 80, physical: 70 } },
  { id: '2', name: 'Altay Bayindir', position: 'GK', rating: 76, form: 5, morale: 60, isStarting: false, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 40, shooting: 10, passing: 60, dribbling: 40, defending: 70, physical: 60 } },
  { id: '3', name: 'Lisandro Martinez', position: 'DEF', rating: 85, form: 7, morale: 80, isStarting: true, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 70, shooting: 50, passing: 80, dribbling: 70, defending: 85, physical: 80 } },
  { id: '4', name: 'Matthijs de Ligt', position: 'DEF', rating: 84, form: 6, morale: 75, isStarting: true, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 60, shooting: 40, passing: 70, dribbling: 60, defending: 85, physical: 85 } },
  { id: '5', name: 'Leny Yoro', position: 'DEF', rating: 78, form: 5, morale: 85, isStarting: false, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 75, shooting: 30, passing: 65, dribbling: 60, defending: 75, physical: 70 } },
  { id: '6', name: 'Diogo Dalot', position: 'DEF', rating: 82, form: 7, morale: 75, isStarting: true, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 80, shooting: 60, passing: 75, dribbling: 75, defending: 75, physical: 70 } },
  { id: '7', name: 'Luke Shaw', position: 'DEF', rating: 81, form: 4, morale: 60, isStarting: true, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 75, shooting: 50, passing: 75, dribbling: 70, defending: 75, physical: 75 } },
  { id: '8', name: 'Harry Maguire', position: 'DEF', rating: 80, form: 6, morale: 70, isStarting: false, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 50, shooting: 40, passing: 65, dribbling: 50, defending: 80, physical: 85 } },
  { id: '9', name: 'Kobbie Mainoo', position: 'MID', rating: 82, form: 8, morale: 90, isStarting: true, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 70, shooting: 65, passing: 80, dribbling: 85, defending: 70, physical: 65 } },
  { id: '10', name: 'Bruno Fernandes', position: 'MID', rating: 88, form: 7, morale: 80, isStarting: true, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 70, shooting: 85, passing: 90, dribbling: 80, defending: 60, physical: 70 } },
  { id: '11', name: 'Manuel Ugarte', position: 'MID', rating: 83, form: 6, morale: 75, isStarting: true, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 70, shooting: 50, passing: 75, dribbling: 70, defending: 85, physical: 85 } },
  { id: '12', name: 'Casemiro', position: 'MID', rating: 81, form: 5, morale: 65, isStarting: false, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 50, shooting: 70, passing: 75, dribbling: 65, defending: 80, physical: 80 } },
  { id: '13', name: 'Mason Mount', position: 'MID', rating: 80, form: 5, morale: 60, isStarting: false, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 75, shooting: 75, passing: 80, dribbling: 80, defending: 60, physical: 65 } },
  { id: '14', name: 'Alejandro Garnacho', position: 'FWD', rating: 83, form: 8, morale: 85, isStarting: true, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 90, shooting: 75, passing: 70, dribbling: 85, defending: 40, physical: 60 } },
  { id: '15', name: 'Marcus Rashford', position: 'FWD', rating: 83, form: 5, morale: 55, isStarting: true, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 85, shooting: 80, passing: 70, dribbling: 80, defending: 40, physical: 70 } },
  { id: '16', name: 'Rasmus Hojlund', position: 'FWD', rating: 81, form: 6, morale: 75, isStarting: true, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 85, shooting: 80, passing: 60, dribbling: 70, defending: 30, physical: 85 } },
  { id: '17', name: 'Joshua Zirkzee', position: 'FWD', rating: 79, form: 5, morale: 70, isStarting: false, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 75, shooting: 75, passing: 75, dribbling: 80, defending: 30, physical: 75 } },
  { id: '18', name: 'Amad Diallo', position: 'FWD', rating: 79, form: 7, morale: 80, isStarting: false, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 85, shooting: 70, passing: 75, dribbling: 85, defending: 40, physical: 55 } },
  { id: '19', name: 'Antony', position: 'FWD', rating: 77, form: 4, morale: 50, isStarting: false, matchesPlayed: 0, injuryWeeks: 0, suspensionWeeks: 0, stamina: 100, attributes: { pace: 80, shooting: 70, passing: 70, dribbling: 80, defending: 40, physical: 60 } },
];

export const INITIAL_FIXTURES: Fixture[] = generateFixtures(PREMIER_LEAGUE_TEAMS);
