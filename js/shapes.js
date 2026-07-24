document.addEventListener('DOMContentLoaded', () => {
  const NAMES = {
    3: 'Triangle', 4: 'Square', 5: 'Pentagon', 6: 'Hexagon',
    7: 'Heptagon', 8: 'Octagon', 9: 'Nonagon', 10: 'Decagon',
    12: 'Dodecagon', 32: 'Circle'
  };

  function setupChips(containerId, onPick) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    const chips = container.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        onPick(Number(chip.dataset.n));
      });
    });
    chips[0].classList.add('active');
    return chips;
  }

  /* ---------------- Flat shape (Perimeter & Area) ---------------- */
  (function flatShape() {
    const canvas = document.getElementById('shape-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const SIZE = 440;
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    ctx.scale(DPR, DPR);
    const cx = SIZE / 2, cy = SIZE / 2;

    const lenSlider = document.getElementById('side-len');
    const lenVal = document.getElementById('side-len-val');
    const nameEl = document.getElementById('shape-name');
    const perimEl = document.getElementById('shape-perim');
    const areaEl = document.getElementById('shape-area');
    const formulaEl = document.getElementById('shape-formula');

    let n = 3;

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const s = Number(lenSlider.value);
      lenVal.textContent = s;

      if (n === 32) {
        // treat slider as radius for the circle case
        const r = s;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#E8B65A';
        ctx.lineWidth = 2.2;
        ctx.stroke();
        const perim = 2 * Math.PI * r;
        const area = Math.PI * r * r;
        nameEl.textContent = 'Circle';
        perimEl.textContent = perim.toFixed(1) + ' (circumference)';
        areaEl.textContent = area.toFixed(1);
        formulaEl.textContent = 'Circumference = 2πr   |   Area = πr²   (r = ' + r + ')';
        return;
      }

      const R = s / (2 * Math.sin(Math.PI / n)); // circumradius from side length
      const pts = [];
      const rot = -Math.PI / 2;
      for (let i = 0; i < n; i++) {
        const theta = rot + (i / n) * Math.PI * 2;
        pts.push([cx + R * Math.cos(theta), cy + R * Math.sin(theta)]);
      }
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.closePath();
      ctx.strokeStyle = '#E8B65A';
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(232,182,90,0.08)';
      ctx.fill();

      const perim = n * s;
      const area = (n * s * s) / (4 * Math.tan(Math.PI / n));

      nameEl.textContent = NAMES[n] || (n + '-gon');
      perimEl.textContent = perim.toFixed(1);
      areaEl.textContent = area.toFixed(1);
      formulaEl.textContent = `Perimeter = n × s = ${n} × ${s} = ${perim.toFixed(1)}   |   Area = n·s²/(4·tan(π/n))`;
    }

    setupChips('side-chips', (val) => { n = val; draw(); });
    lenSlider.addEventListener('input', draw);
    draw();
  })();

  /* ---------------- Prism (LSA / TSA / Volume) ---------------- */
  (function prism() {
    const canvas = document.getElementById('prism-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const SIZE = 440;
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    ctx.scale(DPR, DPR);
    const cx = SIZE / 2, cy = SIZE / 2 + 40;

    const heightSlider = document.getElementById('prism-height');
    const heightVal = document.getElementById('prism-height-val');
    const lsaEl = document.getElementById('prism-lsa');
    const tsaEl = document.getElementById('prism-tsa');
    const volEl = document.getElementById('prism-vol');

    let n = 3;
    const baseSide = 70; // fixed for clean drawing
    const skew = { x: 0.55, y: -0.35 }; // pseudo-3D offset direction

    function polygonPoints(n, R, ox, oy) {
      const pts = [];
      const rot = -Math.PI / 2;
      for (let i = 0; i < n; i++) {
        const theta = rot + (i / n) * Math.PI * 2;
        pts.push([ox + R * Math.cos(theta), oy + R * Math.sin(theta) * 0.5]);
      }
      return pts;
    }

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const h = Number(heightSlider.value);
      heightVal.textContent = h;

      let R, perim, baseArea, isCircle = false;
      if (n === 32) {
        isCircle = true;
        R = 90;
        perim = 2 * Math.PI * R;
        baseArea = Math.PI * R * R;
      } else {
        R = baseSide / (2 * Math.sin(Math.PI / n));
        perim = n * baseSide;
        baseArea = (n * baseSide * baseSide) / (4 * Math.tan(Math.PI / n));
      }

      const topY = cy - h;
      const bottomPts = isCircle ? null : polygonPoints(n, R, cx, cy);
      const topPts = isCircle ? null : polygonPoints(n, R, cx, topY);

      ctx.strokeStyle = '#6FC2C0';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(111,194,192,0.06)';

      if (isCircle) {
        // bottom ellipse
        ctx.beginPath();
        ctx.ellipse(cx, cy, R, R * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        // vertical sides (tangent lines)
        ctx.beginPath();
        ctx.moveTo(cx - R, cy); ctx.lineTo(cx - R, topY);
        ctx.moveTo(cx + R, cy); ctx.lineTo(cx + R, topY);
        ctx.stroke();
        // top ellipse
        ctx.beginPath();
        ctx.ellipse(cx, topY, R, R * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232,182,90,0.1)';
        ctx.fill();
        ctx.strokeStyle = '#E8B65A';
        ctx.stroke();
      } else {
        // vertical edges
        ctx.strokeStyle = '#6FC2C0';
        bottomPts.forEach(([x, y], i) => {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(topPts[i][0], topPts[i][1]);
          ctx.stroke();
        });
        // bottom face
        ctx.beginPath();
        bottomPts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.closePath();
        ctx.stroke();
        // top face
        ctx.beginPath();
        topPts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.closePath();
        ctx.fillStyle = 'rgba(232,182,90,0.12)';
        ctx.fill();
        ctx.strokeStyle = '#E8B65A';
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }

      const lsa = perim * h;
      const tsa = lsa + 2 * baseArea;
      const vol = baseArea * h;

      lsaEl.textContent = lsa.toFixed(0);
      tsaEl.textContent = tsa.toFixed(0);
      volEl.textContent = vol.toFixed(0);
    }

    setupChips('side-chips-solid', (val) => { n = val; draw(); });
    heightSlider.addEventListener('input', draw);
    draw();
  })();
});
