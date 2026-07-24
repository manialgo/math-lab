document.addEventListener('DOMContentLoaded', () => {
  const coeffContainer = document.getElementById('coeff-inputs');
  if (!coeffContainer) return;
  const rootSlider = document.getElementById('root-slider');
  const rootVal = document.getElementById('root-val');
  const tableEl = document.getElementById('synthetic-table');
  const quotientEl = document.getElementById('quotient-display');
  const remainderEl = document.getElementById('remainder-display');
  const factorEl = document.getElementById('factor-display');

  const DEFAULTS = {
    2: [1, -5, 6],
    3: [1, -6, 11, -6],
    4: [1, -10, 35, -50, 24]
  };

  let degree = 3;

  function buildCoeffInputs(deg) {
    coeffContainer.innerHTML = '';
    const defaults = DEFAULTS[deg];
    for (let i = 0; i <= deg; i++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.value = defaults[i];
      input.style.width = '64px';
      input.style.background = 'var(--navy-deep)';
      input.style.color = 'var(--chalk)';
      input.style.border = '1px solid var(--grid-line)';
      input.style.borderRadius = '6px';
      input.style.padding = '8px 10px';
      input.style.fontFamily = 'var(--mono)';
      input.dataset.idx = i;
      input.addEventListener('input', compute);
      coeffContainer.appendChild(input);
    }
  }

  function getCoeffs() {
    return Array.from(coeffContainer.querySelectorAll('input')).map(inp => Number(inp.value) || 0);
  }

  function powerLabel(deg, i) {
    const p = deg - i;
    if (p === 0) return '';
    if (p === 1) return 'x';
    return `x^${p}`;
  }

  function compute() {
    const coeffs = getCoeffs();
    const r = Number(rootSlider.value);
    rootVal.textContent = r;

    // synthetic division
    const result = [coeffs[0]];
    for (let i = 1; i < coeffs.length; i++) {
      result.push(coeffs[i] + result[i - 1] * r);
    }
    const remainder = result[result.length - 1];
    const quotientCoeffs = result.slice(0, -1);

    // build table
    let html = '<table style="border-collapse:collapse; font-family:var(--mono); font-size:0.9rem;">';
    html += '<tr>' + coeffs.map(c => `<td style="padding:6px 12px; border-bottom:1px solid var(--grid-line);">${c}</td>`).join('') + '</tr>';
    html += '<tr>' + ['', ...result.slice(0, -1).map(v => (v * r).toFixed(2))].map(v => `<td style="padding:6px 12px; color:var(--cyan);">${v}</td>`).join('') + '</tr>';
    html += '<tr>' + result.map((v, i) => `<td style="padding:6px 12px; border-top:1px solid var(--chalk-dim); color:${i === result.length - 1 ? 'var(--gold)' : 'var(--chalk)'};">${Number(v.toFixed(4))}</td>`).join('') + '</tr>';
    html += '</table>';
    tableEl.innerHTML = html;

    const qStr = quotientCoeffs
      .map((c, i) => {
        const label = powerLabel(quotientCoeffs.length - 1, i);
        if (c === 0) return null;
        const sign = c > 0 ? (i === 0 ? '' : '+ ') : '− ';
        const mag = Math.abs(c);
        return `${sign}${mag}${label}`;
      })
      .filter(Boolean)
      .join(' ') || '0';

    quotientEl.textContent = qStr;
    remainderEl.textContent = Number(remainder.toFixed(4));
    factorEl.textContent = Math.abs(remainder) < 0.0001 ? 'Yes — remainder is 0' : 'No';
  }

  document.querySelectorAll('#degree-chips .chip').forEach((chip, i) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#degree-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      degree = Number(chip.dataset.deg);
      buildCoeffInputs(degree);
      compute();
    });
    if (i === 1) chip.classList.add('active'); // default degree 3
  });

  rootSlider.addEventListener('input', compute);

  buildCoeffInputs(degree);
  compute();
});
