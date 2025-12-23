import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Bookmark, PREDEFINED_TAGS } from "@/components/article-bookmarks";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ArticleComment {
  id: string;
  articleId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

async function loadArticleComments(articleId: string): Promise<ArticleComment[]> {
  try {
    const stored = await AsyncStorage.getItem("article_comments");
    if (!stored) return [];
    
    const allComments: ArticleComment[] = JSON.parse(stored);
    return allComments.filter((c) => c.articleId === articleId);
  } catch (error) {
    console.error("Error loading comments for export:", error);
    return [];
  }
}

export async function exportBookmarksToPDF(bookmarks: Bookmark[]): Promise<void> {
  if (bookmarks.length === 0) {
    throw new Error("Nenhum destaque para exportar");
  }

  // Agrupar por artigo
  const grouped: Record<string, Bookmark[]> = {};
  bookmarks.forEach((bookmark) => {
    if (!grouped[bookmark.articleId]) {
      grouped[bookmark.articleId] = [];
    }
    grouped[bookmark.articleId].push(bookmark);
  });

  // Carregar comentários de todos os artigos
  const articleComments: Record<string, ArticleComment[]> = {};
  for (const articleId of Object.keys(grouped)) {
    articleComments[articleId] = await loadArticleComments(articleId);
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Gerar HTML
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meus Destaques - Siga o Dinheiro</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      padding: 40px 30px;
      font-size: 14px;
    }
    
    .cover {
      text-align: center;
      padding: 80px 0;
      page-break-after: always;
    }
    
    .cover h1 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #0a7ea4;
    }
    
    .cover .subtitle {
      font-size: 18px;
      color: #666;
      margin-bottom: 40px;
    }
    
    .cover .stats {
      font-size: 16px;
      color: #888;
      margin-bottom: 8px;
    }
    
    .cover .date {
      font-size: 14px;
      color: #999;
      margin-top: 40px;
    }
    
    .toc {
      page-break-after: always;
      padding: 20px 0;
    }
    
    .toc h2 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #0a7ea4;
      border-bottom: 2px solid #0a7ea4;
      padding-bottom: 8px;
    }
    
    .toc-item {
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }
    
    .toc-item .title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    
    .toc-item .count {
      font-size: 14px;
      color: #0a7ea4;
      font-weight: 600;
    }
    
    .article-section {
      page-break-before: always;
      margin-bottom: 40px;
    }
    
    .article-title {
      font-size: 24px;
      font-weight: 700;
      color: #0a7ea4;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 3px solid #0a7ea4;
    }
    
    .bookmark {
      margin-bottom: 32px;
      padding: 20px;
      background: #f9f9f9;
      border-left: 4px solid #0a7ea4;
      border-radius: 4px;
      page-break-inside: avoid;
    }
    
    .bookmark-header {
      margin-bottom: 12px;
    }
    
    .part-title {
      font-size: 14px;
      font-weight: 600;
      color: #0a7ea4;
      margin-bottom: 8px;
    }
    
    .excerpt {
      font-size: 15px;
      font-style: italic;
      color: #333;
      line-height: 1.7;
      margin-bottom: 12px;
      padding: 12px;
      background: white;
      border-radius: 4px;
    }
    
    .note {
      font-size: 14px;
      color: #555;
      line-height: 1.6;
      margin-bottom: 12px;
      padding: 10px;
      background: #fffbea;
      border-left: 3px solid #f59e0b;
      border-radius: 4px;
    }
    
    .note-label {
      font-weight: 600;
      color: #f59e0b;
      margin-bottom: 4px;
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }
    
    .tag {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }
    
    .tag-importante { background: #fee2e2; color: #dc2626; }
    .tag-revisar { background: #fef3c7; color: #f59e0b; }
    .tag-citar { background: #dbeafe; color: #2563eb; }
    .tag-duvida { background: #e0e7ff; color: #6366f1; }
    .tag-insight { background: #dcfce7; color: #16a34a; }
    
    .comments-section {
      margin-top: 32px;
      padding: 20px;
      background: #f0f9ff;
      border-left: 4px solid #0284c7;
      border-radius: 4px;
      page-break-inside: avoid;
    }
    
    .comments-title {
      font-size: 16px;
      font-weight: 700;
      color: #0284c7;
      margin-bottom: 16px;
    }
    
    .comment {
      margin-bottom: 16px;
      padding: 12px;
      background: white;
      border-radius: 4px;
      border-left: 2px solid #0284c7;
    }
    
    .comment:last-child {
      margin-bottom: 0;
    }
    
    .comment-text {
      font-size: 14px;
      color: #333;
      line-height: 1.6;
      margin-bottom: 8px;
    }
    
    .comment-date {
      font-size: 11px;
      color: #999;
      text-align: right;
    }
    
    .timestamp {
      font-size: 12px;
      color: #999;
      text-align: right;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    
    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <!-- Capa -->
  <div class="cover">
    <h1>📚 Meus Destaques</h1>
    <div class="subtitle">Siga o Dinheiro</div>
    <div class="stats">${bookmarks.length} ${bookmarks.length === 1 ? "destaque" : "destaques"}</div>
    <div class="stats">${Object.keys(grouped).length} ${Object.keys(grouped).length === 1 ? "artigo" : "artigos"}</div>
    <div class="date">Gerado em ${dateStr}</div>
  </div>

  <!-- Índice -->
  <div class="toc">
    <h2>Índice</h2>
    ${Object.entries(grouped)
      .map(
        ([articleId, bookmarks]) => `
      <div class="toc-item">
        <div class="title">${bookmarks[0].articleTitle}</div>
        <div class="count">${bookmarks.length} ${bookmarks.length === 1 ? "destaque" : "destaques"}</div>
      </div>
    `,
      )
      .join("")}
  </div>

  <!-- Destaques por Artigo -->
  ${Object.entries(grouped)
    .map(
      ([articleId, articleBookmarks]) => `
    <div class="article-section">
      <h2 class="article-title">${articleBookmarks[0].articleTitle}</h2>
      
      ${articleBookmarks
        .map(
          (bookmark, index) => `
        <div class="bookmark">
          <div class="bookmark-header">
            <div class="part-title">${index + 1}. ${bookmark.partTitle}</div>
          </div>
          
          <div class="excerpt">"${bookmark.excerpt}"</div>
          
          ${
            bookmark.note
              ? `
            <div class="note">
              <div class="note-label">💭 Nota pessoal:</div>
              ${bookmark.note}
            </div>
          `
              : ""
          }
          
          ${
            bookmark.tags && bookmark.tags.length > 0
              ? `
            <div class="tags">
              ${bookmark.tags
                .map((tagId) => {
                  const tag = PREDEFINED_TAGS.find((t) => t.id === tagId);
                  return tag ? `<span class="tag tag-${tag.id}">${tag.label}</span>` : "";
                })
                .join("")}
            </div>
          `
              : ""
          }
          
          <div class="timestamp">
            ${new Date(bookmark.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      `,
        )
        .join("")}
      
      ${articleComments[articleId] && articleComments[articleId].length > 0 ? `
        <div class="comments-section">
          <div class="comments-title">💬 Comentários do Artigo (${articleComments[articleId].length})</div>
          ${articleComments[articleId]
            .map(
              (comment) => `
            <div class="comment">
              <div class="comment-text">${comment.text}</div>
              <div class="comment-date">
                ${new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      ` : ""}
    </div>
  `,
    )
    .join("")}

  <div class="footer">
    Gerado pelo app Siga o Dinheiro<br>
    ${dateStr}
  </div>
</body>
</html>
  `;

  try {
    // Gerar PDF
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // Compartilhar PDF
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartilhar Destaques",
        UTI: "com.adobe.pdf",
      });
    } else {
      throw new Error("Compartilhamento não disponível neste dispositivo");
    }
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
}
