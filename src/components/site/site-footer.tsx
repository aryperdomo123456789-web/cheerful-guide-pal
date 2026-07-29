import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

import { categoriesQuery, settingsQuery } from "@/lib/site-data";

export function SiteFooter() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: categories } = useQuery(categoriesQuery);

  return (
    <footer className="mt-24 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl">{settings?.brand_name}</p>
          <p className="mt-3 text-sm text-sidebar-foreground/70">{settings?.tagline}</p>
          <p className="mt-4 text-sm text-sidebar-foreground/70">
            {settings?.years_experience} anos de oficina · {settings?.projects_done?.toLocaleString("pt-BR")} peças
            entregues
          </p>
          <div className="mt-5 flex gap-3">
            {settings?.instagram ? (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-sidebar-border p-2 hover:bg-sidebar-accent"
              >
                <Instagram className="size-4" />
              </a>
            ) : null}
            {settings?.facebook ? (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-sidebar-border p-2 hover:bg-sidebar-accent"
              >
                <Facebook className="size-4" />
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/50">Categorias</p>
          <ul className="mt-4 space-y-2 text-sm">
            {(categories ?? []).slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link
                  to="/produtos"
                  search={{ categoria: c.slug }}
                  className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/50">Navegue</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/produtos" className="text-sidebar-foreground/80 hover:text-sidebar-foreground">
                Todos os produtos
              </Link>
            </li>
            <li>
              <Link to="/sobre" className="text-sidebar-foreground/80 hover:text-sidebar-foreground">
                A Marcenaria
              </Link>
            </li>
            <li>
              <Link to="/contato" className="text-sidebar-foreground/80 hover:text-sidebar-foreground">
                Contato e orçamento
              </Link>
            </li>
            <li>
              <Link to="/auth" className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
                Área administrativa
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/50">Fale com a gente</p>
          <ul className="mt-4 space-y-3 text-sm text-sidebar-foreground/80">
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              {settings?.phone}
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" />
              {settings?.email}
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {settings?.address}
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0" />
              {settings?.opening_hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sidebar-border py-6 text-center text-xs text-sidebar-foreground/50">
        © {new Date().getFullYear()} {settings?.brand_name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
