/* eslint-disable @typescript-eslint/no-explicit-any */
import admin from "firebase-admin";

export const deactivateUserAuthAdmin = async (
  uid: string
): Promise<{ error: null | string }> => {
  return admin
    .auth()
    .updateUser(uid, {
      disabled: true
    })
    .then(() => ({
      error: null
    }))
    .catch((error) => {
      console.log(error);
      return { error: "Erro ao desativar usuário" };
    });
};

export const deleteUserAuthAdmin = async (
  uid: string
): Promise<{ error: null | string }> => {
  return admin
    .auth()
    .deleteUser(uid)
    .then(() => ({
      error: null
    }))
    .catch((error) => {
      console.log(error);
      return { error: "Erro ao deletar usuário" };
    });
};

export const createUserAuthAdmin = async (
  email: string,
  password: string
): Promise<{ uid: string | null; error: null | string }> => {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    return {
      uid: userRecord.uid,
      error: null
    };
  } catch (error: any) {
    console.error(error);
    return {
      uid: null,
      error:
        error.code === "auth/email-already-exists"
          ? "Email já está em uso."
          : "Erro ao criar usuário."
    };
  }
};
