"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Products page error:", error);
  }, [error]);

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-8">
            <svg
              className="mx-auto h-16 w-16 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="mb-4 text-3xl font-bold">Erro ao carregar produtos</h1>
          <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
            Não foi possível carregar a lista de produtos. Por favor, tente novamente.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 max-w-2xl rounded-lg bg-gray-100 p-4 text-left dark:bg-gray-900">
              <p className="font-mono text-sm text-red-600 dark:text-red-400">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={reset}>Tentar Novamente</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Voltar para Home
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
