(function () {
  const root = document.querySelector("[data-carousel-interval]");

  if (!root) {
    return;
  }

  const slides = Array.from(root.querySelectorAll("[data-carousel-slide]"));
  const interval = Number(root.dataset.carouselInterval) || 3000;
  const transitionDuration = 750;

  if (slides.length < 2) {
    return;
  }

  let currentIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

  if (currentIndex < 0) {
    currentIndex = 0;
    slides[0].classList.add("is-active");
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timerId;

  function setActiveSlide(nextIndex) {
    slides.forEach((slide, index) => {
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
  }

  function advanceSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    setActiveSlide(nextIndex);
    scheduleAdvance();
  }

  function clearAdvance() {
    window.clearTimeout(timerId);
  }

  function scheduleAdvance() {
    clearAdvance();

    if (reduceMotion.matches || document.hidden) {
      return;
    }

    timerId = window.setTimeout(advanceSlide, interval + transitionDuration);
  }

  function startCarousel() {
    if (reduceMotion.matches) {
      clearAdvance();
      return;
    }

    scheduleAdvance();
  }

  reduceMotion.addEventListener("change", function () {
    if (reduceMotion.matches) {
      clearAdvance();
      return;
    }

    startCarousel();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      clearAdvance();
      return;
    }

    startCarousel();
  });

  startCarousel();
})();
