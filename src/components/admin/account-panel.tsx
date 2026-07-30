import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/admin/admin-ui";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function AccountPanel() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setCurrentEmail(data.user?.email ?? "");
      setEmail(data.user?.email ?? "");
    });
  }, []);

  const changeEmail = async () => {
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      toast.error("E-mail inválido");
      return;
    }
    setSavingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: value });
    setSavingEmail(false);
    if (error) {
      toast.error(getErrorMessage(error, "Não foi possível atualizar o e-mail."));
      return;
    }
    toast.success("E-mail atualizado. Confirme pelo link enviado, se solicitado.");
  };

  const changePassword = async () => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(`A senha precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres`);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não conferem");
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      toast.error(getErrorMessage(error, "Não foi possível alterar a senha."));
      return;
    }
    setPassword("");
    setConfirmPassword("");
    toast.success("Senha alterada com sucesso");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Panel title="E-mail de acesso">
        <div className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Conta atual: <span className="font-medium text-foreground">{currentEmail || "—"}</span>
          </p>
          <div className="grid gap-2">
            <Label htmlFor="acc-email">Novo e-mail</Label>
            <Input
              id="acc-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={() => void changeEmail()} disabled={savingEmail}>
            {savingEmail ? "Salvando..." : "Atualizar e-mail"}
          </Button>
        </div>
      </Panel>

      <Panel title="Senha de acesso">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="acc-pass">Nova senha</Label>
            <Input
              id="acc-pass"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="acc-pass2">Confirmar nova senha</Label>
            <Input
              id="acc-pass2"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button onClick={() => void changePassword()} disabled={savingPassword}>
            {savingPassword ? "Salvando..." : "Alterar senha"}
          </Button>
        </div>
      </Panel>
    </div>
  );
}
