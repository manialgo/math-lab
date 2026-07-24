document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('quad-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  const W = 440, H = 380;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.scale(DPR, DPR);

  const aSlider = document.getElementById('quad-a');
  const bSlider = document.getElementById('quad-b');
  const cSlider = document.getElementById('quad-c');
  const aVal = document.getElementById('quad-a-val');
  const bVal = document.getElementById('quad-b-val');
  const cVal = document.getElementById('quad-c-val');
  const discEl = document.getElementById('quad-disc');
  const caseEl = document.getElementById('quad-case');
  const rootsEl = document.getElementById('quad-roots');

  const XMIN = -10, XMAX = 10, YMIN = -10, YMAX = 10;
  const originX = W / 2, originY = H / 2;
  const scaleX = W / (XMAX - XMIN);
  const scaleY = H / (YMAX - YMIN);

  function toPx(x, y) {
    return [originX + x * scaleX, originY - y * scaleY];
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
    if (a === 0) a = 0.5; // avoid degenerate case visually
    aVal.textContent = Number(aSlider.value);
    bVal.textContent = b;
    cVal.textContent = c;

    const f = x => a * x * x + b * x + c;

    ctx.beginPath();
    for (let px = 0; px <= W; px += 2) {
      const x = XMIN + (px / W) * (XMAX - XMIN);
      const y = f(x);
      const [cx, cy] = toPx(x, Math.max(YMIN - 4, Math.min(YMAX + 4, y)));
      if (px === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
    }
    ctx.strokeStyle = '#6FC2C0';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    const D = b * b - 4 * a * c;
    discEl.textContent = D.toFixed(2);

    if (D > 0.0001) {
      const r1 = (-b + Math.sqrt(D)) / (2 * a);
      const r2 = (-b - Math.sqrt(D)) / (2 * a);
      caseEl.textContent = '2 real roots';
      rootsEl.textContent = `${r1.toFixed(2)}, ${r2.toFixed(2)}`;
      [r1, r2].forEach(r => {
        if (r >= XMIN && r <= XMAX) {
          const [rx, ry] = toPx(r, 0);
          ctx.beginPath();
          ctx.arc(rx, ry, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#E8B65A';
          ctx.fill();
          ctx.strokeStyle = '#0B1D26';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    } else if (Math.abs(D) <= 0.0001) {
      const r = -b / (2 * a);
      caseEl.textContent = '1 repeated root';
      rootsEl.textContent = r.toFixed(2);
      if (r >= XMIN && r <= XMAX) {
        const [rx, ry] = toPx(r, 0);
        ctx.beginPath();
        ctx.arc(rx, ry, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#E8B65A';
        ctx.fill();
        ctx.strokeStyle = '#0B1D26';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    } else {
      caseEl.textContent = 'no real roots';
      const real = (-b / (2 * a)).toFixed(2);
      const imag = (Math.sqrt(-D) / (2 * a)).toFixed(2);
      rootsEl.textContent = `${real} ± ${imag}i`;
    }
  }

  aSlider.addEventListener('input', draw);
  bSlider.addEventListener('input', draw);
  cSlider.addEventListener('input', draw);
  draw();
});
