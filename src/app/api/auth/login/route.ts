import { NextRequest, NextResponse } from "next/server";
import type { User, ApiResponse } from "@/types";

// POST /api/auth/login - Autenticar usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Em produção: verificar credenciais no banco de dados
    // Esta é apenas uma simulação
    if (password !== "demo123") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Criar usuário mockado
    const user: User = {
      id: "1",
      name: "Usuário Demo",
      email,
      role: "user",
    };

    // Em produção: gerar JWT token
    const mockToken = `mock-token-${Date.now()}`;

    const response: ApiResponse<{ user: User; token: string }> = {
      data: {
        user,
        token: mockToken,
      },
      message: "Login successful",
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        // Em produção: definir cookie httpOnly com token
        "Set-Cookie": `auth-token=${mockToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
