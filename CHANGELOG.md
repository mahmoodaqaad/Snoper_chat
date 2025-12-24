# Changelog

All notable changes to the Real Chat App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-12-21

### Added
- **Advanced Search**: Unified search system for users and posts with real-time suggestions.
- **Debounced Search Bar**: Improved performance with 300ms delay during typing.
- **Glassmorphism Suggestions Dropdown**: Visual feedback for search results.

## [1.2.0] - 2025-12-21

### Added

#### Client-Side

**New Pages**
- `RequestsPage.jsx` - Dedicated page for viewing friend requests with sidebar navigation
- `SuggestionsPage.jsx` - Dedicated page for friend suggestions ("People You May Know")
- `Footer.jsx` - Bottom navigation bar for mobile devices (≤991px) with active state indicators

**New Features**
- Bottom navigation bar for mobile with 5 icons: Home, Messages, Users, Notifications, Profile
- Active state indicators on navigation (purple highlight + bottom line)
- Typing indicator animation with 3 bouncing dots
- Automatic message read receipts when opening a chat
- Real-time message status updates (Sent → Delivered → Read)

**New CSS Files**
- `Footer.css` - Styling for bottom navigation with glassmorphism effect
- `typing-animation.css` - Smooth bouncing dot animation for typing indicator

**UI Improvements**
- Grid layout for Friends, Requests, and Suggestions pages (responsive: 4 columns → 2 → 1)
- Modern gradient pill buttons for friend actions (Accept/Reject, Add Friend)
- Glass-card dropdown menu for chat options (Profile, Delete)
- Beautiful placeholder styling with purple accent on focus
- Chat input positioned above bottom nav on mobile with blur effect

#### Server-Side

**Socket Events**
- `messageReceived` - Handles delivery receipt when message reaches recipient
- `messageReceivedStatus` - Broadcasts delivery status to sender

### Changed

#### Client-Side

**Navigation**
- Updated `App.js` routes to include `/requests` and `/suggestions`
- Fixed `LeftSide.jsx` links to point to correct routes
- Added lazy loading for new pages

**Components Refactored**
- `MyFriends.jsx` - Changed from vertical list to responsive grid, added `isWidget` mode
- `RequestAdded.jsx` - Redesigned with card grid layout
- `AddFriends.jsx` - Updated grid spacing and removed redundant header
- `Freinds.jsx` - Adjusted layout to accommodate sidebar (col-lg-9)
- `UserChat.jsx` - Modernized options dropdown, fixed `readMassage` function
- `Message.jsx` - Fixed status check logic to handle boolean/number/string types
- `Footer.jsx` - Replaced `Link` with `NavLink` for active states, removed unused logic

**Context Updates**
- `ChatContext.js`:
  - Added auto-mark-as-read on chat open (lines 269-309)
  - Fixed `messageReceivedStatus` listener to handle type variations
  - Added `messageReceived` emission in `getMessage` and `getMessagesNotif`
  - Fixed useEffect dependencies

**Styling**
- `App.css` - Added placeholder styling with `--text-secondary` color and focus effects
- `index.css` - Added mobile-specific chat input positioning with 60px bottom padding
- Updated button styles to use modern gradients and pill shapes

**Bug Fixes**
- Fixed message status not updating correctly (type mismatch: 0/false/1/true/"received")
- Fixed `readMassage` function using wrong variable (`createChat.id` → `userChat.id`)
- Fixed messages not marking as read when opening chat
- Fixed chat input overlapping bottom navigation on mobile
- Fixed placeholder text color being too dark/invisible

#### Server-Side

**Socket Handlers**
- `index.js` - Added `messageReceived` event listener (lines 147-157) to broadcast delivery receipts

### Fixed

- Message status indicators now properly show Sent (✓) → Delivered (✓✓ light) → Read (✓✓ blue)
- Real-time status updates work correctly for both sender and receiver
- Bottom navigation no longer conflicts with chat input on mobile
- Typing indicator shows smooth animation instead of static text
- All navigation links work correctly
- ESLint warnings for missing dependencies in useEffect hooks

### Technical Details

**Database**
- `statusRead` field: `0`/`false` (Sent), `"received"` (Delivered), `1`/`true` (Read)

**Socket Event Flow**
1. User A sends message → `sendMessage` event
2. User B receives → `getMessage` event → emits `messageReceived`
3. User A gets `messageReceivedStatus` → status changes to "received"
4. User B opens chat → marks as read in DB → emits `messageRead`
5. User A gets `messageReadStatus` → status changes to 1 (read)

**Responsive Breakpoints**
- Mobile: ≤991px (bottom nav visible, chat input adjusted)
- Desktop: >991px (sidebar visible, no bottom nav)

**Dependencies**
- No new packages added
- Uses existing: React Router DOM, Socket.io-client, Axios, FontAwesome, Moment, SweetAlert2

---

## [1.1.0] - Previous Version
(Previous changelog entries would go here)

## [1.0.0] - Initial Release
(Initial release notes would go here)
