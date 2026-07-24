document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('cubic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  const W = 440, H = 380;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.scale(DPR, DPR);

  const aSlider = document.getElementById('cubic-a');
  const bSlider = document.getElementById('cubic-b');
  const cSlider = document.getElementById('cubic-c');
  const dSlider = document.getElementById('cubic-d');
  const aVal = document.getElementById('cubic-a-val');
  const bVal = document.getElementById('cubic-b-val');
  const cVal = document.getElementById('cubic-c-val');
  const dVal = document.getElementById('cubic-d-val');
  const rootsEl = document.getElementById('cubic-roots');

  const XMIN = -10, XMAX = 10, YMIN = -10, YMAX = 10;
  const originX = W / 2, originY = H / 2;
  const scaleX = W / (XMAX - XMIN);
  const scaleY = H / (YMAX - YMIN);

  function toPx(x, y) {
    return [originX + x * scaleX, originY - y * scaleY];
  }

  // Find real roots by scanning for sign changes then bisecting.
  function findRoots(f, lo, hi, steps) {
    const roots = [];
    const dx = (hi - lo) / steps;
    let prevX = lo, prevY = f(lo);
    for (let i = 1; i <= steps; i++) {
      const x = lo + i * dx;
      const y = f(x);
      if (prevY === 0) {
        roots.push(prevX);
      } else if (prevY * y < 0) {
        // bisection
        let a = prevX, b = x, fa = prevY;
        for (let iter = 0; iter < 60; iter++) {
          const mid = (a + b) / 2;
          const fm = f(mid);
          if (fa * fm <= 0) { b = mid; } else { a = mid; fa = fm; }
        }
        roots.push((a + b) / 2);
      }
      prevX = x; prevY = y;
    }
    return roots;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(244,237,226,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, originY); ctx.lineTo(W, originY);
    ctx.moveTo(originX, 0); ctx.lineTo(originX, H);
    ctx.stroke();

    let a = Number(aSlider.value);
    const b = Number(bSlider.value);
    const c = Number(cSlider.value);
    const d = Number(dSlider.value);
    if (a === 0) a = 0.5;
    aVal.textContent = Number(aSlider.value);
    bVal.textContent = b;
    cVal.textContent = c;
    dVal.textContent = d;

    const f = x => a * x * x * x + b * x * x + c * x + d;

    ctx.beginPath();
    for (let px = 0; px <= W; px += 2) {
      const x = XMIN + (px / W) * (XMAX - XMIN);
      const y = f(x);
      const [cx, cy] = toPx(x, Math.max(YMIN - 6, Math.min(YMAX + 6, y)));
      if (px === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
    }
    ctx.strokeStyle = '#6FC2C0';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    const roots = findRoots(f, XMIN - 1, XMAX + 1, 2000)
      .filter(r => r >= XMIN && r <= XMAX)
      .sort((x, y) => x - y);

    // de-duplicate very close roots
    const deduped = [];
    roots.forEach(r => {
      if (!deduped.length || Math.abs(r - deduped[deduped.length - 1]) > 0.05) {
        deduped.push(r);
      }
    });

    rootsEl.textContent = deduped.length
      ? deduped.map(r => r.toFixed(2)).join(', ')
      : 'none in view';

    deduped.forEach(r => {
      const [rx, ry] = toPx(r, 0);
      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#E8B65A';
      ctx.fill();
      ctx.strokeStyle = '#0B1D26';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  [aSlider, bSlider, cSlider, dSlider].forEach(s => s.addEventListener('input', draw));
  draw();
});
