import React, { useState, useEffect } from 'react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { theme } from '../../theme';

interface CourseHole {
  number: number;
  par: number;
  strokeIndexMen: number;
  strokeIndexLadies: number;
  yardage: {
    blue: number;
    white: number;
    green: number;
    red: number;
  };
}

interface Course {
  name: string;
  location: string;
  holes: CourseHole[];
  totalPar: number;
  sss: {
    men: number;
    ladies: number;
  };
}

// Luttrellstown Castle Golf Club - Official Data
const LUTTRELLSTOWN_COURSE: Course = {
  name: 'Luttrellstown Castle Golf Club',
  location: 'Clonsilla, Dublin 15, Ireland',
  totalPar: 72,
  sss: { men: 72, ladies: 74 },
  holes: [
    // Front 9
    { number: 1, par: 4, strokeIndexMen: 7, strokeIndexLadies: 7, yardage: { blue: 406, white: 398, green: 374, red: 329 } },
    { number: 2, par: 5, strokeIndexMen: 11, strokeIndexLadies: 3, yardage: { blue: 550, white: 528, green: 517, red: 443 } },
    { number: 3, par: 4, strokeIndexMen: 3, strokeIndexLadies: 13, yardage: { blue: 426, white: 405, green: 391, red: 323 } },
    { number: 4, par: 3, strokeIndexMen: 15, strokeIndexLadies: 17, yardage: { blue: 228, white: 186, green: 163, red: 148 } },
    { number: 5, par: 4, strokeIndexMen: 1, strokeIndexLadies: 1, yardage: { blue: 433, white: 410, green: 391, red: 344 } },
    { number: 6, par: 3, strokeIndexMen: 9, strokeIndexLadies: 15, yardage: { blue: 202, white: 194, green: 176, red: 132 } },
    { number: 7, par: 4, strokeIndexMen: 5, strokeIndexLadies: 11, yardage: { blue: 424, white: 410, green: 394, red: 330 } },
    { number: 8, par: 5, strokeIndexMen: 17, strokeIndexLadies: 5, yardage: { blue: 508, white: 500, green: 486, red: 416 } },
    { number: 9, par: 4, strokeIndexMen: 13, strokeIndexLadies: 9, yardage: { blue: 408, white: 378, green: 362, red: 342 } },
    // Back 9
    { number: 10, par: 4, strokeIndexMen: 6, strokeIndexLadies: 2, yardage: { blue: 421, white: 398, green: 382, red: 342 } },
    { number: 11, par: 4, strokeIndexMen: 16, strokeIndexLadies: 14, yardage: { blue: 419, white: 345, green: 330, red: 265 } },
    { number: 12, par: 5, strokeIndexMen: 14, strokeIndexLadies: 10, yardage: { blue: 521, white: 514, green: 498, red: 405 } },
    { number: 13, par: 3, strokeIndexMen: 12, strokeIndexLadies: 18, yardage: { blue: 216, white: 200, green: 154, red: 141 } },
    { number: 14, par: 4, strokeIndexMen: 2, strokeIndexLadies: 12, yardage: { blue: 494, white: 458, green: 438, red: 314 } },
    { number: 15, par: 3, strokeIndexMen: 18, strokeIndexLadies: 16, yardage: { blue: 181, white: 155, green: 123, red: 112 } },
    { number: 16, par: 4, strokeIndexMen: 8, strokeIndexLadies: 8, yardage: { blue: 450, white: 396, green: 379, red: 343 } },
    { number: 17, par: 4, strokeIndexMen: 4, strokeIndexLadies: 6, yardage: { blue: 505, white: 449, green: 416, red: 357 } },
    { number: 18, par: 5, strokeIndexMen: 10, strokeIndexLadies: 4, yardage: { blue: 555, white: 488, green: 472, red: 421 } },
  ],
};

export const CourseSetup: React.FC = () => {
  const [course, setCourse] = useState<Course>(LUTTRELLSTOWN_COURSE);
  const [selectedTees, setSelectedTees] = useState<'blue' | 'white' | 'green' | 'red'>('white');
  const [showDetails, setShowDetails] = useState(false);

  // Calculate totals
  const frontNine = course.holes.slice(0, 9);
  const backNine = course.holes.slice(9, 18);
  const frontPar = frontNine.reduce((sum, hole) => sum + hole.par, 0);
  const backPar = backNine.reduce((sum, hole) => sum + hole.par, 0);
  
  const frontYardage = frontNine.reduce((sum, hole) => sum + hole.yardage[selectedTees], 0);
  const backYardage = backNine.reduce((sum, hole) => sum + hole.yardage[selectedTees], 0);
  const totalYardage = frontYardage + backYardage;

  const par3Holes = course.holes.filter(hole => hole.par === 3);
  const par4Holes = course.holes.filter(hole => hole.par === 4);
  const par5Holes = course.holes.filter(hole => hole.par === 5);

  const hardestHoleMen = course.holes.find(hole => hole.strokeIndexMen === 1);
  const easiestHoleMen = course.holes.find(hole => hole.strokeIndexMen === 18);
  const hardestHoleLadies = course.holes.find(hole => hole.strokeIndexLadies === 1);
  const easiestHoleLadies = course.holes.find(hole => hole.strokeIndexLadies === 18);

  // Find holes with major stroke index differences
  const majorDifferences = course.holes.filter(hole => 
    Math.abs(hole.strokeIndexMen - hole.strokeIndexLadies) >= 10
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Course Header */}
      <Card title="⛳ Course Configuration">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: theme.spacing.lg,
          marginBottom: theme.spacing.lg,
        }}>
          <div>
            <h3 style={{ color: theme.colors.primary, margin: `0 0 ${theme.spacing.sm} 0` }}>
              Course Information
            </h3>
            <div style={{ fontSize: theme.typography.organizer.body }}>
              <div><strong>Name:</strong> {course.name}</div>
              <div><strong>Location:</strong> {course.location}</div>
              <div><strong>Total Par:</strong> {course.totalPar}</div>
              <div><strong>SSS Men:</strong> {course.sss.men}</div>
              <div><strong>SSS Ladies:</strong> {course.sss.ladies}</div>
            </div>
          </div>

          <div>
            <h3 style={{ color: theme.colors.primary, margin: `0 0 ${theme.spacing.sm} 0` }}>
              Course Statistics
            </h3>
            <div style={{ fontSize: theme.typography.organizer.body }}>
              <div><strong>Par 3s:</strong> {par3Holes.length} holes ({par3Holes.map(h => h.number).join(', ')})</div>
              <div><strong>Par 4s:</strong> {par4Holes.length} holes</div>
              <div><strong>Par 5s:</strong> {par5Holes.length} holes ({par5Holes.map(h => h.number).join(', ')})</div>
              <div><strong>Front 9:</strong> Par {frontPar}</div>
              <div><strong>Back 9:</strong> Par {backPar}</div>
            </div>
          </div>

          <div>
            <h3 style={{ color: theme.colors.primary, margin: `0 0 ${theme.spacing.sm} 0` }}>
              Stroke Index Analysis
            </h3>
            <div style={{ fontSize: theme.typography.organizer.body }}>
              <div><strong>Hardest (Men):</strong> Hole {hardestHoleMen?.number} (SI 1)</div>
              <div><strong>Easiest (Men):</strong> Hole {easiestHoleMen?.number} (SI 18)</div>
              <div><strong>Hardest (Ladies):</strong> Hole {hardestHoleLadies?.number} (SI 1)</div>
              <div><strong>Easiest (Ladies):</strong> Hole {easiestHoleLadies?.number} (SI 18)</div>
              <div style={{ color: theme.colors.warning }}>
                <strong>Major Differences:</strong> {majorDifferences.length} holes
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: theme.spacing.sm, fontWeight: 'bold' }}>
              Select Tees:
            </label>
            <select
              value={selectedTees}
              onChange={(e) => setSelectedTees(e.target.value as any)}
              style={{
                padding: theme.spacing.sm,
                borderRadius: theme.components.button.borderRadius,
                border: `2px solid ${theme.colors.primary}`,
                fontSize: theme.typography.organizer.body,
              }}
            >
              <option value="blue">🔵 Blue Tees (Championship) - {totalYardage}y</option>
              <option value="white">⚪ White Tees (Men's Regular) - {totalYardage}y</option>
              <option value="green">🟢 Green Tees (Forward) - {totalYardage}y</option>
              <option value="red">🔴 Red Tees (Ladies') - {totalYardage}y</option>
            </select>
          </div>

          <Button 
            onClick={() => setShowDetails(!showDetails)}
            variant={showDetails ? 'primary' : 'secondary'}
          >
            {showDetails ? 'Hide' : 'Show'} Hole Details
          </Button>

          <div style={{ color: theme.colors.success, fontSize: theme.typography.organizer.small }}>
            ✅ Course data verified from official scorecard
          </div>
        </div>
      </Card>

      {/* Detailed Hole Information */}
      {showDetails && (
        <Card title="📋 Hole by Hole Breakdown">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: theme.typography.organizer.small,
            }}>
              <thead>
                <tr style={{ backgroundColor: theme.colors.primary, color: theme.colors.white }}>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'center' }}>Hole</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'center' }}>Par</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'center' }}>SI Men</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'center' }}>SI Ladies</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'center' }}>Diff</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'center' }}>{selectedTees.charAt(0).toUpperCase() + selectedTees.slice(1)} Yardage</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'left' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {course.holes.map((hole, index) => {
                  const diff = hole.strokeIndexMen - hole.strokeIndexLadies;
                  const isMajorDiff = Math.abs(diff) >= 10;
                  
                  return (
                    <tr 
                      key={hole.number}
                      style={{ 
                        backgroundColor: index % 2 === 0 ? theme.colors.white : theme.colors.lightGray,
                        borderBottom: `1px solid ${theme.colors.lightGray}`,
                      }}
                    >
                      <td style={{ 
                        padding: theme.spacing.sm, 
                        textAlign: 'center', 
                        fontWeight: 'bold',
                        color: theme.colors.primary,
                      }}>
                        {hole.number}
                      </td>
                      <td style={{ padding: theme.spacing.sm, textAlign: 'center', fontWeight: 'bold' }}>
                        {hole.par}
                      </td>
                      <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>
                        {hole.strokeIndexMen}
                        {hole.strokeIndexMen === 1 && ' 🔥'}
                        {hole.strokeIndexMen === 18 && ' 😌'}
                      </td>
                      <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>
                        {hole.strokeIndexLadies}
                        {hole.strokeIndexLadies === 1 && ' 🔥'}
                        {hole.strokeIndexLadies === 18 && ' 😌'}
                      </td>
                      <td style={{ 
                        padding: theme.spacing.sm, 
                        textAlign: 'center',
                        color: isMajorDiff ? theme.colors.warning : theme.colors.darkGray,
                        fontWeight: isMajorDiff ? 'bold' : 'normal',
                      }}>
                        {diff > 0 ? `+${diff}` : diff}
                        {isMajorDiff && ' ⚠️'}
                      </td>
                      <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>
                        {hole.yardage[selectedTees]}y
                      </td>
                      <td style={{ padding: theme.spacing.sm }}>
                        {hole.par === 3 && '🎯 Par 3'}
                        {hole.par === 5 && '🦅 Par 5'}
                        {hole.strokeIndexMen === 1 && ' • Hardest (Men)'}
                        {hole.strokeIndexMen === 18 && ' • Easiest (Men)'}
                        {hole.strokeIndexLadies === 1 && ' • Hardest (Ladies)'}
                        {hole.strokeIndexLadies === 18 && ' • Easiest (Ladies)'}
                        {isMajorDiff && ' • Major SI difference'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: theme.colors.primary, color: theme.colors.white, fontWeight: 'bold' }}>
                  <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>OUT</td>
                  <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>{frontPar}</td>
                  <td colSpan={2} style={{ padding: theme.spacing.sm, textAlign: 'center' }}>Front 9</td>
                  <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>{frontYardage}y</td>
                  <td></td>
                </tr>
                <tr style={{ backgroundColor: theme.colors.primary, color: theme.colors.white, fontWeight: 'bold' }}>
                  <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>IN</td>
                  <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>{backPar}</td>
                  <td colSpan={2} style={{ padding: theme.spacing.sm, textAlign: 'center' }}>Back 9</td>
                  <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>{backYardage}y</td>
                  <td></td>
                </tr>
                <tr style={{ backgroundColor: theme.colors.success, color: theme.colors.white, fontWeight: 'bold' }}>
                  <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>TOTAL</td>
                  <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>{course.totalPar}</td>
                  <td colSpan={2} style={{ padding: theme.spacing.sm, textAlign: 'center' }}>18 Holes</td>
                  <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>{totalYardage}y</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {/* Major Differences Alert */}
      {majorDifferences.length > 0 && (
        <Card title="⚠️ Gender Stroke Index Differences">
          <div style={{ color: theme.colors.warning, marginBottom: theme.spacing.md }}>
            <strong>Important:</strong> {majorDifferences.length} holes have major stroke index differences (≥10) between men and ladies.
            This is why our system uses gender-specific calculations for fair scoring.
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: theme.spacing.md,
          }}>
            {majorDifferences.map(hole => (
              <div key={hole.number} style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.lightGray,
                borderRadius: theme.components.card.borderRadius,
                border: `2px solid ${theme.colors.warning}`,
              }}>
                <div style={{ fontWeight: 'bold', fontSize: theme.typography.organizer.h3 }}>
                  Hole {hole.number} (Par {hole.par})
                </div>
                <div>Men SI: {hole.strokeIndexMen}</div>
                <div>Ladies SI: {hole.strokeIndexLadies}</div>
                <div style={{ color: theme.colors.warning, fontWeight: 'bold' }}>
                  Difference: {Math.abs(hole.strokeIndexMen - hole.strokeIndexLadies)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};