import { Suspense } from "react";
import type { Metadata } from "next";
import type { Product } from "@/types";
import ProductGrid from "@/components/features/ProductGrid";
import ProductGridSkeleton from "@/components/features/ProductGridSkeleton";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Listagem completa de produtos disponíveis na plataforma",
};

// Server Component - Busca os dados no servidor
async function getProducts(): Promise<Product[]> {
  // Simulação de fetch de API externa
  // Cache com revalidação a cada 1 hora (ISR)
  const res = await fetch("https://jsonplaceholder.typicode.com/photos", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  // Transformar dados da API em formato Product
  return data.slice(0, 12).map((item: { id: number; title: string; url: string; thumbnailUrl: string }) => ({
    id: String(item.id),
    name: item.title,
    description: `Descrição detalhada do produto ${item.id}`,
    price: Math.floor(Math.random() * 1000) + 50,
    image: item.thumbnailUrl,
    category: ["Eletrônicos", "Roupas", "Livros", "Decoração"][
      Math.floor(Math.random() * 4)
    ],
    inStock: Math.random() > 0.2,
    createdAt: new Date().toISOString(),
  }));
}

export default async function ProductsPage() {
  // Busca de dados no servidor
  const products = await getProducts();

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Produtos</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Explore nossa coleção completa de produtos
          </p>
        </div>

        {/* Filtros - URL Search Params para manter estado compartilhável */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button className="rounded-lg border border-gray-300 px-4 py-2 font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            Todos
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            Eletrônicos
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            Roupas
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            Livros
          </button>
        </div>

        {/* Product Grid com Suspense */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid products={products} />
        </Suspense>
      </div>
    </main>
  );
}
