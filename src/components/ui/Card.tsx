import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
}

export default function Card({
  children,
  variant = "default",
  className = "",
  ...props
}: CardProps) {
  const variants = {
    default: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
    outlined: "border-2 border-gray-300 dark:border-gray-700",
    elevated: "bg-white dark:bg-gray-900 shadow-lg",
  };

  return (
    <div
      className={`rounded-lg p-6 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-xl font-bold ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
