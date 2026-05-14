import { useState, useCallback } from 'react';
import { normalizeInput } from '../utils/normalizeInput';
import { validateSecretWord } from '../utils/validateSecretWord';

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface GameState {
  originalWord: string;
  comparableWord: string;
  guessedCharacters: string[];
  wrongCharacters: string[];
  remainingLives: number;
  status: GameStatus;
}

const INITIAL_LIVES = 6;

function createInitialState(): GameState {
  return {
    originalWord: '',
    comparableWord: '',
    guessedCharacters: [],
    wrongCharacters: [],
    remainingLives: INITIAL_LIVES,
    status: 'idle',
  };
}

function checkWin(originalWord: string, guessedCharacters: string[]): boolean {
  for (const char of originalWord) {
    if (char !== ' ' && !guessedCharacters.includes(char)) {
      return false;
    }
  }
  return true;
}

export function useHangmanGame() {
  const [state, setState] = useState<GameState>(createInitialState);

  const startGame = useCallback((word: string): { valid: boolean; error?: string } => {
    const validation = validateSecretWord(word);
    if (!validation.valid) {
      return validation;
    }

    const comparableWord = normalizeInput(word);

    setState({
      originalWord: word.trim().replace(/\s+/g, ' ').toUpperCase(),
      comparableWord,
      guessedCharacters: [],
      wrongCharacters: [],
      remainingLives: INITIAL_LIVES,
      status: 'playing',
    });

    return { valid: true };
  }, []);

  const guessCharacter = useCallback(
    (char: string) => {
      if (state.status !== 'playing') return;

      const upperChar = char.toUpperCase();

      if (
        state.guessedCharacters.some((c) => normalizeInput(c) === upperChar) ||
        state.wrongCharacters.includes(upperChar)
      ) {
        return;
      }

      if (state.comparableWord.includes(upperChar)) {
        const newGuessed = [...state.guessedCharacters];

        for (const originalChar of state.originalWord) {
          if (normalizeInput(originalChar) === upperChar) {
            if (!newGuessed.includes(originalChar)) {
              newGuessed.push(originalChar);
            }
          }
        }

        const isWin = checkWin(state.originalWord, newGuessed);

        setState((prev) => ({
          ...prev,
          guessedCharacters: newGuessed,
          status: isWin ? 'won' : 'playing',
        }));
      } else {
        const newWrong = [...state.wrongCharacters, upperChar];
        const newLives = state.remainingLives - 1;

        setState((prev) => ({
          ...prev,
          wrongCharacters: newWrong,
          remainingLives: newLives,
          status: newLives <= 0 ? 'lost' : 'playing',
        }));
      }
    },
    [state]
  );

  const resetGame = useCallback(() => {
    setState(createInitialState());
  }, []);

  return {
    state,
    startGame,
    guessCharacter,
    resetGame,
  };
}
