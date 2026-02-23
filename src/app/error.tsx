"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-red-50 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Something went wrong!
          </h1>
          <p className="text-muted-foreground">
            {error.message ||
              "An unexpected error occurred while processing your request. Don't worry, it's not you, it's us."}
          </p>
          {error.digest && (
            <p className="text-xs text-zinc-400 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center gap-2 bg-primary"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>

          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              className: "w-full sm:w-auto flex items-center gap-2",
            })}
          >
            <Home className="h-4 w-4" />
            Go back home
          </Link>
        </div>

        <p className="text-sm text-zinc-500 italic">
          If the problem persists, please contact our support team.
        </p>
      </div>
    </div>
  );
}
