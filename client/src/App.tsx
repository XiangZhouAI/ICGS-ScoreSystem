import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { PlayerManagement } from './components/Players/PlayerManagement';
import { CourseSetup } from './components/Course/CourseSetup';
import { ScoringEntry } from './components/Scoring/ScoringEntry';
import { ResultsDisplay } from './components/Results/ResultsDisplay';
import { Button } from './components/Common/Button';
import { Card } from './components/Common/Card';
import { theme } from './theme';

type ActiveView = 'dashboard' | 'players' | 'course' | 'scoring' | 'results';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'players':
        return <PlayerManagement />;
      case 'course':
        return <CourseSetup />;
      case 'scoring':
        return <ScoringEntry />;
      case 'results':
        return <ResultsDisplay />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.colors.lightGray,
    }}>
      <Header 
        title="ICGS Golf Competition System"
        subtitle="Stableford Scoring • Luttrellstown Castle"
      />
      
      {activeView !== 'dashboard' && (
        <nav style={{
          padding: theme.spacing.md,
          backgroundColor: theme.colors.white,
          borderBottom: `1px solid ${theme.colors.lightGray}`,
          display: 'flex',
          gap: theme.spacing.sm,
        }}>
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => setActiveView('dashboard')}
          >
            ← Dashboard
          </Button>
          <Button 
            variant={activeView === 'players' ? 'primary' : 'secondary'} 
            size="small"
            onClick={() => setActiveView('players')}
          >
            Players
          </Button>
          <Button 
            variant={activeView === 'course' ? 'primary' : 'secondary'} 
            size="small"
            onClick={() => setActiveView('course')}
          >
            Course
          </Button>
          <Button 
            variant={activeView === 'scoring' ? 'primary' : 'secondary'} 
            size="small"
            onClick={() => setActiveView('scoring')}
          >
            Scoring
          </Button>
          <Button 
            variant={activeView === 'results' ? 'primary' : 'secondary'} 
            size="small"
            onClick={() => setActiveView('results')}
          >
            Results
          </Button>
        </nav>
      )}

      <main style={{ padding: theme.spacing.lg }}>
        {renderActiveView()}
      </main>
    </div>
  );
}

// Dashboard component
const Dashboard: React.FC<{ onNavigate: (view: ActiveView) => void }> = ({ onNavigate }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: theme.spacing.lg,
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <Card title="🏌️ Player Management">
        <p style={{ margin: `0 0 ${theme.spacing.md} 0`, color: theme.colors.darkGray }}>
          Manage player profiles, handicaps, and categories. Import from CSV or add manually.
        </p>
        <Button onClick={() => onNavigate('players')}>
          Manage Players
        </Button>
      </Card>

      <Card title="⛳ Course Setup">
        <p style={{ margin: `0 0 ${theme.spacing.md} 0`, color: theme.colors.darkGray }}>
          Configure Luttrellstown Castle course data, par values, and stroke indexes.
        </p>
        <Button onClick={() => onNavigate('course')}>
          Setup Course
        </Button>
      </Card>

      <Card title="📊 Live Scoring">
        <p style={{ margin: `0 0 ${theme.spacing.md} 0`, color: theme.colors.darkGray }}>
          Enter scores in real-time with automatic Stableford point calculation.
        </p>
        <Button onClick={() => onNavigate('scoring')}>
          Start Scoring
        </Button>
      </Card>

      <Card title="🏆 Results Display">
        <p style={{ margin: `0 0 ${theme.spacing.md} 0`, color: theme.colors.darkGray }}>
          4K-optimized results display for TV screens. Live leaderboard and prizes.
        </p>
        <Button onClick={() => onNavigate('results')}>
          View Results
        </Button>
      </Card>

      <Card title="📋 Competition Status">
        <div style={{ fontSize: theme.typography.organizer.small, color: theme.colors.darkGray }}>
          <div style={{ marginBottom: theme.spacing.sm }}>
            <strong>Players:</strong> 0 registered
          </div>
          <div style={{ marginBottom: theme.spacing.sm }}>
            <strong>Course:</strong> Luttrellstown Castle
          </div>
          <div style={{ marginBottom: theme.spacing.sm }}>
            <strong>Format:</strong> Stableford
          </div>
          <div>
            <strong>Status:</strong> <span style={{ color: theme.colors.warning }}>Setup Required</span>
          </div>
        </div>
      </Card>

      <Card title="ℹ️ System Information">
        <div style={{ fontSize: theme.typography.organizer.small, color: theme.colors.darkGray }}>
          <div style={{ marginBottom: theme.spacing.sm }}>
            <strong>Scoring:</strong> Updated Stableford (-4→6pts)
          </div>
          <div style={{ marginBottom: theme.spacing.sm }}>
            <strong>Gender Support:</strong> Male & Female stroke indexes
          </div>
          <div style={{ marginBottom: theme.spacing.sm }}>
            <strong>Categories:</strong> Auto-balanced A/B/C
          </div>
          <div>
            <strong>Export:</strong> CSV & PDF ready
          </div>
        </div>
      </Card>
    </div>
  );
};

export default App;