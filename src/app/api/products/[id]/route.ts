import { NextRequest, NextResponse } from "next/server";
import type { Product, ApiResponse } from "@/types";

// Mock database - em produção usar banco de dados real
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Notebook Pro 15",
    description: "Notebook de alta performance",
    price: 4999.99,
    image: "/images/notebook.jpg",
    category: "Eletrônicos",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
];

// GET /api/products/[id] - Buscar produto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = mockProducts.find((p) => p.id === params.id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const response: ApiResponse<Product> = {
      data: product,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error(`GET /api/products/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Atualizar produto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productIndex = mockProducts.findIndex((p) => p.id === params.id);

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await request.json();
    const updatedProduct: Product = {
      ...mockProducts[productIndex],
      ...body,
      id: params.id, // Não permitir mudança de ID
    };

    // Em produção, atualizar no banco de dados
    mockProducts[productIndex] = updatedProduct;

    const response: ApiResponse<Product> = {
      data: updatedProduct,
      message: "Product updated successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`PUT /api/products/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Deletar produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productIndex = mockProducts.findIndex((p) => p.id === params.id);

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Em produção, deletar do banco de dados
    const deletedProduct = mockProducts.splice(productIndex, 1)[0];

    const response: ApiResponse<Product> = {
      data: deletedProduct,
      message: "Product deleted successfully",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`DELETE /api/products/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
