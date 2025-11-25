import type { Metadata } from "next";

/**
 * Configurações de SEO centralizadas para a aplicação
 * Facilita manutenção e consistência dos metadados
 */

export const siteConfig = {
  name: "Content Generator",
  description:
    "Plataforma moderna e escalável para geração de conteúdo para redes sociais, construída com Next.js 15, TypeScript e Tailwind CSS",
  url: "https://content-generator.com",
  ogImage: "https://content-generator.com/og-image.jpg",
  links: {
    twitter: "https://twitter.com/contentgenerator",
    github: "https://github.com/yourusername/content-generator",
  },
};

export function generateMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title: title || siteConfig.name,
    description: description || siteConfig.description,
    openGraph: {
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      type: "website",
      locale: "pt_BR",
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      images: [image || siteConfig.ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}
