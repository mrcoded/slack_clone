"use client";

import { useQueryState } from "nuqs";

export const useThreadId = () => {
  return useQueryState("threadId");
};
