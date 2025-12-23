import { useState } from "react";
import { Paths, File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useOfflineCache, CachedArticle } from "./use-offline-cache";
import { ARTICLES } from "@/data/mock-data";

export interface SeriesExport {
  version: string;
  exportedAt: number;
  seriesId: string;
  seriesName: string;
  articles: CachedArticle[];
  checksum: string;
}

export function useSeriesExport() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const { cacheArticle, getAllCachedArticles } = useOfflineCache();

  const calculateChecksum = (data: string): string => {
    // Simples checksum para validação de integridade
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  };

  const exportSeries = async (seriesId: string, seriesName: string): Promise<boolean> => {
    try {
      setExporting(true);
      setProgress(0);

      // Obter todos os artigos em cache
      const cachedArticles = await getAllCachedArticles();
      setProgress(20);

      // Filtrar artigos da série
      const seriesArticles = cachedArticles.filter((article) => article.series === seriesId);

      if (seriesArticles.length === 0) {
        console.log("[SeriesExport] No articles found for series:", seriesId);
        return false;
      }

      setProgress(40);

      // Criar objeto de exportação
      const exportData: SeriesExport = {
        version: "1.0",
        exportedAt: Date.now(),
        seriesId,
        seriesName,
        articles: seriesArticles,
        checksum: "",
      };

      // Calcular checksum
      const dataString = JSON.stringify({
        ...exportData,
        checksum: "", // Excluir checksum do cálculo
      });
      exportData.checksum = calculateChecksum(dataString);

      setProgress(60);

      // Salvar em arquivo
      const fileName = `siga_o_dinheiro_${seriesId}_${Date.now()}.json`;
      const file = new File(Paths.cache, fileName);

      await file.write(JSON.stringify(exportData, null, 2));
      setProgress(80);

      // Compartilhar arquivo
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/json",
          dialogTitle: `Compartilhar série: ${seriesName}`,
        });
      }

      setProgress(100);
      return true;
    } catch (error) {
      console.error("[SeriesExport] Export failed:", error);
      return false;
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  const importSeries = async (fileUri: string): Promise<{ success: boolean; message: string }> => {
    try {
      setImporting(true);
      setProgress(0);

      // Ler arquivo
      const file = new File(fileUri);
      const fileContent = await file.text();
      setProgress(20);

      // Parse JSON
      const importData: SeriesExport = JSON.parse(fileContent);
      setProgress(40);

      // Validar estrutura
      if (
        !importData.version ||
        !importData.seriesId ||
        !importData.seriesName ||
        !importData.articles ||
        !Array.isArray(importData.articles)
      ) {
        return {
          success: false,
          message: "Arquivo inválido: estrutura incorreta",
        };
      }

      // Validar checksum
      const dataString = JSON.stringify({
        ...importData,
        checksum: "",
      });
      const calculatedChecksum = calculateChecksum(dataString);

      if (calculatedChecksum !== importData.checksum) {
        return {
          success: false,
          message: "Arquivo corrompido: checksum inválido",
        };
      }

      setProgress(60);

      // Importar artigos
      let importedCount = 0;
      for (let i = 0; i < importData.articles.length; i++) {
        const article = importData.articles[i];
        const success = await cacheArticle(article);
        if (success) {
          importedCount++;
        }
        setProgress(60 + (i / importData.articles.length) * 40);
      }

      setProgress(100);

      return {
        success: true,
        message: `${importedCount} de ${importData.articles.length} artigos importados com sucesso`,
      };
    } catch (error) {
      console.error("[SeriesExport] Import failed:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido ao importar",
      };
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  const generateQRCodeData = async (seriesId: string, seriesName: string): Promise<string | null> => {
    try {
      // Exportar série para arquivo temporário
      const cachedArticles = await getAllCachedArticles();
      const seriesArticles = cachedArticles.filter((article) => article.series === seriesId);

      if (seriesArticles.length === 0) {
        return null;
      }

      const exportData: SeriesExport = {
        version: "1.0",
        exportedAt: Date.now(),
        seriesId,
        seriesName,
        articles: seriesArticles,
        checksum: "",
      };

      const dataString = JSON.stringify({
        ...exportData,
        checksum: "",
      });
      exportData.checksum = calculateChecksum(dataString);

      // Salvar em arquivo temporário
      const fileName = `temp_${seriesId}_${Date.now()}.json`;
      const file = new File(Paths.cache, fileName);
      await file.write(JSON.stringify(exportData));

      // Retornar URI do arquivo para gerar QR code
      return file.uri;
    } catch (error) {
      console.error("[SeriesExport] QR code generation failed:", error);
      return null;
    }
  };

  return {
    exporting,
    importing,
    progress,
    exportSeries,
    importSeries,
    generateQRCodeData,
  };
}
