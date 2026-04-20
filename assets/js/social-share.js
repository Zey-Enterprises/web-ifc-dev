(function () {
  var NATIVE_SHARE_NOOP_STORAGE_KEY = "ifc-native-share-noop";

  function getStorage() {
    try {
      return window.localStorage;
    } catch (error) {
      return null;
    }
  }

  function hasRecordedNativeShareNoop() {
    var storage = getStorage();
    if (!storage) {
      return false;
    }

    return storage.getItem(NATIVE_SHARE_NOOP_STORAGE_KEY) === "true";
  }

  function recordNativeShareNoop() {
    var storage = getStorage();
    if (!storage) {
      return;
    }

    storage.setItem(NATIVE_SHARE_NOOP_STORAGE_KEY, "true");
  }

  function isLikelyTouchShareSurface() {
    var hasTouchPoints = typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 0;
    var coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    var noHover = window.matchMedia && window.matchMedia("(hover: none)").matches;
    var narrowViewport = window.matchMedia && window.matchMedia("(max-width: 900px)").matches;

    return hasTouchPoints || coarsePointer || noHover || narrowViewport;
  }

  function isApplePlatform() {
    var userAgentDataPlatform = navigator.userAgentData && navigator.userAgentData.platform;
    if (typeof userAgentDataPlatform === "string") {
      var normalizedPlatform = userAgentDataPlatform.toLowerCase();
      if (normalizedPlatform.indexOf("mac") !== -1 || normalizedPlatform.indexOf("ios") !== -1) {
        return true;
      }
    }

    var platform = (navigator.platform || "").toLowerCase();
    if (/mac|iphone|ipad|ipod/.test(platform)) {
      return true;
    }

    var userAgent = navigator.userAgent || "";
    return /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1);
  }

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

  function getFeedbackHost(element) {
    var shareRoot = element.closest("[data-social-share]");
    if (shareRoot && shareRoot.querySelector("[data-share-feedback]")) {
      return shareRoot;
    }

    return element;
  }

  function showFeedback(element, message) {
    var feedbackHost = getFeedbackHost(element);
    var feedback = feedbackHost.querySelector("[data-share-feedback]");
    if (!feedback || !message) {
      return;
    }

    feedback.textContent = message;
    feedback.hidden = false;
    feedback.setAttribute("aria-hidden", "false");

    window.clearTimeout(feedbackHost._ifcShareFeedbackTimer);
    feedbackHost._ifcShareFeedbackTimer = window.setTimeout(function () {
      feedback.hidden = true;
      feedback.textContent = "";
      feedback.setAttribute("aria-hidden", "true");
    }, 2400);
  }

  function getShareData(element) {
    var data = {
      title: element.getAttribute("data-share-title") || document.title,
      url: element.getAttribute("data-share-url") || window.location.href,
    };
    var text = element.getAttribute("data-share-text");
    if (text) {
      data.text = text;
    }

    return data;
  }

  function canUseNativeShare(element) {
    if (hasRecordedNativeShareNoop() || !window.isSecureContext || typeof navigator.share !== "function") {
      return false;
    }

    if (!isLikelyTouchShareSurface()) {
      return false;
    }

    var shareData = getShareData(element);
    if (typeof navigator.canShare === "function" && shareData.files && shareData.files.length) {
      try {
        return navigator.canShare(shareData);
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  function attemptNativeShare(shareData) {
    try {
      return Promise.resolve(navigator.share(shareData));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function performNativeShare(shareData) {
    return new Promise(function (resolve, reject) {
      var interactionObserved = false;
      var startedAt = Date.now();

      function markInteraction() {
        interactionObserved = true;
      }

      function cleanup() {
        window.removeEventListener("blur", markInteraction, true);
        document.removeEventListener("visibilitychange", markInteraction, true);
        window.removeEventListener("pagehide", markInteraction, true);
      }

      window.addEventListener("blur", markInteraction, true);
      document.addEventListener("visibilitychange", markInteraction, true);
      window.addEventListener("pagehide", markInteraction, true);

      attemptNativeShare(shareData)
        .then(function () {
          var elapsed = Date.now() - startedAt;
          cleanup();

          if (!interactionObserved && elapsed < 120) {
            recordNativeShareNoop();
            resolve({ status: "noop" });
            return;
          }

          resolve({ status: "shared" });
        })
        .catch(function (error) {
          cleanup();
          reject(error);
        });
    });
  }

  function shouldUseNativeShare(link) {
    return (
      link.getAttribute("data-share-native") === "true" &&
      typeof navigator.share === "function" &&
      window.matchMedia("(max-width: 768px)").matches
    );
  }

  function setIconClass(icon, className) {
    icon.className = className;
    if (icon.className.indexOf("ifc-share-button__icon") === -1) {
      icon.className += " ifc-share-button__icon";
    }
  }

  function configureShareButton(button) {
    var supportsNativeShare = canUseNativeShare(button);
    var hideWhenNoNative = button.getAttribute("data-share-hide-when-no-native") === "true";
    var fallbackLabel = button.getAttribute("data-share-fallback-label") || "Copy link";
    var defaultLabel = button.getAttribute("data-share-default-label") || "";
    var label = button.querySelector("[data-share-button-label]");
    var icon = button.querySelector("[data-share-button-icon]");

    if (!defaultLabel && label) {
      defaultLabel = label.textContent;
      button.setAttribute("data-share-default-label", defaultLabel);
    }

    if (!supportsNativeShare && hideWhenNoNative) {
      button.hidden = true;
      button.setAttribute("aria-hidden", "true");
      return;
    }

    button.hidden = false;
    button.removeAttribute("aria-hidden");

    if (!icon) {
      return;
    }

    if (supportsNativeShare) {
      setIconClass(
        icon,
        isApplePlatform()
          ? (button.getAttribute("data-share-apple-icon") || "fas fa-arrow-up-from-bracket")
          : (button.getAttribute("data-share-default-icon") || "fas fa-share-nodes")
      );
      button.setAttribute("data-share-mode", "native");
      if (label && !label.classList.contains("ifc-share-button__label--sr-only")) {
        label.textContent = defaultLabel || "Share";
      }
    } else {
      setIconClass(icon, button.getAttribute("data-share-link-icon") || "fas fa-link");
      button.setAttribute("data-share-mode", "copy");
      if (label && !label.classList.contains("ifc-share-button__label--sr-only")) {
        label.textContent = fallbackLabel;
      }
    }
  }

  onReady(function () {
    var shareRoots = Array.prototype.slice.call(
      document.querySelectorAll("[data-social-share]")
    );
    var shareButtons = Array.prototype.slice.call(
      document.querySelectorAll("[data-share-button]")
    );

    shareButtons.forEach(configureShareButton);

    shareButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        var shareMode = button.getAttribute("data-share-mode");
        var shareData = getShareData(button);

        if (shareMode === "native") {
          event.preventDefault();
          performNativeShare(shareData)
            .then(function (result) {
              if (result && result.status === "noop") {
                configureShareButton(button);

                if (button.getAttribute("data-share-mode") === "copy") {
                  return copyText(shareData.url).then(function (didCopy) {
                    if (didCopy) {
                      showFeedback(button, "Copied to clipboard");
                    }
                  });
                }
              }
            })
            .catch(function (error) {
              if (!error || error.name === "AbortError") {
                return;
              }

              copyText(shareData.url).then(function (didCopy) {
                if (didCopy) {
                  showFeedback(button, "Copied to clipboard");
                }
              });
            });
          return;
        }

        if (shareMode === "copy") {
          event.preventDefault();
          copyText(shareData.url).then(function (didCopy) {
            if (didCopy) {
              showFeedback(button, "Copied to clipboard");
            }
          });
        }
      });
    });

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
            performNativeShare({
              title: link.getAttribute("data-share-native-title") || document.title,
              text: link.getAttribute("data-share-native-text") || "",
              url: link.getAttribute("data-share-native-url") || window.location.href,
            })
              .then(function (result) {
                if (result && result.status === "noop") {
                  var fallbackUrl = link.getAttribute("data-share-native-url") || window.location.href;
                  return copyText(fallbackUrl).then(function (didCopy) {
                    if (didCopy) {
                      showFeedback(link, "Copied to clipboard");
                    }
                  });
                }
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
                  link,
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
