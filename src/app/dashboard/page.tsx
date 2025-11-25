import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import type { DashboardStats } from "@/types";

// Simulação de fetch de dados - Server Component
async function getDashboardStats(): Promise<DashboardStats> {
  // Em produção, isso viria de uma API ou banco de dados
  // Usando cache com revalidação a cada 1 hora
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  const users = await res.json();

  return {
    totalUsers: users.length,
    totalProducts: 150,
    totalRevenue: 45230,
    growthRate: 12.5,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Visão geral das suas métricas e estatísticas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Usuários"
          value={stats.totalUsers}
          trend="+12%"
          trendUp
        />
        <StatCard
          title="Produtos"
          value={stats.totalProducts}
          trend="+8%"
          trendUp
        />
        <StatCard
          title="Receita Total"
          value={`R$ ${stats.totalRevenue.toLocaleString("pt-BR")}`}
          trend="+23%"
          trendUp
        />
        <StatCard
          title="Taxa de Crescimento"
          value={`${stats.growthRate}%`}
          trend="-2%"
          trendUp={false}
        />
      </div>

      {/* Additional Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                title="Novo usuário cadastrado"
                time="2 minutos atrás"
              />
              <ActivityItem
                title="Produto atualizado"
                time="15 minutos atrás"
              />
              <ActivityItem
                title="Pedido processado"
                time="1 hora atrás"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tarefas Pendentes</CardTitle>
            <CardDescription>Itens que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TaskItem title="Revisar novos produtos" priority="high" />
              <TaskItem title="Responder comentários" priority="medium" />
              <TaskItem title="Atualizar documentação" priority="low" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
}

function StatCard({ title, value, trend, trendUp }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            <p
              className={`mt-2 text-sm font-medium ${
                trendUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend} vs. último mês
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityItemProps {
  title: string;
  time: string;
}

function ActivityItem({ title, time }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0 dark:border-gray-800">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  );
}

interface TaskItemProps {
  title: string;
  priority: "high" | "medium" | "low";
}

function TaskItem({ title, priority }: TaskItemProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium">{title}</p>
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${priorityColors[priority]}`}
      >
        {priority}
      </span>
    </div>
  );
}
