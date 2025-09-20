const { calculateStablefordPoints, getHandicapStrokes, calculateNetStrokes } = require('./server/utils/stableford');

console.log('🏌️ ICGS Golf Scoring System - Stableford Calculation Tests');
console.log('='.repeat(60));

// Test Stableford scoring system (Updated rules)
function testStablefordScoring() {
  console.log('\n📊 Testing Stableford Point Calculation:');
  
  const tests = [
    { netStrokes: 1, par: 4, expected: 6, description: 'Hole-in-one on Par 4 (-3)' },
    { netStrokes: 2, par: 5, expected: 6, description: 'Eagle on Par 5 (-3)' },
    { netStrokes: 2, par: 4, expected: 4, description: 'Eagle on Par 4 (-2)' },
    { netStrokes: 3, par: 4, expected: 3, description: 'Birdie on Par 4 (-1)' },
    { netStrokes: 4, par: 4, expected: 2, description: 'Par on Par 4 (0)' },
    { netStrokes: 5, par: 4, expected: 1, description: 'Bogey on Par 4 (+1)' },
    { netStrokes: 6, par: 4, expected: 0, description: 'Double bogey on Par 4 (+2)' },
    { netStrokes: 7, par: 4, expected: 0, description: 'Triple bogey on Par 4 (+3)' }
  ];
  
  let passed = 0;
  tests.forEach(test => {
    const result = calculateStablefordPoints(test.netStrokes, test.par);
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.description}: ${result} pts (expected ${test.expected})`);
    if (result === test.expected) passed++;
  });
  
  console.log(`\n📈 Stableford Test Results: ${passed}/${tests.length} tests passed`);
  return passed === tests.length;
}

// Test handicap stroke allocation
function testHandicapStrokes() {
  console.log('\n🎯 Testing Handicap Stroke Allocation:');
  
  const tests = [
    { handicap: 12, strokeIndex: 1, expected: 1, description: 'H12 player on SI 1 hole' },
    { handicap: 12, strokeIndex: 12, expected: 1, description: 'H12 player on SI 12 hole' },
    { handicap: 12, strokeIndex: 13, expected: 0, description: 'H12 player on SI 13 hole' },
    { handicap: 18, strokeIndex: 18, expected: 1, description: 'H18 player on SI 18 hole' },
    { handicap: 22, strokeIndex: 1, expected: 2, description: 'H22 player on SI 1 hole' },
    { handicap: 22, strokeIndex: 4, expected: 2, description: 'H22 player on SI 4 hole' },
    { handicap: 22, strokeIndex: 5, expected: 1, description: 'H22 player on SI 5 hole' }
  ];
  
  let passed = 0;
  tests.forEach(test => {
    const result = getHandicapStrokes(test.handicap, test.strokeIndex);
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.description}: ${result} strokes (expected ${test.expected})`);
    if (result === test.expected) passed++;
  });
  
  console.log(`\n📈 Handicap Test Results: ${passed}/${tests.length} tests passed`);
  return passed === tests.length;
}

// Test net stroke calculation
function testNetStrokes() {
  console.log('\n⛳ Testing Net Stroke Calculation:');
  
  const tests = [
    { gross: 5, handicap: 12, strokeIndex: 1, expected: 4, description: '5 gross, H12, SI 1' },
    { gross: 4, handicap: 18, strokeIndex: 10, expected: 3, description: '4 gross, H18, SI 10' },
    { gross: 3, handicap: 6, strokeIndex: 15, expected: 3, description: '3 gross, H6, SI 15 (no stroke)' },
    { gross: 8, handicap: 24, strokeIndex: 1, expected: 6, description: '8 gross, H24, SI 1' },
  ];
  
  let passed = 0;
  tests.forEach(test => {
    const result = calculateNetStrokes(test.gross, test.handicap, test.strokeIndex);
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.description}: ${result} net (expected ${test.expected})`);
    if (result === test.expected) passed++;
  });
  
  console.log(`\n📈 Net Stroke Test Results: ${passed}/${tests.length} tests passed`);
  return passed === tests.length;
}

// Run all tests
const stablefordPassed = testStablefordScoring();
const handicapPassed = testHandicapStrokes();
const netStrokesPassed = testNetStrokes();

console.log('\n' + '='.repeat(60));
console.log('🏆 Overall Test Summary:');
console.log(`Stableford Calculation: ${stablefordPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Handicap Strokes: ${handicapPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Net Strokes: ${netStrokesPassed ? '✅ PASSED' : '❌ FAILED'}`);

const overallPassed = stablefordPassed && handicapPassed && netStrokesPassed;
console.log(`\n🎯 STABLEFORD ENGINE: ${overallPassed ? '✅ ALL TESTS PASSED' : '❌ TESTS FAILED'}`);

if (overallPassed) {
  console.log('✅ Stableford calculation is 100% accurate as required');
} else {
  console.log('❌ Stableford calculation needs fixes before competition use');
}