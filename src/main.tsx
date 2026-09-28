import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { getStoredArticles } from './services/articlesStorage'
import { updatePageSeo } from './utils/seo'

// Immediately initialize SEO before render (crucial for Googlebot & social share preview scrapers)
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('article') || (window.location.hash.startsWith('#article-') ? window.location.hash.replace('#article-', '') : null);
  if (articleId) {
    const articles = getStoredArticles();
    const found = articles.find((a) => a.id === articleId);
    if (found) {
      updatePageSeo({ article: found });
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
