"use client";

import { useEffect, useState } from "react";

import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";

import { UserEntity as UserDoc } from "@/common/entities/user";
import firebaseApp from "@/config/firebase";
import { errorToast, successToast } from "@/hooks/useAppToast";
import {
  createUserWithEmailAndPasswordLocal,
  deleteOwnAccount,
  logout,
  recoverPassword,
  signInWithEmailAndPasswordLocal
} from "@/store/services/auth";
import {
  createNewUserDoc,
  deleteUserDoc,
  waitForUser
} from "@/store/services/user";
import SignUpForm from "@/validations/signUp";

import AuthContext from "./context";

interface Props {
  children: React.ReactNode;
}

export type UserType = UserDoc | null;
type SignUpFormValidationData = z.infer<typeof SignUpForm>;

const AuthProvider = ({ children }: Props) => {
  const initialLoadingObject = {
    onAuthUserChanged: true,
    loginWithGoogle: false,
    loginWithInternalService: false,
    createUserWithInternalService: false,
    forgotPassword: false,
    updatePassword: false,
    deleteUser: false,
    logout: false
  };
  const [userUid, setUserUid] = useState<string>("undefined");
  const [loading, setLoading] = useState(initialLoadingObject);
  const router = useRouter();
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid("");
      }
      setLoading((prev) => ({ ...prev, onAuthUserChanged: true }));
    });

    return () => unsubscribe();
  }, []);

  const loginWithInternalService = async (email: string, password: string) => {
    setLoading((prev) => ({ ...prev, loginWithInternalService: true }));
    const { error, user } = await signInWithEmailAndPasswordLocal(
      email,
      password
    );
    if (user && !user?.emailVerified) {
      errorToast("Por favor, verifique seu email.");
      await sendEmailVerification(user);
      setLoading((prev) => ({ ...prev, loginWithInternalService: false }));
      logout();
      return;
    }
    if (user) {
      successToast("Bem vindo!");
      setUserUid(user.uid);
    } else {
      setUserUid("");
      if (error === "Firebase: Error (auth/user-not-found).") {
        errorToast("Usuário não encontrado.");
      } else if (error === "Firebase: Error (auth/wrong-password).") {
        errorToast("Senha errada.");
      } else if (error === "Firebase: Error (auth/invalid-credential).") {
        errorToast("Credenciais erradas.");
      } else {
        console.log(error);
        errorToast(error);
      }
    }
    setLoading((prev) => ({ ...prev, loginWithInternalService: false }));
  };

  const createUserWithInternalService = async ({
    email,
    password,
    name,
    dob,
    phone
  }: Omit<SignUpFormValidationData, "confirmPassword">) => {
    if (email && password) {
      setLoading((prev) => ({ ...prev, createUserWithInternalService: true }));
      const { error, user } = await createUserWithEmailAndPasswordLocal(
        email,
        password
      );
      if (error) {
        errorToast(error);
        setLoading((prev) => ({
          ...prev,
          createUserWithInternalService: false
        }));
        return;
      }
      await createNewUserDoc({
        uid: user?.uid || "",
        email,
        name,
        dob: new Date(dob),
        phone
      });
      setUserUid(user?.uid || "");
      toast("Account Created, verify your email!", { type: "success" });
      router.push("/");
      setLoading((prev) => ({ ...prev, createUserWithInternalService: false }));
    } else {
      errorToast("Email and password are required");
    }
  };

  const waitForUserSync = async () => {
    setLoading((prev) => ({ ...prev, onAuthUserChanged: true }));
    await waitForUser(async (userCred) => {
      if (userCred && !userCred?.emailVerified) {
        logout();
        setLoading((prev) => ({ ...prev, onAuthUserChanged: false }));
      }
    });
    setLoading((prev) => ({ ...prev, onAuthUserChanged: false }));
  };
  const forgotPassword = async (email: string) => {
    setLoading((prev) => ({ ...prev, forgotPassword: true }));
    const { error } = await recoverPassword(email);
    if (!error) {
      toast("Email de redefinição de senha enviado", { type: "success" });
    }
    errorToast(error);
    setLoading((prev) => ({ ...prev, forgotPassword: false }));
  };

  const updatePassword = async (password: string) => {
    setLoading((prev) => ({ ...prev, updatePassword: true }));
    // const { error } =
    await updatePassword(password);
    // if (!error) {
    //   toast("Password updated", { type: "success" });
    // }
    // errorToast(error);
    setLoading((prev) => ({ ...prev, updatePassword: false }));
  };

  const deleteUser = async () => {
    setLoading((prev) => ({ ...prev, deleteUser: true }));
    // const { error } =
    await deleteOwnAccount();
    await deleteUserDoc(userUid);
    setUserUid("");
    // if (!error) {
    //   setUser(null);
    //   toast("Account deleted", { type: "success" });
    // }
    // errorToast(error);
    setLoading((prev) => ({ ...prev, deleteUser: false }));
  };

  const logoutUser = async () => {
    setLoading((prev) => ({ ...prev, logout: true }));
    router.push("/");
    setUserUid("");
    logout();
    setLoading((prev) => ({ ...prev, logout: false }));
  };

  return (
    <AuthContext.Provider
      value={{
        userUid,
        loading,
        updatePassword,
        forgotPassword,
        loginWithInternalService,
        logoutUser,
        setUserUid,
        deleteUser,
        createUserWithInternalService,
        waitForUserSync
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
