// Shopnest - Firebase Firestore & Auth Helper Functions
import { db, auth } from './firebase-config.js';
import { 
    collection, getDocs, addDoc, doc, getDoc, query, where 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/**
 * Fetch all products from Firestore
 */
export async function getProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

/**
 * Register a new user (Customer or Vendor)
 */
export async function registerUser(email, password, fullName, role = 'customer') {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save extra user profile data in Firestore
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            email: email,
            fullName: fullName,
            role: role,
            createdAt: new Date()
        });

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Login existing user
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Logout user
 */
export async function logoutUser() {
    return await signOut(auth);
}
