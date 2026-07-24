document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('int-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  const W = 440, H = 380;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.scale(DPR, DPR);

  const FUNCS = {
    x2: { f: x => x * x, label: 'f(x) = x²' },
    sin: { f: x => 3 * Math.sin(x), label: 'f(x) = 3·sin(x)' },
    cubic: { f: x => (x * x * x) / 20, label: 'f(x) = x³/20' },
    linear: { f: x => 0.5 * x + 2, label: 'f(x) = 0.5x + 2' }
  };

  let fnKey = 'x2';
  const aSlider = document.getElementById('a-slider');
  const bSlider = document.getElementById('b-slider');
  const aVal = document.getElementById('a-val');
  const bVal = document.getElementById('b-val');
  const intValEl = document.getElementById('int-value');

  const XMIN = -10, XMAX = 10, YMIN = -10, YMAX = 10;
  const originX = W / 2, originY = H / 2;
  const scaleX = W / (XMAX - XMIN);
  const scaleY = H / (YMAX - YMIN);

  function toPx(x, y) {
    return [originX + x * scaleX, originY - y * scaleY];
  }

  function simpson(f, a, b, n) {
    if (n % 2 !== 0) n++;
    const h = (b - a) / n;
    let sum = f(a) + f(b);
    for (let i = 1; i < n; i++) {
      sum += f(a + i * h) * (i % 2 === 0 ? 2 : 4);
    }
    return (h / 3) * sum;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const f = FUNCS[fnKey].f;

    // axes
    ctx.strokeStyle = 'rgba(244,237,226,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, originY); ctx.lineTo(W, originY);
    ctx.moveTo(originX, 0); ctx.lineTo(originX, H);
    ctx.stroke();

    let a = Number(aSlider.value);
    let b = Number(bSlider.value);
    if (a > b) [a, b] = [b, a];
    aVal.textContent = a.toFixed(1);
    bVal.textContent = b.toFixed(1);

    // shaded area
    ctx.beginPath();
    const steps = 120;
    let started = false;
    for (let i = 0; i <= steps; i++) {
      const x = a + (i / steps) * (b - a);
      const y = f(x);
      const [px, py] = toPx(x, Math.max(YMIN, Math.min(YMAX, y)));
      if (!started) { ctx.moveTo(px, originY); ctx.lineTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    const [pbx] = toPx(b, 0);
    ctx.lineTo(pbx, originY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(232,182,90,0.25)';
    ctx.fill();

    // curve
    ctx.beginPath();
    for (let px = 0; px <= W; px += 2) {
      const x = XMIN + (px / W) * (XMAX - XMIN);
      const y = f(x);
      const [cx2, cy2] = toPx(x, Math.max(YMIN - 2, Math.min(YMAX + 2, y)));
      if (px === 0) ctx.moveTo(cx2, cy2); else ctx.lineTo(cx2, cy2);
    }
    ctx.strokeStyle = '#6FC2C0';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    const value = simpson(f, a, b, 200);
    intValEl.textContent = value.toFixed(2);
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

  aSlider.addEventListener('input', draw);
  bSlider.addEventListener('input', draw);
  draw();
});
