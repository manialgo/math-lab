document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('linear-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  const W = 440, H = 380;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.scale(DPR, DPR);

  const aSlider = document.getElementById('lin-a');
  const bSlider = document.getElementById('lin-b');
  const aVal = document.getElementById('lin-a-val');
  const bVal = document.getElementById('lin-b-val');
  const eqEl = document.getElementById('lin-eq');
  const rootEl = document.getElementById('lin-root');

  const XMIN = -10, XMAX = 10, YMIN = -10, YMAX = 10;
  const originX = W / 2, originY = H / 2;
  const scaleX = W / (XMAX - XMIN);
  const scaleY = H / (YMAX - YMIN);

  function toPx(x, y) {
    return [originX + x * scaleX, originY - y * scaleY];
  }

  function fmtSigned(n) {
    return n >= 0 ? `+ ${n}` : `− ${Math.abs(n)}`;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // axes
    ctx.strokeStyle = 'rgba(244,237,226,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, originY); ctx.lineTo(W, originY);
    ctx.moveTo(originX, 0); ctx.lineTo(originX, H);
    ctx.stroke();

    const a = Number(aSlider.value);
    const b = Number(bSlider.value);
    aVal.textContent = a;
    bVal.textContent = b;

    const f = x => a * x + b;

    // line
    ctx.beginPath();
    const [p1x, p1y] = toPx(XMIN, Math.max(YMIN - 4, Math.min(YMAX + 4, f(XMIN))));
    const [p2x, p2y] = toPx(XMAX, Math.max(YMIN - 4, Math.min(YMAX + 4, f(XMAX))));
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.strokeStyle = '#6FC2C0';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    eqEl.textContent = a === 0
      ? `${b} = 0 (no unique root)`
      : `${a}x ${fmtSigned(b)} = 0`;

    if (a === 0) {
      rootEl.textContent = b === 0 ? 'all x' : 'none';
      return;
    }

    const root = -b / a;
    rootEl.textContent = root.toFixed(2);

    if (root >= XMIN && root <= XMAX) {
      const [rx, ry] = toPx(root, 0);
      ctx.beginPath();
      ctx.arc(rx, ry, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#E8B65A';
      ctx.fill();
      ctx.strokeStyle = '#0B1D26';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.strokeStyle = 'rgba(232,182,90,0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(rx, originY);
      ctx.lineTo(rx, ry);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  aSlider.addEventListener('input', draw);
  bSlider.addEventListener('input', draw);
  draw();
});
