// Hero signature animation: a regular polygon inscribed in a circle,
// its side-count climbs from 3 upward and visually approaches the circle.
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const sideLabel = document.getElementById('hero-n');

  const DPR = window.devicePixelRatio || 1;
  const CSS_SIZE = 420;
  canvas.width = CSS_SIZE * DPR;
  canvas.height = CSS_SIZE * DPR;
  canvas.style.width = '100%';
  canvas.style.height = 'auto';
  ctx.scale(DPR, DPR);

  const cx = CSS_SIZE / 2;
  const cy = CSS_SIZE / 2;
  const R = 150;

  let n = 3;
  let growing = true;
  let frame = 0;
  const MAX_N = 40;
  const HOLD_FRAMES = 55;
  let holdCounter = 0;

  function drawCircleGuide() {
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(111, 194, 192, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawPolygon(sides) {
    const pts = [];
    const rot = -Math.PI / 2;
    for (let i = 0; i < sides; i++) {
      const theta = rot + (i / sides) * Math.PI * 2;
      pts.push([cx + R * Math.cos(theta), cy + R * Math.sin(theta)]);
    }
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.closePath();
    ctx.strokeStyle = '#E8B65A';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // vertices
    ctx.fillStyle = '#E8B65A';
    pts.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, sides > 16 ? 1.4 : 2.6, 0, Math.PI * 2);
      ctx.fill();
    });

    // center point + radius spoke
    ctx.strokeStyle = 'rgba(244, 237, 226, 0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(pts[0][0], pts[0][1]);
    ctx.stroke();
  }

  function grid() {
    ctx.strokeStyle = 'rgba(28, 53, 64, 0.9)';
    ctx.lineWidth = 1;
  }

  function tick() {
    ctx.clearRect(0, 0, CSS_SIZE, CSS_SIZE);
    drawCircleGuide();
    drawPolygon(Math.round(n));

    if (sideLabel) {
      sideLabel.textContent = Math.round(n) >= MAX_N ? '\u221E (circle)' : Math.round(n);
    }

    frame++;
    if (frame % 4 === 0) {
      if (growing) {
        n++;
        if (n >= MAX_N) { growing = false; holdCounter = 0; }
      } else {
        holdCounter++;
        if (holdCounter > HOLD_FRAMES) { n = 3; growing = true; }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
});
