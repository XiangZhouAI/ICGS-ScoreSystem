# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Very important :  
- Do not fuckin change anything I did not ask for Just do only what I fuckin told you 
- commit and push code after each phase to git



## Project Overview

This is a full-stack Golf Competition Management and Scoring Application designed for organizers to manage golf competitions on laptops with results displayed on connected 4K screens (3840x2160). The application handles player management, course configuration, real-time scoring, and prize calculations using the Stableford scoring system.

## Technology Stack (Planned)

- **Frontend**: React (laptop organizer interface + 4K presentation display)
- **Backend**: Node.js 
- **Database**: MongoDB
- **Deployment**: Local laptop deployment

## Key Application Components

### Core Functionality
1. **Player & Handicap Management**: Preload, add, edit, delete player information
2. **Course Configuration**: 18-hole setup with par values and separate male/female stroke indexes
3. **Dynamic Handicap Categories**: Auto-divide players into three equal groups by handicap
4. **Score Entry Interface**: Organizer-optimized for rapid stroke entry per hole
5. **Stableford Calculation Engine**: Updated scoring (-4→6pts, -3→5pts, -2→4pts, -1→3pts, Par→2pts, +1→1pt, +2+→0pts)
6. **Rule-based Prize Engine**: Most birdies/bogeys, scratch holes, lowest Par 3 scores, best individual holes
7. **Export System**: CSV results and PDF competition summaries

### Design Requirements
- **Color Palette**: Blue-based theme derived from society logo
- **4K Display Optimization**: Text legible from 4-10 meters distance
- **Logo Integration**: Society logo + up to 7 sponsor logo slots
- **Performance**: Instant calculations and display updates

## Development Process

This project follows a multi-role iterative workflow:
1. **PM Phase**: Requirements clarification, prioritization, acceptance criteria
2. **UX Design Phase**: Wireframes, layouts, visual guidelines  
3. **Development Phase**: Frontend/backend implementation
4. **QA Phase**: Testing against requirements with mandatory pause for questions
5. **PM Sign-Off**: Final approval before next iteration

**Important**: After each QA phase, development must pause and ask clarifying questions before continuing to the next iteration.

## Key Architectural Considerations

- **Scoring Accuracy**: Stableford calculations must be 100% accurate
- **Data Integrity**: Prevent data loss during competitions
- **User Experience**: Organizer-first workflows prioritizing speed and simplicity
- **Display Performance**: Real-time updates for 4K presentation screen
- **Extensibility**: Prize engine must support adding new rules

## Project Requirements Reference

All detailed functional and non-functional requirements are documented in `prompt.txt`. Refer to this file for:
- Complete Stableford scoring rules
- Specific prize calculation logic
- 4K display formatting requirements
- Export format specifications
- UX workflow requirements