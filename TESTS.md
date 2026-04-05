This file contains a comprehensive concise list of the tests and should be
updated everytime tests were modified, extended or added.

# E2E Tests (Playwright)

## Authentication
- auth state persists after page reload
- logout clears auth state

## Circles
### Create (UI)
- can create a new circle via UI and view it
- newly created circle appears in My Circles sidebar

### View List
- displays circles on explore page
- circle detail page shows circle info

### Follow
- user can follow a circle
- user can unfollow a circle

## Questions
### Create
- can create a new question via UI and view it
- newly created question appears on circle page without refresh

### Edit
- question edit page is accessible (verifies title input is pre-filled)
- question can be deleted via UI (confirm dialog, navigates back, question removed)

### View Detail
- displays question detail page with title, body, and answer count
- shows answers on question detail page (verifies answer text is rendered)

## Answers
### Create (UI)
- can create an answer via UI
- can view question with answer

### Edit
- answer owner can access edit mode
- answer owner can trigger delete confirmation

### Mark Solution
- question owner can mark an answer as solution
- question owner can unmark a solution

### Reply
- user can reply to an answer (creates answer via API, then replies to it via UI)
- ~~reply editor vanishes after successful submission~~ (skipped)
- main answer editor stays visible after submission

### Permissions
- non-owner cannot see edit/delete buttons on others answers

### Unauthenticated
- unauthenticated user sees login prompt instead of reply
- unauthenticated user cannot see answer editor

## Voting
### Upvote
- can upvote a question (verifies count 1→2, button disabled after)
- can upvote an answer (verifies count 1→2, button disabled after)

### Downvote
- user can downvote a question (verifies count 1→0, button disabled after)
- user can downvote an answer (verifies count 1→0, button disabled after)

### Unauthenticated
- voting requires authentication (verifies login dialog appears)

## Moderation
### Approve
- moderator can approve a question
- moderator can approve an answer

### Block
- moderator can block a question
- moderator can block an answer
- blocked answer hidden from non-moderators

### Close Comments
- moderator can close comments on question
- closed question shows comments closed message

### Notes
- moderator can add note to question
- note is visible on question detail

## Profile
- profile page displays user info
- profile shows users circles

## Notifications
- notification bell is visible
- notification shows badge with count and opens menu with link

## Navigation
- Critical routes render without errors (/, /explore, /profile, /imprint, /privacy, /terms, /disclaimer)
- 404 page for unknown routes (verifies 404 heading, error message, and back button)
