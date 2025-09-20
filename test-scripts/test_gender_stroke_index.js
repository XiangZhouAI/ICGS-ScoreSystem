const { calculateStablefordPoints, getHandicapStrokes, calculateNetStrokes } = require('./server/utils/stableford');

console.log('⚤ Gender-Specific Stroke Index Testing - Luttrellstown Castle');
console.log('='.repeat(70));

// Luttrellstown Castle hole data with different stroke indexes
const luttrrellstownHoles = [
  // Front 9
  { number: 1, par: 4, strokeIndexMen: 7, strokeIndexLadies: 7 },
  { number: 2, par: 5, strokeIndexMen: 11, strokeIndexLadies: 3 },   // BIG DIFFERENCE!
  { number: 3, par: 4, strokeIndexMen: 3, strokeIndexLadies: 13 },   // BIG DIFFERENCE!
  { number: 4, par: 3, strokeIndexMen: 15, strokeIndexLadies: 17 },
  { number: 5, par: 4, strokeIndexMen: 1, strokeIndexLadies: 1 },    // Same (hardest)
  { number: 6, par: 3, strokeIndexMen: 9, strokeIndexLadies: 15 },   // Different
  { number: 7, par: 4, strokeIndexMen: 5, strokeIndexLadies: 11 },   // Different
  { number: 8, par: 5, strokeIndexMen: 17, strokeIndexLadies: 5 },   // BIG DIFFERENCE!
  { number: 9, par: 4, strokeIndexMen: 13, strokeIndexLadies: 9 },
  // Back 9
  { number: 10, par: 4, strokeIndexMen: 6, strokeIndexLadies: 2 },   // Different
  { number: 11, par: 4, strokeIndexMen: 16, strokeIndexLadies: 14 },
  { number: 12, par: 5, strokeIndexMen: 14, strokeIndexLadies: 10 },
  { number: 13, par: 3, strokeIndexMen: 12, strokeIndexLadies: 18 }, // Different
  { number: 14, par: 4, strokeIndexMen: 2, strokeIndexLadies: 12 },  // BIG DIFFERENCE!
  { number: 15, par: 3, strokeIndexMen: 18, strokeIndexLadies: 16 }, // Men's easiest
  { number: 16, par: 4, strokeIndexMen: 8, strokeIndexLadies: 8 },   // Same
  { number: 17, par: 4, strokeIndexMen: 4, strokeIndexLadies: 6 },
  { number: 18, par: 5, strokeIndexMen: 10, strokeIndexLadies: 4 }
];

function testGenderStrokeIndexDifferences() {
  console.log('🔍 Analyzing Gender-Specific Stroke Index Differences:');
  console.log('Hole | Par | Men SI | Ladies SI | Difference | Notes');
  console.log('-'.repeat(60));
  
  let significantDifferences = [];
  
  luttrrellstownHoles.forEach(hole => {
    const diff = hole.strokeIndexMen - hole.strokeIndexLadies;
    const absDiff = Math.abs(diff);
    const diffStr = diff > 0 ? `+${diff}` : diff.toString();
    
    let notes = '';
    if (absDiff >= 10) {
      notes = '⚠️  MAJOR DIFF';
      significantDifferences.push(hole);
    } else if (absDiff >= 5) {
      notes = '⚠️  Big diff';
    } else if (diff === 0) {
      notes = '✅ Same';
    }
    
    console.log(`${hole.number.toString().padStart(2)}   |  ${hole.par}  |   ${hole.strokeIndexMen.toString().padStart(2)}   |    ${hole.strokeIndexLadies.toString().padStart(2)}    |    ${diffStr.padStart(3)}     | ${notes}`);
  });
  
  console.log('-'.repeat(60));
  console.log(`Significant differences (≥10): ${significantDifferences.length} holes`);
  
  return significantDifferences;
}

function testH12PlayerBothGenders() {
  console.log('\n👫 Testing H12 Player - Male vs Female Scoring:');
  console.log('Same player, same scores, different stroke indexes');
  
  const testScenarios = [
    {
      hole: 2, par: 5, gross: 6,
      menSI: 11, ladiesSI: 3,
      description: 'Par 5, 6 gross - Hole where ladies get more help'
    },
    {
      hole: 3, par: 4, gross: 5,
      menSI: 3, ladiesSI: 13,
      description: 'Par 4, 5 gross - Hole where men get more help'
    },
    {
      hole: 8, par: 5, gross: 7,
      menSI: 17, ladiesSI: 5,
      description: 'Par 5, 7 gross - Major difference (17 vs 5)'
    },
    {
      hole: 14, par: 4, gross: 6,
      menSI: 2, ladiesSI: 12,
      description: 'Par 4, 6 gross - Men SI 2 vs Ladies SI 12'
    }
  ];
  
  const handicap = 12;
  let differences = 0;
  
  testScenarios.forEach(test => {
    const menStrokes = getHandicapStrokes(handicap, test.menSI);
    const ladiesStrokes = getHandicapStrokes(handicap, test.ladiesSI);
    
    const menNet = calculateNetStrokes(test.gross, handicap, test.menSI);
    const ladiesNet = calculateNetStrokes(test.gross, handicap, test.ladiesSI);
    
    const menPoints = calculateStablefordPoints(menNet, test.par);
    const ladiesPoints = calculateStablefordPoints(ladiesNet, test.par);
    
    const pointsDiff = ladiesPoints - menPoints;
    
    console.log(`\nHole ${test.hole}: ${test.description}`);
    console.log(`  Gross score: ${test.gross}`);
    console.log(`  Handicap strokes - Men: ${menStrokes}, Ladies: ${ladiesStrokes}`);
    console.log(`  Net scores - Men: ${menNet}, Ladies: ${ladiesNet}`);
    console.log(`  Stableford points - Men: ${menPoints}, Ladies: ${ladiesPoints}`);
    console.log(`  Points difference: ${pointsDiff >= 0 ? '+' : ''}${pointsDiff} ${pointsDiff !== 0 ? '⚠️' : '✅'}`);
    
    if (pointsDiff !== 0) differences++;
  });
  
  console.log(`\nScoring differences found: ${differences}/${testScenarios.length} holes`);
  return differences;
}

function testExtremeHandicapDifferences() {
  console.log('\n🏌️ Testing High Handicap Players (H24) - Gender Impact:');
  
  // Test on holes with biggest stroke index differences
  const extremeTests = [
    {
      hole: 2, par: 5, gross: 8, menSI: 11, ladiesSI: 3,
      description: 'H24 player struggles on Par 5'
    },
    {
      hole: 8, par: 5, gross: 9, menSI: 17, ladiesSI: 5,
      description: 'H24 player on hole with huge SI difference (17 vs 5)'
    },
    {
      hole: 14, par: 4, gross: 7, menSI: 2, ladiesSI: 12,
      description: 'H24 player on hardest hole for men, medium for ladies'
    }
  ];
  
  const handicap = 24;
  
  extremeTests.forEach(test => {
    const menStrokes = getHandicapStrokes(handicap, test.menSI);
    const ladiesStrokes = getHandicapStrokes(handicap, test.ladiesSI);
    
    const menNet = calculateNetStrokes(test.gross, handicap, test.menSI);
    const ladiesNet = calculateNetStrokes(test.gross, handicap, test.ladiesSI);
    
    const menPoints = calculateStablefordPoints(menNet, test.par);
    const ladiesPoints = calculateStablefordPoints(ladiesNet, test.par);
    
    console.log(`\nHole ${test.hole}: ${test.description}`);
    console.log(`  H${handicap} gets - Men: ${menStrokes} strokes, Ladies: ${ladiesStrokes} strokes`);
    console.log(`  Net result - Men: ${menNet} (${menPoints} pts), Ladies: ${ladiesNet} (${ladiesPoints} pts)`);
    
    if (ladiesPoints !== menPoints) {
      console.log(`  ⚠️  ${ladiesPoints > menPoints ? 'Ladies advantage' : 'Men advantage'}: ${Math.abs(ladiesPoints - menPoints)} point difference`);
    } else {
      console.log(`  ✅ Same result for both genders`);
    }
  });
}

function identifySystemRequirement() {
  console.log('\n🛠️  SYSTEM REQUIREMENT ANALYSIS:');
  console.log('Current system limitation: Only uses strokeIndexMen in calculations');
  console.log('Required fix: processScorecard() needs gender parameter');
  console.log();
  console.log('Current code in stableford.js line ~70:');
  console.log('  strokeIndex: courseHole.strokeIndexMen,  // ❌ HARD-CODED!');
  console.log();
  console.log('Required change:');
  console.log('  strokeIndex: gender === "female" ? courseHole.strokeIndexLadies : courseHole.strokeIndexMen,');
  console.log();
  console.log('API changes needed:');
  console.log('  • Player model: add gender field');
  console.log('  • Score calculation: pass player gender');
  console.log('  • Frontend: gender selection in player management');
}

// Run all tests
console.log('Running comprehensive gender-specific stroke index tests...\n');

const significantDiffs = testGenderStrokeIndexDifferences();
const scoringDiffs = testH12PlayerBothGenders();
const extremeResults = testExtremeHandicapDifferences();
identifySystemRequirement();

console.log('\n' + '='.repeat(70));
console.log('🏆 GENDER STROKE INDEX TEST SUMMARY:');
console.log(`Holes with major SI differences (≥10): ${significantDiffs.length}/18`);
console.log(`H12 player scoring differences: ${scoringDiffs}/4 test scenarios`);
console.log('Current system status: ❌ USES ONLY MEN\'S STROKE INDEXES');

console.log('\n🚨 CRITICAL FINDING:');
console.log('The system currently hard-codes men\'s stroke indexes in calculations.');
console.log('This creates unfair scoring for female players on many holes.');
console.log('');
console.log('Examples of unfair advantage/disadvantage:');
significantDiffs.slice(0, 3).forEach(hole => {
  console.log(`  • Hole ${hole.number}: Men SI ${hole.strokeIndexMen} vs Ladies SI ${hole.strokeIndexLadies}`);
});

console.log('\n✅ RECOMMENDATION:');
console.log('Add gender field to Player model and update Stableford calculations');
console.log('before competition to ensure fair play for all participants.');

const testsPassed = significantDiffs.length > 0; // We expect to find differences
console.log(`\nTest validation: ${testsPassed ? '✅ DIFFERENCES DETECTED AS EXPECTED' : '❌ NO DIFFERENCES FOUND - ERROR'}`);