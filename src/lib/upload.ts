import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("produtos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data, error: signError } = await supabase.storage
    .from("produtos")
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data?.signedUrl) throw signError ?? new Error("Falha ao gerar link da imagem");

  return data.signedUrl;
}
