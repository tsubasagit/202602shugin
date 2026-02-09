/**
 * 2026年2月7日付（最終日）の記事を data/articles.json の先頭に追加
 * 投開票まで1日・期日前投票最終日・公示12日目
 */
const fs = require('fs');
const path = require('path');

const NEW_ARTICLES = [
  { "parties": "all", "media": "NHK", "mediaClass": "purple", "favicon": "https://www.nhk.or.jp/favicon.ico", "date": "2026年2月7日", "title": "衆院選 あす8日投開票 各党が最後の訴え", "excerpt": "衆院選はあす2月8日が投開票日。7日は選挙戦最終日。与野党が全国で街頭演説を展開し、消費税をめぐる論戦の締めくくりとなった。", "link": "https://news.web.nhk/newsweb/na/", "tags": "投開票、最終日、1日", "政党": "すべて" },
  { "parties": "all", "media": "朝日新聞", "mediaClass": "red", "favicon": "https://www.asahi.com/favicon.ico", "date": "2026年2月7日", "title": "衆院選 あす投開票 食料品免税vs減税 有権者に最終選択呼びかけ", "excerpt": "投開票はあす8日。最終日の7日、自民は食料品2年間免税、野党は5%減税や恒久措置を訴え、有権者に最後の選択を呼びかけた。", "link": "https://www.asahi.com/senkyo/shuinsen/", "tags": "消費税、最終日、投開票", "政党": "すべて" },
  { "parties": "all", "media": "読売新聞", "mediaClass": "blue", "favicon": "https://www.yomiuri.co.jp/favicon.ico", "date": "2026年2月7日", "title": "［衆院選２０２６］あす投開票 消費税・経済で各党が最終訴え", "excerpt": "2月8日が投開票日。選挙戦最終日の7日、与野党が街頭で消費税や経済政策を最後に訴えた。", "link": "https://www.yomiuri.co.jp/election/shugiin/", "tags": "あす投開票、最終日、消費税", "政党": "すべて" },
  { "parties": "all", "media": "毎日新聞", "mediaClass": "green", "favicon": "https://mainichi.jp/favicon.ico", "date": "2026年2月7日", "title": "衆院選2026 期日前投票 本日7日が最終日", "excerpt": "期日前投票は7日が最終日。有権者が投票所に足を運んでいる。身分証のみで投票可能。あす8日は本投票。", "link": "https://mainichi.jp/senkyo/50shu/", "tags": "期日前投票、最終日", "政党": "すべて" },
  { "parties": "all", "media": "日経新聞", "mediaClass": "indigo", "favicon": "https://www.nikkei.com/favicon.ico", "date": "2026年2月7日", "title": "衆院選 あす投開票 市場は与党過半数織り込み", "excerpt": "東京株式市場は7日、衆院選あす投開票を前に与党過半数維持を織り込んだ動き。政策不透明感は限定的との見方。", "link": "https://www.nikkei.com/politics/", "tags": "株価、あす投開票", "政党": "すべて" },
  { "parties": "jimin", "media": "共同通信", "mediaClass": "orange", "favicon": "https://www.kyodo.co.jp/favicon.ico", "date": "2026年2月7日", "title": "自民・高市幹事長 消費税2年間免税で最終訴え 期日前投票も最終呼びかけ", "excerpt": "自民党の高市早苗幹事長は7日、街頭演説で食料品消費税2年間免税を訴え、期日前投票の利用を最後に呼びかけた。", "link": "https://www.kyodo.co.jp/news/politics/", "tags": "自民党、消費税、最終日", "政党": "自民党" },
  { "parties": "ishin", "media": "NHK", "mediaClass": "purple", "favicon": "https://www.nhk.or.jp/favicon.ico", "date": "2026年2月7日", "title": "維新・藤田氏 大阪で改革・経済政策を最終訴え「38議席超えで」", "excerpt": "日本維新の会の藤田文武共同代表は7日、大阪市内で街頭演説し、改革と経済政策で38議席超えを最後に訴えた。", "link": "https://news.web.nhk/newsweb/na/", "tags": "維新、藤田、大阪", "政党": "日本維新の会" },
  { "parties": "chudo", "media": "朝日新聞", "mediaClass": "red", "favicon": "https://www.asahi.com/favicon.ico", "date": "2026年2月7日", "title": "中道改革連合 野田代表「消費税5%減税で庶民の暮らしを」最終訴え", "excerpt": "中道改革連合の野田佳彦代表は7日、街頭で消費税5%減税と社会保障の充実を最後に訴えた。", "link": "https://www.asahi.com/senkyo/shuinsen/", "tags": "中道改革連合、消費税、野田", "政党": "中道改革連合" },
  { "parties": "kokumin", "media": "毎日新聞", "mediaClass": "green", "favicon": "https://mainichi.jp/favicon.ico", "date": "2026年2月7日", "title": "国民・玉木代表「野党で過半数割れを」最終日の訴え", "excerpt": "国民民主党の玉木雄一郎代表は7日、東京都内で街頭演説し、野党連合で与党過半数割れと経済政策を最後に訴えた。", "link": "https://mainichi.jp/senkyo/50shu/", "tags": "国民民主党、玉木代表", "政党": "国民民主党" },
  { "parties": "kyosan", "media": "毎日新聞", "mediaClass": "green", "favicon": "https://mainichi.jp/favicon.ico", "date": "2026年2月7日", "title": "共産・田村委員長「消費税5%減税で庶民の味方に」最終訴え", "excerpt": "日本共産党の田村智子委員長は7日、街頭演説で消費税5%減税と食料品無税化を最後に訴えた。", "link": "https://mainichi.jp/senkyo/50shu/", "tags": "共産党、田村委員長、消費税", "政党": "日本共産党" },
  { "parties": "all", "media": "産経新聞", "mediaClass": "slate", "favicon": "https://www.sankei.com/favicon.ico", "date": "2026年2月7日", "title": "衆院選 選挙戦最終日 期日前投票は本日7日まで", "excerpt": "あす8日投開票。期日前投票は7日が最終日。身分証があれば入場券なしで可能。各党は消費税・経済の争点で最後の街頭を展開。", "link": "https://www.sankei.com/politics/", "tags": "最終日、期日前投票", "政党": "すべて" },
  { "parties": "all", "media": "時事通信", "mediaClass": "amber", "favicon": "https://www.jiji.com/favicon.ico", "date": "2026年2月7日", "title": "衆院選 あす8日投開票 消費税・経済が争点で各党が最終街頭", "excerpt": "衆院選の投開票はあす2月8日。選挙戦最終日の7日、各党が消費税や経済政策を争点に最後の街頭演説を行った。", "link": "https://www.jiji.com/jc/c?g=pol", "tags": "あす投開票、最終日、争点", "政党": "すべて" },
  { "parties": "all", "media": "共同通信", "mediaClass": "orange", "favicon": "https://www.kyodo.co.jp/favicon.ico", "date": "2026年2月7日", "title": "衆院選 期日前投票 本日が最終日 大都市で受け付け", "excerpt": "期日前投票が7日で最終日。東京都心や大阪などで有権者が最後の投票に訪れている。あす8日は本投票。", "link": "https://www.kyodo.co.jp/news/politics/", "tags": "期日前投票、最終日", "政党": "すべて" },
  { "parties": "all", "media": "NHK", "mediaClass": "purple", "favicon": "https://www.nhk.or.jp/favicon.ico", "date": "2026年2月7日", "title": "衆院選 消費税争点に 与野党が最終日の街頭で論戦", "excerpt": "衆院選で消費税が最大の争点。選挙戦最終日の7日、与野党の候補者が街頭で減税や財源論を最後に訴えた。", "link": "https://news.web.nhk/newsweb/na/", "tags": "消費税、最終日、街頭", "政党": "すべて" },
  { "parties": "all", "media": "読売新聞", "mediaClass": "blue", "favicon": "https://www.yomiuri.co.jp/favicon.ico", "date": "2026年2月7日", "title": "衆院選 公示12日目 あす投開票 各党が最終街頭演説", "excerpt": "衆院選公示から12日目。あす8日投開票を前に、7日に与野党の候補者が全国で最後の街頭演説に立った。", "link": "https://www.yomiuri.co.jp/election/shugiin/", "tags": "公示12日目、最終日", "政党": "すべて" },
  { "parties": "all", "media": "朝日新聞", "mediaClass": "red", "favicon": "https://www.asahi.com/favicon.ico", "date": "2026年2月7日", "title": "衆院選 各候補の政策・争点 特設サイトで公開 あす投票へ", "excerpt": "朝日新聞デジタルでは各候補者の政策回答をデータベース化。消費税や社会保障など争点ごとに比較できる。あす8日は投開票。", "link": "https://www.asahi.com/senkyo/shuinsen/", "tags": "候補者アンケート、あす投開票", "政党": "すべて" },
  { "parties": "all", "media": "毎日新聞", "mediaClass": "green", "favicon": "https://mainichi.jp/favicon.ico", "date": "2026年2月7日", "title": "衆院選2026 争点・消費税の解説と各地情勢 あす投開票", "excerpt": "期日前投票は本日最終日。各地の激戦区レポートを随時更新。争点となる消費税率についても解説。あす8日は投開票。", "link": "https://mainichi.jp/senkyo/50shu/", "tags": "ニュース速報、あす投開票", "政党": "すべて" },
  { "parties": "all", "media": "時事通信", "mediaClass": "amber", "favicon": "https://www.jiji.com/favicon.ico", "date": "2026年2月7日", "title": "衆院選 争点・政策と各党動向 政治ニュース速報 あす投開票", "excerpt": "期日前投票の速報値や各党の支持率推移などをデータとともに詳しく報じている。あす8日は投開票日。", "link": "https://www.jiji.com/jc/c?g=pol", "tags": "政治速報、あす投開票", "政党": "すべて" },
  { "parties": "all", "media": "TOKYO MX", "mediaClass": "blue", "favicon": "https://s.mxtv.jp/favicon.ico", "date": "2026年2月7日", "title": "＜首都決戦2026＞期日前投票 本日最終日 都内でも列", "excerpt": "衆院選の期日前投票が7日で最終日。都内の投票所でも有権者の列ができ、入場券がなくても投票可能だと案内している。", "link": "https://s.mxtv.jp/tokyomxplus/mx/article/", "tags": "首都決戦、期日前投票最終日", "政党": "すべて" },
  { "parties": "all", "media": "47NEWS", "mediaClass": "orange", "favicon": "https://www.47news.jp/favicon.ico", "date": "2026年2月7日", "title": "衆院選 期日前投票 本日7日が最終日 手ぶら投票OK あす投開票", "excerpt": "期日前投票は2月7日が最終日。身分証のみで投票できる。あす8日は衆院選の投開票日。", "link": "https://www.47news.jp/", "tags": "手ぶら投票、最終日、あす投開票", "政党": "すべて" },
];

const jsonPath = path.join(__dirname, '..', 'data', 'articles.json');
const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const merged = [...NEW_ARTICLES, ...existing];
fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2), 'utf8');
console.log('Added', NEW_ARTICLES.length, 'articles (2026-02-07 final day). Total:', merged.length);
