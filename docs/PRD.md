# PRD — Forca do TioSiipe

## Project Overview

**Forca do TioSiipe** is a local multiplayer hangman-style game designed primarily for Brazilian children.

The initial version focuses on simplicity, clean architecture, maintainability, accessibility, and future extensibility for animations, sprites, themes, and random word categories.

The project will be developed using React, Vite, TypeScript, and Tailwind CSS.

---

# Technical Stack

## Core Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Phaser (hangman rendering + death animation)

## Tooling

- ESLint
- Prettier
- Vitest
- React Testing Library

## Package Manager

- npm

## Dependency Policy

All dependencies must use exact versions.

Every installation command must use:

```bash
npm install -E
```

No floating patch or minor versions are allowed.

---

# Project Name

```txt
siipe-hangman
```

---

# Application Language

All UI text must be written in Brazilian Portuguese.

---

# Game Scope (V1)

The initial version is a local single-screen multiplayer experience.

Flow:

1. Player 1 inputs a secret word or phrase
2. The game starts
3. Player 2 guesses characters
4. The game ends on victory or defeat
5. User can start a new game

No online multiplayer is required.

No backend/server is required.

---

# UI/UX Requirements

## Visual Style

- Clean
- Minimal
- Smooth
- Dark-mode friendly
- Child-friendly

## Dark Mode

Requirements:

- Manual toggle
- Persist preference using `localStorage`
- Class-based strategy via `@custom-variant dark (&:where(.dark, .dark *))` in Tailwind v4

---

# Game Rules

## Supported Characters

Allowed:

- Letters
- Numbers
- Spaces

Examples:

```txt
xm8
mac10
arma lendaria
```

Not allowed:

- Symbols
- Punctuation
- Special characters

Examples of invalid inputs:

```txt
#
@
$
%
/
-
_
!
```

---

# Word Handling

## Space Behavior

Spaces must be automatically revealed.

Example:

```txt
arma lendaria
```

Display: unrevealed letters are left blank, with a bottom border as visual placeholder.

Revealed letters display the actual character.

---

## Word Wrapping

Each word must be treated as an unbreakable unit during line wrapping.

- Words should not break mid-word across lines
- If a whole word does not fit on the current line, it must wrap entirely to the next line
- Single-line display is preferred when all words fit

---

## Case Normalization

All text after Player 1's input is normalized to uppercase.

- `originalWord` stored as uppercase
- `comparableWord` stored as uppercase
- `guessedCharacters` stores original uppercase characters
- `wrongCharacters` stored as uppercase
- Player 2 input (lowercase or uppercase) is always mapped to uppercase before processing

Display always renders uppercase characters.

---

## Multiple Spaces

Repeated spaces must be collapsed into a single space.

Example:

```txt
arma    lendaria
```

Becomes:

```txt
arma lendaria
```

---

## Empty Validation

The application must reject:

- Empty strings
- Space-only values

---

# Accent Mapping Rules

The game must preserve the original input while internally mapping accented characters to comparable base characters, then normalizing to uppercase.

Full Portuguese accent map:

| Original | Base | Original | Base |
|---|---|---|---|
| á | A | Á | A |
| à | A | À | A |
| ã | A | Ã | A |
| â | A | Â | A |
| ä | A | Ä | A |
| é | E | É | E |
| è | E | È | E |
| ê | E | Ê | E |
| ë | E | Ë | E |
| í | I | Í | I |
| ì | I | Ì | I |
| î | I | Î | I |
| ï | I | Ï | I |
| ó | O | Ó | O |
| ò | O | Ò | O |
| õ | O | Õ | O |
| ô | O | Ô | O |
| ö | O | Ö | O |
| ú | U | Ú | U |
| ù | U | Ù | U |
| û | U | Û | U |
| ü | U | Ü | U |
| ç | C | Ç | C |

Example:

```txt
Original Input:
maçã verde

Comparable Internal Value:
MACA VERDE
```

If the player guesses:

```txt
a
```

The UI must reveal both:

```txt
ã
á
```

The original text must always be preserved for rendering and final reveal.

---

# Secret Word Modal

Before the game starts, the application must display a modal where Player 1 enters the secret word or phrase.

## Modal Requirements

Fields:

- Secret word input
- Checkbox:
  ```txt
  Esconder palavra ao digitar
  ```
  Enabled (checked) by default.

Behavior:

- Input is always `type="text"` — never `type="password"`
- If checked:
  - characters are masked using `-webkit-text-security: disc`
- If unchecked:
  - characters are visible
- Browser password management is fully disabled (`autocomplete="off"`, `spellcheck="false"`, `data-lpignore`, `data-1p-ignore`, unique `name` attribute)
- No browser save/update/autocomplete prompts of any kind

---

# Input Methods

## Physical Keyboard

Player 2 must be able to type using the physical keyboard.

Supported:

- Letters
- Numbers

---

## On-Screen Keyboard

The application must include a clickable on-screen keyboard.

Requirements:

- QWERTY-like layout
- Numbers row on top (0-9), followed by letter rows (QWERTY)
- Disabled/highlighted states for used keys (correct = green, wrong = red)
- Accent-aware key state: keys highlight correctly when original word contains accented variants

---

# Lives System

The player starts with:

```txt
6 vidas
```

Lives are visually represented using a Phaser canvas that renders a classic hangman drawing. Each lost life adds a body part progressively.

Stages:

| Lives | Mistakes | Body Part |
|---|---|---|
| 6 | 0 | Empty gallows (base, post, beam, diagonal support, rope) |
| 5 | 1 | Head (with eyes and mouth) |
| 4 | 2 | Body |
| 3 | 3 | Left arm |
| 2 | 4 | Right arm |
| 1 | 5 | Left leg |
| 0 | 6 | Right leg (triggers death animation) |

The gallows uses wood tones (brown/gold fill with darker highlights). Body parts use a dark charcoal color. A green ground strip with grass sits at the bottom.

The Phaser canvas is 300×250px, embedded via a React wrapper component that passes `remainingLives` and `totalLives` as props.

## Death Animation

When `remainingLives` reaches 0:

1. **Fire** — body catches fire while hanging. Phaser particle emitter sprays orange/red/yellow flames for ~1.5s
2. **Explosion** — white flash expands and fades, 40 fire particles burst in all directions, 30 dark debris chunks fly outward
3. **Body parts** — head, body, arms, and legs are individually tweened in random directions with spin (up to 1080° rotation) and fade out over ~1–1.5s
4. **Rope snap** — rope redrawn as a frayed broken end on the gallows

Animation state machine: `idle` → `burning` → `exploding` → `done`.

---

# Game States

## Playing

- Input active
- Keyboard active

## Victory

Display victory message.

Reveal full original word.

Disable further input.

## Defeat

Display defeat message.

Reveal full original word.

Disable further input.

Trigger death animation: fire → explosion → body parts fly away.

---

# New Game

The interface must contain a:

```txt
Novo jogo
```

button.

Behavior:

- Resets all game state
- Reopens the secret word modal

---

# Suggested Component Structure

```txt
src/
  components/
    GameBoard/
    HangmanScene.ts       (Phaser scene: drawing + death animation)
    PhaserHangman.tsx      (React wrapper for Phaser canvas)
    Keyboard/
    LivesDisplay/
    SecretWordModal/
    ThemeToggle/
    WordDisplay/
    GameStatus/

  hooks/
    useDarkMode/
    useHangmanGame/

  utils/
    normalizeInput.ts
    validateSecretWord.ts

  tests/
```

---

# Suggested State Shape

```ts
type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

interface GameState {
  originalWord: string;
  comparableWord: string;
  guessedCharacters: string[];
  wrongCharacters: string[];
  remainingLives: number;
  status: GameStatus;
}
```

---

# Validation Rules

## Accepted Regex

Suggested validation:

```txt
Only:
- letters
- numbers
- spaces
```

The implementation should reject punctuation and symbols.

---

# Testing Requirements

## Test Stack

- Vitest
- React Testing Library

## Required Coverage

### Utils

- normalization
- accent mapping
- validation
- repeated spaces

### Components

- keyboard interaction
- modal behavior
- dark mode toggle
- game victory
- game defeat

### Accessibility

- keyboard navigation
- button roles
- modal focus behavior

---

# Prettier Configuration

```json
{
  "singleQuote": true,
  "semi": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

---

# Future Expansion Ideas (Out of Scope for V1)

## Planned Features

- Random word categories
- PT-BR themed dictionaries
- Canvas animations
- Sprites
- Character progression
- Sound effects
- Score system
- Online multiplayer
- Mobile optimization improvements
- Difficulty modes
- Timed mode

---

# Success Criteria

The V1 is considered successful if:

- The game is fully playable locally
- Keyboard input works correctly
- Accent mapping behaves correctly
- UI is responsive and visually clean
- Dark mode persists correctly
- Tests pass successfully
- Architecture is clean and extensible for future versions
