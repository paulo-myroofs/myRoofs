/* eslint-disable @typescript-eslint/no-explicit-any */
import { FirebaseError } from "firebase/app";
import {
  DocumentData,
  FirestoreError,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
  WhereFilterOp,
  deleteDoc
} from "firebase/firestore";
import { Filter } from "lucide-react";

import firebaseApp from "@/config/firebase";

const db = getFirestore(firebaseApp);

type CollectionResponse<T> =
  | { data: (T & { id: string })[]; error: null }
  | { data: null; error: string };

interface Filter {
  field: string;
  operator: WhereFilterOp;
  value: any;
}

export const getFirestoreCollection = async <T extends DocumentData>({
  collectionPath,
  filters = []
}: {
  collectionPath: string;
  filters?: Filter[];
}): Promise<CollectionResponse<T>> => {
  try {
    const collectionRef = collection(db, collectionPath);
    const finalFilters = filters.map((filter) =>
      where(filter.field, filter.operator, filter.value)
    );
    const q = query(collectionRef, ...finalFilters);

    const querySnapshot = await getDocs(q);

    const data: (T & { id: string })[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as T;

      return {
        id: doc.id,
        ...data
      };
    });

    return {
      data,
      error: null
    };
  } catch (error) {
    if (error instanceof FirestoreError) {
      return {
        error: error.message,
        data: null
      };
    } else {
      return {
        error: (error as Error).message,
        data: null
      };
    }
  }
};

type DocumentResponse<T> =
  | { data: (T & { id: string }) | null; error: null }
  | { data: null; error: string };

export const getFirestoreDoc = async <T extends DocumentData>({
  documentPath
}: {
  documentPath: string;
}): Promise<DocumentResponse<T>> => {
  try {
    const documentRef = doc(db, documentPath);
    const docSnapshot = await getDoc(documentRef);

    if (!docSnapshot.exists()) {
      return {
        data: null,
        error: null
      };
    }

    const data = docSnapshot.data() as T;

    return {
      data: { ...data, id: docSnapshot.id },
      error: null
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return {
        error: error.message,
        data: null
      };
    } else {
      return {
        error: error as string,
        data: null
      };
    }
  }
};

export const createFirestoreDoc = async <T extends DocumentData>({
  collectionPath,
  data
}: {
  collectionPath: string;
  data: Omit<T, "id">;
}): Promise<{ error: string | null }> => {
  try {
    const collectionRef = collection(db, collectionPath);
    addDoc(collectionRef, data);

    return {
      error: null
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return {
        error: error.message
      };
    } else {
      return {
        error: "An unknown error occurred"
      };
    }
  }
};

export const setFirestoreDoc = async <T extends DocumentData>({
  docPath,
  data
}: {
  docPath: string;
  data: Omit<T, "id">;
}): Promise<{ error: string | null }> => {
  try {
    const docRef = doc(db, docPath);
    setDoc(docRef, data);

    return {
      error: null
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return {
        error: error.message
      };
    } else {
      return {
        error: "An unknown error occurred"
      };
    }
  }
};

export const updateFirestoreDoc = async <T extends DocumentData>({
  documentPath,
  data
}: {
  documentPath: string;
  data: Partial<Omit<T, "id">>;
}): Promise<{ error: string | null }> => {
  try {
    const documentRef = doc(db, documentPath);

    await updateDoc(documentRef, {
      ...data
    });

    return {
      error: null
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return {
        error: error.message
      };
    } else {
      return {
        error: "An unknown error occurred"
      };
    }
  }
};

export const deleteFirestoreDoc = async ({
  documentPath
}: {
  documentPath: string;
}): Promise<{ error: string | null }> => {
  try {
    const documentRef = doc(db, documentPath);

    await deleteDoc(documentRef);

    return {
      error: null
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      return {
        error: error.message
      };
    } else {
      return {
        error: "An unknown error occurred"
      };
    }
  }
};
