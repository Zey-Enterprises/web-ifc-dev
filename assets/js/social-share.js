(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function copyText(text) {
    if (!text) {
      return Promise.resolve(false);
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      });
    }

    return new Promise(function (resolve) {
      var helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "absolute";
      helper.style.left = "-9999px";
      document.body.appendChild(helper);
      helper.select();

      try {
        resolve(document.execCommand("copy"));
      } catch (error) {
        resolve(false);
      } finally {
        document.body.removeChild(helper);
      }
    });
  }

  function openPopup(link, width, height) {
    var left = Math.max(0, Math.round((window.screen.width - width) / 2));
    var top = Math.max(0, Math.round((window.screen.height - height) / 2));

    return window.open(
      link.href,
      "ifc-share-popup",
      "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=" +
        width +
        ",height=" +
        height +
        ",left=" +
        left +
        ",top=" +
        top
    );
  }

  function showFeedback(root, message) {
    var feedback = root.querySelector("[data-share-feedback]");
    if (!feedback || !message) {
      return;
    }

    feedback.textContent = message;
    feedback.hidden = false;
    feedback.setAttribute("aria-hidden", "false");

    window.clearTimeout(root._ifcShareFeedbackTimer);
    root._ifcShareFeedbackTimer = window.setTimeout(function () {
      feedback.hidden = true;
      feedback.textContent = "";
      feedback.setAttribute("aria-hidden", "true");
    }, 2400);
  }

  function shouldUseNativeShare(link) {
    return (
      link.getAttribute("data-share-native") === "true" &&
      typeof navigator.share === "function" &&
      window.matchMedia("(max-width: 768px)").matches
    );
  }

  onReady(function () {
    var shareRoots = Array.prototype.slice.call(
      document.querySelectorAll("[data-social-share]")
    );

    shareRoots.forEach(function (root) {
      var popupWidth =
        Number.parseInt(root.getAttribute("data-share-popup-width"), 10) || 620;
      var popupHeight =
        Number.parseInt(root.getAttribute("data-share-popup-height"), 10) || 540;
      var links = Array.prototype.slice.call(
        root.querySelectorAll("[data-share-link]")
      );

      links.forEach(function (link) {
        link.addEventListener("click", function (event) {
          if (shouldUseNativeShare(link)) {
            event.preventDefault();

            navigator
              .share({
                title: link.getAttribute("data-share-native-title") || document.title,
                text: link.getAttribute("data-share-native-text") || "",
                url: link.getAttribute("data-share-native-url") || window.location.href,
              })
              .catch(function () {});
            return;
          }

          var copyTextValue = link.getAttribute("data-share-copy-text");
          if (link.getAttribute("data-share-copy") === "true" && copyTextValue) {
            event.preventDefault();
            copyText(copyTextValue).then(function (didCopy) {
              if (didCopy) {
                showFeedback(
                  root,
                  link.getAttribute("data-share-copy-toast") === "true"
                    ? "Copied to clipboard"
                    : (link.getAttribute("data-share-copy-feedback") || "Suggested caption copied.")
                );
              }
            });
          }

          if (link.getAttribute("data-share-copy-only") === "true") {
            event.preventDefault();
            return;
          }

          if (link.getAttribute("data-share-popup") === "true") {
            var popup = openPopup(link, popupWidth, popupHeight);
            if (popup) {
              event.preventDefault();
              popup.focus();
            }
          }
        });
      });
    });
  });
})();
