# 🛍️ Shopnest - Modern E-Commerce Platform

A sleek, responsive, and modern E-Commerce web platform customized for Nepal. Features a cute Tote Bag logo, local currency (`Rs`), high-resolution fashion imagery, and built-in Firebase Authentication & Cloud Firestore database architecture.

---

## ✨ Features

- 🛍️ **Custom Shopnest Branding**: Includes a cute vector Tote Bag logo (`logo.svg` & `logo.png`).
- 🇳🇵 **Localized for Nepal**: Formatted with Nepalese currency (`Rs`) and local contact email (`info@shopnest.com`).
- 💃 **High-Resolution Fashion Imagery**: Stunning fashion banner sliders, product showcases, and lifestyle photography.
- 🖼️ **Responsive Hero Slider**: 4 distinct widescreen 16:9 hero banners with top-center framing (`center top` layout to prevent head cropping).
- 🔥 **Firebase Ready**: Pre-configured Firebase Web SDK v10 setup (`firebase-config.js`) and helper modules (`shopnest-firebase.js`) for User Auth and Firestore Database operations.
- 🛒 **Full Shopping Workflow**: Product Catalog, Category Filtering, Wishlist, Product Comparison, Shopping Cart, and Checkout templates.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap, FontAwesome
- **Components**: OwlCarousel2, Lightbox, RateIt
- **Backend / Database Architecture**: Firebase Auth, Cloud Firestore (Modular SDK v10)
- **Local Server**: Python HTTP Server / Node http-server

---

## 🚀 How to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/shakyamtech/Multivendor-shopnest-ecommerce.git
   cd Multivendor-shopnest-ecommerce
   ```

2. **Start a Local Web Server**:
   Using Python:
   ```bash
   python -m http.server 8080
   ```
   Or using Node `http-server`:
   ```bash
   npx http-server -p 8080
   ```

3. **Open in Browser**:
   Navigate to [http://localhost:8080](http://localhost:8080) to view the Shopnest application.

---

## 🔥 Firebase Setup

To connect your own Firebase project:
1. Open `assets/js/firebase-config.js`.
2. Replace `firebaseConfig` credentials with your credentials from the [Firebase Console](https://console.firebase.google.com/).
3. Start using authentication and Firestore database operations!

---

## 👤 Author

- **Mahesh Shakya** ([@shakyamtech](https://github.com/shakyamtech))

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
