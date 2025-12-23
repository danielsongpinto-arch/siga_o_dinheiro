import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ArticleComment {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

interface ArticleWithComments {
  articleId: string;
  articleTitle: string;
  comments: ArticleComment[];
}

// Carregar todos os comentários de todos os artigos
async function loadAllComments(): Promise<ArticleWithComments[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const commentKeys = keys.filter((key) => key.startsWith("article_comments_"));
    
    const articlesWithComments: ArticleWithComments[] = [];
    
    for (const key of commentKeys) {
      const articleId = key.replace("article_comments_", "");
      const commentsJson = await AsyncStorage.getItem(key);
      
      if (commentsJson) {
        const comments: ArticleComment[] = JSON.parse(commentsJson);
        
        if (comments.length > 0) {
          // Tentar obter o título do artigo dos bookmarks
          const bookmarksJson = await AsyncStorage.getItem(`bookmarks_${articleId}`);
          let articleTitle = "Artigo sem título";
          
          if (bookmarksJson) {
            const bookmarks = JSON.parse(bookmarksJson);
            if (bookmarks.length > 0) {
              articleTitle = bookmarks[0].articleTitle || articleTitle;
            }
          }
          
          articlesWithComments.push({
            articleId,
            articleTitle,
            comments,
          });
        }
      }
    }
    
    // Ordenar por data do comentário mais recente
    articlesWithComments.sort((a, b) => {
      const aLatest = Math.max(...a.comments.map(c => new Date(c.createdAt).getTime()));
      const bLatest = Math.max(...b.comments.map(c => new Date(c.createdAt).getTime()));
      return bLatest - aLatest;
    });
    
    return articlesWithComments;
  } catch (error) {
    console.error("Error loading all comments:", error);
    return [];
  }
}

// Exportar comentários para PDF
export async function exportCommentsToPDF() {
  try {
    const articlesWithComments = await loadAllComments();
    
    if (articlesWithComments.length === 0) {
      throw new Error("Nenhum comentário encontrado para exportar");
    }
    
    const totalComments = articlesWithComments.reduce((sum, article) => sum + article.comments.length, 0);
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              padding: 40px 30px;
              max-width: 800px;
              margin: 0 auto;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #0284c7;
            }
            
            .header h1 {
              font-size: 32px;
              color: #0284c7;
              margin-bottom: 8px;
            }
            
            .header .subtitle {
              font-size: 16px;
              color: #666;
            }
            
            .article-section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            
            .article-header {
              background: #f0f9ff;
              padding: 16px 20px;
              border-left: 4px solid #0284c7;
              margin-bottom: 20px;
            }
            
            .article-title {
              font-size: 20px;
              font-weight: 600;
              color: #0284c7;
              margin-bottom: 4px;
            }
            
            .article-meta {
              font-size: 14px;
              color: #666;
            }
            
            .comment {
              background: #fff;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 16px;
              margin-bottom: 12px;
              page-break-inside: avoid;
            }
            
            .comment-text {
              font-size: 15px;
              line-height: 1.6;
              color: #333;
              margin-bottom: 12px;
            }
            
            .comment-footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-top: 8px;
              border-top: 1px solid #f3f4f6;
            }
            
            .comment-date {
              font-size: 13px;
              color: #6b7280;
            }
            
            .comment-edited {
              font-size: 12px;
              color: #9ca3af;
              font-style: italic;
            }
            
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              font-size: 13px;
              color: #9ca3af;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>💬 Meus Comentários</h1>
            <div class="subtitle">
              ${totalComments} ${totalComments === 1 ? "comentário" : "comentários"} em ${articlesWithComments.length} ${articlesWithComments.length === 1 ? "artigo" : "artigos"}
            </div>
          </div>
          
          ${articlesWithComments.map((article) => `
            <div class="article-section">
              <div class="article-header">
                <div class="article-title">${article.articleTitle}</div>
                <div class="article-meta">
                  ${article.comments.length} ${article.comments.length === 1 ? "comentário" : "comentários"}
                </div>
              </div>
              
              ${article.comments.map((comment) => {
                const date = new Date(comment.createdAt);
                const formattedDate = date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const isEdited = comment.updatedAt !== comment.createdAt;
                
                return `
                  <div class="comment">
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-footer">
                      <span class="comment-date">${formattedDate}</span>
                      ${isEdited ? '<span class="comment-edited">(editado)</span>' : ""}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          `).join("")}
          
          <div class="footer">
            Exportado em ${new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </body>
      </html>
    `;
    
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Exportar Comentários",
      UTI: "com.adobe.pdf",
    });
  } catch (error) {
    console.error("Error exporting comments to PDF:", error);
    throw error;
  }
}

// Compartilhar comentários como texto
export async function shareCommentsAsText() {
  try {
    const articlesWithComments = await loadAllComments();
    
    if (articlesWithComments.length === 0) {
      throw new Error("Nenhum comentário encontrado para compartilhar");
    }
    
    const totalComments = articlesWithComments.reduce((sum, article) => sum + article.comments.length, 0);
    
    let text = `💬 MEUS COMENTÁRIOS\n`;
    text += `${totalComments} ${totalComments === 1 ? "comentário" : "comentários"} em ${articlesWithComments.length} ${articlesWithComments.length === 1 ? "artigo" : "artigos"}\n`;
    text += `\n${"=".repeat(50)}\n\n`;
    
    for (const article of articlesWithComments) {
      text += `📄 ${article.articleTitle}\n`;
      text += `${article.comments.length} ${article.comments.length === 1 ? "comentário" : "comentários"}\n`;
      text += `${"-".repeat(50)}\n\n`;
      
      for (const comment of article.comments) {
        const date = new Date(comment.createdAt);
        const formattedDate = date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        const isEdited = comment.updatedAt !== comment.createdAt;
        
        text += `${comment.text}\n`;
        text += `📅 ${formattedDate}${isEdited ? " (editado)" : ""}\n\n`;
      }
      
      text += `\n`;
    }
    
    text += `${"=".repeat(50)}\n`;
    text += `Exportado em ${new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}\n`;
    
    await Sharing.shareAsync("data:text/plain;base64," + btoa(unescape(encodeURIComponent(text))), {
      mimeType: "text/plain",
      dialogTitle: "Compartilhar Comentários",
    });
  } catch (error) {
    console.error("Error sharing comments as text:", error);
    throw error;
  }
}
