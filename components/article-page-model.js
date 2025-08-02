class ArticlePageModel extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
  
      const titulo = this.getAttribute('titulo') || 'Sem título';
      const descricao = this.getAttribute('descricao') || '';
  
      shadow.innerHTML = `
        <style>
          .esqueleto {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            margin-top: 0;
            color: #2c3e50;
          }
          .descricao {
            color: #666;
            font-style: italic;
            margin-bottom: 1.5rem;
          }
        </style>
        <div class="esqueleto">
          <h1>${titulo}</h1>
          <div class="descricao">${descricao}</div>
          <div class="conteudo">
            <slot></slot>
          </div>
        </div>
      `;
    }
  }
  
  customElements.define('article-page-model', ArticlePageModel);