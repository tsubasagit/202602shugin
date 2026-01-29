/**
 * 記事の link を「表示タイトルに近い実在記事URL」に揃える
 * タイトル・要約・タグと遷移先の記事内容が一致するよう、キーワードで最適なURLを割り当てる
 */
const fs = require('fs');
const path = require('path');

// 各メディアの実在URLと、その記事の内容を示すキーワード（表示タイトルと一致させやすくするため）
const URL_WITH_KEYWORDS = {
  'NHK': [
    { url: 'https://news.web.nhk/newsweb/na/na-k10015032821000', keywords: ['期日前投票', '投票', '総務省', '選管', '入場券'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015032271000', keywords: ['衆議院', '解散', '総選挙', '与野党', '公約', '公示'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015030631000', keywords: ['高市首相', '衆院解散', '新党', '中道改革連合'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015032631000', keywords: ['立民', '野田代表', '中道', '政界再編'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015032841000', keywords: ['警察庁', '衆院選', '立候補', '公示', '1285'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015032781000', keywords: ['官房長官', '選挙', '偽情報', 'SNS'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015032481000', keywords: ['高市首相動静', '藤田', '維新', '38議席'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015031731000', keywords: ['自民', '財政', '食料品', '消費税', '争点', '公約'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015031351000', keywords: ['衆院選', '与野党', '準備', '候補', '擁立', '公約'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015030591000', keywords: ['衆議院解散', '高市首相', '維新', '比例', '関西'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015032371000', keywords: ['受刑者', '選挙権', '最高裁', '比例代表', '11ブロック', '176'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015026921000', keywords: ['衆院解散', '背景', '消費税', '与野党', '公約'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015019931000', keywords: ['高市政権', '与野党', '共産党', '大企業', '課税'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015019151000', keywords: ['予算', '財政規律', '公示', '最終調整'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015031631000', keywords: ['高市首相', '予算編成', '解散', '期日前投票', '公示翌日'] },
    { url: 'https://news.web.nhk/newsweb/na/na-k10015032121000', keywords: ['立民', '中道改革連合', 'ロゴ', 'SNS', '公示', '届出'] },
  ],
  '朝日新聞': [
    { url: 'https://www.asahi.com/articles/DA3S16387536.html', keywords: ['衆院選', '候補者', '女性', '24.4', '過去最高', '中道', '公認', '詳報', '解散', '詔書'] },
    { url: 'https://www.asahi.com/senkyo/shuinsen/', keywords: ['衆院選', '特設', '期日前投票', '国民', '玉木', '野党連合', '維新', '自民', '高市'] },
  ],
  '読売新聞': [
    { url: 'https://www.yomiuri.co.jp/election/shugiin/20241027-OYT1T50003/', keywords: ['議席', '過半数', '立候補', '1200', '1285', '締め切り', '比例'] },
    { url: 'https://www.yomiuri.co.jp/election/shugiin/20241028-OYT1T50196/', keywords: ['展望', '識者', '公示', '街頭', '小選挙区', '立候補'] },
    { url: 'https://www.yomiuri.co.jp/election/shugiin/20241016-OYT1T50164/', keywords: ['過半数', '情勢調査', '自民', '全小選挙区', '公約', '消費税'] },
    { url: 'https://www.yomiuri.co.jp/election/shugiin/', keywords: ['衆院選', '期日前投票', '29日', '減税', '公示'] },
  ],
  '毎日新聞': [
    { url: 'https://mainichi.jp/senkyo/50shu/', keywords: ['衆院選', '50回', '期日前投票', '公示', '争点', '責任ある政党'] },
    { url: 'https://mainichi.jp/articles/20250807/ddw/090/010/006000c', keywords: ['共産党', '田村', '消費税', '過半数', '街頭', '公示翌日'] },
    { url: 'https://mainichi.jp/seiji/', keywords: ['政治', '維新', '藤田', '自民', '国民', '玉木', '野党'] },
  ],
  '日経新聞': [
    { url: 'https://www.nikkei.com/politics/', keywords: ['衆院選', '政治', '消費税', '公示', '市場', '財源', '短期決戦'] },
  ],
  '共同通信': [
    { url: 'https://www.kyodo.co.jp/news/politics/', keywords: ['衆院選', '政治', '期日前投票', '高市首相', '自民', '国民', '共産'] },
  ],
  '産経新聞': [
    { url: 'https://www.sankei.com/politics/', keywords: ['衆院選', '政治', '期日前投票', '公示', '消費税', '過半数'] },
  ],
  '時事通信': [
    { url: 'https://www.jiji.com/jc/c?g=pol', keywords: ['衆院選', '政治', '期日前投票', '公示', '投開票'] },
  ],
};

function scoreMatch(articleText, item) {
  let score = 0;
  const lower = articleText;
  for (const kw of item.keywords) {
    if (lower.includes(kw)) score += 1;
  }
  return score;
}

const jsonPath = path.join(__dirname, '..', 'data', 'articles.json');
const articles = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let updated = 0;

articles.forEach((a) => {
  const list = URL_WITH_KEYWORDS[a.media];
  if (!list || list.length === 0) return;

  const text = [a.title, a.excerpt, a.tags].filter(Boolean).join(' ');
  let best = { url: list[0].url, score: scoreMatch(text, list[0]) };

  for (let i = 1; i < list.length; i++) {
    const s = scoreMatch(text, list[i]);
    if (s > best.score) best = { url: list[i].url, score: s };
  }

  if (a.link !== best.url) {
    a.link = best.url;
    updated++;
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(articles, null, 2), 'utf8');
console.log('Updated', updated, 'article links (title/topic matching).');
