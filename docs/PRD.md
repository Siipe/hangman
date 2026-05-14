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

Display:

```txt
_ _ _ _   _ _ _ _ _ _ _ _ _
```

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

The game must preserve the original input while internally mapping accented characters to comparable base characters.

Examples:

| Original | Comparable |
|---|---|
| á | a |
| à | a |
| ã | a |
| â | a |
| ç | c |

Example:

```txt
Original Input:
maçã verde

Comparable Internal Value:
maca verde
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

Behavior:

- If checked:
  - input behaves like password
- If unchecked:
  - input is visible

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
- Support letters
- Support numbers
- Disabled/highlighted states for used keys

---

# Lives System

The player starts with:

```txt
6 vidas
```

Lives must be visually represented using hearts.

Example:

```txt
❤️ ❤️ ❤️ ❤️ ❤️ ❤️
```

Wrong guesses remove hearts progressively.

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
    Keyboard/
    SecretWordModal/
    LivesDisplay/
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
