/*
 * chip.js — 첫 화면의 반도체 칩 그래픽
 * 가운데 다이(die)에서 회로선이 뻗어 나가고, 선을 따라 데이터 신호가 흐릅니다.
 */
(function () {
  const cv = document.getElementById("chipCanvas");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, DPR = 1, traces = [], pulses = [], die = null, raf = 0, t0 = performance.now();

  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  function rgba(hex, a) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }
  // 같은 결과가 나오도록 고정된 난수
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  function build() {
    const r = cv.getBoundingClientRect();
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed = 7;

    const S = Math.min(W, H) * 0.34;
    die = { x: W / 2 - S / 2, y: H / 2 - S / 2, s: S };
    traces = [];
    const per = 9, gap = S / (per + 1), step = Math.max(10, S * 0.06);
    for (let side = 0; side < 4; side++) {
      for (let i = 1; i <= per; i++) {
        const o = gap * i;
        let x, y, dx, dy, sx, sy;
        if (side === 0) { x = die.x + o; y = die.y; dx = 0; dy = -1; sx = 1; sy = 0; }
        if (side === 1) { x = die.x + S; y = die.y + o; dx = 1; dy = 0; sx = 0; sy = 1; }
        if (side === 2) { x = die.x + S - o; y = die.y + S; dx = 0; dy = 1; sx = -1; sy = 0; }
        if (side === 3) { x = die.x; y = die.y + S - o; dx = -1; dy = 0; sx = 0; sy = -1; }
        const pts = [[x, y]];
        const a = step * (1 + Math.floor(rnd() * 3));
        let px = x + dx * a, py = y + dy * a; pts.push([px, py]);
        // 45도로 한 번 꺾고 다시 바깥으로
        const shift = (i - (per + 1) / 2) * step * 0.9;
        const d = Math.abs(shift);
        px += sx * shift + dx * d; py += sy * shift + dy * d; pts.push([px, py]);
        const far = Math.max(W, H);
        pts.push([px + dx * far, py + dy * far]);
        // 화면 밖으로 잘라 내기
        const clipped = clip(pts);
        let len = 0; const seg = [];
        for (let k = 1; k < clipped.length; k++) {
          const l = Math.hypot(clipped[k][0] - clipped[k - 1][0], clipped[k][1] - clipped[k - 1][1]);
          seg.push(l); len += l;
        }
        traces.push({ pts: clipped, seg, len, pad: [x, y], side });
      }
    }
    pulses = [];
    const n = reduce ? 0 : Math.round(traces.length * 0.45);
    for (let i = 0; i < n; i++) pulses.push(newPulse(true));
  }

  function clip(pts) {
    const out = [pts[0]];
    for (let k = 1; k < pts.length; k++) {
      let [x, y] = pts[k];
      const [x0, y0] = out[out.length - 1];
      if (x < 0 || x > W || y < 0 || y > H) {
        const tx = x < 0 ? (0 - x0) / (x - x0) : x > W ? (W - x0) / (x - x0) : 1;
        const ty = y < 0 ? (0 - y0) / (y - y0) : y > H ? (H - y0) / (y - y0) : 1;
        const tt = Math.max(0, Math.min(tx, ty));
        out.push([x0 + (x - x0) * tt, y0 + (y - y0) * tt]);
        break;
      }
      out.push([x, y]);
    }
    return out;
  }

  function newPulse(randomStart) {
    const tr = traces[Math.floor(Math.random() * traces.length)];
    return { tr, p: randomStart ? Math.random() : 0, v: 0.08 + Math.random() * 0.14, out: Math.random() < 0.6 };
  }

  function at(tr, d) {
    let acc = 0;
    for (let k = 0; k < tr.seg.length; k++) {
      if (acc + tr.seg[k] >= d) {
        const f = (d - acc) / (tr.seg[k] || 1);
        const a = tr.pts[k], b = tr.pts[k + 1];
        return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
      }
      acc += tr.seg[k];
    }
    return tr.pts[tr.pts.length - 1];
  }

  function draw(now) {
    const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
    const ink = css("--ink") || "#E9ECEF", acc = css("--accent") || "#F2A65A";
    ctx.clearRect(0, 0, W, H);

    // 1) 배경: 웨이퍼 원과 다이 격자
    const R = Math.max(W, H) * 0.62, cx = W / 2, cy = H / 2;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = rgba(ink, 0.05); ctx.lineWidth = 1;
    const g = die.s * 0.5;
    ctx.beginPath();
    for (let x = cx % g; x < W; x += g) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
    for (let y = cy % g; y < H; y += g) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = rgba(ink, 0.12);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

    // 2) 회로선
    ctx.lineWidth = 1; ctx.strokeStyle = rgba(ink, 0.22);
    for (const tr of traces) {
      ctx.beginPath(); ctx.moveTo(tr.pts[0][0], tr.pts[0][1]);
      for (let k = 1; k < tr.pts.length; k++) ctx.lineTo(tr.pts[k][0], tr.pts[k][1]);
      ctx.stroke();
      // 비아(via)
      const v = tr.pts[2] || tr.pts[1];
      ctx.beginPath(); ctx.arc(v[0], v[1], 2, 0, Math.PI * 2);
      ctx.fillStyle = rgba(ink, 0.35); ctx.fill();
    }

    // 3) 신호
    for (let i = 0; i < pulses.length; i++) {
      const p = pulses[i];
      p.p += p.v * dt;
      if (p.p >= 1) { pulses[i] = newPulse(false); continue; }
      const prog = p.out ? p.p : 1 - p.p;
      const d = prog * p.tr.len;
      const tail = 26;
      const steps = 8;
      for (let s = steps; s >= 0; s--) {
        const dd = d + (p.out ? -1 : 1) * (tail * s) / steps;
        if (dd < 0 || dd > p.tr.len) continue;
        const [x, y] = at(p.tr, dd);
        ctx.fillStyle = rgba(acc, (1 - s / steps) * 0.9);
        ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
      }
    }

    // 4) 다이
    const { x, y, s } = die;
    ctx.fillStyle = css("--paper") || "#0A0B0D";
    ctx.fillRect(x, y, s, s);
    ctx.strokeStyle = rgba(ink, 0.55); ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, s, s);
    // 패드
    ctx.fillStyle = rgba(acc, 0.85);
    for (const tr of traces) { const [px, py] = tr.pad; ctx.fillRect(px - 2, py - 2, 4, 4); }
    // 안쪽 HBM 적층(4단) 표시
    const m = s * 0.16, iw = s - m * 2;
    for (let k = 0; k < 4; k++) {
      const off = k * s * 0.035;
      ctx.strokeStyle = rgba(ink, 0.18 + k * 0.12);
      ctx.strokeRect(x + m + off + 0.5, y + m - off + 0.5, iw - s * 0.105, iw - s * 0.105);
    }
    // 코어 셀
    const cs = (iw - s * 0.105) / 6, ox = x + m + 3 * s * 0.035, oy = y + m - 3 * s * 0.035;
    const tt = now / 1000;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
      const on = !reduce && Math.sin(tt * 1.3 + r * 0.9 + c * 1.7) > 0.86;
      ctx.fillStyle = on ? rgba(acc, 0.75) : rgba(ink, 0.07);
      ctx.fillRect(ox + c * cs + 2, oy + r * cs + 2, cs - 4, cs - 4);
    }
    // 라벨
    ctx.fillStyle = rgba(ink, 0.6);
    ctx.font = `500 ${Math.max(9, s * 0.05)}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.fillText("HBM · 20212954", x + 6, y + s - 8);

    if (!reduce) raf = requestAnimationFrame(draw);
  }

  function start() {
    cancelAnimationFrame(raf); build(); t0 = performance.now();
    if (reduce) draw(performance.now()); else raf = requestAnimationFrame(draw);
  }
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(start, 120); });
  document.addEventListener("themechange", () => { if (reduce) draw(performance.now()); });
  // 화면 밖에 있으면 멈추기
  if ("IntersectionObserver" in window && !reduce) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { t0 = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
      else cancelAnimationFrame(raf);
    }).observe(cv);
  }
  start();
})();
