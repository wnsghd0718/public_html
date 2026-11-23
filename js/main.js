(function () {
  const grid = document.getElementById("projectGrid");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // 1) 프로젝트 카드 그리기
  function card(p) {
    const media = p.video
      ? `<button class="media-btn" type="button" data-video="${esc(p.video)}" data-title="${esc(p.title)}" aria-label="${esc(p.title)} 영상 재생">
           <img src="${esc(p.thumb)}" alt="" loading="lazy">
           <span class="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>재생</span>
         </button>`
      : `<div class="thumb ${p.thumbFit === "contain" ? "is-contain" : ""}"><img src="${esc(p.thumb)}" alt="" loading="lazy"></div>`;
    const facts = (p.facts || [])
      .map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join("");
    const links = (p.links || [])
      .map((l) => `<a class="link" href="${esc(l.href)}"${l.external ? ' target="_blank" rel="noopener"' : ""}${l.download ? ` download="${esc(l.download)}"` : ""}>${esc(l.text)} <span aria-hidden="true">${l.download ? "↓" : "↗"}</span></a>`).join("");
    const play = p.video ? `<button class="link" type="button" data-video="${esc(p.video)}" data-title="${esc(p.title)}">영상 보기 <span aria-hidden="true">▶</span></button>` : "";
    return `<article class="card" data-type="${esc(p.type)}">
      ${media}
      <div class="card-body">
        <p class="meta"><span class="tag">${esc(p.label)}</span><span>${esc(p.date)}</span></p>
        <h3>${esc(p.title)}</h3>
        <p class="desc">${esc(p.desc)}</p>
        ${facts ? `<ul class="facts">${facts}</ul>` : ""}
        <div class="card-links">${play}${links}</div>
      </div>
    </article>`;
  }
  if (grid && typeof PROJECTS !== "undefined") grid.innerHTML = PROJECTS.map(card).join("");

  // 2) 분류 필터
  document.querySelectorAll(".filters .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filters .chip").forEach((c) => c.classList.toggle("is-on", c === chip));
      const f = chip.dataset.filter;
      grid.querySelectorAll(".card").forEach((el) => {
        el.hidden = !(f === "all" || el.dataset.type === f);
      });
    });
  });

  // 3) 영상 팝업
  const dlg = document.getElementById("player");
  const vid = document.getElementById("playerVideo");
  const ttl = document.getElementById("playerTitle");
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-video]");
    if (!b) return;
    ttl.textContent = b.dataset.title || "";
    vid.src = b.dataset.video;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    vid.play().catch(() => {});
  });
  const close = () => { vid.pause(); vid.removeAttribute("src"); vid.load(); dlg.close ? dlg.close() : dlg.removeAttribute("open"); };
  document.getElementById("playerClose").addEventListener("click", close);
  dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); close(); });

  // 4) 밝게/어둡게
  const root = document.documentElement;
  document.getElementById("themeBtn").addEventListener("click", () => {
    const dark = root.dataset.theme !== "light";
    root.dataset.theme = dark ? "light" : "dark";
    document.dispatchEvent(new Event("themechange"));
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });

  // 5) 이메일 복사
  const copyBtn = document.getElementById("copyBtn");
  copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(copyBtn.dataset.copy); copyBtn.textContent = "복사됨"; }
    catch (e) { copyBtn.textContent = "복사 실패"; }
    setTimeout(() => (copyBtn.textContent = "주소 복사"), 1600);
  });

  // 6) 스크롤 시 부드럽게 나타나기
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".sec-head, .feature, .card, .steps li, .about-grid, .stats").forEach((el) => {
      el.classList.add("reveal"); io.observe(el);
    });
  }
})();
