/**
 * 2026年2月2日付の記事を data/articles.json の先頭に追加
 */
const fs = require('fs');
const path = require('path');

const NEW_ARTICLES = [
  { "parties": "all", "media": "NHK", "mediaClass": "purple", "favicon": "https://www.nhk.or.jp/favicon.ico", "date": "2026年2月2日", "title": "衆院選 投開票まで6日 消費税争点に終盤戦", "excerpt": "衆院選は2月8日投開票まであと6日。2日も与野党が全国で街頭演説を展開し、消費税の免税・減税をめぐる論戦が激化している。", "link": "https://news.web.nhk/newsweb/na/", "tags": "消費税、終盤戦、6日", "政党": "すべて" },
  { "parties": "all", "media": "朝日新聞", "mediaClass": "red", "favicon": "https://www.asahi.com/favicon.ico", "date": "2026年2月2日", "title": "衆院選 食料品免税vs減税 各党が政策で街頭訴え", "excerpt": "投開票まで6日。自民は食料品2年間免税、野党は5%減税や恒久措置を訴え、有権者に選択を呼びかけている。", "link": "https://www.asahi.com/senkyo/shuinsen/", "tags": "消費税、食料品、政策", "政党": "すべて" },
  { "parties": "all", "media": "読売新聞", "mediaClass": "blue", "favicon": "https://www.yomiuri.co.jp/favicon.ico", "date": "2026年2月2日", "title": "［衆院選２０２６］投開票まで6日 消費税・経済で各党が終盤戦", "excerpt": "2月8日投開票まであと6日。与野党が街頭で消費税や経済政策を訴え、選挙戦は終盤へ。", "link": "https://www.yomiuri.co.jp/election/shugiin/", "tags": "6日、終盤戦、消費税", "政党": "すべて" },
  { "parties": "all", "media": "毎日新聞", "mediaClass": "green", "favicon": "https://mainichi.jp/favicon.ico", "date": "2026年2月2日", "title": "衆院選2026 期日前投票5日目 月曜も投票所に列", "excerpt": "期日前投票が2日で5日目。月曜も有権者が投票所に足を運んでいる。身分証のみで投票可能。", "link": "https://mainichi.jp/senkyo/50shu/", "tags": "期日前投票、5日目", "政党": "すべて" },
  { "parties": "all", "media": "日経新聞", "mediaClass": "indigo", "favicon": "https://www.nikkei.com/favicon.ico", "date": "2026年2月2日", "title": "衆院選 市場は与党過半数織り込み 株価は小幅圏内", "excerpt": "東京株式市場は2日、衆院選で与党過半数維持を織り込んだ動き。投開票まで6日、政策不透明感は限定的との見方。", "link": "https://www.nikkei.com/politics/", "tags": "株価、与党過半数", "政党": "すべて" },
  { "parties": "jimin", "media": "共同通信", "mediaClass": "orange", "favicon": "https://www.kyodo.co.jp/favicon.ico", "date": "2026年2月2日", "title": "自民・高市幹事長 消費税2年間免税で街頭訴え 期日前投票も呼びかけ", "excerpt": "自民党の高市早苗幹事長は2日、街頭演説で食料品消費税2年間免税を訴え、期日前投票の利用も呼びかけた。", "link": "https://www.kyodo.co.jp/news/politics/", "tags": "自民党、消費税、期日前", "政党": "自民党" },
  { "parties": "ishin", "media": "NHK", "mediaClass": "purple", "favicon": "https://www.nhk.or.jp/favicon.ico", "date": "2026年2月2日", "title": "維新・藤田氏 大阪で改革・経済政策を訴え「38議席超えで」", "excerpt": "日本維新の会の藤田文武共同代表は2日、大阪市内で街頭演説し、改革と経済政策で38議席超えを訴えた。", "link": "https://news.web.nhk/newsweb/na/", "tags": "維新、藤田、大阪", "政党": "日本維新の会" },
  { "parties": "chudo", "media": "朝日新聞", "mediaClass": "red", "favicon": "https://www.asahi.com/favicon.ico", "date": "2026年2月2日", "title": "中道改革連合 野田代表「消費税5%減税で庶民の暮らしを」", "excerpt": "中道改革連合の野田佳彦代表は2日、街頭で消費税5%減税と社会保障の充実を訴えた。", "link": "https://www.asahi.com/senkyo/shuinsen/", "tags": "中道改革連合、消費税、野田", "政党": "中道改革連合" },
  { "parties": "kokumin", "media": "毎日新聞", "mediaClass": "green", "favicon": "https://mainichi.jp/favicon.ico", "date": "2026年2月2日", "title": "国民・玉木代表「野党で過半数割れを」経済政策も訴え", "excerpt": "国民民主党の玉木雄一郎代表は2日、東京都内で街頭演説し、野党連合で与党過半数割れと経済政策を訴えた。", "link": "https://mainichi.jp/senkyo/50shu/", "tags": "国民民主党、玉木代表", "政党": "国民民主党" },
  { "parties": "kyosan", "media": "毎日新聞", "mediaClass": "green", "favicon": "https://mainichi.jp/favicon.ico", "date": "2026年2月2日", "title": "共産・田村委員長「消費税5%減税で庶民の味方に」", "excerpt": "日本共産党の田村智子委員長は2日、街頭演説で消費税5%減税と食料品無税化を訴えた。", "link": "https://mainichi.jp/senkyo/50shu/", "tags": "共産党、田村委員長、消費税", "政党": "日本共産党" },
  { "parties": "all", "media": "産経新聞", "mediaClass": "slate", "favicon": "https://www.sankei.com/favicon.ico", "date": "2026年2月2日", "title": "衆院選 争点の論戦続くなか 期日前投票は手ぶらでもOK", "excerpt": "投開票まで6日。期日前投票は身分証があれば入場券なしで可能。各党は消費税・経済の争点で街頭を展開。", "link": "https://www.sankei.com/politics/", "tags": "期日前、手ぶら投票", "政党": "すべて" },
  { "parties": "all", "media": "時事通信", "mediaClass": "amber", "favicon": "https://www.jiji.com/favicon.ico", "date": "2026年2月2日", "title": "衆院選 投開票まで6日 消費税・経済が争点で各党が街頭", "excerpt": "衆院選の投開票は2月8日。あと6日。各党が消費税や経済政策を争点に街頭演説を続けている。", "link": "https://www.jiji.com/jc/c?g=pol", "tags": "6日、消費税、争点", "政党": "すべて" },
  { "parties": "all", "media": "共同通信", "mediaClass": "orange", "favicon": "https://www.kyodo.co.jp/favicon.ico", "date": "2026年2月2日", "title": "衆院選 期日前投票5日目 大都市で受け付け順調", "excerpt": "期日前投票が2日も東京都心や大阪などで実施。有権者が次々と投票に訪れ、受け付けは順調。", "link": "https://www.kyodo.co.jp/news/politics/", "tags": "期日前投票、大都市", "政党": "すべて" },
  { "parties": "all", "media": "NHK", "mediaClass": "purple", "favicon": "https://www.nhk.or.jp/favicon.ico", "date": "2026年2月2日", "title": "衆院選 消費税争点に 与野党が街頭で論戦", "excerpt": "衆院選で消費税が最大の争点となっている。2日も与野党の候補者が街頭で減税や財源論を訴えた。", "link": "https://news.web.nhk/newsweb/na/", "tags": "消費税、街頭論戦", "政党": "すべて" },
  { "parties": "all", "media": "読売新聞", "mediaClass": "blue", "favicon": "https://www.yomiuri.co.jp/favicon.ico", "date": "2026年2月2日", "title": "衆院選 公示7日目 消費税・経済の争点で各党が街頭演説", "excerpt": "衆院選公示から7日目の2日、与野党の候補者が全国で街頭演説に立ち、消費税や経済政策を訴えた。", "link": "https://www.yomiuri.co.jp/election/shugiin/", "tags": "公示7日目、街頭", "政党": "すべて" },
  { "parties": "all", "media": "朝日新聞", "mediaClass": "red", "favicon": "https://www.asahi.com/favicon.ico", "date": "2026年2月2日", "title": "衆院選 各候補の政策・争点回答 特設サイトで公開", "excerpt": "朝日新聞デジタルでは各候補者の政策回答をデータベース化。消費税や社会保障など争点ごとに比較できる。", "link": "https://www.asahi.com/senkyo/shuinsen/", "tags": "候補者アンケート、政策", "政党": "すべて" },
  { "parties": "all", "media": "毎日新聞", "mediaClass": "green", "favicon": "https://mainichi.jp/favicon.ico", "date": "2026年2月2日", "title": "衆院選2026 争点・消費税の解説と各地情勢", "excerpt": "期日前投票の様子や各地の激戦区レポートを随時更新。争点となる消費税率についても解説。", "link": "https://mainichi.jp/senkyo/50shu/", "tags": "ニュース速報、消費税", "政党": "すべて" },
  { "parties": "all", "media": "時事通信", "mediaClass": "amber", "favicon": "https://www.jiji.com/favicon.ico", "date": "2026年2月2日", "title": "衆院選 争点・政策と各党動向の政治ニュース速報", "excerpt": "期日前投票の速報値や各党の支持率推移などをデータとともに詳しく報じている。", "link": "https://www.jiji.com/jc/c?g=pol", "tags": "政治速報", "政党": "すべて" },
  { "parties": "all", "media": "TOKYO MX", "mediaClass": "blue", "favicon": "https://s.mxtv.jp/favicon.ico", "date": "2026年2月2日", "title": "＜首都決戦2026＞期日前投票5日目 都内でも列", "excerpt": "衆院選の期日前投票が2日で5日目。都内の投票所でも有権者の列ができ、入場券がなくても投票可能だと案内している。", "link": "https://s.mxtv.jp/tokyomxplus/mx/article/", "tags": "首都決戦、期日前投票", "政党": "すべて" },
  { "parties": "all", "media": "47NEWS", "mediaClass": "orange", "favicon": "https://www.47news.jp/favicon.ico", "date": "2026年2月2日", "title": "衆院選 期日前投票 入場券なし「手ぶら投票」対応広がる", "excerpt": "公示が急だったため入場券の郵送が遅れている自治体が複数。選管は身分証のみで投票できるよう呼びかけを強化。", "link": "https://www.47news.jp/", "tags": "手ぶら投票、入場券", "政党": "すべて" },
];

const jsonPath = path.join(__dirname, '..', 'data', 'articles.json');
const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const merged = [...NEW_ARTICLES, ...existing];
fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2), 'utf8');
console.log('Added', NEW_ARTICLES.length, 'articles (2026-02-02). Total:', merged.length);
