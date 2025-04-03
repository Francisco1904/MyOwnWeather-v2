import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';

// Public user interface
export interface PublicUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
}

// Auth result interface
interface AuthResult {
  success: boolean;
  message?: string;
  user?: PublicUser;
}

// Helper function to convert Firebase user to our PublicUser
const formatUser = (user: FirebaseUser): PublicUser => {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
};

// Authenticate a user
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: formatUser(userCredential.user),
    };
  } catch (error: any) {
    console.error('Login error:', error);
    let message = 'An error occurred during login';

    if (error.code === 'auth/user-not-found') {
      message = 'No account found with this email';
    } else if (error.code === 'auth/wrong-password') {
      message = 'Invalid password';
    } else if (error.code === 'auth/invalid-credential') {
      message = 'Invalid email or password';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Too many failed login attempts. Please try again later';
    }

    return { success: false, message };
  }
}

// Create a new user
export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    // Create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update the user profile with the provided name
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    return {
      success: true,
      user: formatUser(userCredential.user),
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    let message = 'An error occurred during signup';

    if (error.code === 'auth/email-already-in-use') {
      message = 'An account with this email already exists';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password is too weak';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address';
    }

    return { success: false, message };
  }
}

// Reset password
export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent. Check your inbox.',
    };
  } catch (error: any) {
    console.error('Password reset error:', error);
    let message = 'An error occurred during password reset';

    if (error.code === 'auth/user-not-found') {
      // For security reasons, don't reveal if the email exists
      return {
        success: true,
        message: "If an account with this email exists, we've sent a password reset link.",
      };
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address';
    }

    return { success: false, message };
  }
}

// Get current user
export function getCurrentUser(): PublicUser | null {
  const user = auth.currentUser;
  return user ? formatUser(user) : null;
}

// Logout user
export function logoutUser(): Promise<void> {
  return signOut(auth);
}
