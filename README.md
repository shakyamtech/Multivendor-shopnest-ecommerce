# Shopnest - E-Commerce Frontend

Shopnest is a multi-vendor E-Commerce web template built with HTML5, CSS3, JavaScript, and Bootstrap. It features product listings, category filters, wishlist management, cart/checkout pages, and integration with Firebase (Auth & Firestore).

## Live Demo
[https://shakyamtech.github.io/Multivendor-shopnest-ecommerce/](https://shakyamtech.github.io/Multivendor-shopnest-ecommerce/)

## Project Overview

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap
- **Libraries**: Owl Carousel 2, Lightbox, RateIt, FontAwesome
- **Backend Services**: Firebase Web SDK v10 (Auth & Cloud Firestore)

## Pages Included

- `index.html` / `home.html` - Homepage with promo banners and product showcases
- `category.html` - Product listing with sidebar filters
- `detail.html` - Single product view with gallery & review tab
- `shopping-cart.html` - Shopping cart summary
- `checkout.html` - Order checkout process
- `my-wishlist.html` - User saved wishlist items
- `sign-in.html` - Authentication page (Firebase Auth)
- `contact.html` - Contact form & information

## Running Locally

Clone the repository and start a static web server:

```bash
git clone https://github.com/shakyamtech/Multivendor-shopnest-ecommerce.git
cd Multivendor-shopnest-ecommerce

# Using Python
python -m http.server 5000
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

## Firebase Configuration

To use your own Firebase project for authentication and database:

1. Open `assets/js/firebase-config.js`.
2. Update the `firebaseConfig` object with your API keys from the [Firebase Console](https://console.firebase.google.com/).

## Author

- **Mahesh Shakya** - [@shakyamtech](https://github.com/shakyamtech)

## License

This project is open source and available under the [MIT License](LICENSE).

