import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-9xl font-bold text-blue-600">404</h1>
          <h2 className="mb-2 text-3xl font-bold">Página não encontrada</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Desculpe, não conseguimos encontrar a página que você está procurando.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button>Voltar para Home</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Ver Produtos</Button>
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Precisa de ajuda? Entre em contato com o suporte.
          </p>
        </div>
      </div>
    </div>
  );
}
