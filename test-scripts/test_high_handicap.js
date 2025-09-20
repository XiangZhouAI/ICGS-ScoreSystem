const { calculateStablefordPoints, getHandicapStrokes, calculateNetStrokes } = require('./server/utils/stableford');

console.log('🏌️ High Handicap Player Tests (H45) - 0 Points & 5 Points Scenarios');
console.log('='.repeat(80));

function testH45ZeroPoints() {
  console.log('\n❌ Testing H45 Player Scoring 0 Points:');
  
  const zeroPointTests = [
    {
      description: 'H45 on hardest hole (SI 1) - Double bogey or worse',
      handicap: 45, strokeIndex: 1, par: 4, gross: 9,
      // H45 gets floor(45/18) + (1 <= 45%18) = 2 + 1 = 3 strokes
      // Net: max(1, 9-3) = 6, Score to par: 6-4 = +2, Points: 0
      expectedNet: 6, expectedPoints: 0
    },
    {
      description: 'H45 on medium hole (SI 10) - Triple bogey',
      handicap: 45, strokeIndex: 10, par: 4, gross: 10,
      // H45 gets 2 + (10 <= 9) = 2 + 0 = 2 strokes  
      // Net: max(1, 10-2) = 8, Score to par: 8-4 = +4, Points: 0
      expectedNet: 8, expectedPoints: 0
    },
    {
      description: 'H45 on easiest hole (SI 18) - Still struggles',
      handicap: 45, strokeIndex: 18, par: 5, gross: 10,
      // H45 gets 2 + (18 <= 9) = 2 + 0 = 2 strokes
      // Net: max(1, 10-2) = 8, Score to par: 8-5 = +3, Points: 0
      expectedNet: 8, expectedPoints: 0
    },
    {
      description: 'H45 on Par 3 (SI 5) - Way over par',
      handicap: 45, strokeIndex: 5, par: 3, gross: 8,
      // H45 gets 2 + (5 <= 9) = 2 + 1 = 3 strokes
      // Net: max(1, 8-3) = 5, Score to par: 5-3 = +2, Points: 0  
      expectedNet: 5, expectedPoints: 0
    }
  ];

  return runTests(zeroPointTests, 'Zero Points');
}

function testH45FivePoints() {
  console.log('\n🏆 Testing H45 Player Scoring 5 Points (-3 to par):');
  
  const fivePointTests = [
    {
      description: 'H45 holes out on Par 5 (SI 1) - Incredible shot!',
      handicap: 45, strokeIndex: 1, par: 5, gross: 1,
      // H45 gets 3 strokes, Net: max(1, 1-3) = 1, Score: 1-5 = -4, Points: 6 (not 5!)
      expectedNet: 1, expectedPoints: 6, note: 'Actually gets 6 points (-4 or better)'
    },
    {
      description: 'H45 eagles Par 5 (SI 10) - Great round!',
      handicap: 45, strokeIndex: 10, par: 5, gross: 3,
      // H45 gets 2 strokes, Net: max(1, 3-2) = 1, Score: 1-5 = -4, Points: 6
      expectedNet: 1, expectedPoints: 6, note: 'Actually gets 6 points (-4 or better)'
    },
    {
      description: 'H45 chips in on Par 4 (SI 8) - Lucky shot!',
      handicap: 45, strokeIndex: 8, par: 4, gross: 1,
      // H45 gets 2 + (8 <= 9) = 2 + 1 = 3 strokes
      // Net: max(1, 1-3) = 1, Score: 1-4 = -3, Points: 5
      expectedNet: 1, expectedPoints: 5
    },
    {
      description: 'H45 birdies Par 4 (SI 18) - Playing well!',
      handicap: 45, strokeIndex: 18, par: 4, gross: 3,
      // H45 gets 2 strokes, Net: max(1, 3-2) = 1, Score: 1-4 = -3, Points: 5
      expectedNet: 1, expectedPoints: 5
    },
    {
      description: 'H45 aces Par 3 (SI 12) - Hole in one!',
      handicap: 45, strokeIndex: 12, par: 3, gross: 1,
      // H45 gets 2 strokes, Net: max(1, 1-2) = 1, Score: 1-3 = -2, Points: 4
      expectedNet: 1, expectedPoints: 4, note: 'Gets 4 points (-2 to par)'
    }
  ];

  return runTests(fivePointTests, 'Five Points (and other high scores)');
}

function runTests(tests, category) {
  let passed = 0;
  
  tests.forEach((test, i) => {
    const handicapStrokes = getHandicapStrokes(test.handicap, test.strokeIndex);
    const netStrokes = calculateNetStrokes(test.gross, test.handicap, test.strokeIndex);
    const points = calculateStablefordPoints(netStrokes, test.par);
    const scoreToPar = netStrokes - test.par;
    
    const netCorrect = netStrokes === test.expectedNet;
    const pointsCorrect = points === test.expectedPoints;
    const allCorrect = netCorrect && pointsCorrect;
    
    console.log(`\n${i + 1}. ${test.description}`);
    console.log(`   Setup: ${test.gross} gross, H${test.handicap}, SI${test.strokeIndex}, Par ${test.par}`);
    console.log(`   Handicap calculation: floor(${test.handicap}/18) + (${test.strokeIndex} <= ${test.handicap % 18}) = ${Math.floor(test.handicap/18)} + ${test.strokeIndex <= test.handicap % 18 ? 1 : 0} = ${handicapStrokes} strokes`);
    console.log(`   Net calculation: max(1, ${test.gross} - ${handicapStrokes}) = ${netStrokes}`);
    console.log(`   Score to par: ${netStrokes} - ${test.par} = ${scoreToPar >= 0 ? '+' : ''}${scoreToPar}`);
    console.log(`   Expected: Net ${test.expectedNet} ${netCorrect ? '✅' : '❌'}, Points ${test.expectedPoints} ${pointsCorrect ? '✅' : '❌'}`);
    if (test.note) {
      console.log(`   📝 Note: ${test.note}`);
    }
    console.log(`   Result: ${allCorrect ? '✅ PASS' : '❌ FAIL'}`);
    
    if (allCorrect) passed++;
  });
  
  console.log(`\n📈 ${category} Results: ${passed}/${tests.length} tests passed`);
  return passed === tests.length;
}

function explainH45HandicapSystem() {
  console.log('\n📚 H45 Handicap Stroke Allocation Explained:');
  console.log('H45 means: 45 ÷ 18 = 2 remainder 9');
  console.log('• Player gets 2 strokes on every hole');
  console.log('• Player gets 1 EXTRA stroke on holes with SI 1-9');
  console.log('• Total strokes per hole: 2 or 3 depending on stroke index');
  
  console.log('\nStroke Index Distribution:');
  for (let si = 1; si <= 18; si++) {
    const strokes = getHandicapStrokes(45, si);
    console.log(`SI ${si.toString().padStart(2)}: ${strokes} ${strokes === 3 ? '(extra)' : '       '} ${si <= 9 ? '←' : ''}`);
  }
}

// Run all tests
explainH45HandicapSystem();
const zeroPointsPassed = testH45ZeroPoints();
const fivePointsPassed = testH45FivePoints();

console.log('\n' + '='.repeat(80));
console.log('🏆 H45 PLAYER TEST SUMMARY:');
console.log(`Zero Points Scenarios: ${zeroPointsPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Five Points Scenarios: ${fivePointsPassed ? '✅ PASSED' : '❌ FAILED'}`);

const allPassed = zeroPointsPassed && fivePointsPassed;
console.log(`\nOverall H45 Tests: ${allPassed ? '✅ ALL PASSED' : '❌ ISSUES FOUND'}`);

if (allPassed) {
  console.log('\n✅ High handicap player calculations are accurate!');
  console.log('   • H45 players properly receive 2-3 strokes per hole');
  console.log('   • Zero point scenarios correctly identified');  
  console.log('   • High scoring scenarios (4-6 points) working correctly');
} else {
  console.log('\n❌ High handicap calculations need review before competition!');
}