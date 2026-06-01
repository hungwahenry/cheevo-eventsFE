# Frontend Refactor Plan

Audit of the Expo frontend (214 .ts/.tsx files, ~10.4k LOC) covering 7 concerns:
component duplication, inline styles, file structure, god components,
business-logic-in-JSX, bad practices, and pattern consistency.

Each phase below is self-contained — finish one, commit, move to the next.
Time estimates assume working through file-by-file.

---

## TL;DR — What's clean, what isn't

**Already clean** (no action needed):
- API client usage — everything goes through `lib/api/client.ts`, no direct axios/fetch elsewhere
- Forms — RHF + zod everywhere, no hand-rolled form state
- Date/time + money formatting — centralized in `lib/format/*` and used consistently
- Theme color access — `useUniwind() + THEME[theme]` pattern is uniform
- Haptics — all via `lib/haptics.ts`, no inline `Haptics.*` calls
- File naming — kebab-case everywhere, no violations
- Hook naming — `use-X.ts` everywhere, one hook per file
- EmptyState component used consistently for empty UI

**Needs work**:
- 1 confirmed double-toast bug (checkout)
- 28 inline styles that should be tailwind classes
- 3 reusable patterns duplicated across features (SheetHeader, EventFlyer, StatusPill)
- 2 misplaced modules (`components/gif-picker/`, `lib/giphy/use-giphy-search.ts`)
- 5 god components carrying state + orchestration that belongs in hooks
- 3 large features with flat `components/` folders that warrant sub-folders
- 1 inconsistent feature barrel (onboarding exposes too much)

---

## Phase 1 — Fix double-toast (15 min)

**Goal:** Remove duplicate error toasts. Global `MutationCache.onError` in
[lib/query.ts:8-11](lib/query.ts#L8-L11) already toasts all non-422 errors. Any hook that
also toasts non-422 will fire twice.

**Confirmed culprit:**
- [features/checkout/hooks/use-checkout.ts:40-49](features/checkout/hooks/use-checkout.ts#L40-L49) — the `else` branch on line 45-47 toasts non-validation errors. Global handler does the same. **Drop that branch**, keep only the validation-error branch since the global skips 422s.

**Verified safe** (don't touch):
- `use-verify-form.ts` — only uses `form.setError`, no toast
- `use-comment-compose.ts` — only toasts validation (422), global skips
- All other mutation hooks — no `onError`, rely on global

**Test:** trigger a non-422 error (e.g. take checkout offline) — confirm one toast.

---

## Phase 2 — Inline styles → tailwind classes (30 min)

**Goal:** 28 fixable inline styles. Keep `style={{}}` only for genuinely dynamic
values (animated, runtime theme color, window dims, safe-area numbers).

### Mechanical replacements

| Pattern | Replace with | Files |
|---|---|---|
| `const fillParent = { width: '100%', height: '100%' }; style={fillParent}` | `className="size-full"` (delete the constant) | [event-detail-flyer.tsx:6,20](features/event-detail/components/event-detail-flyer.tsx#L6), [event-detail-gallery.tsx](features/event-detail/components/event-detail-gallery.tsx), [event-detail-feature-card.tsx:9,26](features/event-detail/components/event-detail-feature-card.tsx#L26), [event-card-flyer.tsx:6](features/feed/components/event-card-flyer.tsx#L6), [event-card-video.tsx:7](features/feed/components/event-card-video.tsx#L7) |
| `style={{ width: '100%', height: '100%' }}` | `className="size-full"` | [event-ticket-card.tsx:28](features/tickets/components/event-ticket-card.tsx#L28), [event-ticket-detail.tsx:60](features/tickets/components/event-ticket-detail.tsx#L60), [comment-gif.tsx:16](features/event-comments/components/comment-gif.tsx#L16), [comment-compose.tsx:139](features/event-comments/components/comment-compose.tsx#L139) |
| `style={{ flex: 1 }}` | `className="flex-1"` | [tickets-list.tsx:47](features/tickets/components/tickets-list.tsx#L47), [event-comments-sheet.tsx:102](features/event-comments/components/event-comments-sheet.tsx#L102), [checkout-sheet.tsx:100](features/checkout/components/checkout-sheet.tsx#L100), [auth-layout.tsx:48](features/auth/components/auth-layout.tsx#L48), [onboarding-layout.tsx:53](features/onboarding/components/onboarding-layout.tsx#L53), [gif-picker/index.tsx:96](components/gif-picker/index.tsx#L96) |
| `style={{ gap: COLUMN_GAP }}` (=8) | `className="gap-2"` | [gif-picker-grid.tsx:65,87](components/gif-picker/gif-picker-grid.tsx#L65) |
| `style={{ width: 140, height: 140 }}` | `className="size-[140px]"` | [event-detail-gallery.tsx:21](features/event-detail/components/event-detail-gallery.tsx#L21) |
| `style={{ width: '100%', aspectRatio: aspect, height: '100%' }}` | `className="size-full" style={{ aspectRatio: aspect }}` | [gif-picker-tile.tsx:22,25](components/gif-picker/gif-picker-tile.tsx#L22) |

### Leave alone (legitimately dynamic)

- Reanimated `animatedStyle` props
- `style={{ height }}` derived from `useWindowDimensions()` (event-detail-flyer)
- `style={{ paddingBottom: insets.bottom + N }}` for safe-area
- `style={{ color: colors.foreground }}` for `BottomSheetTextInput` (needs JS value)
- `style={{ aspectRatio: gif.aspect }}` (dynamic per-gif)
- Avatar picker dynamic sizing (`width: size, height: size, borderRadius: size/2`)
- Date picker height (`height: 216`)

**Test:** screens should render identically; no visual regression.

---

## Phase 3 — Relocate misplaced code (10 min)

**Goal:** One small util is inlined that belongs in `lib/`.

> **Note:** Originally proposed moving `components/gif-picker/` into event-comments. Reverted — gif-picker is a generic UI primitive that other surfaces (messages, broadcasts, reactions) will reuse later. Stays at `components/gif-picker/`. Its data hook stays at `lib/giphy/use-giphy-search.ts` next to its api/types.

### 3a. Move `formatBirthday()` from `birthday-field.tsx:10-15` → `lib/format/datetime.ts`

**Reasoning:** Date formatter inlined into a component. Belongs in the shared formatter module.

---

## Phase 4 — Extract shared primitives (1 hour)

**Goal:** Three patterns are reimplemented across features. Extract once, replace.

### 4a. `components/ui/sheet-header.tsx` (replaces 2 duplicates)

Both [comments-sheet-header.tsx](features/event-comments/components/comments-sheet-header.tsx) and [report-sheet-header.tsx](features/reports/components/report-sheet-header.tsx) define the same structure: `border-b px-5 pb-3` + bold title + optional subtitle.

Shape:
```tsx
type Props = { title: string; subtitle?: string };
```

Steps:
1. Create `components/ui/sheet-header.tsx` with the unified component
2. Delete the two existing sheet-header files
3. Update imports in `event-comments-sheet.tsx` and `report-sheet.tsx`

### 4b. `components/event-flyer.tsx` (replaces 4 duplicate image/video branches)

Every flyer rendering site does the same `flyer_type === 'video' ? <VideoView/EventCardVideo> : <Image>` dance. Sites:
- [event-detail-flyer.tsx](features/event-detail/components/event-detail-flyer.tsx) — full-bleed hero, autoplay video
- [event-card-flyer.tsx](features/feed/components/event-card-flyer.tsx) — feed card, autoplay when visible
- [event-ticket-card.tsx:23-32](features/tickets/components/event-ticket-card.tsx#L23-L32) — small thumb, video broken (image-only)
- [event-ticket-detail.tsx:56-64](features/tickets/components/event-ticket-detail.tsx#L56-L64) — medium thumb, video broken (image-only)

The tickets-page sites also surfaced separately as "videos don't show" — same root cause.

**Shape:**
```tsx
type Props = {
  flyerUrl: string | null;
  flyerType: 'image' | 'video' | null;
  variant: 'hero' | 'card' | 'thumbnail';   // controls auto-play + sound toggle visibility
  isVisible?: boolean;                       // for autoplay variants (feed list)
};
```

- `hero` and `card` — autoplay, muted, with sound toggle
- `thumbnail` — paused first-frame, no controls (use `useVideoPlayer` without calling play)

This collapses 4 implementations into 1 component + 2 internal variants (image/video).

### 4c. `components/ui/status-pill.tsx` (consolidates 3 pill components)

Three inline pill implementations:
- `GoingPill` inline in [comment-row.tsx:84-92](features/event-comments/components/comment-row.tsx#L84-L92)
- [`TicketStatusPill`](features/tickets/components/ticket-status-pill.tsx)
- `UrgencyChip` inline in [ticket-picker-row.tsx](features/checkout/components/ticket-picker-row.tsx)

All three: `rounded-full px-1.5 py-px` + colored text. Differ only in label + tone.

**Shape:**
```tsx
type Props = {
  label: string;
  tone: 'primary' | 'success' | 'warning' | 'destructive' | 'muted';
  // size?: 'sm' | 'md' — start with one, expand if needed
};
```

Then:
- `GoingPill` becomes `<StatusPill label="Going" tone="primary" />`
- `TicketStatusPill` becomes a thin wrapper that maps ticket status → tone
- `UrgencyChip` becomes `<StatusPill label={...} tone="warning" />`

---

## Phase 5 — Decompose god components (2 hours)

**Goal:** State + orchestration moves to hooks. Components stay presentational.

### 5a. `features/checkout/components/checkout-sheet.tsx` (168 lines)

Currently the JSX file holds cart state, quote state, the checkout mutation handler with branching success logic (cancel detection, status checks, multi-step toast/dismiss), and theme handling.

Move:
- Mutation orchestration → expand the existing [`useCheckout`](features/checkout/hooks/use-checkout.ts) to accept `onCancelled` + `onConfirmed` + `onError` callbacks; component passes its dismiss/clear-cart side effects in
- The `handleCheckout` event handler in the component becomes 2-3 lines

### 5b. `features/event-comments/components/event-comments-sheet.tsx` (135 lines)

Owns three sheet refs, comment-action handlers, delete dialog state, report dispatch.

Move:
- Long-press → openActions + report dispatch → new `useCommentsSheetActions(sheet, reportRef, actionsRef)` hook
- Leave the sheet shell + ref mounting in the component (presentational)

### 5c. `features/event-detail/components/event-detail-screen.tsx` (147 lines)

Currently owns: data fetching, scroll-based animation shared value, two refs, action sheet orchestration, report dispatch, error/loading states.

Move:
- Scroll handler + sharedValue → new `useEventDetailScroll()` hook returning `{ scrollY, onScroll, pinStart, pinEnd }`
- Keep refs in the screen (presentation owns the imperative API surface)

### 5d. `components/gif-picker/index.tsx` (117 lines) — *after Phase 3a it lives at features/event-comments/components/gif-picker/index.tsx*

Owns query state, debounced search, theme. Extract:
- `useGiphySearchState()` in the same folder
- Keep `index.tsx` as the sheet shell + composition

### 5e. `features/event-detail/components/event-detail-action-bar.tsx` (141 lines)

Defines `PresaleRsvpAction`, `RsvpAction`, `CommentsButton`, `ActionBarWrapper` inline. Each 5-40 lines.

Split into a sub-folder (overlaps with Phase 6 for this feature). Files:
- `event-detail-action-bar/index.tsx` (composition root)
- `event-detail-action-bar/presale-rsvp-action.tsx`
- `event-detail-action-bar/rsvp-action.tsx`
- `event-detail-action-bar/comments-button.tsx`
- `event-detail-action-bar/action-bar-wrapper.tsx`

### 5f. Move `splitMasonry()` from [gif-picker-grid.tsx:95-113](components/gif-picker/gif-picker-grid.tsx#L95-L113) → `lib/masonry-layout.ts`

Pure data transformation (masonry column distribution). Belongs in lib, not in a component file.

---

## Phase 6 — Folder restructuring in large features (1.5 hours)

**Goal:** Three features have flat `components/` folders with 9-13 files. Group by domain.

### 6a. `features/event-detail/components/` → 4 sub-folders

Current: 13 components flat. Propose:

```
event-detail/components/
├── header/
│   ├── event-detail-header.tsx
│   ├── event-detail-pinned-header.tsx
├── detail/
│   ├── event-detail-screen.tsx
│   ├── event-detail-flyer.tsx (or delete after Phase 4b)
│   ├── event-detail-about.tsx
│   ├── event-detail-section.tsx
│   ├── event-detail-promo.tsx
│   ├── event-detail-presale-banner.tsx
│   ├── event-detail-organisation.tsx
├── tickets/
│   ├── event-detail-tickets.tsx
│   ├── event-detail-ticket-card.tsx
├── actions/
│   ├── event-detail-action-bar/  (from Phase 5e)
├── gallery/
│   ├── event-detail-gallery.tsx
├── features/   ← Event-Features section (not framework features)
│   ├── event-detail-features.tsx
│   ├── event-detail-feature-card.tsx
```

### 6b. `features/event-comments/components/` → 3 sub-folders

Current: 9 components flat. After Phase 4a (sheet-header gone) and Phase 3a (gif-picker landing here):

```
event-comments/components/
├── list/
│   ├── comments-list.tsx
│   ├── comment-row.tsx
│   ├── comment-replies.tsx
├── compose/
│   ├── comment-compose.tsx
│   ├── comment-gif.tsx
│   ├── gif-picker/   ← from Phase 3a
├── actions/
│   ├── comment-like-button.tsx
│   ├── delete-comment-dialog.tsx
├── event-comments-sheet.tsx   ← keep at root (composition)
```

### 6c. `features/onboarding/components/` → `form-fields/` sub-folder

Current: 10 components flat. Inputs cluster:

```
onboarding/components/
├── form-fields/
│   ├── avatar-picker.tsx
│   ├── birthday-field.tsx
│   ├── field.tsx
│   ├── gender-select.tsx
│   ├── username-field.tsx
│   ├── location-prompt.tsx
├── onboarding-layout.tsx        ← root: layout/orchestration
├── interest-grid.tsx
├── opt-in-row.tsx
├── select-chip.tsx
├── branding-header.tsx
├── basics-step.tsx
```

### Leave flat (small features)

- `features/checkout/components/` (4 files) — flat is fine
- `features/feed/components/` (5 files) — flat is fine
- `features/tickets/components/` (7 files) — borderline, leave flat for now
- `features/reports/components/` (5 files) — flat is fine
- `features/auth/components/` (1 file) — obviously flat

### Migration tactic

For each sub-folder move:
1. Create the new directory
2. `git mv` each file (preserves history)
3. Update `import` paths — use TS-aware find/replace or run `npx tsc --noEmit` and chase errors
4. Commit per sub-folder so reverts are easy

---

## Phase 7 — Polish (30 min)

### 7a. Standardize feature barrel boundaries

[`features/onboarding/index.ts`](features/onboarding/index.ts) uses `export * from './stores'`, `'./validation'`, etc. — exposes internal modules.

Compare to `features/event-detail/index.ts` (exports only the screen + types) and `features/event-comments/index.ts` (same).

Make onboarding match: export only the screen, hooks, and types. If something needs to be public, export it explicitly.

### 7b. Consider `placeholderData: keepPreviousData` on infinite queries

No infinite query currently sets this — pagination flickers on page change. Minor UX polish.
Check: [`use-event-comments.ts`](features/event-comments/hooks/use-event-comments.ts),
[`use-comment-replies.ts`](features/event-comments/hooks/use-comment-replies.ts),
[`use-my-tickets.ts`](features/tickets/hooks/use-my-tickets.ts),
[`use-feed.ts`](features/feed/hooks/use-feed.ts),
[`use-orders.ts`](features/orders/hooks/use-orders.ts).

---

## Out of scope (deliberate non-decisions)

These came up in the audit but aren't worth doing right now:

- **Icon-label rows** (`<Icon /> <Text>`) across feed card + ticket detail — shape-similar but the
  semantics differ. Extract only if a third site appears.
- **Avatar + name + handle row** in comments vs `event-detail-organisation` — different entities,
  different actions. Don't unify until the design demands it.
- **Label-value pairs** in `checkout-summary` — only used in checkout. Leave.
- **Skeleton vs Spinner** — codebase mostly uses Spinner; Skeleton component exists but is rarely
  invoked. Acceptable for the current visual style.

---

## Suggested execution order

The phases above are roughly ordered by risk and effort. A realistic working order:

1. **Phase 1** first — bug fix, takes 15 min, no risk
2. **Phase 2** — purely mechanical, can be split across a few commits
3. **Phase 3a-c** — file moves, low risk
4. **Phase 4a-c** — primitive extractions; do each one fully (extract + replace + delete old) in a single commit
5. **Phase 5** — one god component per commit; verify with the dev server between each
6. **Phase 6** — folder moves; commit per sub-folder, run typecheck between each
7. **Phase 7** — quick polish

Estimated total time: 5-6 hours of focused work spread across several sessions.
