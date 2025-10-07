# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dance Live Stream Demo is a TikTok/YouTube Live-style interactive dance streaming application. This is a **sales demo prototype** designed for 1-2 minute video demonstrations. The entire application runs frontend-only with mock data—no backend required.

**Target Device**: iPhone 14 Pro (390×844px), portrait orientation only.

## Development Commands

```bash
# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs on `http://localhost:3000` (note: configured to use port 3000, not the Vite default 5173).

## Architecture Overview

### Application Flow

The app has 4 primary modes managed through a single state machine in `App.tsx`:

1. **Dashboard** (`'dashboard'`) - Live stream grid, start button, my page access
2. **Streamer Mode** (`'streamer'`) - Broadcast your own practice session
3. **Viewer Mode** (`'viewer'`) - Watch others' streams, donate, comment
4. **My Page** (`'mypage'`) - View statistics and past stream history

State transitions are handled via callbacks passed down to child components. The `selectedStreamId` state tracks which stream is being viewed in viewer mode.

### Page Transitions

All mode transitions use Framer Motion with consistent animation variants:
- Pages slide in from right (x: 300) and exit to left (x: -300)
- Duration: 0.3s with easeInOut easing
- Transitions are defined in `App.tsx` as `pageVariants` and `pageTransition`

### Core Data Flow

**Realtime Score System** (`hooks/useRealtimeScore.ts`):
- Updates every 5 seconds when active
- Maintains rolling window of 12 data points (60 seconds)
- Score fluctuates ±3 points per update, capped at 100
- Tracks: score, cumulative donations, comment count, emotion average
- `addDonation()` callback immediately updates latest data point with bonus score

**Mock Comments** (`hooks/useMockComments.ts`):
- Generates random comments every 4 seconds when active
- Comments auto-delete after 3 seconds
- Comments are categorized as positive/neutral/negative with corresponding colors

### Key Architectural Patterns

**Component Organization**:
- **Views** (Dashboard, StreamerMode, ViewerMode, MyPage) - Top-level screens
- **Feature Components** (RealtimeChart, DonationModal, CommentPopup, etc.) - Reusable UI
- **Utility Components** (WebcamView, YouTubePlayerWrapper) - Third-party integrations

**Data Mocking**:
- `data/mockStreams.ts` - Stream list with YouTube video IDs
- `data/mockComments.ts` - Comment pool with emotion labels
- `data/mockFeedback.ts` - AI feedback messages

**Type System** (`types/demo.ts`):
- `AppMode` - Union type for app states
- `StreamData` - Stream metadata
- `ScoreData` - Time-series performance data
- `Comment` / `Donation` - User interaction types

## Important Implementation Details

### Webcam Integration
- Uses `navigator.mediaDevices.getUserMedia()`
- Implements mirror effect via CSS `scaleX(-1)`
- Camera stops when leaving streamer mode (cleanup in useEffect)
- Requires HTTPS in production or localhost for permissions

### YouTube Player
- Uses `react-youtube` library
- Auto-plays and loops via `opts` configuration
- Player state managed through `onStateChange` callback
- Video IDs stored in mock data, easily swappable

### Chart.js Configuration
- Uses 2-axis setup: left Y-axis for score (0-100), right Y-axis for donations (¥)
- Updates are animated with 500ms easeInOutQuart transitions
- Chart.js modules must be explicitly registered in `RealtimeChart.tsx`
- Time labels auto-format from timestamps

### Donation Bonus Logic
- ¥100 → +10 score
- ¥500 → +25 score
- ¥1000 → +50 score
- Score capped at 100 even with bonuses
- Donations immediately update the graph's latest data point

### Environment Variables
- `.env.local` contains `GEMINI_API_KEY` (currently unused in demo)
- Vite exposes env vars via `process.env` in config
- API integration is planned for future phases but not implemented

## Path Aliases

TypeScript and Vite are configured with `@/*` alias pointing to project root:
```typescript
import { StreamData } from '@/types/demo';
import { mockStreams } from '@/data/mockStreams';
```

## Mobile-First Considerations

- All measurements assume 390px width (iPhone 14 Pro)
- Touch interactions use `onTouchStart/Move/End` for swipe gestures (viewer mode)
- No horizontal scrolling - everything fits in viewport
- Fixed positioning for floating buttons (donation, controls)
- Tailwind responsive classes target mobile-first breakpoints

## Demo Scenario Timing

When adding features, keep in mind the demo is designed for:
- **10s**: Dashboard → My Page → Back
- **30s**: Streamer mode with score updates and feedback
- **30s**: Viewer mode with donations and comments
- **5s**: Final statistics view

Intervals and animation timings are tuned for this 75-second demonstration flow.
