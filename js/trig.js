document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('trig-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const slider = document.getElementById('angle-slider');
  const degLabel = document.getElementById('angle-deg');
  const vSin = document.getElementById('val-sin');
  const vCos = document.getElementById('val-cos');
  const vTan = document.getElementById('val-tan');
  const vRad = document.getElementById('val-rad');

  const DPR = window.devicePixelRatio || 1;
  const SIZE = 440;
  canvas.width = SIZE * DPR;
  canvas.height = SIZE * DPR;
  ctx.scale(DPR, DPR);

  const cx = SIZE / 2, cy = SIZE / 2, R = 160;
  let angleDeg = 45;
  let dragging = false;

  function toRad(deg) { return (deg * Math.PI) / 180; }

  function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);

    // axes
    ctx.strokeStyle = 'rgba(244,237,226,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - R - 30, cy); ctx.lineTo(cx + R + 30, cy);
    ctx.moveTo(cx, cy - R - 30); ctx.lineTo(cx, cy + R + 30);
    ctx.stroke();

    // circle
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(111,194,192,0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const theta = toRad(angleDeg);
    // canvas y is inverted
    const px = cx + R * Math.cos(theta);
    const py = cy - R * Math.sin(theta);

    // cos projection (x-axis)
    ctx.strokeStyle = '#E8B65A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, cy); ctx.lineTo(px, py);
    ctx.stroke();

    // sin projection (y-axis)
    ctx.strokeStyle = '#D98770';
    ctx.beginPath();
    ctx.moveTo(cx, py); ctx.lineTo(px, py);
    ctx.stroke();

    // radius line
    ctx.strokeStyle = '#F4EDE2';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(px, py);
    ctx.stroke();

    // point
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#E8B65A';
    ctx.fill();
    ctx.strokeStyle = '#0B1D26';
    ctx.lineWidth = 2;
    ctx.stroke();

    // labels
    ctx.font = '12px monospace';
    ctx.fillStyle = 'rgba(244,237,226,0.5)';
    ctx.fillText('1', cx + R + 8, cy + 14);
    ctx.fillText('θ', cx + 24, cy - 10);

    const s = Math.sin(theta), c = Math.cos(theta);
    const t = c !== 0 ? s / c : NaN;

    vSin.textContent = s.toFixed(3);
    vCos.textContent = c.toFixed(3);
    vTan.textContent = Number.isFinite(t) ? t.toFixed(3) : '\u00B1\u221E';
    vRad.textContent = theta.toFixed(3);
    degLabel.textContent = Math.round(((angleDeg % 360) + 360) % 360) + '\u00B0';
  }

  function setAngleFromEvent(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = SIZE / rect.width;
    const scaleY = SIZE / rect.height;
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const dx = x - cx, dy = cy - y;
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    angleDeg = deg;
    slider.value = Math.round(deg);
    draw();
  }

  canvas.addEventListener('mousedown', e => { dragging = true; setAngleFromEvent(e); });
  window.addEventListener('mousemove', e => { if (dragging) setAngleFromEvent(e); });
  window.addEventListener('mouseup', () => dragging = false);
  canvas.addEventListener('touchstart', e => { dragging = true; setAngleFromEvent(e); });
  canvas.addEventListener('touchmove', e => { if (dragging) { setAngleFromEvent(e); e.preventDefault(); } }, { passive: false });
  window.addEventListener('touchend', () => dragging = false);

  slider.addEventListener('input', () => {
    angleDeg = Number(slider.value);
    draw();
  });

  draw();
});
