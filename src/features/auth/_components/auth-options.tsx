import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";

const AuthOptions = ({
  pending,
  handleProviderAction,
}: {
  pending: boolean;
  handleProviderAction: (value: "github" | "google") => void;
}) => {
  return (
    <div className="flex flex-col gap-y-2.5">
      <Button
        disabled={pending}
        onClick={() => handleProviderAction("google")}
        variant="outline"
        size="lg"
        className="w-full relative"
      >
        <FcGoogle className="size-5 absolute top-3 left-2.5" /> Continue with
        Google
      </Button>
      <Button
        disabled={pending}
        onClick={() => handleProviderAction("github")}
        variant="outline"
        size="lg"
        className="w-full relative"
      >
        <FaGithub className="size-5 absolute top-3 left-2.5" /> Continue with
        Github
      </Button>
    </div>
  );
};

export default AuthOptions;
