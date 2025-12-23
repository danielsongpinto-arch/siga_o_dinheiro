import * as Sharing from "expo-sharing";

export interface CommentToShare {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  articleTitle: string;
}

// Compartilhar comentário como texto
export async function shareCommentAsText(comment: CommentToShare) {
  try {
    const date = new Date(comment.createdAt);
    const formattedDate = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const isEdited = comment.updatedAt !== comment.createdAt;
    
    let text = `💬 COMENTÁRIO\n\n`;
    text += `"${comment.text}"\n\n`;
    text += `📄 Artigo: ${comment.articleTitle}\n`;
    text += `📅 ${formattedDate}${isEdited ? " (editado)" : ""}\n\n`;
    text += `---\n`;
    text += `Siga o Dinheiro - Análise de fatos através da perspectiva financeira\n`;
    
    await Sharing.shareAsync("data:text/plain;base64," + btoa(unescape(encodeURIComponent(text))), {
      mimeType: "text/plain",
      dialogTitle: "Compartilhar Comentário",
    });
  } catch (error) {
    console.error("Error sharing comment as text:", error);
    throw error;
  }
}

// Compartilhar comentário como imagem (usando canvas HTML)
export async function shareCommentAsImage(comment: CommentToShare) {
  try {
    const date = new Date(comment.createdAt);
    const formattedDate = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const isEdited = comment.updatedAt !== comment.createdAt;
    
    // Criar HTML para renderizar como imagem
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
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .card {
              background: white;
              border-radius: 24px;
              padding: 40px;
              max-width: 600px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            
            .icon {
              font-size: 48px;
              margin-bottom: 24px;
            }
            
            .comment-text {
              font-size: 24px;
              line-height: 1.6;
              color: #1a1a1a;
              margin-bottom: 32px;
              font-style: italic;
              position: relative;
            }
            
            .comment-text::before {
              content: '"';
              position: absolute;
              left: -20px;
              top: -10px;
              font-size: 60px;
              color: #667eea;
              opacity: 0.3;
            }
            
            .metadata {
              border-top: 2px solid #f0f0f0;
              padding-top: 24px;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            
            .article-title {
              font-size: 16px;
              font-weight: 600;
              color: #667eea;
            }
            
            .date {
              font-size: 14px;
              color: #666;
            }
            
            .footer {
              margin-top: 32px;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
            
            .app-name {
              font-weight: 600;
              color: #667eea;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">💬</div>
            <div class="comment-text">${comment.text}</div>
            <div class="metadata">
              <div class="article-title">${comment.articleTitle}</div>
              <div class="date">${formattedDate}${isEdited ? " • editado" : ""}</div>
            </div>
            <div class="footer">
              <span class="app-name">Siga o Dinheiro</span>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Usar expo-print para converter HTML em imagem
    const { default: Print } = await import("expo-print");
    const { uri } = await Print.printToFileAsync({ html });
    
    await Sharing.shareAsync(uri, {
      mimeType: "image/png",
      dialogTitle: "Compartilhar Comentário",
    });
  } catch (error) {
    console.error("Error sharing comment as image:", error);
    throw error;
  }
}
