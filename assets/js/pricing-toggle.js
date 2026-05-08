(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function setView(root, view) {
    var buttons = root.querySelectorAll("[data-pricing-view-trigger]");
    var panels = root.querySelectorAll("[data-pricing-view-panel]");

    buttons.forEach(function (button) {
      var isActive = button.getAttribute("data-pricing-view-trigger") === view;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    panels.forEach(function (panel) {
      var isActive = panel.getAttribute("data-pricing-view-panel") === view;
      panel.hidden = !isActive;
    });
  }

  ready(function () {
    document.querySelectorAll("[data-pricing-compare]").forEach(function (root) {
      root.addEventListener("click", function (event) {
        var trigger = event.target.closest("[data-pricing-view-trigger]");
        if (!trigger || !root.contains(trigger)) {
          return;
        }

        setView(root, trigger.getAttribute("data-pricing-view-trigger"));
      });
    });
  });
})();
