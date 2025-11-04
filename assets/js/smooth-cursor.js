/**
 * Custom Smooth Green Cursor for The Viral Trees
 * Uses the SmoothCursor class with a glowing SVG pointer.
 */

// ===== SmoothCursor class =====
class SmoothCursor {
  constructor(options = {}) {
    this.config = {
      cursorElement: options.cursorElement || this.createDefaultCursor(),
      damping: options.damping || 0.15,
      hideDefaultCursor: options.hideDefaultCursor !== false,
    };

    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.target = { x: this.pos.x, y: this.pos.y };
    this.scale = 1;
    this.cursor = this.config.cursorElement;

    this.init();
  }

  createDefaultCursor() {
    const div = document.createElement('div');
    div.id = 'custom-cursor';
    div.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <path fill="#9fef00" d="M9.391 2.32C8.42 1.56 7 2.253 7 3.486V28.41c0 1.538 1.966 2.18 2.874.938l6.225-8.523a2 2 0 0 1 1.615-.82h9.69c1.512 0 2.17-1.912.978-2.844z"/>
      </svg>
    `;
    Object.assign(div.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)',
    });
    document.body.appendChild(div);
    return div;
  }

  init() {
    if (this.config.hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    document.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
    });

    document.addEventListener('mousedown', () => {
      this.scale = 0.9;
      this.cursor.classList.add('active');
    });

    document.addEventListener('mouseup', () => {
      this.scale = 1;
      this.cursor.classList.remove('active');
    });

    requestAnimationFrame(() => this.animate());
  }

  animate() {
    // smooth interpolation
    this.pos.x += (this.target.x - this.pos.x) * this.config.damping;
    this.pos.y += (this.target.y - this.pos.y) * this.config.damping;

    this.cursor.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px) scale(${this.scale})`;

    requestAnimationFrame(() => this.animate());
  }
}

// ===== Initialize on page load =====
window.addEventListener('load', () => {
  const cursorElement = document.getElementById('custom-cursor');
  window.smoothCursor = new SmoothCursor({
    cursorElement: cursorElement,
    hideDefaultCursor: true,
  });
});
