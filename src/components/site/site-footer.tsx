import { Link } from "@tanstack/react-router";
import { Clock, Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { SiteLink, useSite } from "@/lib/site-context";

export function SiteFooter() {
  const { settings, categories } = useSite();
  const { t, formatNumber } = useI18n();

  return (
    <footer className="mt-24 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl">{settings?.brand_name}</p>
          <p className="mt-3 text-sm text-sidebar-foreground/70">{settings?.tagline}</p>
          <p className="mt-4 text-sm text-sidebar-foreground/70">
            {t("footer.yearsPieces", {
              years: settings?.years_experience ?? 0,
              pieces: formatNumber(settings?.projects_done ?? 0),
            })}
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
          <p className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/50">
            {t("footer.categories")}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <SiteLink
                  page="produtos"
                  search={{ categoria: c.slug }}
                  className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
                >
                  {c.name}
                </SiteLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/50">
            {t("footer.browse")}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <SiteLink page="produtos" className="text-sidebar-foreground/80 hover:text-sidebar-foreground">
                {t("footer.allProducts")}
              </SiteLink>
            </li>
            <li>
              <SiteLink page="sobre" className="text-sidebar-foreground/80 hover:text-sidebar-foreground">
                {t("nav.about")}
              </SiteLink>
            </li>
            <li>
              <SiteLink page="contato" className="text-sidebar-foreground/80 hover:text-sidebar-foreground">
                {t("contact.title")}
              </SiteLink>
            </li>
            <li>
              <Link to="/auth" className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
                {t("nav.admin")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/50">
            {t("footer.contactUs")}
          </p>
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
        © {new Date().getFullYear()} {settings?.brand_name}. {t("footer.rights")}
      </div>
    </footer>
  );
}
