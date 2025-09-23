# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CardinalNStar is a web portal application that serves as a quick access hub for NStarX resources and documentation. It features multiple themed interfaces including Modern, Retro, Terminal, Neon, Glassmorphism, and Carnival modes.

## Development Commands

Since this is a static HTML/CSS/JavaScript site with no build process:

```bash
# Open the site locally
open index.html

# Run a local server (if Python is available)
python3 -m http.server 8000

# Or with Node.js
npx serve .
```

## Architecture

### Core Structure

The application uses a **static multi-page architecture** with shared components:

- **Entry Points**:
  - `index.html` - Main portal with quick links to resources
  - `engineering-laws.html` - Engineering laws documentation with elegant design
  - `engineering-laws-terminal.html` - Terminal-themed version of engineering laws

- **Data Layer**:
  - `data.json` - Contains portal links, metadata, and configuration
  - `engineering-law.json` - Engineering laws content data

- **Shared Components**:
  - `assets/css/common.css` - Base styles and theme foundations
  - `assets/js/common.js` - Core utilities including:
    - Theme management system (`applyTheme()`)
    - Service status checking (`checkServiceStatus()`)
    - Dialog system
    - EventBus for component communication
    - Animation utilities (fade in/out)

### Theme System

The application implements a dynamic theme switching system:

1. **Theme Storage**: Uses `localStorage` to persist theme selection
2. **Available Themes**: Modern, Retro, Terminal, Neon, Glassmorphism, TuiCSS, Carnival
3. **Theme Application**: Managed through `applyTheme()` function that:
   - Toggles theme-specific CSS classes on body
   - Manages external stylesheet loading (e.g., TuiCSS)
   - Triggers theme-specific JavaScript (e.g., Carnival mode animations)

### Key Design Patterns

- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced features added when available
- **Component Communication**: Global EventBus (`window.eventBus`) for decoupled component interaction
- **Utility Namespace**: All common utilities exposed via `window.CardinalUtils` object
- **Visual Effects**: Heavy use of CSS gradients, animations, and blend modes for aesthetic appeal

## Important Implementation Notes

1. **No Build Process**: This is intentionally a static site - avoid adding complex tooling
2. **Theme Isolation**: Each theme's styles should be scoped to avoid conflicts
3. **Status Checking**: Uses `no-cors` fetch for service availability checks
4. **Loading Screen**: Automatic 500ms delay before hiding to ensure smooth transition
5. **Cardinal Compass SVG**: Background element positioned absolutely at viewport center