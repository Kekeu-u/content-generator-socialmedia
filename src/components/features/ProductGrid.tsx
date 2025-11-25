"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import { Card, CardContent, CardFooter, Button } from "@/components/ui";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div>
      {/* Client-side filtering */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredProducts.length} produtos encontrados
        </p>
        <select
          value={selectedCategory || ""}
          onChange={(e) =>
            setSelectedCategory(e.target.value || null)
          }
          className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="">Todas as categorias</option>
          <option value="Eletrônicos">Eletrônicos</option>
          <option value="Roupas">Roupas</option>
          <option value="Livros">Livros</option>
          <option value="Decoração">Decoração</option>
        </select>
      </div>

      {/* Grid de Produtos */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Nenhum produto encontrado nesta categoria.
          </p>
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = () => {
    setIsLoading(true);
    // Simulação de adição ao carrinho
    setTimeout(() => {
      setIsLoading(false);
      alert(`${product.name} adicionado ao carrinho!`);
    }, 1000);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-transform hover:scale-105">
      {/* Imagem do Produto */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <CardContent className="flex-1 p-4">
        <div className="mb-2">
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {product.category}
          </span>
        </div>
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
          {product.name}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {product.description}
        </p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          R$ {product.price.toFixed(2)}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          isLoading={isLoading}
          disabled={!product.inStock}
          className="w-full"
        >
          {product.inStock ? "Adicionar ao Carrinho" : "Indisponível"}
        </Button>
      </CardFooter>
    </Card>
  );
}
