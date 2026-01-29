/**
 * 記事の link を各メディアの政治面・ニューストップ（404にならない安定URL）に揃える
 * 参照タイトルはそのまま、URL先のみメディア別の公式一覧ページに統一
 */
const fs = require('fs');
const path = require('path');

const MEDIA_LINKS = {
  'NHK': 'https://www3.nhk.or.jp/news/cat04.html',
  '朝日新聞': 'https://www.asahi.com/politics/',
  '読売新聞': 'https://www.yomiuri.co.jp/politics/',
  '毎日新聞': 'https://mainichi.jp/seiji/',
  '日経新聞': 'https://www.nikkei.com/politics/',
  '共同通信': 'https://www.kyodo.co.jp/news/politics/',
  '産経新聞': 'https://www.sankei.com/politics/',
  '時事通信': 'https://www.jiji.com/jc/c?g=pol'
};

const jsonPath = path.join(__dirname, '..', 'data', 'articles.json');
const articles = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let updated = 0;
articles.forEach(a => {
  const url = MEDIA_LINKS[a.media];
  if (url && a.link !== url) {
    a.link = url;
    updated++;
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(articles, null, 2), 'utf8');
console.log('Updated', updated, 'article links. All links now point to media politics/section top.');
