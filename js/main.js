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

  function closeBooksyWidget() {
    document.querySelectorAll(".booksy-widget-dialog, .booksy-widget-overlay").forEach(function (el) {
      el.remove();
    });
  }

  /* Lock page scrolling while the dialog is open; release it once Booksy
     (or the overlay click / Escape below) removes the dialog. */
  function lockScrollWhileWidgetOpen() {
    setTimeout(function () {
      if (!document.querySelector(".booksy-widget-dialog")) return;
      document.body.style.overflow = "hidden";
      var observer = new MutationObserver(function () {
        if (!document.querySelector(".booksy-widget-dialog")) {
          document.body.style.overflow = "";
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true });
    }, 0);
  }

  bookingLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var widgetButton = document.querySelector(".booksy-widget-button");
      if (!widgetButton) return;
      e.preventDefault();
      var scrollY = window.scrollY;
      widgetButton.click();
      /* The widget scrolls the page to the dialog; keep the visitor where they were. */
      requestAnimationFrame(function () {
        window.scrollTo(0, scrollY);
      });
      lockScrollWhileWidgetOpen();
    });
  });

  document.addEventListener("click", function (e) {
    if (e.target.classList && e.target.classList.contains("booksy-widget-overlay")) {
      closeBooksyWidget();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.querySelector(".booksy-widget-dialog")) {
      closeBooksyWidget();
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

  /* Footer year. */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
