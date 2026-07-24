document.addEventListener("DOMContentLoaded", () => {
    // Canvas colors based on MATH.LAB theme
    const strokeColor = "#6FC2C0"; // cyan
    const fillColor = "rgba(111, 194, 192, 0.1)"; // cyan with opacity
    const textColor = "#A3AAB2"; // chalk-dim approx

    // --- Equilateral Canvas ---
    const cvsEq = document.getElementById('canvas-eq');
    const ctxEq = cvsEq.getContext('2d');
    const eqSideSlider = document.getElementById('eq-side');
    const eqSideVal = document.getElementById('eq-side-val');

    function drawEquilateral() {
        if(!ctxEq) return;
        ctxEq.clearRect(0, 0, cvsEq.width, cvsEq.height);
        const side = parseFloat(eqSideSlider.value);
        eqSideVal.textContent = side;

        const h = (Math.sqrt(3) / 2) * side;
        const cx = cvsEq.width / 2;
        const cy = cvsEq.height / 2;

        ctxEq.beginPath();
        ctxEq.moveTo(cx, cy - h / 2);
        ctxEq.lineTo(cx + side / 2, cy + h / 2);
        ctxEq.lineTo(cx - side / 2, cy + h / 2);
        ctxEq.closePath();

        ctxEq.fillStyle = fillColor;
        ctxEq.fill();
        ctxEq.strokeStyle = strokeColor;
        ctxEq.lineWidth = 2;
        ctxEq.stroke();

        ctxEq.fillStyle = textColor;
        ctxEq.font = "14px monospace";
        ctxEq.textAlign = "center";
        
        ctxEq.fillText(side, cx, cy + h/2 + 20); // base
        ctxEq.fillText(side, cx - side/4 - 15, cy); // left
        ctxEq.fillText(side, cx + side/4 + 15, cy); // right
    }
    if(eqSideSlider) eqSideSlider.addEventListener('input', drawEquilateral);
    
    // --- Isosceles Canvas ---
    const cvsIso = document.getElementById('canvas-iso');
    const ctxIso = cvsIso.getContext('2d');
    const isoSideSlider = document.getElementById('iso-side');
    const isoBaseSlider = document.getElementById('iso-base');
    const isoSideVal = document.getElementById('iso-side-val');
    const isoBaseVal = document.getElementById('iso-base-val');

    function drawIsosceles() {
        if(!ctxIso) return;
        ctxIso.clearRect(0, 0, cvsIso.width, cvsIso.height);
        const s = parseFloat(isoSideSlider.value);
        const b = parseFloat(isoBaseSlider.value);
        isoSideVal.textContent = s;
        isoBaseVal.textContent = b;

        // Check if triangle is valid (sum of equal sides > base)
        if (2 * s <= b) {
            ctxIso.fillStyle = "#ff6b6b"; // rose
            ctxIso.font = "14px sans-serif";
            ctxIso.textAlign = "center";
            ctxIso.fillText("Invalid Triangle (2 × Side must be > Base)", cvsIso.width/2, cvsIso.height/2);
            return;
        }

        const h = Math.sqrt(s * s - (b / 2) * (b / 2));
        const cx = cvsIso.width / 2;
        const cy = cvsIso.height / 2;

        ctxIso.beginPath();
        ctxIso.moveTo(cx, cy - h / 2);
        ctxIso.lineTo(cx + b / 2, cy + h / 2);
        ctxIso.lineTo(cx - b / 2, cy + h / 2);
        ctxIso.closePath();

        ctxIso.fillStyle = fillColor;
        ctxIso.fill();
        ctxIso.strokeStyle = strokeColor;
        ctxIso.lineWidth = 2;
        ctxIso.stroke();

        ctxIso.fillStyle = textColor;
        ctxIso.font = "14px monospace";
        ctxIso.textAlign = "center";
        ctxIso.fillText(b, cx, cy + h/2 + 20); // base
        ctxIso.fillText(s, cx - b/4 - 15, cy); // left
        ctxIso.fillText(s, cx + b/4 + 15, cy); // right
    }
    if(isoSideSlider) isoSideSlider.addEventListener('input', drawIsosceles);
    if(isoBaseSlider) isoBaseSlider.addEventListener('input', drawIsosceles);

    // --- Scalene Canvas ---
    const cvsSca = document.getElementById('canvas-sca');
    const ctxSca = cvsSca.getContext('2d');
    const scaA = document.getElementById('sca-a');
    const scaB = document.getElementById('sca-b');
    const scaC = document.getElementById('sca-c');
    const scaAVal = document.getElementById('sca-a-val');
    const scaBVal = document.getElementById('sca-b-val');
    const scaCVal = document.getElementById('sca-c-val');
    const scaWarn = document.getElementById('sca-warning');

    function drawScalene() {
        if(!ctxSca) return;
        ctxSca.clearRect(0, 0, cvsSca.width, cvsSca.height);
        const a = parseFloat(scaA.value); // side A (right)
        const b = parseFloat(scaB.value); // side B (left)
        const c = parseFloat(scaC.value); // base C
        
        scaAVal.textContent = a;
        scaBVal.textContent = b;
        scaCVal.textContent = c;

        // Check triangle inequality theorem
        if (a + b <= c || a + c <= b || b + c <= a) {
            scaWarn.style.display = "block";
            return;
        } else {
            scaWarn.style.display = "none";
        }

        // Calculate coordinates using Law of Cosines to find x of top vertex
        // c is the base (on x-axis)
        const x = (c*c + b*b - a*a) / (2 * c);
        const y = Math.sqrt(b*b - x*x);

        // Calculate bounding box to center it
        const minX = Math.min(0, c, x);
        const maxX = Math.max(0, c, x);
        const width = maxX - minX;
        const height = y;

        const offsetX = (cvsSca.width - width) / 2 - minX;
        const offsetY = (cvsSca.height - height) / 2 + y; // Y goes down, so we subtract y later

        ctxSca.beginPath();
        ctxSca.moveTo(offsetX, offsetY); // Left base vertex
        ctxSca.lineTo(offsetX + c, offsetY); // Right base vertex
        ctxSca.lineTo(offsetX + x, offsetY - y); // Top vertex
        ctxSca.closePath();

        ctxSca.fillStyle = fillColor;
        ctxSca.fill();
        ctxSca.strokeStyle = strokeColor;
        ctxSca.lineWidth = 2;
        ctxSca.stroke();

        ctxSca.fillStyle = textColor;
        ctxSca.font = "14px monospace";
        ctxSca.textAlign = "center";
        
        ctxSca.fillText(c, offsetX + c/2, offsetY + 20); // base (c)
        ctxSca.fillText(b, offsetX + x/2 - 15, offsetY - y/2); // left side (b)
        ctxSca.fillText(a, offsetX + c - (c-x)/2 + 15, offsetY - y/2); // right side (a)
    }
    
    if(scaA) scaA.addEventListener('input', drawScalene);
    if(scaB) scaB.addEventListener('input', drawScalene);
    if(scaC) scaC.addEventListener('input', drawScalene);

    // Trigger initial draws
    drawEquilateral();
    drawIsosceles();
    drawScalene();
    
    // Ensure redrawing if tab changes (helps some browsers when canvas display toggles)
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(() => {
                drawEquilateral();
                drawIsosceles();
                drawScalene();
            }, 10);
        });
    });
});
