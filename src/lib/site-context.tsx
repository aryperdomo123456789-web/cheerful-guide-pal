import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import {
  ambientesQuery,
  categoriesQuery,
  productsQuery,
  settingsQuery,
  sitesQuery,
  testimonialsQuery,
  type Ambiente,
  type Category,
  type Product,
  type Site,
  type SiteSettings,
  type Testimonial,
} from "@/lib/site-data";

export type SitePage = "home" | "produtos" | "produto" | "sobre" | "contato";

type SiteContextValue = {
  /** slug do site na URL — undefined quando é o site principal (raiz "/") */
  routeSlug?: string;
  site: Site | null;
  siteId: string | null;
  settings: SiteSettings | null;
  categories: Category[];
  ambientes: Ambiente[];
  products: Product[];
  testimonials: Testimonial[];
  theme: string;
  isLoading: boolean;
  notFound: boolean;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error("useSite precisa estar dentro de <SiteProvider>");
  }
  return ctx;
}

/**
 * Provider de site. Sem `slug` = site principal (rotas na raiz).
 * Com `slug` = segundo site (rotas em /s/$site).
 */
export function SiteProvider({ slug, children }: { slug?: string; children: ReactNode }) {
  const { data: sites, isLoading: loadingSites } = useQuery(sitesQuery);

  const site = useMemo(() => {
    const list = sites ?? [];
    if (slug) return list.find((s) => s.slug === slug) ?? null;
    return list.find((s) => s.is_primary) ?? list[0] ?? null;
  }, [sites, slug]);

  const siteId = site?.id ?? null;

  const { data: settings } = useQuery(settingsQuery(siteId));
  const { data: categories } = useQuery(categoriesQuery(siteId));
  const { data: ambientes } = useQuery(ambientesQuery(siteId));
  const { data: products } = useQuery(productsQuery(siteId));
  const { data: testimonials } = useQuery(testimonialsQuery(siteId));

  const value: SiteContextValue = {
    routeSlug: slug,
    site,
    siteId,
    settings: settings ?? null,
    categories: (categories ?? []).filter((c) => c.is_active),
    ambientes: (ambientes ?? []).filter((a) => a.is_active),
    products: (products ?? []).filter((p) => p.is_active),
    testimonials: (testimonials ?? []).filter((t) => t.is_active),
    theme: site?.theme ?? "rustico",
    isLoading: loadingSites || !siteId,
    notFound: !loadingSites && !site,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

type LinkTarget = { to: string; params?: Record<string, string> };

/** Resolve o destino de uma página respeitando o site atual. */
export function useSiteHref() {
  const { routeSlug } = useSite();

  return useMemo(() => {
    return (page: SitePage, productSlug?: string): LinkTarget => {
      if (!routeSlug) {
        switch (page) {
          case "home":
            return { to: "/" };
          case "produtos":
            return { to: "/produtos" };
          case "produto":
            return { to: "/produtos/$slug", params: { slug: productSlug ?? "" } };
          case "sobre":
            return { to: "/sobre" };
          case "contato":
            return { to: "/contato" };
        }
      }
      switch (page) {
        case "home":
          return { to: "/s/$site", params: { site: routeSlug } };
        case "produtos":
          return { to: "/s/$site/produtos", params: { site: routeSlug } };
        case "produto":
          return {
            to: "/s/$site/produto/$slug",
            params: { site: routeSlug, slug: productSlug ?? "" },
          };
        case "sobre":
          return { to: "/s/$site/sobre", params: { site: routeSlug } };
        case "contato":
          return { to: "/s/$site/contato", params: { site: routeSlug } };
      }
    };
  }, [routeSlug]);
}

/** Link ciente do site atual: <SiteLink page="produtos" /> */
export function SiteLink({
  page,
  productSlug,
  search,
  children,
  ...rest
}: {
  page: SitePage;
  productSlug?: string;
  search?: Record<string, unknown>;
  children: ReactNode;
} & Omit<React.ComponentProps<"a">, "href">) {
  const href = useSiteHref();
  const target = href(page, productSlug);

  const props: Record<string, unknown> = {
    ...rest,
    to: target.to,
    params: target.params,
    search,
  };

  const AnyLink = Link as unknown as React.ComponentType<
    Record<string, unknown> & { children?: ReactNode }
  >;

  return <AnyLink {...props}>{children}</AnyLink>;
}
