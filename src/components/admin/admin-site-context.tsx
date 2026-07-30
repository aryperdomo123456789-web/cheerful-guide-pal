import { createContext, useContext, type ReactNode } from "react";

/** Id do site que está sendo editado no painel. */
const AdminSiteContext = createContext<string | null>(null);

export function AdminSiteProvider({
  siteId,
  children,
}: {
  siteId: string | null;
  children: ReactNode;
}) {
  return <AdminSiteContext.Provider value={siteId}>{children}</AdminSiteContext.Provider>;
}

export function useAdminSiteId() {
  return useContext(AdminSiteContext);
}
