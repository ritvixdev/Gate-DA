# Gate TikTok — Linear Algebra Design

**Date:** 2026-06-20  
**Status:** Approved

## Goal

Add a mobile-first, immersive revision feed to the Linear Algebra Reference section. Students move through nearly full-screen learning cards, open deeper explanations without losing their position, and tap linked concepts for instant definitions, formulas, examples, and related ideas.

## Experience

- The page uses a dedicated dark presentation while retaining the site's coral, cream, teal, typography, and math styling.
- One card occupies nearly the full viewport. Touch, wheel, trackpad, Page Up/Down, and arrow keys move one card using CSS scroll snapping.
- A top-left topic bubble opens guided navigation through the nine Linear Algebra topics.
- Cards mix deep dives, cheat sheets, traps, worked examples, practice, and real GATE questions.
- Tapping the non-interactive area of a card opens a full-height detail sheet. It contains a fuller explanation, method or derivation, example, misconception, connections, and a link to the existing lesson.
- Explicitly linked terms open a compact concept popover. Related concept chips allow students to follow connections without leaving the feed.
- The current card and completed cards are stored locally and restored on return.

## Content architecture

- `gate-tiktok-data.js` owns subject topics and curated card records.
- `gate-concepts.js` owns canonical concept records and relationships.
- Cards reference concepts by stable IDs. Linking is explicit to avoid accidental matches.
- Existing lesson and GATE-question pages remain the authoritative long-form sources.
- The runtime is subject-neutral; later subjects can provide compatible data without changing the feed engine.

## Motion and accessibility

- CSS controls layout and scroll snapping.
- GSAP, loaded from a pinned CDN, enhances card, formula, sheet, feedback, and concept transitions.
- Missing GSAP or reduced-motion preferences leave all content and interactions functional.
- Dialogs trap focus, restore focus on close, respond to Escape, expose accessible labels, and provide keyboard navigation.

## Pilot scope

- Complete Linear Algebra coverage across nine topics.
- Approximately 16 cards per topic, about 144 total.
- No backend, login, database, framework, or build step.

