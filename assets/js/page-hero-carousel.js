(function () {
  const overlays = Array.from(document.querySelectorAll("[data-overlay]"));

  if (!overlays.length) {
    return;
  }

  const imageDimensions = new Map();
  const transitionDuration = 750;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function parseAxis(token, fallback, axis) {
    const value = String(token || "").trim().toLowerCase();

    if (value === "left" || value === "top") {
      return 0;
    }

    if (value === "center") {
      return 0.5;
    }

    if (value === "right" || value === "bottom") {
      return 1;
    }

    if (value.endsWith("%")) {
      const percent = Number.parseFloat(value);

      if (Number.isFinite(percent)) {
        return percent / 100;
      }
    }

    const numeric = Number.parseFloat(value);

    if (Number.isFinite(numeric)) {
      return numeric > 1 ? numeric / 100 : numeric;
    }

    return axis === "y" && fallback.length === 1 ? 0.5 : 0.5;
  }

  function parsePoint(value) {
    const parts = String(value || "50% 50%").trim().split(/\s+/);
    const xToken = parts[0] || "50%";
    const yToken = parts[1] || "50%";

    return {
      x: clamp(parseAxis(xToken, parts, "x"), 0, 1),
      y: clamp(parseAxis(yToken, parts, "y"), 0, 1),
    };
  }

  function getImageDimensions(url) {
    if (imageDimensions.has(url)) {
      return imageDimensions.get(url);
    }

    const promise = new Promise(function (resolve, reject) {
      const image = new Image();

      image.addEventListener("load", function () {
        resolve({
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      });

      image.addEventListener("error", reject);
      image.src = url;
    });

    imageDimensions.set(url, promise);
    return promise;
  }

  function positionSlide(overlay, slide, dimensions) {
    const containerWidth = overlay.clientWidth;
    const containerHeight = overlay.clientHeight;

    if (!containerWidth || !containerHeight || !dimensions.width || !dimensions.height) {
      return;
    }

    const focal = parsePoint(slide.dataset.focalPoint);
    const anchor = parsePoint(slide.dataset.anchorPoint);
    const scale = Math.max(containerWidth / dimensions.width, containerHeight / dimensions.height);
    const renderedWidth = dimensions.width * scale;
    const renderedHeight = dimensions.height * scale;

    const minLeft = containerWidth - renderedWidth;
    const minTop = containerHeight - renderedHeight;
    const left = clamp(anchor.x * containerWidth - focal.x * renderedWidth, minLeft, 0);
    const top = clamp(anchor.y * containerHeight - focal.y * renderedHeight, minTop, 0);

    slide.style.backgroundPosition = `${left}px ${top}px`;
  }

  function positionOverlaySlides(overlay) {
    const slides = Array.from(overlay.querySelectorAll("[data-overlay-slide]"));

    slides.forEach(function (slide) {
      const imageUrl = slide.dataset.overlayImage;

      if (!imageUrl) {
        return;
      }

      getImageDimensions(imageUrl)
        .then(function (dimensions) {
          positionSlide(overlay, slide, dimensions);
        })
        .catch(function () {
          slide.style.backgroundPosition = "center";
        });
    });
  }

  function initCarousel(overlay) {
    if (!overlay.hasAttribute("data-overlay-carousel")) {
      return;
    }

    const slides = Array.from(overlay.querySelectorAll("[data-overlay-slide]"));

    if (slides.length < 2) {
      return;
    }

    const interval = Number(overlay.dataset.overlayInterval) || 3000;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timerId;
    let currentIndex = slides.findIndex(function (slide) {
      return slide.classList.contains("is-active");
    });

    if (currentIndex < 0) {
      currentIndex = 0;
      slides[0].classList.add("is-active");
    }

    function setActiveSlide(nextIndex) {
      slides.forEach(function (slide, index) {
        slide.classList.remove("is-active", "is-prev");

        if (index === nextIndex) {
          slide.classList.add("is-active");
          slide.removeAttribute("aria-hidden");
        } else if (index === currentIndex) {
          slide.classList.add("is-prev");
          slide.setAttribute("aria-hidden", "true");
        } else {
          slide.setAttribute("aria-hidden", "true");
        }
      });

      currentIndex = nextIndex;
      positionOverlaySlides(overlay);
    }

    function clearAdvance() {
      window.clearTimeout(timerId);
    }

    function scheduleAdvance() {
      clearAdvance();

      if (reduceMotion.matches || document.hidden) {
        return;
      }

      timerId = window.setTimeout(function () {
        setActiveSlide((currentIndex + 1) % slides.length);
        scheduleAdvance();
      }, interval + transitionDuration);
    }

    reduceMotion.addEventListener("change", scheduleAdvance);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        clearAdvance();
        return;
      }

      scheduleAdvance();
    });

    scheduleAdvance();
  }

  overlays.forEach(function (overlay) {
    const resizeObserver = new ResizeObserver(function () {
      positionOverlaySlides(overlay);
    });

    resizeObserver.observe(overlay);
    positionOverlaySlides(overlay);
    initCarousel(overlay);
  });
})();
