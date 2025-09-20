import React, { useState } from 'react';
import { Button } from '../Common/Button';
import { Card } from '../Common/Card';
import { theme } from '../../theme';
import { calculateCategory } from '../../utils/categoryUtils';

interface Player {
  id?: string;
  name: string;
  handicap: number;
  gender: 'male' | 'female';
  email?: string;
  phone?: string;
  // Note: category is now calculated dynamically, not stored
}

export const PlayerManagement: React.FC = () => {
  // Load players from localStorage on component mount
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem('icgs-players');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id'>>({
    name: '',
    handicap: 0,
    gender: 'male',
    email: '',
    phone: '',
  });

  // Save players to localStorage whenever players array changes
  React.useEffect(() => {
    localStorage.setItem('icgs-players', JSON.stringify(players));
  }, [players]);


  const handleAddPlayer = () => {
    if (newPlayer.name && newPlayer.handicap >= 0) {
      const player: Player = {
        ...newPlayer,
        id: Date.now().toString(),
        // category is calculated dynamically, not stored
      };
      setPlayers([...players, player]);
      setNewPlayer({ name: '', handicap: 0, gender: 'male', email: '', phone: '' });
      setShowAddForm(false);
    }
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            alert('CSV file must have at least a header row and one data row');
            return;
          }
          
          const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
          
          const importedPlayers: Player[] = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim());
            const name = values[headers.indexOf('name')] || `Player ${index + 1}`;
            const handicap = parseInt(values[headers.indexOf('handicap')] || '18');
            const gender = (values[headers.indexOf('gender')] || 'male') as 'male' | 'female';
            
            return {
              id: (Date.now() + index).toString(),
              name: name.trim(),
              handicap: Math.max(0, Math.min(54, handicap)),
              gender: gender === 'female' ? 'female' : 'male',
              // category is calculated dynamically, not stored
              email: values[headers.indexOf('email')] || '',
              phone: values[headers.indexOf('phone')] || '',
            };
          });
          
          setPlayers([...players, ...importedPlayers]);
          alert(`Successfully imported ${importedPlayers.length} players!`);
        } catch (error) {
          alert('Error reading CSV file. Please check the format.');
          console.error('CSV Import Error:', error);
        }
      };
      reader.readAsText(file);
    }
    // Reset the file input
    event.target.value = '';
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Card title={`Player Management (${players.length} players)`}>
        <div style={{ 
          display: 'flex', 
          gap: theme.spacing.md, 
          marginBottom: theme.spacing.lg,
          flexWrap: 'wrap',
        }}>
          <Button onClick={() => setShowAddForm(true)} variant="primary">
            + Add Player
          </Button>
          
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            backgroundColor: theme.colors.success,
            color: theme.colors.white,
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            borderRadius: theme.components.button.borderRadius,
            fontWeight: theme.components.button.fontWeight,
          }}>
            📄 Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              style={{ display: 'none' }}
            />
          </label>

          <Button 
            onClick={() => {
              const csv = ['name,handicap,gender,email,phone']
                .concat(players.map(p => `${p.name},${p.handicap},${p.gender},${p.email || ''},${p.phone || ''}`))
                .join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'icgs-players.csv';
              a.click();
            }}
            variant="secondary"
          >
            💾 Export CSV
          </Button>

          {players.length > 0 && (
            <Button 
              onClick={() => {
                if (window.confirm(`Are you sure you want to remove all ${players.length} players?`)) {
                  setPlayers([]);
                }
              }}
              variant="danger"
              size="small"
            >
              🗑️ Clear All
            </Button>
          )}
        </div>

        {showAddForm && (
          <div style={{ 
            marginBottom: theme.spacing.lg,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.lightGray,
            borderRadius: theme.components.card.borderRadius,
          }}>
            <h3 style={{ margin: `0 0 ${theme.spacing.md} 0`, color: theme.colors.primary }}>
              Add New Player
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: theme.spacing.md,
            }}>
              <input
                type="text"
                placeholder="Player Name *"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.components.button.borderRadius,
                  border: `1px solid ${theme.colors.darkGray}`,
                  fontSize: theme.typography.organizer.body,
                }}
              />
              <input
                type="number"
                placeholder="Handicap *"
                min="0"
                max="54"
                value={newPlayer.handicap}
                onChange={(e) => setNewPlayer({...newPlayer, handicap: parseInt(e.target.value) || 0})}
                style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.components.button.borderRadius,
                  border: `1px solid ${theme.colors.darkGray}`,
                  fontSize: theme.typography.organizer.body,
                }}
              />
              <select
                value={newPlayer.gender}
                onChange={(e) => setNewPlayer({...newPlayer, gender: e.target.value as 'male' | 'female'})}
                style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.components.button.borderRadius,
                  border: `1px solid ${theme.colors.darkGray}`,
                  fontSize: theme.typography.organizer.body,
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input
                type="email"
                placeholder="Email"
                value={newPlayer.email}
                onChange={(e) => setNewPlayer({...newPlayer, email: e.target.value})}
                style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.components.button.borderRadius,
                  border: `1px solid ${theme.colors.darkGray}`,
                  fontSize: theme.typography.organizer.body,
                }}
              />
            </div>
            <div style={{ 
              display: 'flex', 
              gap: theme.spacing.sm, 
              marginTop: theme.spacing.md,
            }}>
              <Button onClick={handleAddPlayer} variant="success">
                Add Player
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {players.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: theme.colors.white,
            }}>
              <thead>
                <tr style={{ backgroundColor: theme.colors.primary, color: theme.colors.white }}>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'left' }}>Name</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'center' }}>Handicap</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'center' }}>Gender</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'center' }}>Category</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'center' }}>Contact</th>
                  <th style={{ padding: theme.spacing.sm, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr 
                    key={player.id} 
                    style={{ 
                      backgroundColor: index % 2 === 0 ? theme.colors.white : theme.colors.lightGray,
                      borderBottom: `1px solid ${theme.colors.lightGray}`,
                    }}
                  >
                    <td style={{ padding: theme.spacing.sm, fontWeight: 'bold' }}>
                      {player.name}
                    </td>
                    <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>
                      {player.handicap}
                    </td>
                    <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>
                      {player.gender === 'male' ? '♂️' : '♀️'} {player.gender}
                    </td>
                    <td style={{ 
                      padding: theme.spacing.sm, 
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: theme.colors.primary,
                    }}>
                      {calculateCategory(player.handicap)}
                    </td>
                    <td style={{ padding: theme.spacing.sm, fontSize: theme.typography.organizer.small }}>
                      {player.email && <div>📧 {player.email}</div>}
                      {player.phone && <div>📱 {player.phone}</div>}
                    </td>
                    <td style={{ padding: theme.spacing.sm, textAlign: 'center' }}>
                      <Button 
                        size="small"
                        variant="danger" 
                        onClick={() => removePlayer(player.id!)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: theme.spacing.xxl,
            color: theme.colors.darkGray,
          }}>
            <h3>No players registered yet</h3>
            <p>Add players manually or import from CSV file</p>
            <p style={{ fontSize: theme.typography.organizer.small, marginTop: theme.spacing.md }}>
              CSV format: name,handicap,gender,email,phone<br/>
              Example: "John Smith,12,male,john@email.com,+353123456789"
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};