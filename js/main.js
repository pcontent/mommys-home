/* Mommys Home, landing page interactions. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Preloader: hide after the intro animation, or instantly with reduced motion. */
  var preloader = document.getElementById("preloader");
  function finishLoading() {
    document.body.classList.add("loaded");
    if (preloader) {
      preloader.classList.add("done");
      setTimeout(function () {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 700);
    }
  }
  if (reducedMotion) {
    finishLoading();
  } else {
    window.addEventListener("load", function () {
      setTimeout(finishLoading, 900);
    });
    /* Safety net in case the load event stalls (slow fonts, etc.). */
    setTimeout(finishLoading, 3500);
  }

  /* Nav: background on scroll. */
  var nav = document.getElementById("nav");
  function onScrollNav() {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* Mobile menu. */
  var burger = document.getElementById("navBurger");
  var navLinks = document.getElementById("navLinks");
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
      document.body.style.overflow = open ? "hidden" : "";
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("menu-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* Booksy booking: the official widget (loaded in index.html) injects a hidden
     .booksy-widget-button that opens Booksy's booking overlay for this salon.
     Booking CTAs trigger that button; if the widget script did not load, the
     links simply open the salon's Booksy page as usual. */
  var bookingLinks = document.querySelectorAll('a[data-booksy="book"]');
  var isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || "");
  var bookSheet = document.getElementById("bookSheet");
  var widgetCloseButton = null;

  function removeWidgetCloseButton() {
    if (widgetCloseButton && widgetCloseButton.parentNode) {
      widgetCloseButton.parentNode.removeChild(widgetCloseButton);
    }
    widgetCloseButton = null;
  }

  var finishWidgetLoader = null;

  /* Brand loader shown inside Booksy's dialog until the widget iframe reports
     "ready" through postMessage (with a time limit as a safety net). */
  function showWidgetLoader(dialog) {
    var loader = document.createElement("div");
    loader.className = "booksy-loader";
    loader.setAttribute("aria-live", "polite");
    loader.innerHTML =
      '<svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path class="draw draw-1" d="M12 50 L60 13 L108 50" fill="none" stroke="#2F2C61" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path class="draw draw-2" d="M25 51 V88 Q25 95 32 95 H88 Q95 95 95 88 V51" fill="none" stroke="#2F2C61" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path class="draw draw-3" d="M60 81 C44 70 41.5 57 51.5 53 C56.5 51 60 55 60 60 C60 55 63.5 51 68.5 53 C78.5 57 76 70 60 81 Z" fill="none" stroke="#E89CC4" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg><p>Ładujemy rezerwację</p>";
    dialog.appendChild(loader);

    var finished = false;
    var timer = setTimeout(finish, 15000);
    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      window.removeEventListener("message", onMessage);
      loader.classList.add("done");
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 450);
      finishWidgetLoader = null;
    }
    function onMessage(e) {
      if (String(e.origin).indexOf("booksy.com") === -1) return;
      var data = e.data;
      if (data && data.events && data.events.ready) finish();
    }
    window.addEventListener("message", onMessage);
    finishWidgetLoader = finish;
  }

  function closeBooksyWidget() {
    if (finishWidgetLoader) finishWidgetLoader();
    document.querySelectorAll(".booksy-widget-dialog, .booksy-widget-overlay").forEach(function (el) {
      el.remove();
    });
    removeWidgetCloseButton();
    document.body.style.overflow = "";
    document.body.classList.remove("booking-open");
  }

  /* Lock page scrolling while the dialog is open; release it once Booksy
     (or the overlay click / Escape / floating X) removes the dialog. */
  function lockScrollWhileWidgetOpen() {
    setTimeout(function () {
      if (!document.querySelector(".booksy-widget-dialog")) return;
      document.body.style.overflow = "hidden";
      var observer = new MutationObserver(function () {
        if (!document.querySelector(".booksy-widget-dialog")) {
          document.body.style.overflow = "";
          document.body.classList.remove("booking-open");
          removeWidgetCloseButton();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true });
    }, 0);
  }

  /* On phones the widget fills the screen, so a floating X is the way back. */
  function addWidgetCloseButton() {
    if (widgetCloseButton) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "booksy-close";
    btn.setAttribute("aria-label", "Zamknij rezerwację");
    btn.addEventListener("click", closeBooksyWidget);
    document.body.appendChild(btn);
    widgetCloseButton = btn;
  }

  function openBooksyWidget() {
    var widgetButton = document.querySelector(".booksy-widget-button");
    if (!widgetButton) return;
    var scrollY = window.scrollY;
    widgetButton.click();
    /* The widget scrolls the page to the dialog; keep the visitor where they were. */
    requestAnimationFrame(function () {
      window.scrollTo(0, scrollY);
    });
    var dialog = document.querySelector(".booksy-widget-dialog");
    if (dialog) showWidgetLoader(dialog);
    if (isMobileDevice) addWidgetCloseButton();
    document.body.classList.add("booking-open");
    lockScrollWhileWidgetOpen();
  }

  /* Mobile choice sheet: Booksy app (real link, so the OS can hand it to the app)
     or the on-page widget. */
  function openBookSheet() {
    document.body.classList.add("booking-open");
    bookSheet.hidden = false;
    requestAnimationFrame(function () {
      bookSheet.classList.add("open");
    });
    setTimeout(function () {
      document.body.style.overflow = "hidden";
    }, 0);
  }

  function closeBookSheet(immediately) {
    bookSheet.classList.remove("open");
    document.body.style.overflow = "";
    document.body.classList.remove("booking-open");
    if (immediately) {
      bookSheet.hidden = true;
    } else {
      setTimeout(function () { bookSheet.hidden = true; }, 350);
    }
  }

  bookingLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      /* Widget script missing: let the link open the Booksy page normally. */
      if (!document.querySelector(".booksy-widget-button")) return;
      e.preventDefault();
      if (isMobileDevice && bookSheet) {
        openBookSheet();
      } else {
        openBooksyWidget();
      }
    });
  });

  if (bookSheet) {
    bookSheet.querySelectorAll("[data-sheet-close]").forEach(function (el) {
      el.addEventListener("click", function () { closeBookSheet(false); });
    });
    var sheetWidgetButton = document.getElementById("bookSheetWidget");
    if (sheetWidgetButton) {
      sheetWidgetButton.addEventListener("click", function () {
        closeBookSheet(true);
        openBooksyWidget();
      });
    }
    var sheetAppLink = bookSheet.querySelector(".book-sheet-app");
    if (sheetAppLink) {
      /* Default navigation stays: the tap must reach the OS for the app hand-off.
         The sheet is tidied away for when the visitor comes back to this tab. */
      sheetAppLink.addEventListener("click", function () {
        setTimeout(function () { closeBookSheet(false); }, 800);
      });
    }
  }

  /* Return path of the "open in app" link: when the Booksy app is not installed,
     the deep link sends the visitor back here with ?rezerwacja=1, and the widget
     opens by itself so no one ends up in an app store. */
  if (/[?&]rezerwacja=1(&|$)/.test(window.location.search)) {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    }
    setTimeout(openBooksyWidget, 500);
  }

  document.addEventListener("click", function (e) {
    if (e.target.classList && e.target.classList.contains("booksy-widget-overlay")) {
      closeBooksyWidget();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (document.querySelector(".booksy-widget-dialog")) {
      closeBooksyWidget();
    } else if (bookSheet && !bookSheet.hidden) {
      closeBookSheet(false);
    }
  });

  /* Scroll reveal. */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* Review counter. */
  var counter = document.getElementById("counter");
  if (counter) {
    var target = parseInt(counter.getAttribute("data-target"), 10) || 0;
    var animateCounter = function () {
      if (reducedMotion) {
        counter.textContent = String(target);
        return;
      }
      var duration = 1800;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 4);
        counter.textContent = String(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter();
            counterObserver.disconnect();
          }
        });
      }, { threshold: 0.4 });
      counterObserver.observe(counter);
    } else {
      counter.textContent = String(target);
    }
  }

  /* Stars light up when visible. */
  var stars = document.querySelector(".reviews-stars");
  if (stars && "IntersectionObserver" in window) {
    var starsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          stars.classList.add("lit");
          starsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    starsObserver.observe(stars);
  } else if (stars) {
    stars.classList.add("lit");
  }

  /* Ghost text parallax. */
  var ghost = document.querySelector("[data-parallax]");
  if (ghost && !reducedMotion) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var rect = ghost.parentElement.getBoundingClientRect();
          var offset = rect.top * 0.15;
          ghost.style.transform = "translateY(calc(-50% + " + offset.toFixed(1) + "px))";
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  } else if (ghost) {
    ghost.style.transform = "translateY(-50%)";
  }

  /* Floating booking button: shown once the hero booking button has scrolled
     above the viewport. It shares the data-booksy="book" behaviour above and is
     hidden through body.booking-open while the sheet or widget is open. */
  var fab = document.getElementById("fabBook");
  var heroBookButton = document.querySelector(".hero-cta .btn-primary");
  if (fab && heroBookButton && "IntersectionObserver" in window) {
    var fabObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      var scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      fab.classList.toggle("visible", scrolledPast);
    }, { threshold: 0 });
    fabObserver.observe(heroBookButton);
  } else if (fab) {
    fab.classList.add("visible");
  }

  /* Footer year. */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
