import { Timestamp } from "@/common/entities/timestamp";

export const timestampToDate = (data: Timestamp): Date => {

  
  if (!data || typeof data.seconds !== "number" || typeof data.nanoseconds !== "number") {
    throw new Error("Invalid Timestamp object");
  }

  const milliseconds = data.seconds * 1000 + data.nanoseconds / 1000000;
  return new Date(milliseconds);
};
