import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../components/ThemeToggle';
import { WordDisplay } from '../components/WordDisplay';
import { GameStatus } from '../components/GameStatus';

describe('ThemeToggle', () => {
  it('renders with moon emoji when light mode', () => {
    render(<ThemeToggle isDark={false} onToggle={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🌙');
  });

  it('renders with sun emoji when dark mode', () => {
    render(<ThemeToggle isDark={true} onToggle={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('☀️');
  });

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup();
    let toggled = false;
    render(<ThemeToggle isDark={false} onToggle={() => { toggled = true; }} />);
    await user.click(screen.getByRole('button'));
    expect(toggled).toBe(true);
  });
});

describe('WordDisplay', () => {
  it('shows underscores for unrevealed letters', () => {
    render(<WordDisplay originalWord="ABC" guessedCharacters={[]} />);
    const container = screen.getByLabelText('Palavra secreta');
    const letters = container.querySelectorAll('span span');
    expect(letters.length).toBeGreaterThan(0);
    for (const letter of letters) {
      expect(letter.textContent).toBe('');
    }
  });

  it('shows revealed characters', () => {
    render(<WordDisplay originalWord="ABC" guessedCharacters={['A']} />);
    const container = screen.getByLabelText('Palavra secreta');
    expect(container.textContent).toContain('A');
  });

  it('shows spaces as gaps', () => {
    render(<WordDisplay originalWord="A B" guessedCharacters={['A', 'B']} />);
    const container = screen.getByLabelText('Palavra secreta');
    expect(container.textContent).toContain('A');
    expect(container.textContent).toContain('B');
  });
});

describe('GameStatus', () => {
  it('renders victory message', () => {
    render(<GameStatus status="won" originalWord="test" />);
    expect(screen.getByRole('status')).toHaveTextContent('Parabéns! Você venceu!');
    expect(screen.getByRole('status')).toHaveTextContent('test');
  });

  it('renders defeat message', () => {
    render(<GameStatus status="lost" originalWord="test" />);
    expect(screen.getByRole('status')).toHaveTextContent('Fim de jogo!');
    expect(screen.getByRole('status')).toHaveTextContent('test');
  });

  it('renders nothing when playing', () => {
    const { container } = render(<GameStatus status="playing" originalWord="test" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when idle', () => {
    const { container } = render(<GameStatus status="idle" originalWord="" />);
    expect(container.firstChild).toBeNull();
  });
});
