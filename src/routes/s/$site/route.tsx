import { createFileRoute, Outlet } from "@tanstack/react-router";

import { SiteProvider } from "@/lib/site-context";

export const Route = createFileRoute("/s/$site")({
  component: SiteShell,
});

function SiteShell() {
  const { site } = Route.useParams();
  return (
    <SiteProvider slug={site}>
      <Outlet />
    </SiteProvider>
  );
}
