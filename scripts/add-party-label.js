/**
 * data/articles.json の各記事に「政党」プロパティを追加する
 * parties（フィルター用コード）から日本語の表示名を生成
 */
const fs = require('fs');
const path = require('path');

// parties コード → 日本語表示名（フィルター・表示用）
const PARTY_LABELS = {
  all: 'すべて',
  jimin: '自民党',
  chudo: '中道改革連合',
  rikken: '立憲民主党',
  komei: '公明党',
  ishin: '日本維新の会',
  kokumin: '国民民主党',
  kyosan: '日本共産党',
  mirai: 'チームみらい',
};
// 複合コードの表示名（スペース区切りで複数政党）
const COMPOUND_LABELS = {
  'jimin ishin': '自民・維新',
  'chudo rikken komei': '中道・立憲・公明',
};

function partiesToLabel(partiesStr) {
  const s = (partiesStr || 'all').trim();
  if (COMPOUND_LABELS[s]) return COMPOUND_LABELS[s];
  const codes = s.split(/\s+/).filter(Boolean);
  if (codes.length === 0) return PARTY_LABELS.all;
  if (codes.length === 1) return PARTY_LABELS[codes[0]] || s;
  return codes.map((c) => PARTY_LABELS[c] || c).join('・');
}

const jsonPath = path.join(__dirname, '..', 'data', 'articles.json');
const articles = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

articles.forEach((a) => {
  a.政党 = partiesToLabel(a.parties);
});

fs.writeFileSync(jsonPath, JSON.stringify(articles, null, 2), 'utf8');
console.log('Added "政党" to', articles.length, 'articles.');
