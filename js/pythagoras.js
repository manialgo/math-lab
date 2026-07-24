document.addEventListener('DOMContentLoaded', () => {
  const css = getComputedStyle(document.documentElement);
  const COL = {
    chalk: css.getPropertyValue('--chalk').trim(),
    chalkDim: css.getPropertyValue('--chalk-dim').trim(),
    gold: css.getPropertyValue('--gold').trim(),
    cyan: css.getPropertyValue('--cyan').trim(),
    line: 'rgba(244,237,226,0.15)'
  };

  /* ============================================================
     PROOF TAB — two proofs (square-tiling, algebraic), toggled
     by chip buttons, each with its own canvas illustration and
     numbered step list.
     ============================================================ */
  const proofCanvas = document.getElementById('proof-canvas');
  if (proofCanvas) {
    const pctx = proofCanvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const PSIZE = 420;
    proofCanvas.width = PSIZE * DPR;
    proofCanvas.height = PSIZE * DPR;
    pctx.scale(DPR, DPR);
    const proofStepsEl = document.getElementById('proof-steps');

    const proofContent = {
      tiles: {
        steps: [
          ['1', 'Start with a right triangle of legs <span class="math">a</span> and <span class="math">b</span>, hypotenuse <span class="math">c</span>.'],
          ['2', 'Build a square of side <span class="math">a + b</span>, and place four copies of the triangle inside it, rotated to spiral around a tilted inner square.'],
          ['3', 'The tilted inner square has side <span class="math">c</span>, so its area is <span class="math">c²</span>.'],
          ['4', 'The big square\'s area is also <span class="math">(a+b)²</span>, which equals the four triangles plus the inner square.'],
          ['5', 'Subtract the four triangles from both descriptions of the same area, and what remains is <span class="math">a² + b² = c²</span>.']
        ]
      },
      algebra: {
        steps: [
          ['1', 'Arrange four identical right triangles inside a square whose side is <span class="math">a + b</span>.'],
          ['2', 'Arranged this way, an untilted region in the middle forms a square of side <span class="math">(a − b)</span>, area <span class="math">(a−b)²</span>.'],
          ['3', 'Total area = 4 triangles + inner square: <span class="math">(a+b)² = 4(½ab) + (a−b)²</span>.'],
          ['4', 'Expand both sides: <span class="math">a² + 2ab + b² = 2ab + a² − 2ab + b²</span>.'],
          ['5', 'Simplify the algebra and the cross terms cancel, leaving exactly <span class="math">a² + b² = c²</span> — proven without appealing to the picture at all.']
        ]
      }
    };

    function renderProofSteps(key) {
      proofStepsEl.innerHTML = proofContent[key].steps.map(([n, text]) => `
        <div class="proof-step">
          <div class="proof-step-num">${n}</div>
          <p>${text}</p>
        </div>
      `).join('');
    }

    function drawTilesProof() {
      pctx.clearRect(0, 0, PSIZE, PSIZE);
      const a = 120, b = 160;
      const S = a + b;
      const scale = 320 / S;
      const ox = (PSIZE - S * scale) / 2, oy = (PSIZE - S * scale) / 2 + 10;

      pctx.strokeStyle = COL.line;
      pctx.lineWidth = 1.5;
      pctx.strokeRect(ox, oy, S * scale, S * scale);

      const pts = [
        [[0, 0], [a, 0], [0, b]],
        [[S, 0], [S, a], [S - b, 0]],
        [[S, S], [S - a, S], [S, S - b]],
        [[0, S], [0, S - a], [b, S]]
      ];
      const colors = [COL.cyan, COL.gold, COL.cyan, COL.gold];
      pts.forEach((tri, i) => {
        pctx.beginPath();
        tri.forEach(([x, y], j) => {
          const px = ox + x * scale, py = oy + y * scale;
          if (j === 0) pctx.moveTo(px, py); else pctx.lineTo(px, py);
        });
        pctx.closePath();
        pctx.fillStyle = colors[i] + '33';
        pctx.strokeStyle = colors[i];
        pctx.lineWidth = 1.5;
        pctx.fill();
        pctx.stroke();
      });

      const inner = [[a, 0], [S, a], [S - a, S], [0, S - a]];
      pctx.beginPath();
      inner.forEach(([x, y], j) => {
        const px = ox + x * scale, py = oy + y * scale;
        if (j === 0) pctx.moveTo(px, py); else pctx.lineTo(px, py);
      });
      pctx.closePath();
      pctx.strokeStyle = COL.chalk;
      pctx.lineWidth = 2;
      pctx.stroke();
      pctx.fillStyle = 'rgba(244,237,226,0.05)';
      pctx.fill();

      pctx.fillStyle = COL.chalk;
      pctx.font = '600 15px "Fraunces", serif';
      pctx.textAlign = 'center';
      pctx.fillText('c²', ox + S * scale / 2, oy + S * scale / 2 + 5);

      pctx.font = '500 12px "IBM Plex Mono", monospace';
      pctx.fillStyle = COL.chalkDim;
      pctx.fillText('a', ox + (a / 2) * scale, oy - 8);
      pctx.fillText('b', ox + (a + b / 2) * scale, oy - 8);
    }

    function drawAlgebraProof() {
      pctx.clearRect(0, 0, PSIZE, PSIZE);
      const a = 100, b = 160;
      const S = a + b;
      const scale = 320 / S;
      const ox = (PSIZE - S * scale) / 2, oy = (PSIZE - S * scale) / 2 + 10;

      pctx.strokeStyle = COL.line;
      pctx.lineWidth = 1.5;
      pctx.strokeRect(ox, oy, S * scale, S * scale);

      const tris = [
        [[0, 0], [S, 0], [b, a]],
        [[S, 0], [S, S], [S - a, b]],
        [[S, S], [0, S], [S - b, S - a]],
        [[0, S], [0, 0], [a, S - b]]
      ];
      const colors = [COL.cyan, COL.gold, COL.cyan, COL.gold];
      tris.forEach((tri, i) => {
        pctx.beginPath();
        tri.forEach(([x, y], j) => {
          const px = ox + x * scale, py = oy + y * scale;
          if (j === 0) pctx.moveTo(px, py); else pctx.lineTo(px, py);
        });
        pctx.closePath();
        pctx.fillStyle = colors[i] + '33';
        pctx.strokeStyle = colors[i];
        pctx.lineWidth = 1.5;
        pctx.fill();
        pctx.stroke();
      });

      const ms = (b - a) * scale;
      pctx.strokeStyle = COL.chalk;
      pctx.lineWidth = 2;
      pctx.strokeRect(ox + a * scale, oy + a * scale, ms, ms);
      pctx.fillStyle = 'rgba(244,237,226,0.05)';
      pctx.fillRect(ox + a * scale, oy + a * scale, ms, ms);

      pctx.fillStyle = COL.chalk;
      pctx.font = '600 14px "Fraunces", serif';
      pctx.textAlign = 'center';
      pctx.fillText('(a−b)²', ox + a * scale + ms / 2, oy + a * scale + ms / 2 + 5);

      pctx.font = '500 12px "IBM Plex Mono", monospace';
      pctx.fillStyle = COL.chalkDim;
      pctx.fillText('a + b', ox + S * scale / 2, oy - 8);
    }

    function setProof(key) {
      document.querySelectorAll('#proof-chips .chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.proof === key);
      });
      renderProofSteps(key);
      if (key === 'tiles') drawTilesProof(); else drawAlgebraProof();
    }
    document.querySelectorAll('#proof-chips .chip').forEach(btn => {
      btn.addEventListener('click', () => setProof(btn.dataset.proof));
    });
    setProof('tiles');
  }

  /* ============================================================
     INTERACTIVE LAB — three sliders, a/b/c, with optional lock.
     Free mode: a/b drive c; c drives b. Lock mode: locking one
     side keeps it fixed while the other two stay solvable in
     either direction via a² + b² = c².
     ============================================================ */
  const sliderA = document.getElementById('slider-a');
  if (!sliderA) return;
  const sliderB = document.getElementById('slider-b');
  const sliderC = document.getElementById('slider-c');
  const valA = document.getElementById('val-a');
  const valB = document.getElementById('val-b');
  const valC = document.getElementById('val-c');
  const rowA = document.getElementById('row-a');
  const rowB = document.getElementById('row-b');
  const rowC = document.getElementById('row-c');
  const outA2 = document.getElementById('out-a2');
  const outB2 = document.getElementById('out-b2');
  const outSum = document.getElementById('out-sum');
  const outC2 = document.getElementById('out-c2');
  const outArea = document.getElementById('out-area');
  const readoutNote = document.getElementById('readout-note');
  const lockChips = document.querySelectorAll('#lock-chips .chip');

  let state = { a: 3, b: 4, c: 5, locked: null };
  let activeDrag = null;

  function fmt(n) { return n.toFixed(2); }

  function applyLockUI() {
    [['a', rowA, sliderA], ['b', rowB, sliderB], ['c', rowC, sliderC]].forEach(([side, row, input]) => {
      const isLocked = state.locked === side;
      input.disabled = isLocked;
      row.style.opacity = isLocked ? '0.5' : '1';
    });
    lockChips.forEach(chip => chip.classList.toggle('active', chip.dataset.side === state.locked));
  }

  function updateReadoutNote() {
    if (!state.locked) {
      readoutNote.textContent = 'Currently solving for c — the hypotenuse.';
    } else {
      const solvedFor = state.locked === 'a' ? (activeDrag === 'c' ? 'b' : 'c')
        : state.locked === 'b' ? (activeDrag === 'c' ? 'a' : 'c')
        : (activeDrag === 'a' ? 'b' : 'a');
      readoutNote.textContent = `Side ${state.locked} is locked. Solving for ${solvedFor} as you drag the other slider.`;
    }
  }

  function syncSlidersFromState() {
    sliderA.value = state.a; sliderB.value = state.b; sliderC.value = state.c;
    valA.textContent = fmt(state.a);
    valB.textContent = fmt(state.b);
    valC.textContent = fmt(state.c);
  }

  function updateReadout() {
    const a2 = state.a * state.a, b2 = state.b * state.b, c2 = state.c * state.c;
    outA2.textContent = fmt(a2);
    outB2.textContent = fmt(b2);
    outSum.textContent = fmt(a2 + b2);
    outC2.textContent = fmt(c2);
    outArea.textContent = fmt(0.5 * state.a * state.b);
  }

  function recompute(changed) {
    activeDrag = changed;
    const { locked } = state;

    if (!locked) {
      if (changed === 'a' || changed === 'b') {
        state.c = Math.sqrt(state.a * state.a + state.b * state.b);
      } else if (changed === 'c') {
        const bb2 = state.c * state.c - state.a * state.a;
        state.b = bb2 > 0.0001 ? Math.sqrt(bb2) : 0.1;
      }
    } else if (locked === 'a') {
      if (changed === 'b') state.c = Math.sqrt(state.a * state.a + state.b * state.b);
      if (changed === 'c') {
        const bb2 = state.c * state.c - state.a * state.a;
        state.b = bb2 > 0.0001 ? Math.sqrt(bb2) : 0.1;
      }
    } else if (locked === 'b') {
      if (changed === 'a') state.c = Math.sqrt(state.a * state.a + state.b * state.b);
      if (changed === 'c') {
        const aa2 = state.c * state.c - state.b * state.b;
        state.a = aa2 > 0.0001 ? Math.sqrt(aa2) : 0.1;
      }
    } else if (locked === 'c') {
      if (changed === 'a') {
        const bb2 = state.c * state.c - state.a * state.a;
        state.b = bb2 > 0.0001 ? Math.sqrt(bb2) : 0.1;
      }
      if (changed === 'b') {
        const aa2 = state.c * state.c - state.b * state.b;
        state.a = aa2 > 0.0001 ? Math.sqrt(aa2) : 0.1;
      }
    }

    state.a = Math.min(Math.max(state.a, 0.1), 30);
    state.b = Math.min(Math.max(state.b, 0.1), 30);
    state.c = Math.min(Math.max(state.c, 0.1), 40);

    syncSlidersFromState();
    updateReadout();
    drawLabTriangle();
    updateReadoutNote();
  }

  sliderA.addEventListener('input', () => { state.a = parseFloat(sliderA.value); recompute('a'); });
  sliderB.addEventListener('input', () => { state.b = parseFloat(sliderB.value); recompute('b'); });
  sliderC.addEventListener('input', () => { state.c = parseFloat(sliderC.value); recompute('c'); });

  lockChips.forEach(chip => {
    chip.addEventListener('click', () => {
      state.locked = state.locked === chip.dataset.side ? null : chip.dataset.side;
      applyLockUI();
      updateReadoutNote();
    });
  });

  const labCanvas = document.getElementById('lab-canvas');
  const lctx = labCanvas.getContext('2d');
  const LDPR = window.devicePixelRatio || 1;
  const LW = 440, LH = 380;
  labCanvas.width = LW * LDPR;
  labCanvas.height = LH * LDPR;
  lctx.scale(LDPR, LDPR);

  function drawLabTriangle() {
    lctx.clearRect(0, 0, LW, LH);
    const { a, b } = state;
    const pad = 60;
    const avail = Math.min(LW, LH) - pad * 2;
    const drawScale = avail / 30;

    const legA = a * drawScale;
    const legB = b * drawScale;

    const ox = (LW - legB) / 2;
    const oy = (LH + legA) / 2;

    const P1 = [ox, oy];
    const P2 = [ox + legB, oy];
    const P3 = [ox, oy - legA];

    lctx.fillStyle = COL.gold + '22';
    lctx.strokeStyle = COL.gold;
    lctx.lineWidth = 1.5;
    lctx.beginPath();
    lctx.moveTo(P1[0], P1[1]);
    lctx.lineTo(P2[0], P2[1]);
    lctx.lineTo(P2[0], P2[1] + legB);
    lctx.lineTo(P1[0], P1[1] + legB);
    lctx.closePath();
    lctx.fill(); lctx.stroke();

    lctx.fillStyle = COL.cyan + '22';
    lctx.strokeStyle = COL.cyan;
    lctx.beginPath();
    lctx.moveTo(P1[0], P1[1]);
    lctx.lineTo(P3[0], P3[1]);
    lctx.lineTo(P3[0] - legA, P3[1]);
    lctx.lineTo(P1[0] - legA, P1[1]);
    lctx.closePath();
    lctx.fill(); lctx.stroke();

    const dx = P2[0] - P3[0], dy = P2[1] - P3[1];
    const nx = dy, ny = -dx;
    lctx.fillStyle = 'rgba(244,237,226,0.08)';
    lctx.strokeStyle = COL.chalk;
    lctx.beginPath();
    lctx.moveTo(P3[0], P3[1]);
    lctx.lineTo(P2[0], P2[1]);
    lctx.lineTo(P2[0] + nx, P2[1] + ny);
    lctx.lineTo(P3[0] + nx, P3[1] + ny);
    lctx.closePath();
    lctx.fill(); lctx.stroke();

    lctx.fillStyle = 'rgba(232,182,90,0.18)';
    lctx.strokeStyle = COL.chalk;
    lctx.lineWidth = 2.5;
    lctx.beginPath();
    lctx.moveTo(P1[0], P1[1]);
    lctx.lineTo(P2[0], P2[1]);
    lctx.lineTo(P3[0], P3[1]);
    lctx.closePath();
    lctx.fill(); lctx.stroke();

    const rs = 12;
    lctx.strokeStyle = COL.chalk;
    lctx.lineWidth = 1.5;
    lctx.strokeRect(P1[0], P1[1] - rs, rs, rs);

    lctx.font = '600 13px "IBM Plex Mono", monospace';
    lctx.fillStyle = COL.cyan;
    lctx.textAlign = 'right';
    lctx.fillText('a = ' + fmt(a), P1[0] - 8, (P1[1] + P3[1]) / 2);
    lctx.textAlign = 'center';
    lctx.fillStyle = COL.gold;
    lctx.fillText('b = ' + fmt(b), (P1[0] + P2[0]) / 2, P1[1] + legB + 18);
    lctx.fillStyle = COL.chalk;
    const midCx = (P2[0] + P3[0]) / 2 + nx * 0.3;
    const midCy = (P2[1] + P3[1]) / 2 + ny * 0.3;
    lctx.fillText('c = ' + fmt(state.c), midCx, midCy);
  }

  applyLockUI();
  syncSlidersFromState();
  updateReadout();
  drawLabTriangle();
  updateReadoutNote();
});
