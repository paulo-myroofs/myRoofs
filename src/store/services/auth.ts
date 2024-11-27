/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword as updatePasswordFirebase,
  User
} from "firebase/auth";

import firebaseApp from "@/config/firebase";

const auth = getAuth(firebaseApp);

export const waitForUser = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};

export const createUserWithEmailAndPasswordLocal = async (
  email: string,
  password: string
) => {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCred.user, {
      url: String(process.env.NEXT_PUBLIC_LOGIN_URL)
    });
    return {
      user: userCred.user,
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message
    };
  }
};

export const signInWithEmailAndPasswordLocal = async (
  email: string,
  password: string
) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCred.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const recoverPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: String(process.env.NEXT_PUBLIC_LOGIN_URL)
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteOwnAccount = async () => {
  if (auth.currentUser !== null) {
    try {
      await deleteUser(auth.currentUser);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }
};

export const updatePassword = async (password: string) => {
  if (auth.currentUser !== null) {
    try {
      await updatePasswordFirebase(auth.currentUser, password);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }
};

export const createUserAuth = async (
  email: string,
  password: string
): Promise<{ uid: string | null; error: null | string }> => {
  return await fetch("/api/createAuth", {
    method: "POST",
    body: JSON.stringify({ email, password })
  }).then((data) => data.json());
};

export const deactivateUserAuth = async (userUid: string) => {
  return await fetch("/api/deactivateAuth", {
    method: "POST",
    body: JSON.stringify(userUid)
  }).then((data) => data.json());
};

export const deleteUserAuth = async (userUid: string) => {
  return await fetch("/api/deleteAuth", {
    method: "POST",
    body: JSON.stringify(userUid)
  }).then((data) => data.json());
};

export const logout = async () => {
  await signOut(auth);
};
