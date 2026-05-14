import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { HangmanScene } from './HangmanScene';

const WIDTH = 300;
const HEIGHT = 250;

interface PhaserHangmanProps {
  remainingLives: number;
  totalLives: number;
}

let sceneInstance: HangmanScene | null = null;

export function PhaserHangman({ remainingLives, totalLives }: PhaserHangmanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: WIDTH,
      height: HEIGHT,
      parent: containerRef.current,
      transparent: true,
      scene: HangmanScene,
      banner: false,
      audio: { noAudio: true },
      input: { keyboard: false, mouse: false, touch: false },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.events.on('ready', () => {
      const scene = game.scene.getScene('HangmanScene') as HangmanScene;
      sceneInstance = scene;
      scene.setLives(remainingLives, totalLives);
    });

    return () => {
      game.destroy(true);
      gameRef.current = null;
      sceneInstance = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sceneInstance) {
      sceneInstance.setLives(remainingLives, totalLives);
    }
  }, [remainingLives, totalLives]);

  return (
    <div className="flex justify-center my-4">
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
      />
    </div>
  );
}
