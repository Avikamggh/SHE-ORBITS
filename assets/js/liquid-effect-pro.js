class LiquidMouseEffect {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    `;
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.mouse = { x: this.width / 2, y: this.height / 2 };
    this.metaballs = [];
    this.distortionMap = [];

    this.initMetaballs();
    this.setupEventListeners();
    this.animate();
  }

  initMetaballs() {
    for (let i = 0; i < 8; i++) {
      this.metaballs.push({
        x: this.width / 2 + (Math.random() - 0.5) * 400,
        y: this.height / 2 + (Math.random() - 0.5) * 400,
        radius: Math.random() * 80 + 60,
        vx: 0,
        vy: 0,
        tx: this.width / 2 + (Math.random() - 0.5) * 400,
        ty: this.height / 2 + (Math.random() - 0.5) * 400
      });
    }
  }

  setupEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.updateMetaballTargets();
    });

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    });

    document.addEventListener('mouseleave', () => {
      this.resetMetaballs();
    });
  }

  updateMetaballTargets() {
    this.metaballs.forEach(ball => {
      const angle = Math.atan2(this.mouse.y - ball.y, this.mouse.x - ball.x);
      const distance = Math.hypot(this.mouse.x - ball.x, this.mouse.y - ball.y);
      const force = Math.max(0, 150 - distance) / 150;

      ball.tx = ball.x - Math.cos(angle) * force * 80;
      ball.ty = ball.y - Math.sin(angle) * force * 80;
    });
  }

  resetMetaballs() {
    this.metaballs.forEach(ball => {
      ball.tx = this.width / 2 + (Math.random() - 0.5) * 400;
      ball.ty = this.height / 2 + (Math.random() - 0.5) * 400;
    });
  }

  updateMetaballs() {
    this.metaballs.forEach(ball => {
      ball.vx += (ball.tx - ball.x) * 0.01;
      ball.vy += (ball.ty - ball.y) * 0.01;
      
      ball.vx *= 0.95;
      ball.vy *= 0.95;
      
      ball.x += ball.vx;
      ball.y += ball.vy;
    });
  }

  drawLiquid() {
    const imageData = this.ctx.createImageData(this.width, this.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4;
      const x = pixelIndex % this.width;
      const y = Math.floor(pixelIndex / this.width);

      let influence = 0;
      
      this.metaballs.forEach(ball => {
        const dx = x - ball.x;
        const dy = y - ball.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = ball.radius * ball.radius;
        
        if (distSq < radiusSq) {
          influence += (1 - distSq / radiusSq) * 255;
        }
      });

      influence = Math.min(255, influence);

      data[i] = 100;      // R
      data[i + 1] = 180;  // G
      data[i + 2] = 255;  // B
      data[i + 3] = influence * 0.4; // Alpha
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  animate = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    this.updateMetaballs();
    this.drawLiquid();

    requestAnimationFrame(this.animate);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LiquidMouseEffect();
});
