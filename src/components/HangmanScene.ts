import Phaser from 'phaser';

const WIDTH = 300;
const HEIGHT = 250;

type HangmanAnimState = 'idle' | 'burning' | 'exploding' | 'done';

const BASE_X = 220;
const HEAD_Y = 75;
const BODY_TOP = 93;
const BODY_BOT = 150;
const ARM_Y = 108;
const LEG_TOP = 150;
const LEG_BOT = 190;

export class HangmanScene extends Phaser.Scene {
  private lives: number = 6;
  private totalLives: number = 6;
  private animState: HangmanAnimState = 'idle';

  private gallowsGfx!: Phaser.GameObjects.Graphics;
  private headGfx!: Phaser.GameObjects.Graphics;
  private bodyGfx!: Phaser.GameObjects.Graphics;
  private leftArmGfx!: Phaser.GameObjects.Graphics;
  private rightArmGfx!: Phaser.GameObjects.Graphics;
  private leftLegGfx!: Phaser.GameObjects.Graphics;
  private rightLegGfx!: Phaser.GameObjects.Graphics;
  private ropeGfx!: Phaser.GameObjects.Graphics;

  private fireEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor() {
    super({ key: 'HangmanScene' });
  }

  create() {
    this.gallowsGfx = this.add.graphics();
    this.ropeGfx = this.add.graphics();
    this.headGfx = this.add.graphics();
    this.bodyGfx = this.add.graphics();
    this.leftArmGfx = this.add.graphics();
    this.rightArmGfx = this.add.graphics();
    this.leftLegGfx = this.add.graphics();
    this.rightLegGfx = this.add.graphics();

    const particleGfx = this.make.graphics({ x: 0, y: 0 }, false);
    particleGfx.fillStyle(0xffffff, 1);
    particleGfx.fillCircle(4, 4, 4);
    particleGfx.generateTexture('fire_particle', 8, 8);
    particleGfx.destroy();

    const debrisGfx = this.make.graphics({ x: 0, y: 0 }, false);
    debrisGfx.fillStyle(0xffffff, 1);
    debrisGfx.fillRect(0, 0, 6, 6);
    debrisGfx.generateTexture('debris', 6, 6);
    debrisGfx.destroy();

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
    this.animState = 'burning';

    const fireX = BASE_X;
    const fireY = 110;

    this.fireEmitter = this.add.particles(fireX, fireY, 'fire_particle', {
      speed: { min: 15, max: 70 },
      angle: { min: 250, max: 290 },
      scale: { start: 0.7, end: 0 },
      lifespan: { min: 300, max: 700 },
      alpha: { start: 1, end: 0 },
      tint: [0xff2200, 0xff4400, 0xff8800, 0xffcc00],
      frequency: 25,
      quantity: 2,
      emitting: true,
    });

    this.time.delayedCall(1500, () => {
      this.explode();
    });
  }

  private explode() {
    this.animState = 'exploding';

    if (this.fireEmitter) {
      this.fireEmitter.stop();
      this.fireEmitter = null;
    }

    const cx = BASE_X;
    const cy = 110;

    const flash = this.add.graphics();
    flash.fillStyle(0xffffff, 1);
    flash.fillCircle(cx, cy, 5);
    flash.setDepth(10);

    this.tweens.add({
      targets: flash,
      scaleX: 8,
      scaleY: 8,
      alpha: 0,
      duration: 400,
      ease: 'Quad.easeOut',
      onComplete: () => flash.destroy(),
    });

    const burst = this.add.particles(cx, cy, 'fire_particle', {
      speed: { min: 80, max: 250 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.6, end: 0 },
      lifespan: { min: 400, max: 900 },
      alpha: { start: 1, end: 0 },
      tint: [0xff2200, 0xff4400, 0xff8800, 0xffcc00, 0xffffff],
      frequency: -1,
      quantity: 40,
      emitting: false,
    });
    burst.explode();

    const debrisEmitter = this.add.particles(cx, cy, 'debris', {
      speed: { min: 60, max: 220 },
      angle: { min: 0, max: 360 },
      rotate: { start: 0, end: 20 },
      scale: { start: 1, end: 0.3 },
      lifespan: { min: 500, max: 1200 },
      alpha: { start: 1, end: 0 },
      tint: [0x3a3a3a, 0x5a3a1a, 0x8b6914, 0x1a1a1a],
      frequency: -1,
      quantity: 30,
      emitting: false,
    });
    debrisEmitter.explode();

    const parts = [
      { gfx: this.headGfx, ox: 0, oy: HEAD_Y },
      { gfx: this.bodyGfx, ox: 0, oy: BODY_TOP + (BODY_BOT - BODY_TOP) / 2 },
      { gfx: this.leftArmGfx, ox: -15, oy: ARM_Y },
      { gfx: this.rightArmGfx, ox: 15, oy: ARM_Y },
      { gfx: this.leftLegGfx, ox: -12, oy: LEG_BOT },
      { gfx: this.rightLegGfx, ox: 12, oy: LEG_BOT },
    ];

    for (const part of parts) {
      const dx = (Math.random() - 0.5) * 280;
      const dy = -50 - Math.random() * 200;

      this.tweens.add({
        targets: part.gfx,
        x: BASE_X + part.ox + dx,
        y: part.oy + dy,
        angle: Math.random() * 1080 - 540,
        alpha: 0,
        duration: 1000 + Math.random() * 500,
        ease: 'Quad.easeOut',
      });
    }

    this.ropeGfx.clear();
    this.ropeGfx.lineStyle(3, 0x8b7355);
    this.ropeGfx.lineBetween(BASE_X, 20, BASE_X, 35);
    this.ropeGfx.lineStyle(2, 0x8b7355);
    this.ropeGfx.lineBetween(BASE_X - 2, 35, BASE_X - 5, 42);
    this.ropeGfx.lineBetween(BASE_X, 35, BASE_X, 42);
    this.ropeGfx.lineBetween(BASE_X + 2, 35, BASE_X + 5, 42);

    this.time.delayedCall(3000, () => {
      this.animState = 'done';
    });
  }

  private drawScene() {
    this.clearAll();
    const mistakes = this.totalLives - this.lives;

    this.drawGround();
    this.drawGallows();
    this.drawRope();

    if (mistakes >= 1) this.drawHead();
    if (mistakes >= 2) this.drawBody();
    if (mistakes >= 3) this.drawLeftArm();
    if (mistakes >= 4) this.drawRightArm();
    if (mistakes >= 5) this.drawLeftLeg();
    if (mistakes >= 6) this.drawRightLeg();
  }

  private clearAll() {
    this.gallowsGfx.clear();
    this.ropeGfx.clear();
    this.headGfx.clear();
    this.bodyGfx.clear();
    this.leftArmGfx.clear();
    this.rightArmGfx.clear();
    this.leftLegGfx.clear();
    this.rightLegGfx.clear();
  }

  private drawGround() {
    const g = this.gallowsGfx;
    g.fillStyle(0x4a7a2e, 0.6);
    g.fillRect(0, HEIGHT - 40, WIDTH, 40);
  }

  private drawGallows() {
    const g = this.gallowsGfx;

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
  }

  private drawRope() {
    const g = this.ropeGfx;
    g.lineStyle(3, 0x8b7355);
    g.lineBetween(BASE_X, 20, BASE_X, 39);
  }

  private drawHead() {
    const g = this.headGfx;
    const x = BASE_X;
    const y = HEAD_Y;

    g.fillStyle(0x1a1a1a, 0.15);
    g.fillCircle(x + 2, y - 18 + 3, 18);

    g.lineStyle(3, 0x3a3a3a);
    g.strokeCircle(x, y - 18, 18);

    g.fillStyle(0x3a3a3a);
    g.fillCircle(x - 7, y - 23, 3);
    g.fillCircle(x + 7, y - 23, 3);

    g.lineStyle(2, 0x3a3a3a);
    g.beginPath();
    g.moveTo(x - 7, y - 12);
    g.lineTo(x, y - 16);
    g.lineTo(x + 7, y - 12);
    g.strokePath();
  }

  private drawBody() {
    const g = this.bodyGfx;
    g.lineStyle(4, 0x3a3a3a);
    g.lineBetween(BASE_X, BODY_TOP - 18, BASE_X, BODY_BOT - 18);
  }

  private drawLeftArm() {
    const g = this.leftArmGfx;
    g.lineStyle(3, 0x3a3a3a);
    g.lineBetween(BASE_X, ARM_Y - 18, BASE_X - 30, ARM_Y + 4);
  }

  private drawRightArm() {
    const g = this.rightArmGfx;
    g.lineStyle(3, 0x3a3a3a);
    g.lineBetween(BASE_X, ARM_Y - 18, BASE_X + 30, ARM_Y + 4);
  }

  private drawLeftLeg() {
    const g = this.leftLegGfx;
    g.lineStyle(3, 0x3a3a3a);
    g.lineBetween(BASE_X, LEG_TOP - 18, BASE_X - 25, LEG_BOT - 18);
  }

  private drawRightLeg() {
    const g = this.rightLegGfx;
    g.lineStyle(3, 0x3a3a3a);
    g.lineBetween(BASE_X, LEG_TOP - 18, BASE_X + 25, LEG_BOT - 18);
  }
}
