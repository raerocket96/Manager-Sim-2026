import { Team, Fixture } from './types';

export const generateFixtures = (teams: Team[]): Fixture[] => {
  const fixtures: Fixture[] = [];
  const numTeams = teams.length;
  const numRounds = numTeams - 1;
  const matchesPerRound = numTeams / 2;

  const teamIds = teams.map(t => t.id);
  
  // Create a copy to manipulate
  let currentTeams = [...teamIds];

  let fixtureIdCounter = 1;

  for (let round = 0; round < numRounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const home = currentTeams[match];
      const away = currentTeams[numTeams - 1 - match];

      // Alternate home/away for the first team
      if (match === 0 && round % 2 === 1) {
        fixtures.push({
          id: `f${fixtureIdCounter++}`,
          week: round + 1,
          homeTeamId: away,
          awayTeamId: home,
          played: false,
          homeScore: null,
          awayScore: null
        });
      } else {
        fixtures.push({
          id: `f${fixtureIdCounter++}`,
          week: round + 1,
          homeTeamId: home,
          awayTeamId: away,
          played: false,
          homeScore: null,
          awayScore: null
        });
      }
    }
    // Rotate teams: keep the first team fixed, rotate the rest clockwise
    const first = currentTeams[0];
    const last = currentTeams.pop()!;
    currentTeams.splice(1, 0, last);
  }

  // Second half of the season (reverse fixtures)
  const secondHalfFixtures: Fixture[] = fixtures.map(f => ({
    ...f,
    id: `f${fixtureIdCounter++}`,
    week: f.week + numRounds,
    homeTeamId: f.awayTeamId,
    awayTeamId: f.homeTeamId
  }));

  return [...fixtures, ...secondHalfFixtures];
};
