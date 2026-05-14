import Phaser from 'phaser';

const WIDTH = 300;
const HEIGHT = 250;

export class HangmanScene extends Phaser.Scene {
  private lives: number = 6;
  private totalLives: number = 6;
  private graphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'HangmanScene' });
  }

  create() {
    this.graphics = this.add.graphics();
    this.drawScene();
  }

  setLives(remainingLives: number, totalLives: number) {
    this.lives = remainingLives;
    this.totalLives = totalLives;
    this.drawScene();
  }

  private drawScene() {
    this.graphics.clear();
    const mistakes = this.totalLives - this.lives;

    this.drawGround();
    this.drawGallows();
    if (mistakes >= 1) this.drawHead();
    if (mistakes >= 2) this.drawBody();
    if (mistakes >= 3) this.drawLeftArm();
    if (mistakes >= 4) this.drawRightArm();
    if (mistakes >= 5) this.drawLeftLeg();
    if (mistakes >= 6) this.drawRightLeg();
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

    g.lineStyle(3, 0x8b7355);
    g.lineBetween(220, 20, 220, 55);
  }

  private drawHead() {
    const g = this.graphics;

    g.fillStyle(0x1a1a1a, 0.2);
    g.fillCircle(222, 78, 18);

    g.lineStyle(3, 0x3a3a3a);
    g.strokeCircle(220, 75, 18);

    g.fillStyle(0x3a3a3a);
    g.fillCircle(213, 70, 3);
    g.fillCircle(227, 70, 3);

    g.lineStyle(2, 0x3a3a3a);
    g.beginPath();
    g.moveTo(213, 81);
    g.lineTo(220, 77);
    g.lineTo(227, 81);
    g.strokePath();
  }

  private drawBody() {
    const g = this.graphics;
    g.lineStyle(4, 0x3a3a3a);
    g.lineBetween(220, 93, 220, 150);
  }

  private drawLeftArm() {
    const g = this.graphics;
    g.lineStyle(3, 0x3a3a3a);
    g.lineBetween(220, 108, 190, 130);
  }

  private drawRightArm() {
    const g = this.graphics;
    g.lineStyle(3, 0x3a3a3a);
    g.lineBetween(220, 108, 250, 130);
  }

  private drawLeftLeg() {
    const g = this.graphics;
    g.lineStyle(3, 0x3a3a3a);
    g.lineBetween(220, 150, 195, 190);
  }

  private drawRightLeg() {
    const g = this.graphics;
    g.lineStyle(3, 0x3a3a3a);
    g.lineBetween(220, 150, 245, 190);
  }
}
