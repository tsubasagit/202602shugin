/**
 * 記事の link を「各メディアの政治面トップ（衆院選・関連ニュース）URL」に統一する
 * 一覧の表示タイトルとリンク先の齟齬を防ぐため、個別記事URLではなくセクショントップのみを参照
 */
const fs = require('fs');
const path = require('path');

// 各メディアの政治面・衆院選トップURL（1メディア1URL）
const MEDIA_TOP_URLS = {
  'NHK': 'https://news.web.nhk/newsweb/na/',
  '朝日新聞': 'https://www.asahi.com/senkyo/shuinsen/',
  '読売新聞': 'https://www.yomiuri.co.jp/election/shugiin/',
  '毎日新聞': 'https://mainichi.jp/senkyo/50shu/',
  '日経新聞': 'https://www.nikkei.com/politics/',
  '共同通信': 'https://www.kyodo.co.jp/news/politics/',
  '産経新聞': 'https://www.sankei.com/politics/',
  '時事通信': 'https://www.jiji.com/jc/c?g=pol',
};

const jsonPath = path.join(__dirname, '..', 'data', 'articles.json');
const articles = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let updated = 0;

articles.forEach((a) => {
  const url = MEDIA_TOP_URLS[a.media];
  if (!url) return;
  if (a.link !== url) {
    a.link = url;
    updated++;
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(articles, null, 2), 'utf8');
console.log('Updated', updated, 'article links (political section top only).');
