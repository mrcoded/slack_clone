"use client";

import React, { useState } from "react";
import { TriangleAlert } from "lucide-react";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

import AuthOptions from "./auth-options";
import PasswordVisibility from "./password-visibility";

import { AuthCardProps } from "@/app/auth/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const SignUpCard = ({ setState }: AuthCardProps) => {
  const { signIn } = useAuthActions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Check if email already exists
  const emailExists = useQuery(api.users.checkEmailExists, { email });

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // If emailExists, return
    if (emailExists) {
      setError("User already exists, please sign in.");
      return;
    }

    setPending(true);
    signIn("password", { name, email, password, flow: "signUp" })
      .catch(() => {
        setError("Something went wrong!");
      })
      .finally(() => {
        setPending(false);
      });
  };

  const handleProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>

      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" /> <p>{error}</p>
        </div>
      )}

      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Full name"
            type="text"
            required
          />
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
            type="email"
            required
          />
          <div className="relative flex flex-col space-y-1.5">
            <Input
              disabled={pending}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              required
            />
            <PasswordVisibility
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </div>
          <div className="relative flex flex-col space-y-1.5">
            <Input
              disabled={pending}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              placeholder="Confirm password"
              type={showPassword ? "text" : "password"}
              required
            />
            <PasswordVisibility
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Continue
          </Button>
        </form>
        <Separator />
        {/* // Provider sign up options */}
        <AuthOptions
          pending={pending}
          handleProviderAction={handleProviderSignUp}
        />
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => setState("signIn")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
