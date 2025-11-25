import { NextRequest, NextResponse } from "next/server";
import type { Product, ApiResponse, PaginatedResponse } from "@/types";

// Dados mockados - em produção viria do banco de dados
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Notebook Pro 15",
    description: "Notebook de alta performance com processador Intel i7",
    price: 4999.99,
    image: "/images/notebook.jpg",
    category: "Eletrônicos",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mouse Wireless Premium",
    description: "Mouse sem fio ergonômico com sensor óptico de precisão",
    price: 149.99,
    image: "/images/mouse.jpg",
    category: "Eletrônicos",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  // Adicionar mais produtos conforme necessário
];

// GET /api/products - Listar produtos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const category = searchParams.get("category");

    // Filtrar por categoria se fornecida
    let filteredProducts = mockProducts;
    if (category) {
      filteredProducts = mockProducts.filter((p) => p.category === category);
    }

    // Paginação
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const response: PaginatedResponse<Product> = {
      data: paginatedProducts,
      total: filteredProducts.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredProducts.length / pageSize),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const newProduct: Product = {
      id: String(mockProducts.length + 1),
      name: body.name,
      description: body.description || "",
      price: body.price,
      image: body.image || "/images/placeholder.jpg",
      category: body.category || "Outros",
      inStock: body.inStock ?? true,
      createdAt: new Date().toISOString(),
    };

    // Em produção, salvar no banco de dados
    mockProducts.push(newProduct);

    const response: ApiResponse<Product> = {
      data: newProduct,
      message: "Product created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
