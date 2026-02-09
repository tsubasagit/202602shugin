/**
 * 2026年1月31日付の記事を data/articles.json の先頭に追加
 */
const fs = require('fs');
const path = require('path');

const NEW_ARTICLES = [
  { "parties": "all", "media": "NHK", "mediaClass": "purple", "favicon": "https://www.nhk.or.jp/favicon.ico", "date": "2026年1月31日", "title": "衆院選 期日前投票3日目 週末で投票所に列", "excerpt": "期日前投票が31日で3日目。土曜を控え、有権者が投票所に足を運んでいる。入場券が届いていなくても身分証で投票可能。", "link": "https://news.web.nhk/newsweb/na/", "tags": "期日前投票、3日目", "政党": "すべて" },
  { "parties": "all", "media": "朝日新聞", "mediaClass": "red", "favicon": "https://www.asahi.com/favicon.ico", "date": "2026年1月31日", "title": "衆院選 投開票まで8日 土日も期日前投票受付", "excerpt": "期日前投票は31日も全国で実施。土日も開設する投票所が多く、週末の投票を呼びかけている。", "link": "https://www.asahi.com/senkyo/shuinsen/", "tags": "期日前投票、土日", "政党": "すべて" },
  { "parties": "all", "media": "読売新聞", "mediaClass": "blue", "favicon": "https://www.yomiuri.co.jp/favicon.ico", "date": "2026年1月31日", "title": "［衆院選２０２６］投開票まで8日 各党が終盤戦へ", "excerpt": "衆院選の投開票日2月8日まであと8日。与野党が街頭演説で有権者に支持を訴え、選挙戦は終盤へ向かう。", "link": "https://www.yomiuri.co.jp/election/shugiin/", "tags": "投開票まで8日、終盤戦", "政党": "すべて" },
  { "parties": "all", "media": "毎日新聞", "mediaClass": "green", "favicon": "https://mainichi.jp/favicon.ico", "date": "2026年1月31日", "title": "衆院選2026 期日前投票 身分証のみで可 31日も順調", "excerpt": "期日前投票は入場券が届いていなくても、運転免許証やマイナンバーカードなどで投票できる。31日も受け付け順調。", "link": "https://mainichi.jp/senkyo/50shu/", "tags": "手ぶら投票、身分証", "政党": "すべて" },
  { "parties": "all", "media": "日経新聞", "mediaClass": "indigo", "favicon": "https://www.nikkei.com/favicon.ico", "date": "2026年1月31日", "title": "衆院選 市場は与党過半数織り込み 株価は小幅圏内", "excerpt": "東京株式市場は31日、衆院選で与党過半数維持を織り込んだ小幅な動き。投開票まで8日、政策不透明感は限定的との見方。", "link": "https://www.nikkei.com/politics/", "tags": "株価、与党過半数", "政党": "すべて" },
  { "parties": "jimin", "media": "共同通信", "mediaClass": "orange", "favicon": "https://www.kyodo.co.jp/favicon.ico", "date": "2026年1月31日", "title": "自民 高市幹事長「期日前投票にぜひ」週末も街頭", "excerpt": "自民党の高市早苗幹事長は31日、街頭演説で期日前投票の利用を呼びかけた。週末も各地で訴えを続ける。", "link": "https://www.kyodo.co.jp/news/politics/", "tags": "自民党、期日前投票", "政党": "自民党" },
  { "parties": "ishin", "media": "NHK", "mediaClass": "purple", "favicon": "https://www.nhk.or.jp/favicon.ico", "date": "2026年1月31日", "title": "維新 藤田共同代表「38議席超えで改革」大阪で訴え", "excerpt": "日本維新の会の藤田文武共同代表は31日、大阪市内で街頭演説し、前回38議席を上回る獲得で改革を進めると訴えた。", "link": "https://news.web.nhk/newsweb/na/", "tags": "維新、藤田、大阪", "政党": "日本維新の会" },
  { "parties": "all", "media": "産経新聞", "mediaClass": "slate", "favicon": "https://www.sankei.com/favicon.ico", "date": "2026年1月31日", "title": "衆院選 期日前投票 入場券遅れでも「手ぶらでOK」", "excerpt": "急な解散で入場券の郵送が遅れている地域があるが、選管は身分証があれば投票可能だと説明。有権者に周知を図る。", "link": "https://www.sankei.com/politics/", "tags": "手ぶら投票、入場券", "政党": "すべて" },
  { "parties": "all", "media": "時事通信", "mediaClass": "amber", "favicon": "https://www.jiji.com/favicon.ico", "date": "2026年1月31日", "title": "衆院選 投開票まで8日 期日前投票は2月7日まで", "excerpt": "衆院選の投開票は2月8日。期日前投票は2月7日まで。有権者は公示翌日から投票できる。", "link": "https://www.jiji.com/jc/c?g=pol", "tags": "8日、期日前投票", "政党": "すべて" },
  { "parties": "kokumin", "media": "朝日新聞", "mediaClass": "red", "favicon": "https://www.asahi.com/favicon.ico", "date": "2026年1月31日", "title": "国民・玉木代表「野党連合で過半数割れを」東京で訴え", "excerpt": "国民民主党の玉木雄一郎代表は31日、東京都内で街頭演説し、野党連合で与党過半数割れを実現すると訴えた。", "link": "https://www.asahi.com/senkyo/shuinsen/", "tags": "国民民主党、玉木代表", "政党": "国民民主党" },
  { "parties": "kyosan", "media": "毎日新聞", "mediaClass": "green", "favicon": "https://mainichi.jp/favicon.ico", "date": "2026年1月31日", "title": "共産・田村委員長「消費税5%減税で庶民の味方に」", "excerpt": "日本共産党の田村智子委員長は31日、街頭演説で消費税5%減税と食料品無税化を訴えた。", "link": "https://mainichi.jp/senkyo/50shu/", "tags": "共産党、田村委員長", "政党": "日本共産党" },
  { "parties": "all", "media": "NHK", "mediaClass": "purple", "favicon": "https://www.nhk.or.jp/favicon.ico", "date": "2026年1月31日", "title": "衆院選 消費税争点に 与野党が街頭で論戦", "excerpt": "衆院選で消費税が最大の争点となっている。31日も与野党の候補者が街頭で減税や財源論を訴えた。", "link": "https://news.web.nhk/newsweb/na/", "tags": "消費税、街頭論戦", "政党": "すべて" },
  { "parties": "all", "media": "読売新聞", "mediaClass": "blue", "favicon": "https://www.yomiuri.co.jp/favicon.ico", "date": "2026年1月31日", "title": "衆院選 公示5日目 各党が全国で街頭演説", "excerpt": "衆院選公示から5日目の31日、与野党の候補者が全国で街頭演説に立ち、有権者に支持を訴えた。", "link": "https://www.yomiuri.co.jp/election/shugiin/", "tags": "公示5日目、街頭", "政党": "すべて" },
  { "parties": "all", "media": "共同通信", "mediaClass": "orange", "favicon": "https://www.kyodo.co.jp/favicon.ico", "date": "2026年1月31日", "title": "衆院選 期日前投票 大都市で受け付け順調", "excerpt": "期日前投票が31日も東京都心や大阪などで実施。有権者が次々と投票に訪れ、受け付けは順調に進んでいる。", "link": "https://www.kyodo.co.jp/news/politics/", "tags": "期日前投票、大都市", "政党": "すべて" },
  { "parties": "all", "media": "TOKYO MX", "mediaClass": "blue", "favicon": "https://s.mxtv.jp/favicon.ico", "date": "2026年1月31日", "title": "＜首都決戦2026＞期日前投票3日目 都内でも列", "excerpt": "衆院選の期日前投票が31日で3日目。都内の投票所でも有権者の列ができ、入場券がなくても投票可能だと案内している。", "link": "https://s.mxtv.jp/tokyomxplus/mx/article/", "tags": "首都決戦、期日前投票", "政党": "すべて" },
  { "parties": "jimin", "media": "NHK", "mediaClass": "purple", "favicon": "https://www.nhk.or.jp/favicon.ico", "date": "2026年1月31日", "title": "自民 全小選挙区で候補者 過半数維持へ総力戦", "excerpt": "自民党は全289小選挙区に候補者を擁立。与党で過半数233議席の維持を目指し、選挙戦に臨む。", "link": "https://news.web.nhk/newsweb/na/", "tags": "自民党、全小選挙区", "政党": "自民党" },
  { "parties": "all", "media": "47NEWS", "mediaClass": "orange", "favicon": "https://www.47news.jp/favicon.ico", "date": "2026年1月31日", "title": "衆院選 期日前投票 入場券なし「手ぶら投票」対応広がる", "excerpt": "公示が急だったため入場券の郵送が遅れている自治体が複数。選管は身分証のみで投票できるよう呼びかけを強化。", "link": "https://www.47news.jp/", "tags": "手ぶら投票、入場券", "政党": "すべて" },
  { "parties": "all", "media": "朝日新聞", "mediaClass": "red", "favicon": "https://www.asahi.com/favicon.ico", "date": "2026年1月31日", "title": "衆院選 候補者アンケート・情勢 特設サイトで公開", "excerpt": "朝日新聞デジタルでは各候補者の政策回答をデータベース化。有権者の判断材料を提供している。", "link": "https://www.asahi.com/senkyo/shuinsen/", "tags": "候補者アンケート", "政党": "すべて" },
  { "parties": "all", "media": "毎日新聞", "mediaClass": "green", "favicon": "https://mainichi.jp/favicon.ico", "date": "2026年1月31日", "title": "衆院選2026 記事一覧・ニュース速報", "excerpt": "期日前投票の様子や各地の激戦区レポートを随時更新。争点となる消費税率についても解説。", "link": "https://mainichi.jp/senkyo/50shu/", "tags": "ニュース速報", "政党": "すべて" },
  { "parties": "all", "media": "時事通信", "mediaClass": "amber", "favicon": "https://www.jiji.com/favicon.ico", "date": "2026年1月31日", "title": "衆院選 政治ニュース速報", "excerpt": "期日前投票の速報値や各党の支持率推移などをデータとともに詳しく報じている。", "link": "https://www.jiji.com/jc/c?g=pol", "tags": "政治速報", "政党": "すべて" },
];

const jsonPath = path.join(__dirname, '..', 'data', 'articles.json');
const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const merged = [...NEW_ARTICLES, ...existing];
fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2), 'utf8');
console.log('Added', NEW_ARTICLES.length, 'articles (2026-01-31). Total:', merged.length);
