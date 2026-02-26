/* ========= EVA — MAIN.JS (COMPLET + FIX MENU) ========= */

/* Year */
document.querySelectorAll("#y, #year").forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* Reveal on scroll */
(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("on");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
})();

/* Typewriter titles */
(() => {
  function typeOnce(el) {
    const target = el.getAttribute("data-text") || "";
    const out = el.querySelector(".typeOut");
    const caret = el.querySelector(".caret");
    if (!out || el.dataset.typed === "1") return;

    el.dataset.typed = "1";
    out.textContent = "";
    let i = 0;
    const speed = 18;
    let last = performance.now();

    function step(now) {
      if (now - last < speed) { requestAnimationFrame(step); return; }
      last = now;
      out.textContent = target.slice(0, i++);
      if (i <= target.length) requestAnimationFrame(step);
      else if (caret) caret.style.opacity = "0.0";
    }
    requestAnimationFrame(step);
  }

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        typeOnce(e.target);
        titleObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".type-title").forEach(t => titleObserver.observe(t));
})();

/* Active link auto (desktop + mobile) */
(() => {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isHome = path === "" || path === "index.html";

  function markActive(selector, activeClass) {
    document.querySelectorAll(selector).forEach(a => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const file = href.split("/").pop();
      const on = (isHome && (file === "" || file === "index.html")) || (file === path);
      a.classList.toggle(activeClass, on);
    });
  }

  markActive(".links a", "active");
  markActive(".mobileLinks a", "active");
})();

/* Nav arrows (scroll horizontal links) */
(() => {
  const el = document.getElementById("topLinks");
  const left = document.getElementById("navLeft");
  const right = document.getElementById("navRight");
  if (!el || !left || !right) return;

  function refresh() {
    const overflow = el.scrollWidth > el.clientWidth + 2;
    left.style.display = overflow ? "inline-flex" : "none";
    right.style.display = overflow ? "inline-flex" : "none";
  }
  function scrollByX(dx) {
    el.scrollBy({ left: dx, behavior: "smooth" });
  }

  left.addEventListener("click", () => scrollByX(-240));
  right.addEventListener("click", () => scrollByX(240));
  window.addEventListener("resize", refresh);
  setTimeout(refresh, 80);
  refresh();
})();

/* Burger + drawer */
(() => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("mobileClose");
  if(!burger || !menu || !closeBtn) return;

  function openMenu(){
    menu.classList.add("open");
    menu.setAttribute("aria-hidden","false");
    burger.setAttribute("aria-expanded","true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu(){
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden","true");
    burger.setAttribute("aria-expanded","false");
    document.body.style.overflow = "";
  }

  burger.addEventListener("click", () => {
    menu.classList.contains("open") ? closeMenu() : openMenu();
  });
  closeBtn.addEventListener("click", closeMenu);

  menu.addEventListener("click", (e) => { if(e.target === menu) closeMenu(); });

  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  window.addEventListener("keydown", (e) => {
    if(e.key === "Escape") closeMenu();
  });
})();

/* Portfolio filter */
(() => {
  const segs = Array.from(document.querySelectorAll(".seg"));
  const shots = Array.from(document.querySelectorAll(".shot"));
  if (!segs.length || !shots.length) return;

  function setCat(cat) {
    segs.forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
    shots.forEach(it => {
      it.style.display = (it.dataset.cat === cat) ? "" : "none";
    });
  }

  segs.forEach(btn => btn.addEventListener("click", () => setCat(btn.dataset.cat)));
  setCat("visuels");
})();

/* Lightbox */
(() => {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbTitle = document.getElementById("lbTitle");
  const lbClose = document.getElementById("lbClose");
  const lbZoom = document.getElementById("lbZoom");
  const lbArea = document.getElementById("lbArea");
  const shots = Array.from(document.querySelectorAll(".shot"));

  if (!lb || !lbImg || !lbTitle || !lbClose || !lbZoom || !lbArea || !shots.length) return;

  function openLB(src, title) {
    lbTitle.textContent = title || "Aperçu";
    lbImg.src = src;
    lbImg.alt = title || "Aperçu";
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lbArea.classList.remove("zoom");
    lbImg.style.transform = "scale(1)";
    lbZoom.textContent = "Zoom";
  }
  function closeLB() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
    lbArea.classList.remove("zoom");
    lbImg.style.transform = "scale(1)";
    lbZoom.textContent = "Zoom";
  }
  function toggleZoom() {
    const on = lbArea.classList.toggle("zoom");
    lbZoom.textContent = on ? "Adapter" : "Zoom";
    lbImg.style.transform = "scale(1)";
    z = 1;
  }

  lbClose.addEventListener("click", closeLB);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLB(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLB(); });

  lbZoom.addEventListener("click", toggleZoom);
  lbArea.addEventListener("click", (e) => {
    if (e.target === lbImg || e.target === lbArea) toggleZoom();
  });

  let z = 1;
  lbArea.addEventListener("wheel", (e) => {
    if (!lbArea.classList.contains("zoom")) return;
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    z = Math.max(1, Math.min(3, z + (delta > 0 ? -0.12 : 0.12)));
    lbImg.style.transform = `scale(${z.toFixed(2)})`;
  }, { passive: false });

  shots.forEach(s => {
    s.addEventListener("click", () => {
      const src = s.getAttribute("data-src");
      const title = s.getAttribute("data-title");
      if (src) openLB(src, title);
    });
  });
})();

/* Reviews (home only if elements exist) */
(function initReviews(){
  const track = document.getElementById("reviewsTrack");
  const dots = document.getElementById("revDots");
  const prev = document.getElementById("revPrev");
  const next = document.getElementById("revNext");
  const wrap = track?.closest(".reviews");
  const prog = document.getElementById("revProg");

  if(!track || !dots || !prev || !next) return;

  const reviews = [
    { name:"Dorian", stars:5, meta:"Avis • récent", text:"Je recommande grandement ses services ! Très professionnelle et réactive." },
    { name:"Sheylie", stars:5, meta:"Avis • récent", text:"Très réactive, c’était un grand plaisir d’obtenir son aide !" },
    { name:"Sandiyya", stars:5, meta:"Avis • récent", text:"Je recommande sans hésiter ses services." },
    { name:"Patrick", stars:5, meta:"Avis • récent", text:"Toujours à l'écoute. Un travail au top, je recommande !" },
    { name:"Sylvie", stars:5, meta:"Avis • récent", text:"Travail impeccable, personne agréable et sérieuse. Merci !" }
  ];

  function starsStr(n){
    const x = Math.max(0, Math.min(5, n));
    return "★".repeat(x) + "☆".repeat(5 - x);
  }

  track.innerHTML = reviews.map(r => `
    <div class="review" role="group" aria-label="Avis client">
      <div class="revTop">
        <div>
          <div class="revName">${r.name}</div>
          <div class="revMeta">${r.meta || ""}</div>
        </div>
        <div class="revStars" aria-label="${r.stars} sur 5">
          <span class="stars">${starsStr(r.stars)}</span>
          <span class="starsPulse" aria-hidden="true"></span>
        </div>
      </div>
      <div class="revText">${r.text}</div>
      <div class="revQuote" aria-hidden="true">“</div>
    </div>
  `).join("");

  const mq = window.matchMedia("(min-width: 980px)");
  let idx = 0;
  let raf = null;
  let startAt = 0;
  const DURATION = 5200;

  function perView(){ return mq.matches ? 2 : 1; }
  function pages(){ return Math.max(1, Math.ceil(reviews.length / perView())); }
  function pageWidth(){ return track.clientWidth || 1; }

  function scrollToIdx(smooth){
    const left = pageWidth() * idx;
    track.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  }

  function buildDots(){
    const p = pages();
    dots.innerHTML = "";
    for(let i=0;i<p;i++){
      const d = document.createElement("div");
      d.className = "revDot" + (i===idx ? " on" : "");
      d.addEventListener("click", () => go(i, true));
      dots.appendChild(d);
    }
    const showNav = p > 1;
    prev.style.display = showNav ? "inline-flex" : "none";
    next.style.display = showNav ? "inline-flex" : "none";
    dots.style.display = showNav ? "flex" : "none";
    if(prog) prog.style.width = "0%";
  }

  function updateDots(){
    Array.from(dots.children).forEach((d,i)=> d.classList.toggle("on", i===idx));
  }

  function clampIdx(){
    const p = pages();
    if(idx < 0) idx = p - 1;
    if(idx > p - 1) idx = 0;
  }

  function stop(){
    if(raf) cancelAnimationFrame(raf);
    raf = null;
    if(prog) prog.style.width = "0%";
  }

  function tick(now){
    if(!raf) return;
    const elapsed = now - startAt;
    const t = Math.min(1, elapsed / DURATION);
    if(prog) prog.style.width = `${Math.round(t*100)}%`;
    if(t >= 1){ nextOne(); return; }
    raf = requestAnimationFrame(tick);
  }

  function start(){
    stop();
    if(pages() <= 1) return;
    startAt = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function go(n, smooth){
    idx = n; clampIdx();
    scrollToIdx(smooth);
    updateDots();
    start();
  }

  function nextOne(){ go(idx + 1, true); }
  function prevOne(){ go(idx - 1, true); }

  prev.addEventListener("click", prevOne);
  next.addEventListener("click", nextOne);

  wrap?.addEventListener("mouseenter", stop);
  wrap?.addEventListener("mouseleave", start);
  wrap?.addEventListener("focusin", stop);
  wrap?.addEventListener("focusout", start);

  track.addEventListener("touchstart", stop, { passive: true });
  track.addEventListener("touchend", start, { passive: true });

  let scrollT = null;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollT);
    scrollT = setTimeout(() => {
      const w = pageWidth();
      const target = Math.round(track.scrollLeft / w);
      const newIdx = Math.max(0, Math.min(pages() - 1, target));
      if (newIdx !== idx) {
        idx = newIdx;
        updateDots();
        start();
      }
    }, 80);
  }, { passive: true });

  function onResize(){
    const p = pages();
    if(idx > p - 1) idx = p - 1;
    buildDots();
    scrollToIdx(false);
    updateDots();
    start();
  }

  mq.addEventListener?.("change", onResize);
  window.addEventListener("resize", () => {
    clearTimeout(window.__revResize);
    window.__revResize = setTimeout(onResize, 120);
  });

  document.addEventListener("visibilitychange", () => {
    if(document.hidden) stop();
    else start();
  });

  buildDots();
  scrollToIdx(false);
  start();
})();
