(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const list = typeof PROJECTS !== "undefined" ? PROJECTS : [];
  const byId = Object.fromEntries(list.map((p) => [p.id, p]));

  // ---------- 1) 프로젝트 카드 ----------
  const grid = $("#projectGrid");
  function card(p) {
    const alt = esc(p.thumbAlt || "");
    const media = p.video
      ? `<button class="media-btn" type="button" data-video="${esc(p.video)}" data-title="${esc(p.title)}" aria-label="${esc(p.title)} 영상 재생">
           <img src="${esc(p.thumb)}" alt="${alt}" loading="lazy">
           <span class="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>재생</span>
         </button>`
      : `<button class="thumb" type="button" data-detail="${esc(p.id)}" aria-label="${esc(p.title)} 제작 과정 보기"><img src="${esc(p.thumb)}" alt="${alt}" loading="lazy"></button>`;
    const facts = (p.facts || []).map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join("");
    const links = (p.links || [])
      .map((l) => `<a class="link" href="${esc(l.href)}"${l.external ? ' target="_blank" rel="noopener"' : ""}${l.download ? ` download="${esc(l.download)}"` : ""}>${esc(l.text)} <span aria-hidden="true">${l.download ? "↓" : "↗"}</span></a>`).join("");
    const play = p.video ? `<button class="link" type="button" data-video="${esc(p.video)}" data-title="${esc(p.title)}">영상 보기 <span aria-hidden="true">▶</span></button>` : "";
    const more = p.detail ? `<button class="link link-more" type="button" data-detail="${esc(p.id)}">제작 과정 <span aria-hidden="true">+</span></button>` : "";
    return `<article class="card spot" data-type="${esc(p.type)}">
      ${media}
      <div class="card-body">
        <p class="meta"><span class="tag">${esc(p.label)}</span><span>${esc(p.date)}</span></p>
        <h3>${esc(p.title)}</h3>
        <p class="desc">${esc(p.desc)}</p>
        ${facts ? `<ul class="facts">${facts}</ul>` : ""}
        <div class="card-links">${more}${play}${links}</div>
      </div>
    </article>`;
  }
  if (grid) grid.innerHTML = list.filter((p) => !p.featured).map(card).join("");

  // ---------- 2) 분류 필터 ----------
  $$(".filters .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".filters .chip").forEach((c) => { c.classList.toggle("is-on", c === chip); c.setAttribute("aria-pressed", c === chip); });
      const f = chip.dataset.filter;
      $$(".card", grid).forEach((el) => { el.hidden = !(f === "all" || el.dataset.type === f); });
    });
  });

  // ---------- 3) 대화상자 공통 ----------
  let lastFocus = null;
  function openDlg(d) {
    lastFocus = document.activeElement;
    if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", "");
    document.documentElement.classList.add("dlg-open");
  }
  function closeDlg(d) {
    if (d.id === "player") { const v = $("#playerVideo"); v.pause(); v.removeAttribute("src"); v.load(); }
    if (d.close) d.close(); else d.removeAttribute("open");
    if (!$$("dialog[open]").length) document.documentElement.classList.remove("dlg-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $$("dialog").forEach((d) => {
    d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) closeDlg(d); });
    d.addEventListener("cancel", (e) => { e.preventDefault(); closeDlg(d); });
  });

  // ---------- 4) 영상 ----------
  function openVideo(src, title) {
    const v = $("#playerVideo");
    $("#playerTitle").textContent = title || "";
    v.src = src;
    openDlg($("#player"));
    v.play().catch(() => {});
  }

  // ---------- 5) 제작 과정 창 ----------
  function openDetail(id) {
    const p = byId[id]; if (!p || !p.detail) return;
    const d = p.detail;
    const sec = (no, title, body) => `<section class="dt-sec"><h4><span class="mono">${no}</span>${title}</h4>${body}</section>`;
    let n = 0; const no = () => String(++n).padStart(2, "0");
    let h = `<h3 id="detailTitle">${esc(p.title)}</h3>`;
    if (p.desc) h += `<p class="dt-desc">${esc(p.desc)}</p>`;
    h += sec(no(), "왜 시작했나", `<p>${esc(d.problem)}</p>`);
    if (d.questions) h += sec(no(), "먼저 정한 질문", `<ul class="dt-q">${d.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>${d.questionsNote ? `<p class="dt-note">${esc(d.questionsNote)}</p>` : ""}`);
    h += sec(no(), "만든 과정", `<ol class="dt-steps">${d.steps.map(([t, x], i) => `<li><span class="mono">${String(i + 1).padStart(2, "0")}</span><div><b>${esc(t)}</b><p>${esc(x)}</p></div></li>`).join("")}</ol>`);
    if (d.prompt) h += sec(no(), "실제로 쓴 프롬프트", `<pre class="dt-pre"><code>${esc(d.prompt)}</code></pre>${d.promptNote ? `<p class="dt-note">${esc(d.promptNote)}</p>` : ""}`);
    if (d.gallery) h += sec(no(), "결과물 일부", `<div class="dt-gallery">${d.gallery.map((g) => `<img src="${esc(g)}" alt="" loading="lazy">`).join("")}</div>${d.galleryNote ? `<p class="dt-note">${esc(d.galleryNote)}</p>` : ""}`);
    if (d.results) h += sec(no(), "숫자로 본 결과", `<dl class="dt-results">${d.results.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`);
    if (d.notes) h += sec(no(), "만들며 배운 점", `<ul class="dt-notes">${d.notes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`);
    const acts = [];
    if (p.video) acts.push(`<button class="btn btn-line" type="button" data-video="${esc(p.video)}" data-title="${esc(p.title)}">영상 보기 ▶</button>`);
    (p.links || []).forEach((l) => acts.push(`<a class="btn btn-line" href="${esc(l.href)}"${l.external ? ' target="_blank" rel="noopener"' : ""}${l.download ? ` download="${esc(l.download)}"` : ""}>${esc(l.text)} ${l.download ? "↓" : "↗"}</a>`));
    if (id === "semi") acts.push(`<button class="btn btn-line" type="button" data-gallery="report">보고서 넘겨 보기</button>`, `<button class="btn btn-line" type="button" data-gallery="deck">발표자료 넘겨 보기</button>`);
    if (acts.length) h += `<div class="dt-acts">${acts.join("")}</div>`;
    $("#detailKicker").textContent = d.kicker || "";
    const body = $("#detailBody");
    body.innerHTML = h; body.scrollTop = 0;
    openDlg($("#detail"));
  }

  // ---------- 6) 보고서·발표자료 넘겨 보기 ----------
  const GALLERIES = {
    report: { title: "보고서 — 이번엔 다를까?", pages: Array.from({ length: 9 }, (_, i) => `assets/preview/report/p-${i + 1}.jpg`) },
    deck: { title: "발표자료 — 16장", pages: Array.from({ length: 16 }, (_, i) => `assets/preview/deck/s-${String(i + 1).padStart(2, "0")}.jpg`) }
  };
  const vw = $("#viewer"), vImg = $("#viewerImg"), vThumbs = $("#viewerThumbs");
  let gal = null, gi = 0;
  function showPage(i) {
    if (!gal) return;
    gi = (i + gal.pages.length) % gal.pages.length;
    vImg.src = gal.pages[gi];
    vImg.alt = `${gal.title} ${gi + 1}쪽`;
    $("#viewerCount").textContent = `${String(gi + 1).padStart(2, "0")} / ${String(gal.pages.length).padStart(2, "0")}`;
    $$("button", vThumbs).forEach((b, k) => b.classList.toggle("is-on", k === gi));
    const on = vThumbs.children[gi]; if (on) on.scrollIntoView({ block: "nearest", inline: "center" });
    const nx = new Image(); nx.src = gal.pages[(gi + 1) % gal.pages.length];
  }
  function openGallery(key) {
    gal = GALLERIES[key]; if (!gal) return;
    vw.classList.toggle("is-deck", key === "deck");
    $("#viewerTitle").textContent = gal.title;
    vThumbs.innerHTML = gal.pages.map((src, k) => `<button type="button" data-page="${k}" aria-label="${k + 1}쪽"><img src="${src}" alt="" loading="lazy"></button>`).join("");
    openDlg(vw);
    showPage(0);
  }
  $("#viewerPrev").addEventListener("click", () => showPage(gi - 1));
  $("#viewerNext").addEventListener("click", () => showPage(gi + 1));
  vThumbs.addEventListener("click", (e) => { const b = e.target.closest("[data-page]"); if (b) showPage(+b.dataset.page); });
  vw.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); showPage(gi - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); showPage(gi + 1); }
  });
  let tx = null;
  vImg.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  vImg.addEventListener("touchend", (e) => {
    if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 40) showPage(gi + (dx < 0 ? 1 : -1));
  });

  // ---------- 7) 클릭 연결 (영상 / 제작 과정 / 넘겨 보기) ----------
  document.addEventListener("click", (e) => {
    const v = e.target.closest("[data-video]");
    if (v) { e.preventDefault(); openVideo(v.dataset.video, v.dataset.title); return; }
    const d = e.target.closest("[data-detail]");
    if (d) { e.preventDefault(); openDetail(d.dataset.detail); return; }
    const g = e.target.closest("[data-gallery]");
    if (g) { e.preventDefault(); openGallery(g.dataset.gallery); }
  });

  // ---------- 8) 밝게 / 어둡게 ----------
  const root = document.documentElement;
  $("#themeBtn").addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    document.dispatchEvent(new Event("themechange"));
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });

  // ---------- 9) 모바일 메뉴 ----------
  const menuBtn = $("#menuBtn"), nav = $("#nav");
  const setMenu = (on) => {
    document.body.classList.toggle("menu-open", on);
    menuBtn.setAttribute("aria-expanded", on);
    menuBtn.setAttribute("aria-label", on ? "메뉴 닫기" : "메뉴 열기");
  };
  menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // ---------- 10) 이메일 복사 ----------
  const copyBtn = $("#copyBtn");
  copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(copyBtn.dataset.copy); copyBtn.textContent = "복사됨 ✓"; }
    catch (e) { copyBtn.textContent = "복사 실패"; }
    setTimeout(() => (copyBtn.textContent = "주소 복사"), 1600);
  });

  // ---------- 11) 스크롤 시 나타나기 ----------
  if ("IntersectionObserver" in window && !still) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".sec-head, .feature, .card, .steps li, .about-grid, .stats, .focus-card, .cycle, .principles li, .contact-title").forEach((el) => {
      el.classList.add("reveal"); io.observe(el);
    });
  }

  // ---------- 12) 진행 막대 + 맨 위로 ----------
  const bar = $("#progress"), toTop = $("#toTop");
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    toTop.classList.toggle("is-on", scrollY > innerHeight * 0.9);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // ---------- 13) 숫자 올라가기 ----------
  function fmt(el, v) {
    const dec = +(el.dataset.dec || 0);
    const pre = el.dataset.prefix || "";
    const from = el.dataset.from;
    const num = Math.abs(v).toFixed(dec);
    return from !== undefined ? `${from}~${num}` : `${v < 0 ? pre : ""}${num}`;
  }
  if ("IntersectionObserver" in window && !still) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target, to = +el.dataset.to, t0 = performance.now(), dur = 1400;
        const tick = (now) => {
          const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
          el.textContent = fmt(el, to * e);
          if (k < 1) requestAnimationFrame(tick); else el.textContent = fmt(el, to);
        };
        requestAnimationFrame(tick); co.unobserve(el);
      });
    }, { threshold: 0.6 });
    $$(".count").forEach((c) => co.observe(c));
  }

  // ---------- 14) 카드 위 빛 ----------
  document.addEventListener("pointermove", (e) => {
    const el = e.target.closest && e.target.closest(".spot");
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, { passive: true });

  // ---------- 15) 실적 그래프 막대 올라오기 ----------
  const cyc = $("#cycle");
  if (cyc) {
    if ("IntersectionObserver" in window && !still) {
      const o = new IntersectionObserver(([en]) => { if (en.isIntersecting) { cyc.classList.add("draw"); o.disconnect(); } }, { threshold: 0.3 });
      o.observe(cyc);
    } else cyc.classList.add("draw");
  }
})();
