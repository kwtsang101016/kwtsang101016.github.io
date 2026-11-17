(function () {
  "use strict";

  var TEXT_SCALE_KEY = "vibe-workshop-text-scale";
  var TEXT_SCALES = [
    { zoom: 1, label: "Aa", title: "Text size: default" },
    { zoom: 1.25, label: "Aa+", title: "Text size: large (lecture hall)" },
    { zoom: 1.5, label: "Aa++", title: "Text size: extra large" },
  ];

  function readScaleIndex() {
    try {
      var value = Number(localStorage.getItem(TEXT_SCALE_KEY));
      if (Number.isInteger(value) && value >= 0 && value < TEXT_SCALES.length) return value;
    } catch (e) { /* ignore */ }
    return 0;
  }

  var scenes = Array.prototype.slice.call(document.querySelectorAll(".scene"));
  if (!scenes.length) return;

  var index = 0;
  var scaleIndex = readScaleIndex();
  var progressEl = document.getElementById("progressLabel");
  var trackFill = document.getElementById("trackFill");
  var jump = document.getElementById("jumpSelect");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var scaleBtn = document.getElementById("scaleBtn");
  var stage = document.getElementById("stage");

  function applyZoom() {
    var scale = TEXT_SCALES[scaleIndex];
    if (stage) stage.style.setProperty("--stage-zoom", String(scale.zoom));
    if (scaleBtn) {
      scaleBtn.textContent = scale.label;
      scaleBtn.title = scale.title;
      scaleBtn.classList.toggle("toolBtnActive", scaleIndex > 0);
    }
  }

  function go(to) {
    index = Math.max(0, Math.min(scenes.length - 1, to));
    scenes.forEach(function (scene, i) {
      scene.classList.toggle("is-active", i === index);
    });
    if (progressEl) {
      progressEl.textContent =
        String(index + 1).padStart(2, "0") + " / " + String(scenes.length).padStart(2, "0");
    }
    if (trackFill) {
      trackFill.style.width = ((index + 1) / scenes.length) * 100 + "%";
    }
    if (jump) jump.value = String(index);
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === scenes.length - 1;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (jump) {
    scenes.forEach(function (scene, i) {
      var opt = document.createElement("option");
      opt.value = String(i);
      var title = scene.getAttribute("data-title") || ("Slide " + (i + 1));
      opt.textContent = String(i + 1).padStart(2, "0") + " · " + title;
      jump.appendChild(opt);
    });
    jump.addEventListener("change", function () {
      go(Number(jump.value));
    });
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { go(index - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { go(index + 1); });
  if (scaleBtn) {
    scaleBtn.addEventListener("click", function () {
      scaleIndex = (scaleIndex + 1) % TEXT_SCALES.length;
      try { localStorage.setItem(TEXT_SCALE_KEY, String(scaleIndex)); } catch (e) { /* ignore */ }
      applyZoom();
    });
  }

  window.addEventListener("keydown", function (event) {
    var target = event.target;
    if (target && ["INPUT", "TEXTAREA", "SELECT"].indexOf(target.tagName) >= 0) return;
    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      go(index + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      go(index - 1);
    }
    if (event.key === "Home") go(0);
    if (event.key === "End") go(scenes.length - 1);
  });

  applyZoom();
  go(0);
})();
