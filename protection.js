(function () {
  "use strict";

  // ── 1. CHẶN CHUỘT PHẢI ──────────────────────────────
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    showWarning();
  });

  // ── 2. CHẶN COPY / CUT / SELECT ALL ─────────────────
  document.addEventListener("copy",    e => e.preventDefault());
  document.addEventListener("cut",     e => e.preventDefault());
  document.addEventListener("keydown", blockKeys);

  // ── 3. CHẶN KÉO THẢ NỘI DUNG ────────────────────────
  document.addEventListener("dragstart", e => e.preventDefault());

  // ── 4. CHẶN CHỌN VĂN BẢN ────────────────────────────
  document.addEventListener("selectstart", e => e.preventDefault());

  // CSS chặn select
  const noSelectStyle = document.createElement("style");
  noSelectStyle.textContent = `
    * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    input, textarea {
      -webkit-user-select: text !important;
      user-select: text !important;
    }
  `;
  document.head.appendChild(noSelectStyle);

  // ── 5. CHẶN PHÍM TẮT NGUY HIỂM ──────────────────────
  function blockKeys(e) {
    const key = e.key ? e.key.toUpperCase() : "";
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    const blocked = [
      // DevTools
      e.keyCode === 123,                          // F12
      ctrl && shift && key === "I",               // Ctrl+Shift+I
      ctrl && shift && key === "J",               // Ctrl+Shift+J (Console)
      ctrl && shift && key === "C",               // Ctrl+Shift+C (Inspector)
      ctrl && shift && key === "K",               // Firefox DevTools
      ctrl && key === "U",                        // View Source
      // Copy / Select
      ctrl && key === "C",                        // Copy
      ctrl && key === "A",                        // Select All
      ctrl && key === "S",                        // Save Page
      ctrl && key === "P",                        // Print
      // Ctrl+F (Find – tùy chọn)
      // ctrl && key === "F",
    ];

    if (blocked.some(Boolean)) {
      e.preventDefault();
      e.stopPropagation();
      if (e.keyCode === 123 || (ctrl && shift && "IJC K".includes(key))) {
        showWarning();
      }
      return false;
    }
  }

  // ── 6. PHÁT HIỆN DEVTOOLS MỞ (kỹ thuật timing) ───────
  let devtoolsOpen = false;
  const threshold = 160;

  function detectDevTools() {
    const widthDiff  = window.outerWidth  - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    if (widthDiff > threshold || heightDiff > threshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        handleDevTools();
      }
    } else {
      devtoolsOpen = false;
    }
  }

  // Kỹ thuật thứ 2: debugger timing trap
  function debuggerTrap() {
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    const end = performance.now();
    if (end - start > 100) {
      handleDevTools();
    }
  }

  // Kỹ thuật thứ 3: console.log object toString trap
  let devtoolsChecked = false;
  const img = new Image();
  Object.defineProperty(img, "id", {
    get: function () {
      devtoolsChecked = true;
      handleDevTools();
    },
  });

  function checkConsoleTrap() {
    devtoolsChecked = false;
    console.log(img); // nếu DevTools mở, getter sẽ bị gọi
    console.clear();
  }

  // Chạy các kiểm tra theo chu kỳ
  setInterval(detectDevTools,   1000);
  setInterval(debuggerTrap,     3000);
  setInterval(checkConsoleTrap, 2000);

  // ── 7. XỬ LÝ KHI PHÁT HIỆN DEVTOOLS ─────────────────
  function handleDevTools() {
    // Tuỳ chọn A: chuyển hướng
    // window.location.href = "about:blank";

    // Tuỳ chọn B: xoá nội dung
    // document.body.innerHTML = "";

    // Tuỳ chọn C: hiển thị cảnh báo + làm mờ trang (mặc định)
    showDevToolsWarning();
  }

  // ── 8. CHẶN VIEW-SOURCE QUA URL ──────────────────────
  if (
    window.location.protocol === "view-source:" ||
    document.referrer.startsWith("view-source:")
  ) {
    window.location.replace("about:blank");
  }

  // ── 9. CHẶN IFRAME EMBEDDING (Clickjacking) ──────────
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }

  // ── 10. CHẶN IN TRANG (Print) ────────────────────────
  window.onbeforeprint = function () {
    // Ẩn toàn bộ nội dung khi in
    document.body.style.display = "none";
  };
  window.onafterprint = function () {
    document.body.style.display = "";
  };

  // ── UI: TOAST CẢNH BÁO ────────────────────────────────
  function createToast() {
    if (document.getElementById("__protect_toast")) return;
    const toast = document.createElement("div");
    toast.id = "__protect_toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 30px; left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: linear-gradient(135deg, #1a2d45, #2c6bb5);
      color: #fff;
      padding: 14px 28px;
      border-radius: 50px;
      font-family: 'Nunito', sans-serif;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
      z-index: 999999;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      white-space: nowrap;
      pointer-events: none;
    `;
    toast.innerHTML = "🔒 HUY | Source được bảo mật bởi DMCA";
    document.body.appendChild(toast);
    return toast;
  }

  let toastTimer;
  function showWarning() {
    const toast = createToast();
    clearTimeout(toastTimer);
    // Slide in
    requestAnimationFrame(() => {
      toast.style.transform = "translateX(-50%) translateY(0)";
      toast.style.opacity = "1";
    });
    // Slide out sau 2.5s
    toastTimer = setTimeout(() => {
      toast.style.transform = "translateX(-50%) translateY(80px)";
      toast.style.opacity = "0";
    }, 2500);
  }

  // ── UI: DEVTOOLS WARNING OVERLAY ─────────────────────
  function createOverlay() {
    if (document.getElementById("__protect_overlay")) return document.getElementById("__protect_overlay");
    const overlay = document.createElement("div");
    overlay.id = "__protect_overlay";
    overlay.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(10, 20, 40, 0.97);
      z-index: 9999998;
      display: none;
      align-items: center; justify-content: center;
      flex-direction: column;
      font-family: 'Nunito', sans-serif;
      color: #fff;
      text-align: center;
      padding: 40px;
    `;
    overlay.innerHTML = `
      <div style="font-size:64px;margin-bottom:20px;">🔐</div>
      <h2 style="font-size:24px;margin-bottom:12px;font-weight:800;">
        Bạn đang mở Developer Tools
      </h2>
      <p style="font-size:15px;opacity:0.7;max-width:400px;line-height:1.7;">
        Nội dung trang web này được bảo vệ.<br/>
        Vui lòng đóng DevTools để tiếp tục xem.
      </p>
      <div style="margin-top:28px;font-size:12px;opacity:0.4;letter-spacing:1px;">
        © THANH XUÂN CỦA CHÚNG TA
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function showDevToolsWarning() {
    const overlay = createOverlay();
    overlay.style.display = "flex";
    // Kiểm tra liên tục: khi đóng DevTools thì ẩn overlay
    const checkClose = setInterval(() => {
      const widthDiff  = window.outerWidth  - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff <= threshold && heightDiff <= threshold) {
        overlay.style.display = "none";
        devtoolsOpen = false;
        clearInterval(checkClose);
      }
    }, 500);
  }

  // ── GHI ĐÈ CONSOLE ───────────────────────────────────
  const noop = () => {};
  ["log", "warn", "error", "info", "debug", "table", "dir"].forEach(fn => {
    console[fn] = noop;
  });
  // Thông điệp duy nhất hiện trong console
  const _log = console.log.bind(console);
  Object.defineProperty(console, "_secretLog", { value: _log });

  // ── WATERMARK ẨN TRONG SOURCE ────────────────────────
  // (Trick: nếu ai view-source vẫn thấy watermark)
  const watermark = document.createComment(
    " © Thanh Xuân Của Chúng Ta – All rights reserved. Unauthorized copying is prohibited. "
  );
  document.documentElement.insertBefore(watermark, document.documentElement.firstChild);

})(); // IIFE – toàn bộ code trong scope riêng, không leak ra global
