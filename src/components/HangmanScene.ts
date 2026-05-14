import Phaser from 'phaser';

const WIDTH = 300;
const HEIGHT = 250;

type HangmanAnimState = 'idle' | 'falling' | 'burning' | 'done';

export class HangmanScene extends Phaser.Scene {
  private lives: number = 6;
  private totalLives: number = 6;
  private graphics!: Phaser.GameObjects.Graphics;
  private dropOffset: number = 0;
  private ropeBroken: boolean = false;
  private onFire: boolean = false;
  private fireAlpha: number = 0;
  private animState: HangmanAnimState = 'idle';
  private fireEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor() {
    super({ key: 'HangmanScene' });
  }

  create() {
    this.graphics = this.add.graphics();

    const particleGfx = this.make.graphics({ x: 0, y: 0 }, false);
    particleGfx.fillStyle(0xffffff, 1);
    particleGfx.fillCircle(4, 4, 4);
    particleGfx.generateTexture('fire_particle', 8, 8);
    particleGfx.destroy();

    this.drawScene();
  }

  setLives(remainingLives: number, totalLives: number) {
    if (this.animState !== 'idle') return;

    this.lives = remainingLives;
    this.totalLives = totalLives;
    this.drawScene();

    if (remainingLives <= 0) {
      this.playDeathAnimation();
    }
  }

  private playDeathAnimation() {
    this.animState = 'falling';
    this.ropeBroken = true;
    this.drawScene();

    this.time.delayedCall(200, () => {
      this.tweens.add({
        targets: this,
        dropOffset: 150,
        duration: 700,
        ease: 'Bounce.easeOut',
        onUpdate: () => this.drawScene(),
        onComplete: () => {
          this.startFire();
        },
      });
    });
  }

  private startFire() {
    this.animState = 'burning';
    this.onFire = true;

    this.tweens.add({
      targets: this,
      fireAlpha: 1,
      duration: 400,
      onUpdate: () => this.drawScene(),
    });

    const bodyY = 150 + this.dropOffset;
    const bodyX = 220;

    this.fireEmitter = this.add.particles(bodyX, bodyY, 'fire_particle', {
      speed: { min: 20, max: 80 },
      angle: { min: 250, max: 290 },
      scale: { start: 0.6, end: 0 },
      lifespan: { min: 300, max: 700 },
      alpha: { start: 1, end: 0 },
      tint: [0xff4400, 0xff8800, 0xffcc00, 0xff2200],
      frequency: 30,
      quantity: 2,
      emitting: true,
    });

    this.time.delayedCall(3000, () => {
      if (this.fireEmitter) {
        this.fireEmitter.stop();
        this.fireEmitter = null;
      }
      this.animState = 'done';
    });
  }

  private drawScene() {
    this.graphics.clear();
    const mistakes = this.totalLives - this.lives;
    const wasDrawn = mistakes >= 6;

    this.drawGround();
    this.drawGallows();
    if (wasDrawn) this.drawHangman(mistakes);
  }

  private drawGround() {
    const g = this.graphics;
    g.fillStyle(0x4a7a2e, 0.6);
    g.fillRect(0, HEIGHT - 40, WIDTH, 40);
  }

  private drawGallows() {
    const g = this.graphics;

    g.fillStyle(0x5a3a1a);
    g.fillRect(30, HEIGHT - 50, 110, 14);

    g.fillStyle(0x8b6914);
    g.fillRect(65, 20, 12, HEIGHT - 70);

    g.fillStyle(0x8b6914);
    g.fillRect(65, 20, 160, 10);

    g.fillStyle(0x5a3a1a);
    g.fillRect(100, 20, 10, 40);

    g.lineStyle(3, 0x9b7924);
    g.lineBetween(65, 28, 65, HEIGHT - 72);

    if (this.ropeBroken) {
      g.lineStyle(3, 0x8b7355);
      g.lineBetween(220, 20, 220, 35);
      g.lineStyle(2, 0x8b7355);
      g.lineBetween(218, 35, 215, 42);
      g.lineBetween(220, 35, 220, 42);
      g.lineBetween(222, 35, 225, 42);
    } else {
      g.lineStyle(3, 0x8b7355);
      g.lineBetween(220, 20, 220, 55);
    }
  }

  private drawHangman(mistakes: number) {
    const offset = this.dropOffset;

    if (mistakes >= 1) this.drawHead(offset);
    if (mistakes >= 2) this.drawBody(offset);
    if (mistakes >= 3) this.drawLeftArm(offset);
    if (mistakes >= 4) this.drawRightArm(offset);
    if (mistakes >= 5) this.drawLeftLeg(offset);
    if (mistakes >= 6) this.drawRightLeg(offset);

    if (this.onFire || this.fireAlpha > 0) {
      this.drawFireOverlay(offset);
    }
  }

  private drawHead(offset: number) {
    const g = this.graphics;
    const oy = 75 + offset;

    g.fillStyle(0x1a1a1a, 0.15);
    g.fillCircle(222, oy + 3, 18);

    g.lineStyle(3, 0x3a3a3a);
    g.strokeCircle(220, oy, 18);

    g.fillStyle(0x3a3a3a);
    g.fillCircle(213, oy - 5, 3);
    g.fillCircle(227, oy - 5, 3);

    g.lineStyle(2, 0x3a3a3a);
    g.beginPath();
    g.moveTo(213, oy + 6);
    g.lineTo(220, oy + 2);
    g.lineTo(227, oy + 6);
    g.strokePath();
  }

  private drawBody(offset: number) {
    const g = this.graphics;
    g.lineStyle(4, 0x3a3a3a);
    g.lineBetween(220, 93 + offset, 220, 150 + offset);
  }

  private drawLeftArm(offset: number) {
    const g = this.graphics;
    g.lineStyle(3, 0x3a3a3a);
    g.lineBetween(220, 108 + offset, 190, 130 + offset);
  }

  private drawRightArm(offset: number) {
    const g = this.graphics;
    g.lineStyle(3, 0x3a3a3a);
    g.lineBetween(220, 108 + offset, 250, 130 + offset);
  }

  private drawLeftLeg(offset: number) {
    const g = this.graphics;
    g.lineStyle(3, 0x3a3a3a);
    g.lineBetween(220, 150 + offset, 195, 190 + offset);
  }

  private drawRightLeg(offset: number) {
    const g = this.graphics;
    g.lineStyle(3, 0x3a3a3a);
    g.lineBetween(220, 150 + offset, 245, 190 + offset);
  }

  private drawFireOverlay(offset: number) {
    const g = this.graphics;
    const alpha = this.fireAlpha;
    const bx = 200;
    const by = 140 + offset;
    const w = 60;
    const h = 70;

    for (let i = 0; i < 8; i++) {
      const fx = bx + Math.random() * w;
      const fy = by - Math.random() * h;
      const size = 6 + Math.random() * 12;
      const flameAlpha = alpha * (0.4 + Math.random() * 0.5);
      g.fillStyle(0xff4400, flameAlpha);
      g.fillCircle(fx, fy, size);
      g.fillStyle(0xff8800, flameAlpha * 0.7);
      g.fillCircle(fx - 2, fy - 2, size * 0.6);
      g.fillStyle(0xffcc00, flameAlpha * 0.5);
      g.fillCircle(fx - 1, fy - 4, size * 0.35);
    }
  }
}
