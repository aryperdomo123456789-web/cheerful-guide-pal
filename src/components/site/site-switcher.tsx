import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Palette } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSite } from "@/lib/site-context";
import { sitesQuery } from "@/lib/site-data";

/**
 * Troca automática de marca: muda produtos, textos e tema de uma vez,
 * navegando entre o site principal ("/") e os sites secundários ("/s/{slug}").
 */
export function SiteSwitcher({ className }: { className?: string }) {
  const { routeSlug, site } = useSite();
  const { data: sites } = useQuery(sitesQuery);
  const navigate = useNavigate();

  const list = (sites ?? []).filter((s) => s.is_active);
  if (list.length < 2) return null;

  const current = site?.id ?? "";

  const onChange = (id: string) => {
    const target = list.find((s) => s.id === id);
    if (!target || target.id === current) return;
    if (target.is_primary) {
      void navigate({ to: "/" });
      return;
    }
    void navigate({ to: "/s/$site", params: { site: target.slug } });
  };

  return (
    <Select value={current} onValueChange={onChange}>
      <SelectTrigger
        className={className}
        aria-label="Trocar de marca e tema"
        title={routeSlug ? `Marca atual: ${site?.name}` : "Marca atual"}
      >
        <Palette className="mr-2 size-4 text-muted-foreground" />
        <SelectValue placeholder="Marca" />
      </SelectTrigger>
      <SelectContent>
        {list.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
