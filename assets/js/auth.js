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

  // ─── Update Navbar: Login/Logout + Greeting + Dropdowns ───────────────
  function updateNavbar() {
    var loginLi   = document.querySelector('li.login');
    var loginSpan = document.querySelector('li.login a span');
    var loginA    = document.querySelector('li.login a');
    var myAccLi   = document.querySelector('li.myaccount');
    var myAccSpan = document.querySelector('li.myaccount a span');
    var myAccA    = document.querySelector('li.myaccount a');

    // Wire up top bar links (always, for all users)
    var wishlistLi = document.querySelector('li.wishlist a');
    var cartLi     = document.querySelector('li.header_cart a');
    var checkLi    = document.querySelector('li.check a');
    if (wishlistLi) wishlistLi.href = 'my-wishlist.html';
    if (cartLi)     cartLi.href     = 'shopping-cart.html';
    if (checkLi)    checkLi.href    = 'checkout.html';

    if (isLoggedIn()) {
      var user = getUser();

      // Update "Login" → "Hi, Name"
      if (loginSpan) loginSpan.textContent = 'Hi, ' + user + ' 👤';
      if (loginA)    { loginA.href = '#'; loginA.style.color = '#E2C48C'; loginA.style.fontWeight = '700'; }

      // Build My Account dropdown
      if (myAccLi && !document.getElementById('shopnest-acc-dropdown')) {
        myAccLi.style.position = 'relative';
        // Keep "My Account" text — don't replace with username (shown in Hi greeting already)
        if (myAccA) {
          myAccA.style.cursor = 'pointer';
        }

        var dropdown = document.createElement('ul');
        dropdown.id = 'shopnest-acc-dropdown';
        dropdown.style.cssText = [
          'display:none',
          'position:absolute',
          'top:100%',
          'left:0',
          'background:#FFFFFF',
          'border-radius:10px',
          'box-shadow:0 8px 30px rgba(0,0,0,0.15)',
          'min-width:180px',
          'list-style:none',
          'padding:8px 0',
          'margin:0',
          'z-index:99999',
          'border:1px solid #E2E8F0'
        ].join(';');

        var menuItems = [
          { icon: '👤', label: 'Profile: ' + user, href: '#',              bold: true },
          { icon: '❤️', label: 'My Wishlist',       href: 'my-wishlist.html' },
          { icon: '📦', label: 'Track Orders',      href: 'track-orders.html' },
          { icon: '🛒', label: 'Shopping Cart',     href: 'shopping-cart.html' },
          { icon: '🚪', label: 'Logout',            href: '#', id: 'acc-dd-logout' }
        ];

        menuItems.forEach(function (item) {
          var li = document.createElement('li');
          var a  = document.createElement('a');
          a.href = item.href;
          if (item.id) a.id = item.id;
          a.style.cssText = [
            'display:block',
            'padding:10px 18px',
            'color:' + (item.bold ? '#0F172A' : '#334155'),
            'font-size:13.5px',
            'font-weight:' + (item.bold ? '700' : '500'),
            'text-decoration:none',
            'white-space:nowrap',
            'transition:background 0.15s'
          ].join(';');
          a.innerHTML = '<span style="margin-right:8px;">' + item.icon + '</span>' + item.label;
          a.addEventListener('mouseenter', function () { this.style.background = '#F1F5F9'; });
          a.addEventListener('mouseleave', function () { this.style.background = 'transparent'; });
          if (item.id === 'acc-dd-logout') {
            a.addEventListener('click', function (e) {
              e.preventDefault();
              showToast('Logged out successfully. See you soon! 👋', 'info');
              setTimeout(logout, 1200);
            });
            a.style.color = '#EF4444';
          }
          li.appendChild(a);
          dropdown.appendChild(li);
        });

        myAccLi.appendChild(dropdown);

        // Toggle dropdown on click
        myAccA.addEventListener('click', function (e) {
          e.preventDefault();
          var dd = document.getElementById('shopnest-acc-dropdown');
          dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
          if (!myAccLi.contains(e.target)) {
            var dd = document.getElementById('shopnest-acc-dropdown');
            if (dd) dd.style.display = 'none';
          }
        });
      }

    } else {
      // Guest — ensure Login text is correct
      if (loginSpan) loginSpan.textContent = 'Login';
      if (loginA)    loginA.href = 'sign-in.html';
      if (myAccSpan) myAccSpan.textContent = 'My Account';
      if (myAccA)    myAccA.href = 'sign-in.html';

      // Remove logout if somehow there
      var logoutLiEl = document.getElementById('shopnest-logout-li');
      if (logoutLiEl && logoutLiEl.parentNode) logoutLiEl.parentNode.removeChild(logoutLiEl);
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
