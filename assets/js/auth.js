/**
 * Shopnest Auth System
 * Frontend-only auth using localStorage
 * Controls guest vs logged-in user access
 */

(function () {
  'use strict';

  // ─── Helpers ───────────────────────────────────────────────────────────
  function isLoggedIn() {
    return !!localStorage.getItem('shopnest_user');
  }

  function getUser() {
    return localStorage.getItem('shopnest_user') || 'Guest';
  }

  function logout() {
    localStorage.removeItem('shopnest_user');
    window.location.href = 'sign-in.html';
  }

  // ─── Toast Notification ────────────────────────────────────────────────
  function showToast(message, type) {
    type = type || 'info';
    var colors = {
      success: { bg: '#0F172A', border: '#10B981' },
      warn:    { bg: '#0F172A', border: '#F59E0B' },
      info:    { bg: '#0F172A', border: '#0284C7' }
    };
    var c = colors[type] || colors.info;

    var toast = document.createElement('div');
    toast.style.cssText = [
      'position:fixed', 'top:25px', 'right:25px', 'z-index:999999',
      'background:' + c.bg, 'color:#FFFFFF', 'padding:14px 22px',
      'border-radius:14px', 'box-shadow:0 15px 35px rgba(0,0,0,0.3)',
      'font-family:sans-serif', 'font-size:14px', 'font-weight:600',
      'display:flex', 'align-items:center', 'gap:10px',
      'border-left:5px solid ' + c.border,
      'opacity:1', 'transition:all 0.4s ease',
      'max-width:340px', 'word-break:break-word'
    ].join(';');
    toast.innerHTML = '<span>' + message + '</span>';
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 3200);
  }

  // ─── Login-Required Gate ───────────────────────────────────────────────
  function requireLogin(action) {
    if (isLoggedIn()) {
      if (typeof action === 'function') action();
    } else {
      showToast('🔒 Please log in or create an account to continue!', 'warn');
      setTimeout(function () {
        window.location.href = 'sign-in.html';
      }, 1500);
    }
  }

  // ─── Update Navbar: Login/Logout + Greeting ────────────────────────────
  function updateNavbar() {
    // Top bar login link(s) — update all elements with class or id
    var loginLinks = document.querySelectorAll('.nav-login-link, a[href="sign-in.html"]');

    if (isLoggedIn()) {
      var user = getUser();

      // Replace "Login" links with greeting + logout
      loginLinks.forEach(function (el) {
        // Only replace if it looks like a plain login link
        if (el.textContent.trim().toLowerCase() === 'login' ||
            el.textContent.trim().toLowerCase() === 'log in') {
          el.textContent = 'Hi, ' + user;
          el.href = '#';
          el.style.fontWeight = '700';
          el.style.color = '#E2C48C';
        }
      });

      // Inject logout button into top bar if not already there
      if (!document.getElementById('shopnest-logout-btn')) {
        var topAccountUl = document.querySelector('.top-bar .cnt-account ul');
        if (topAccountUl) {
          var li = document.createElement('li');
          li.innerHTML = '<a href="#" id="shopnest-logout-btn" style="color:rgba(255,255,255,0.85); font-weight:600;">Logout</a>';
          topAccountUl.appendChild(li);
          document.getElementById('shopnest-logout-btn').addEventListener('click', function (e) {
            e.preventDefault();
            logout();
          });
        }
      }

      // Inject greeting in top bar if there's a "My Account" link
      var myAccountLinks = document.querySelectorAll('a[href*="my-account"], .nav-myaccount');
      myAccountLinks.forEach(function (el) {
        el.textContent = '👤 ' + user;
      });

    } else {
      // User is not logged in — show Logout if it somehow exists, remove it
      var logoutBtn = document.getElementById('shopnest-logout-btn');
      if (logoutBtn && logoutBtn.parentNode) {
        logoutBtn.parentNode.removeChild(logoutBtn);
      }
    }
  }

  // ─── Guard Add-to-Cart Buttons ─────────────────────────────────────────
  function guardCartButtons() {
    if (isLoggedIn()) return; // already logged in, no need to guard

    // Intercept all add-to-cart form submits and button clicks
    document.addEventListener('click', function (e) {
      var target = e.target;

      // Walk up to button/anchor
      while (target && target !== document.body) {
        var isCartBtn = (
          (target.tagName === 'BUTTON' || target.tagName === 'A') &&
          (
            (target.className && (
              target.className.indexOf('add-cart') !== -1 ||
              target.className.indexOf('btn-cart') !== -1 ||
              target.className.indexOf('lnk-cart') !== -1
            )) ||
            (target.getAttribute('data-action') === 'add-to-cart') ||
            (target.href && target.href.indexOf('shopping-cart') !== -1 && target.closest('.cart'))
          )
        );

        if (isCartBtn) {
          e.preventDefault();
          e.stopPropagation();
          showToast('🔒 Please log in to add items to your cart!', 'warn');
          setTimeout(function () {
            window.location.href = 'sign-in.html';
          }, 1500);
          return;
        }
        target = target.parentElement;
      }
    }, true);
  }

  // ─── Guard Wishlist Buttons ────────────────────────────────────────────
  function guardWishlistButtons() {
    if (isLoggedIn()) return;

    document.addEventListener('click', function (e) {
      var target = e.target;
      while (target && target !== document.body) {
        var isWishlistBtn = (
          (target.tagName === 'BUTTON' || target.tagName === 'A') &&
          (
            (target.className && target.className.indexOf('wish') !== -1) ||
            (target.href && target.href.indexOf('my-wishlist') !== -1) ||
            (target.title && target.title.toLowerCase().indexOf('wish') !== -1)
          )
        );

        if (isWishlistBtn) {
          e.preventDefault();
          e.stopPropagation();
          showToast('🔒 Please log in to save items to your wishlist!', 'warn');
          setTimeout(function () {
            window.location.href = 'sign-in.html';
          }, 1500);
          return;
        }
        target = target.parentElement;
      }
    }, true);
  }

  // ─── Guard Full Pages (Checkout, Wishlist, My Account, Track Orders) ───
  function guardPage() {
    var protectedPages = [
      'checkout.html',
      'my-wishlist.html',
      'track-orders.html',
      'shopping-cart.html'
    ];

    var currentPage = window.location.pathname.split('/').pop() ||
                      window.location.href.split('/').pop().split('?')[0];

    var isProtected = protectedPages.some(function (page) {
      return currentPage === page || currentPage.indexOf(page) !== -1;
    });

    if (isProtected && !isLoggedIn()) {
      showToast('🔒 Please log in to access this page!', 'warn');
      setTimeout(function () {
        window.location.href = 'sign-in.html';
      }, 1500);
    }
  }

  // ─── Inject Login Banner for Guests ───────────────────────────────────
  function injectGuestBanner() {
    if (isLoggedIn()) return;

    // Only show on homepage/product listing pages
    var showOnPages = ['home.html', 'index.html', 'category.html', ''];
    var currentPage = window.location.pathname.split('/').pop();
    if (showOnPages.indexOf(currentPage) === -1) return;

    // Don't show if already injected
    if (document.getElementById('shopnest-guest-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'shopnest-guest-banner';
    banner.style.cssText = [
      'background:linear-gradient(135deg, #083A4F 0%, #0D4860 100%)',
      'color:#FFFFFF',
      'text-align:center',
      'padding:10px 20px',
      'font-family:sans-serif',
      'font-size:13.5px',
      'font-weight:500',
      'letter-spacing:0.2px',
      'z-index:9999',
      'position:relative'
    ].join(';');

    banner.innerHTML = [
      '<span style="opacity:0.85;">🛍️ Create a free account to add items to cart, save wishlists & checkout!</span>',
      '<a href="sign-in.html" style="margin-left:14px; background:#A58D66; color:#FFFFFF;',
      'padding:5px 14px; border-radius:20px; font-weight:700; font-size:12.5px;',
      'text-decoration:none; white-space:nowrap;">Sign Up Free →</a>'
    ].join(' ');

    // Inject right after <body> opens
    var body = document.body;
    body.insertBefore(banner, body.firstChild);
  }

  // ─── Expose global helpers ─────────────────────────────────────────────
  window.ShopnestAuth = {
    isLoggedIn: isLoggedIn,
    getUser: getUser,
    logout: logout,
    requireLogin: requireLogin,
    showToast: showToast
  };

  // ─── Initialize on DOM Ready ───────────────────────────────────────────
  function init() {
    guardPage();       // redirect if protected page + not logged in
    updateNavbar();    // update login/logout state in navbar
    guardCartButtons(); // intercept add-to-cart clicks for guests
    guardWishlistButtons(); // intercept wishlist clicks for guests
    injectGuestBanner();    // top banner for guests
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
