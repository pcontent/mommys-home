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

  /* Booksy links: hand off to the Booksy app when it is installed.
     iOS relies on Universal Links (Booksy registers the /rwg/ paths), which only
     fire on a same-tab navigation, so the new-tab target is dropped on phones.
     Chromium browsers on Android get an intent:// URL that opens the app and
     falls back to the normal web page when the app is missing. */
  var ua = navigator.userAgent || "";
  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var booksyLinks = document.querySelectorAll('a[href*="booksy.com"]');
  if (isAndroid || isIOS) {
    booksyLinks.forEach(function (link) {
      link.removeAttribute("target");
    });
  }
  if (isAndroid && !/Firefox/i.test(ua)) {
    booksyLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var url = link.href;
        e.preventDefault();
        window.location.href =
          "intent://" + url.replace(/^https?:\/\//, "") +
          "#Intent;scheme=https;package=net.booksy.customer;S.browser_fallback_url=" +
          encodeURIComponent(url) + ";end";
      });
    });
  }

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
