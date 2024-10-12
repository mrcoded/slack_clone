import { useQueryState } from "nuqs";

export const useProfileId = () => {
  return useQueryState("profileId");
};
