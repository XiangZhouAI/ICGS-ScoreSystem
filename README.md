# ICGS Golf Competition Management System

A comprehensive web-based scoring system designed specifically for the Ireland Chinese Golf Society (ICGS) tournaments at Luttrellstown Castle Golf Club.

![ICGS Logo](assets/ICGS_logo.jpg)

## Features

- **Real-time Scoring**: Stableford point system with instant calculations
- **Live Leaderboard**: Auto-refreshing leaderboard with position change indicators
- **Professional Tiebreaking**: Industry-standard golf tiebreaking rules (back 9, back 6, etc.)
- **Gender-Aware Handicapping**: Separate stroke index calculations for fair play
- **Category Competition**: A/B/C category leaderboards
- **Intuitive Interface**: Spreadsheet-style scoring with keyboard navigation
- **Course Integration**: Official Luttrellstown Castle scorecard data

## Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ICGS-ScoreSystem
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - The application will automatically reload when you make changes

### Production Build

To create a production build:

```bash
cd client
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Usage

### Setting up a Competition

1. **Import Players**
   - Go to Course Setup
   - Import player data using CSV format: `name,handicap,gender,email,phone`
   - Sample file available at `test-scripts/test-players.csv`

2. **Configure Categories**
   - Players are automatically categorized (A/B/C) based on handicap
   - Review and adjust categories as needed

3. **Start Scoring**
   - Navigate to Scoring Entry
   - Select players to add them to the scoring grid
   - Enter scores using the spreadsheet interface

### Scoring Interface

- **Default Values**: Each hole defaults to par value
- **Navigation**: Use arrow keys to move between holes
- **Quick Entry**: Press Enter to move to next hole
- **Value Override**: Click on a score to select all and type new value
- **Pickup Rule**: Enter `0` for pickup (counts as double par strokes, 0 points)

### Leaderboard Display

- **Auto-refresh**: Updates every 5 seconds during competition
- **View Modes**: Switch between Overall and Category leaderboards
- **Position Indicators**: Green ↗ for moving up, Red ↘ for moving down
- **Live Clock**: Shows current time and last update

## Project Structure

```
ICGS-ScoreSystem/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── theme.ts       # Design system
│   │   └── ...
│   ├── public/            # Static assets
│   └── package.json       # Dependencies and scripts
├── assets/                # Images, logos, course data
├── docs/                  # Documentation and requirements
├── test-scripts/          # Development and testing scripts
└── README.md             # This file
```

## Course Data

The system uses official Luttrellstown Castle Golf Club scorecard data:

- **Par**: 72 (36 front, 36 back)
- **Holes**: 18 holes with accurate par and stroke index data
- **Gender-specific**: Separate stroke indexes for men and women
- **Source**: `assets/Luttrellstown-Castle-Score-Card.pdf`

## Scoring System

### Stableford Points
- **Hole-in-one/Albatross** (-4 from par): 6 points
- **Eagle** (-3): 5 points
- **Birdie** (-2): 4 points
- **Par** (-1): 3 points
- **Par** (0): 2 points
- **Bogey** (+1): 1 point
- **Double Bogey or worse** (+2+): 0 points

### Tiebreaking Rules
1. Total Stableford points
2. Back 9 points (holes 10-18)
3. Back 6 points (holes 13-18)
4. Back 3 points (holes 16-18)
5. Back 2 points (holes 17-18)
6. Back 1 point (hole 18)
7. Total strokes (lowest wins)

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (irreversible)

### Key Technologies

- **React 19** with TypeScript
- **CSS-in-JS** for styling
- **localStorage** for data persistence
- **Create React App** for tooling

### Testing

Test files are available in `test-scripts/` for validating:
- Course data accuracy
- Scoring calculations
- Gender-based handicapping
- High handicap scenarios

## Troubleshooting

### Common Issues

1. **Scores not saving**
   - Check browser localStorage is enabled
   - Ensure JavaScript is not blocked

2. **Leaderboard not updating**
   - Verify auto-refresh is enabled
   - Check browser console for errors

3. **Position arrows not showing**
   - Arrows appear after position changes occur
   - May take 5+ seconds for tracking to activate

### Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

Mobile browsers are supported with responsive design.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For technical issues or feature requests, please contact the development team or create an issue in the repository.

## License

This project is developed specifically for the Ireland Chinese Golf Society (ICGS) tournaments.

---

**Version**: 0.1  
**Last Updated**: September 2025  
**Venue**: Luttrellstown Castle Golf Club, Dublin, Ireland