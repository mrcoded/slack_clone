export type AuthFlow = "signIn" | "signUp";

export interface AuthCardProps {
  setState: (state: AuthFlow) => void;
}
