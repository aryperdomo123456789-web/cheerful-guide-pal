import { useCallback, useState } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errors";
import { uploadProductImage } from "@/lib/upload";

/** Upload de imagens com estado de progresso e erro tratado em um só lugar. */
export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadMany = useCallback(async (files: FileList | null): Promise<string[]> => {
    if (!files?.length) return [];
    setIsUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadProductImage(file));
      }
      toast.success(urls.length > 1 ? "Imagens enviadas" : "Imagem enviada");
      return urls;
    } catch (error) {
      toast.error(getErrorMessage(error, "Falha no envio da imagem"));
      return [];
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadOne = useCallback(
    async (file: File | null | undefined): Promise<string | null> => {
      if (!file) return null;
      setIsUploading(true);
      try {
        const url = await uploadProductImage(file);
        toast.success("Imagem enviada. Clique em Salvar.");
        return url;
      } catch (error) {
        toast.error(getErrorMessage(error, "Falha no envio da imagem"));
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return { uploadOne, uploadMany, isUploading };
}
