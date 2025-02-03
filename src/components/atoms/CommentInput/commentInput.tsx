import React from "react";

import { FiSend } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

import { CommentInputProps } from "./types";

const CommentInput = ({ onSend, ...inputProps }: CommentInputProps) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="border-gray flex items-center rounded-sm border-2 bg-white px-4 py-2"
    >
      <input
        type="text"
        placeholder="Adicionar comentário"
        className={twMerge(
          "w-[15.85rem] border-none bg-white text-xs text-gray-600 outline-none focus:ring-0",
          inputProps.className
        )}
        {...inputProps}
      />
      <button
        type="submit"
        className="ml-2 text-green-500 hover:text-green-700"
      >
        <FiSend className="rotate-45 transform" />
      </button>
    </form>
  );
};

export default CommentInput;
