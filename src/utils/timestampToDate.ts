import { Timestamp } from "firebase/firestore";

export const timestampToDate = (data: Timestamp): Date => {
  const milliseconds = data.seconds * 1000 + data.nanoseconds / 1000000;
  return new Date(milliseconds);
};
