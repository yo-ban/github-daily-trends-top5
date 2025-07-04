const eleventyPluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // プラグイン
  eleventyConfig.addPlugin(eleventyPluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  // 静的ファイルのコピー
  eleventyConfig.addPassthroughCopy("src/assets");

  // 日付フォーマットフィルター
  eleventyConfig.addFilter("dateFormat", (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  });

  // スラッグ生成フィルター
  eleventyConfig.addFilter("slugify", (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  });

  // 数値フォーマットフィルター
  eleventyConfig.addFilter("numberFormat", (num) => {
    return num?.toLocaleString() || '0';
  });

  // ISO 8601形式の日付フィルター（RSS用）
  eleventyConfig.addFilter("toISOString", (date) => {
    if (date === "now") {
      return new Date().toISOString();
    }
    return new Date(date).toISOString();
  });

  // 配列の件数制限フィルター
  eleventyConfig.addFilter("limit", (array, limit) => {
    if (!array) return [];
    return array.slice(0, limit);
  });

  // 文字列の前後から特定文字を削除
  eleventyConfig.addFilter("trim", (str, char = ' ') => {
    if (!str) return '';
    const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`^${escapedChar}+|${escapedChar}+$`, 'g');
    return str.replace(pattern, '');
  });


  // コレクション: 日付別にグループ化
  eleventyConfig.addCollection("trendsByDate", function(collectionApi) {
    const trends = collectionApi.getFilteredByTag("trend");
    const grouped = {};
    
    trends.forEach(item => {
      const date = item.data.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    
    return grouped;
  });

  // アーカイブ用コレクション（年月別にグループ化）
  eleventyConfig.addCollection("archiveByYear", function(collectionApi) {
    const trends = collectionApi.getFilteredByTag("trend");
    const grouped = {};
    
    trends.forEach(item => {
      const date = new Date(item.data.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) grouped[year][month] = {};
      if (!grouped[year][month][item.data.date]) {
        grouped[year][month][item.data.date] = item.data.repos || [];
      }
    });
    
    return grouped;
  });

  // Markdownのレンダリング設定
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: false
  });
  
  eleventyConfig.setLibrary("md", md);

  // .gitignoreの設定を無視する（生成されたコンテンツも処理するため）
  eleventyConfig.setUseGitIgnore(false);

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    pathPrefix: process.env.PATH_PREFIX || ""
  };
};