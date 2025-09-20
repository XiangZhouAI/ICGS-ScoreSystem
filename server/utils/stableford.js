/**
 * Calculate Stableford points based on net score vs par
 * Updated scoring system:
 * -4 or better → 6 pts (Eagle or better)
 * -3 → 5 pts
 * -2 → 4 pts (Eagle on par 5)
 * -1 → 3 pts (Birdie)
 * Par → 2 pts
 * +1 → 1 pt (Bogey)
 * +2 or worse → 0 pts (Double bogey or worse)
 */
function calculateStablefordPoints(netStrokes, par) {
  const scoreToPar = netStrokes - par;
  
  if (scoreToPar <= -4) return 6;
  if (scoreToPar === -3) return 5;
  if (scoreToPar === -2) return 4;
  if (scoreToPar === -1) return 3;
  if (scoreToPar === 0) return 2;
  if (scoreToPar === 1) return 1;
  return 0; // +2 or worse
}

/**
 * Calculate playing handicap strokes for a hole
 */
function getHandicapStrokes(playingHandicap, strokeIndex) {
  const fullStrokes = Math.floor(playingHandicap / 18);
  const remainingStrokes = playingHandicap % 18;
  
  return fullStrokes + (strokeIndex <= remainingStrokes ? 1 : 0);
}

/**
 * Calculate net strokes for a hole
 */
function calculateNetStrokes(grossStrokes, playingHandicap, strokeIndex) {
  const handicapStrokes = getHandicapStrokes(playingHandicap, strokeIndex);
  return Math.max(1, grossStrokes - handicapStrokes);
}

/**
 * Process a complete scorecard
 */
function processScorecard(holes, playingHandicap, courseHoles) {
  return holes.map(hole => {
    const courseHole = courseHoles.find(ch => ch.number === hole.hole);
    if (!courseHole) throw new Error(`Course hole ${hole.hole} not found`);
    
    const netStrokes = calculateNetStrokes(
      hole.strokes, 
      playingHandicap, 
      courseHole.strokeIndexMen // TODO: Support ladies tees
    );
    
    const stablefordPoints = calculateStablefordPoints(netStrokes, courseHole.par);
    
    return {
      ...hole,
      par: courseHole.par,
      strokeIndex: courseHole.strokeIndexMen,
      playingHandicap,
      netStrokes,
      stablefordPoints
    };
  });
}

/**
 * Calculate prize statistics
 */
function calculatePrizeStats(scores) {
  const stats = {
    mostBirdies: { count: 0, players: [] },
    mostBogeys: { count: 0, players: [] },
    mostPars: { count: 0, players: [] },
    bestPar3Total: { score: Infinity, players: [] }
  };
  
  scores.forEach(score => {
    // Most birdies
    if (score.totals.birdies > stats.mostBirdies.count) {
      stats.mostBirdies = { count: score.totals.birdies, players: [score.player] };
    } else if (score.totals.birdies === stats.mostBirdies.count) {
      stats.mostBirdies.players.push(score.player);
    }
    
    // Most bogeys
    if (score.totals.bogeys > stats.mostBogeys.count) {
      stats.mostBogeys = { count: score.totals.bogeys, players: [score.player] };
    } else if (score.totals.bogeys === stats.mostBogeys.count) {
      stats.mostBogeys.players.push(score.player);
    }
    
    // Best Par 3 total (holes 4, 6, 13, 15 for Luttrellstown)
    const par3Holes = [4, 6, 13, 15];
    const par3Total = score.holes
      .filter(hole => par3Holes.includes(hole.hole))
      .reduce((sum, hole) => sum + hole.strokes, 0);
    
    if (par3Total < stats.bestPar3Total.score) {
      stats.bestPar3Total = { score: par3Total, players: [score.player] };
    } else if (par3Total === stats.bestPar3Total.score) {
      stats.bestPar3Total.players.push(score.player);
    }
  });
  
  return stats;
}

module.exports = {
  calculateStablefordPoints,
  getHandicapStrokes,
  calculateNetStrokes,
  processScorecard,
  calculatePrizeStats
};