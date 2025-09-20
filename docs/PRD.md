# ICGS Golf Competition Management System - Product Requirements Document

## Project Overview

**Product Name:** ICGS Score System  
**Version:** 0.1  
**Target Venue:** Luttrellstown Castle Golf Club  
**Organization:** Ireland Chinese Golf Society (ICGS)  
**Platform:** Web Application (React + TypeScript)

## Executive Summary

The ICGS Score System is a comprehensive golf competition management application designed specifically for the Ireland Chinese Golf Society's tournaments at Luttrellstown Castle Golf Club. The system provides real-time scoring, leaderboard management, and professional tournament features including advanced tiebreaking rules and live position tracking.

## Core Features

### 1. Player Management
- **Player Registration**: Support for player details including name, handicap, gender, and category (A/B/C)
- **CSV Import**: Bulk player import functionality with format: `name,handicap,gender,email,phone`
- **Gender-Aware Handicapping**: Separate stroke index calculations for male and female players
- **Category System**: Three-tier player categorization (A/B/C) for fair competition

### 2. Course Management
- **Luttrellstown Castle Integration**: Official course data with accurate par and stroke index information
- **18-Hole Layout**: Complete hole-by-hole configuration
- **Stroke Index System**: Gender-specific stroke indexes for fair handicap application
- **Course Data**: 
  - Par 72 layout
  - Men's and Ladies' stroke indexes
  - Accurate hole configurations (verified against official scorecard)

### 3. Scoring System
- **Stableford Scoring**: Industry-standard point system
  - Hole-in-one/Albatross (-4): 6 points
  - Eagle (-3): 5 points  
  - Birdie (-2): 4 points
  - Par (-1): 3 points
  - Par (0): 2 points
  - Bogey (+1): 1 point
  - Double Bogey or worse (+2+): 0 points
- **Pickup Rule**: Score of 0 = double par strokes, 0 points
- **Real-time Calculations**: Automatic point and stroke calculations
- **Score Persistence**: LocalStorage-based data persistence

### 4. User Interface & Experience
- **Spreadsheet-Style Input**: 18-hole scoring grid for intuitive data entry
- **Smart Defaults**: Par values pre-filled for quick adjustment
- **Keyboard Navigation**: Arrow key navigation and Enter key progression
- **Value Override**: Click-to-select-all for easy score modification
- **Visual Feedback**: Color-coded scoring (green for under par, orange for over par, red for pickups)
- **Responsive Design**: Optimized for various screen sizes

### 5. Leaderboard System
- **Real-time Updates**: 5-second auto-refresh for live competition tracking
- **Dual Display Modes**: 
  - Overall leaderboard (top 10 players)
  - Category-based leaderboards (A/B/C)
- **Position Tracking**: Visual indicators for ranking changes
  - Green up arrows (↗) for improved positions
  - Red down arrows (↘) for declined positions
- **Trophy System**: Visual recognition for top 3 positions
- **Time Display**: Live clock with last update timestamp

### 6. Professional Tiebreaking
- **Multi-Level Tiebreaking**: Industry-standard golf tiebreaking rules
  1. Total Stableford points (primary)
  2. Back 9 points
  3. Back 6 points (holes 13-18)
  4. Back 3 points (holes 16-18)
  5. Back 2 points (holes 17-18)
  6. Back 1 point (hole 18)
  7. Total strokes (final tiebreaker)
- **Hidden Calculations**: Background computation of tiebreaker scores
- **Automatic Ranking**: Real-time position updates based on tiebreaking rules

### 7. Data Management
- **Local Storage**: Browser-based data persistence
- **Automatic Backup**: Real-time score saving
- **Data Recovery**: Persistent storage across browser sessions
- **Export Capability**: Score data available for external analysis

## Technical Specifications

### Technology Stack
- **Frontend**: React 18+ with TypeScript
- **Styling**: CSS-in-JS with theme system
- **State Management**: React hooks with localStorage persistence
- **Build System**: Create React App
- **Development**: Hot reload, TypeScript checking

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-responsive design
- Touch-friendly interface

### Performance Requirements
- Sub-second score updates
- 5-second leaderboard refresh cycle
- Smooth UI interactions
- Efficient data processing for 50+ players

## User Workflows

### Competition Setup
1. Import player list via CSV
2. Review and categorize players
3. Verify course configuration
4. Initialize competition

### During Competition
1. Select player for scoring
2. Enter scores using spreadsheet interface
3. Navigate with arrow keys/Enter
4. Monitor leaderboard for live updates
5. Track position changes

### Competition Monitoring
1. Display leaderboard on secondary screen
2. Auto-refresh every 5 seconds
3. Switch between overall and category views
4. Monitor position changes in real-time

## Quality Assurance

### Testing Requirements
- Cross-browser compatibility testing
- Mobile device testing
- Load testing with maximum expected players
- Data persistence testing
- Tiebreaking algorithm validation

### Performance Metrics
- Page load time < 2 seconds
- Score update response < 500ms
- Leaderboard refresh < 1 second
- Memory usage optimization

## Success Metrics

### Primary KPIs
- Competition completion time reduction
- Score accuracy improvement
- User satisfaction scores
- System reliability (99%+ uptime during competitions)

### Secondary Metrics
- Reduced manual calculation errors
- Faster result publication
- Enhanced spectator engagement
- Simplified tournament management

## Future Enhancements

### Version 0.2 Roadmap
- Multi-tournament support
- Historical data analysis
- Export to PDF/Excel
- Player statistics tracking
- Email notifications
- Cloud synchronization

### Advanced Features
- Tournament bracket management
- Weather integration
- GPS hole tracking
- Photo integration
- Social media sharing

## Appendices

### A. Course Data
- Official Luttrellstown Castle scorecard integration
- Verified par and stroke index data
- Gender-specific handicap calculations

### B. Scoring Rules
- Stableford point system documentation
- Professional tiebreaking procedures
- Pickup rule implementation

### C. Technical Architecture
- Component structure documentation
- Data flow diagrams
- State management patterns

---

**Document Version:** 1.0  
**Last Updated:** September 2025  
**Next Review:** Post-tournament feedback incorporation