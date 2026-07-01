document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('diff-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  const W = 440, H = 380;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.scale(DPR, DPR);

  const FUNCS = {
    x2: x => x * x,
    sin: x => 3 * Math.sin(x),
    cubic: x => (x * x * x) / 20,
    linear: x => 0.5 * x + 2
  };

  let fnKey = 'x2';
  const x0Slider = document.getElementById('x0-slider');
  const x0Val = document.getElementById('x0-val');
  const fx0El = document.getElementById('fx0-value');
  const slopeEl = document.getElementById('slope-value');
  const tangentEqEl = document.getElementById('tangent-eq');

  const XMIN = -10, XMAX = 10, YMIN = -10, YMAX = 10;
  const originX = W / 2, originY = H / 2;
  const scaleX = W / (XMAX - XMIN);
  const scaleY = H / (YMAX - YMIN);

  function toPx(x, y) {
    return [originX + x * scaleX, originY - y * scaleY];
  }

  function derivative(f, x, h = 0.0001) {
    return (f(x + h) - f(x - h)) / (2 * h);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const f = FUNCS[fnKey];

    // axes
    ctx.strokeStyle = 'rgba(244,237,226,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, originY); ctx.lineTo(W, originY);
    ctx.moveTo(originX, 0); ctx.lineTo(originX, H);
    ctx.stroke();

    // curve
    ctx.beginPath();
    for (let px = 0; px <= W; px += 2) {
      const x = XMIN + (px / W) * (XMAX - XMIN);
      const y = f(x);
      const [cx, cy] = toPx(x, Math.max(YMIN - 2, Math.min(YMAX + 2, y)));
      if (px === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
    }
    ctx.strokeStyle = '#6FC2C0';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    const x0 = Number(x0Slider.value);
    x0Val.textContent = x0.toFixed(1);
    const y0 = f(x0);
    const m = derivative(f, x0);

    // tangent line across visible range
    ctx.beginPath();
    const x1 = XMIN, x2 = XMAX;
    const y1 = y0 + m * (x1 - x0);
    const y2 = y0 + m * (x2 - x0);
    const [p1x, p1y] = toPx(x1, Math.max(YMIN, Math.min(YMAX, y1)));
    const [p2x, p2y] = toPx(x2, Math.max(YMIN, Math.min(YMAX, y2)));
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.strokeStyle = '#E8B65A';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // point at x0
    const [px0, py0] = toPx(x0, Math.max(YMIN, Math.min(YMAX, y0)));
    ctx.beginPath();
    ctx.arc(px0, py0, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#E8B65A';
    ctx.fill();
    ctx.strokeStyle = '#0B1D26';
    ctx.lineWidth = 2;
    ctx.stroke();

    fx0El.textContent = y0.toFixed(2);
    slopeEl.textContent = m.toFixed(2);
    tangentEqEl.textContent = `y = ${m.toFixed(2)}(x − ${x0.toFixed(2)}) + ${y0.toFixed(2)}`;
  }

  document.querySelectorAll('#fn-chips .chip').forEach((chip, i) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#fn-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      fnKey = chip.dataset.fn;
      draw();
    });
    if (i === 0) chip.classList.add('active');
  });

  x0Slider.addEventListener('input', draw);
  draw();
});
