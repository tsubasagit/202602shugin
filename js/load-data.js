/**
 * 記事・動画データを別ファイル（JSON）から読み込み、表示する
 * data/articles.json … メディアニュース記事
 * data/videos.json   … 政党YouTube・動画ニュース
 */
(function () {
  var CONFIG = { articlesUrl: 'data/articles.json', videosUrl: 'data/videos.json' };
  var ARTICLE_CLS = { red: 'border-red-600 bg-red-100 text-red-600 bg-red-600 hover:bg-red-700', blue: 'border-blue-600 bg-blue-100 text-blue-600 bg-blue-600 hover:bg-blue-700', purple: 'border-purple-600 bg-purple-100 text-purple-600 bg-purple-600 hover:bg-purple-700', green: 'border-green-600 bg-green-100 text-green-600 bg-green-600 hover:bg-green-700', indigo: 'border-indigo-600 bg-indigo-100 text-indigo-600 bg-indigo-600 hover:bg-indigo-700', orange: 'border-orange-600 bg-orange-100 text-orange-600 bg-orange-600 hover:bg-orange-700', slate: 'border-slate-600 bg-slate-100 text-slate-600 bg-slate-600 hover:bg-slate-700', amber: 'border-amber-600 bg-amber-100 text-amber-600 bg-amber-600 hover:bg-amber-700', gray: 'border-gray-600 bg-gray-100 text-gray-600 bg-gray-600 hover:bg-gray-700' };
  var LATEST_ARTICLES_COUNT = 5;

  function renderArticle(a) {
    var k = a.mediaClass || 'gray';
    var cls = ARTICLE_CLS[k] || ARTICLE_CLS.gray;
    var parts = cls.split(' ');
    var borderCls = 'border-l-4 ' + parts[0];
    var badgeCls = parts[1] + ' ' + parts[2];
    var btnCls = 'text-xs ' + parts[3] + ' text-white px-3 py-1 rounded-lg ' + parts[4] + ' transition-colors duration-200 flex items-center gap-1';
    var fallback = a.media ? a.media.charAt(0) : '?';
    return (
      '<div class="news-item bg-white rounded-xl shadow-medium p-6 ' + borderCls + ' hover:shadow-strong transition-all duration-300 fade-in-on-scroll flex gap-3" data-parties="' + (a.parties || 'all') + '">' +
      '<a href="' + (a.link || '#') + '" target="_blank" rel="noopener noreferrer" class="flex-shrink-0 self-start" aria-label="' + (a.media || '') + ' 政治">' +
      '<img src="' + (a.favicon || '') + '" alt="" class="w-12 h-12 rounded object-cover bg-gray-100 border border-gray-200" width="48" height="48" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling&&this.nextElementSibling.classList.remove(\'hidden\')">' +
      '<span class="hidden w-12 h-12 rounded ' + badgeCls + ' flex items-center justify-center font-bold text-lg">' + fallback + '</span></a>' +
      '<div class="flex-1 min-w-0">' +
      '<div class="flex items-start justify-between mb-3"><div class="flex items-center gap-3 flex-wrap">' +
      '<span class="' + parts[3] + ' text-white px-3 py-1 rounded-lg text-xs font-bold">' + (a.media || '') + '</span>' +
      '<span class="text-sm text-gray-500">' + (a.date || '') + '</span>' +
      (a.政党 ? '<span class="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded" title="フィルター: この記事が表示される政党">' + a.政党 + '</span>' : '') +
      '</div></div>' +
      '<h3 class="text-lg font-bold text-election-navy mb-2">' +
        '<a href="' + (a.link || '#') + '" target="_blank" rel="noopener noreferrer" class="hover:underline" title="' + (a.media || '') + '（政治面・関連ニュース）を開く">' +
          (a.title || '') +
        '</a>' +
      '</h3>' +
      '<p class="text-sm text-gray-700 leading-relaxed mb-2">' + (a.excerpt || '') + '</p>' +
      '<div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">' +
      '<div class="text-xs text-gray-500"><span class="font-semibold">関連:</span> ' + (a.tags || '') + '</div>' +
      '<a href="' + (a.link || '#') + '" target="_blank" rel="noopener noreferrer" class="' + btnCls + '" title="' + (a.media || '') + '（政治面・関連ニュース）を開く"><span>' + (a.media || '') + '（政治面・関連ニュース）を開く</span><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>' +
      '</div></div></div>'
    );
  }

  var BTN_CLS = { blue: 'bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700', green: 'bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700', yellow: 'bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700', orange: 'bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700', purple: 'bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700', red: 'bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700', pink: 'bg-pink-600 text-white px-3 py-1 rounded-lg hover:bg-pink-700', cyan: 'bg-cyan-600 text-white px-3 py-1 rounded-lg hover:bg-cyan-700', amber: 'bg-amber-600 text-white px-3 py-1 rounded-lg hover:bg-amber-700', indigo: 'bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700', teal: 'bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700' };
  function renderPartyVideo(v) {
    var btn = BTN_CLS[v.buttonClass] || BTN_CLS.blue;
    var hasId = v.videoId;
    var link = hasId ? 'https://www.youtube.com/watch?v=' + v.videoId : (v.channelUrl || '#');
    var linkLabel = hasId ? 'YouTube' : '公式チャンネル';
    var card =
      '<div class="news-item bg-gray-50 rounded-xl p-4" data-parties="' + (v.parties || 'all') + '">' +
      '<div class="flex items-center justify-between mb-2">' +
      '<div class="font-bold text-election-navy">' +
      (v.party || '') +
      '</div>' +
      '<a class="text-xs ' +
      btn +
      ' px-3 py-1 rounded-lg hover:opacity-90 transition-colors" href="' +
      link +
      '" target="_blank" rel="noopener noreferrer">' +
      linkLabel +
      '</a>' +
      '</div>';
    if (hasId) {
      card +=
        '<div class="lite-yt" data-video-id="' +
        v.videoId +
        '" data-parties="' +
        (v.parties || '') +
        '">' +
        '<button type="button" aria-label="YouTubeを再生">' +
        '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>' +
        '</button></div>';
    }
    card += '<p class="text-xs text-gray-600 mt-2">' + (v.caption || '') + '</p></div>';
    return card;
  }

  function renderNewsVideo(n) {
    var labelClass = n.labelClass || 'purple';
    var base =
      '<div class="news-item bg-white rounded-xl shadow-medium p-4 border-l-4 border-' +
      labelClass +
      '-600 hover:shadow-strong transition-all duration-300 fade-in-on-scroll" data-parties="' +
      (n.parties || 'all') +
      '">' +
      '<div class="flex items-center gap-2 mb-3">' +
      '<span class="bg-' +
      labelClass +
      '-600 text-white px-2 py-1 rounded text-xs font-bold">' +
      (n.label || '') +
      '</span>' +
      '<span class="text-xs text-gray-500">' +
      (n.sub || '') +
      '</span></div>' +
      '<h4 class="text-base font-bold text-election-navy mb-2">' +
      (n.title || '') +
      '</h4>';
    if (n.type === 'embed' && n.videoId) {
      base +=
        '<div class="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-100">' +
        '<iframe class="w-full h-full" src="https://www.youtube.com/embed/' +
        n.videoId +
        '" title="' +
        (n.title || '') +
        '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
      base +=
        '<a href="https://www.youtube.com/watch?v=' +
        n.videoId +
        '" target="_blank" rel="noopener noreferrer" class="text-xs text-' +
        labelClass +
        '-600 hover:opacity-80 flex items-center gap-1"><span>YouTubeで見る</span>' +
        '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>';
    } else if (n.url) {
      base +=
        '<div class="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-4">' +
        '<a href="' +
        n.url +
        '" target="_blank" rel="noopener noreferrer" class="text-center text-' +
        labelClass +
        '-600 hover:text-' +
        labelClass +
        '-700 font-semibold">' +
        (n.linkText || n.title) +
        '<br><span class="text-sm">' +
        (n.sub || '') +
        '</span></a></div>';
      base +=
        '<a href="' +
        n.url +
        '" target="_blank" rel="noopener noreferrer" class="text-xs text-' +
        labelClass +
        '-600 hover:opacity-80 flex items-center gap-1"><span>' +
        (n.linkText || '視聴する') +
        '</span>' +
        '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>';
    }
    base += '</div>';
    return base;
  }

  function renderEvaluatorVideo(e) {
    var labelClass = e.labelClass || 'purple';
    var title = e.title || (e.evaluator + ' 動画・討論');
    var url = e.url || (e.videoId ? 'https://www.youtube.com/watch?v=' + e.videoId : '#');
    var linkText = e.linkText || e.evaluator;
    var sub = e.sub || '';
    var card =
      '<div class="news-item bg-white rounded-xl shadow-medium p-4 border-l-4 border-' +
      labelClass +
      '-600 hover:shadow-strong transition-all duration-300 fade-in-on-scroll" data-parties="all">' +
      '<div class="flex items-center gap-2 mb-3">' +
      '<span class="bg-' + labelClass + '-600 text-white px-2 py-1 rounded text-xs font-bold">' + (e.evaluator || e.label || '') + '</span>' +
      (sub ? '<span class="text-xs text-gray-500">' + sub + '</span>' : '') +
      '</div>' +
      '<h4 class="text-base font-bold text-election-navy mb-2">' + title + '</h4>';
    if (e.type === 'embed' && e.videoId) {
      card +=
        '<div class="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-100">' +
        '<iframe class="w-full h-full" src="https://www.youtube.com/embed/' + e.videoId + '" title="' + title + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
    } else {
      card +=
        '<div class="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-4">' +
        '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="text-center text-' + labelClass + '-600 hover:text-' + labelClass + '-700 font-semibold">' + linkText + '</a></div>';
    }
    card +=
      '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="text-xs text-' + labelClass + '-600 hover:opacity-80 flex items-center gap-1"><span>' + linkText + '</span>' +
      '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>' +
      '</div>';
    return card;
  }

  /** 記事の date 文字列（例: 2026年1月28日 / 2026年1月27日 朝刊）をタイムスタンプに変換。比較用。 */
  function parseArticleDate(article) {
    var dateText = article && article.date ? String(article.date).split(' ')[0] : '';
    var m = dateText.match(/(\d+)年(\d+)月(\d+)日/);
    if (!m) return null;
    var y = parseInt(m[1], 10);
    var mo = parseInt(m[2], 10);
    var d = parseInt(m[3], 10);
    if (!y || !mo || !d) return null;
    return new Date(y, mo - 1, d).getTime();
  }

  function run() {
    var newsEl = document.getElementById('news-container');
    var newsAllEl = document.getElementById('news-articles-list');
    var partyGrid = document.getElementById('party-youtube-grid');
    var partyVideosInNews = document.getElementById('party-videos-in-news');
    var newsVideosGrid = document.getElementById('news-videos-grid');
    var evaluatorVideosGrid = document.getElementById('evaluator-videos-grid');
    var videosList = document.getElementById('news-videos-list');
    var evaluatorVideosList = document.getElementById('evaluator-videos-list');

    Promise.all([
      fetch(CONFIG.articlesUrl).then(function (r) { return r.ok ? r.json() : []; }),
      fetch(CONFIG.videosUrl).then(function (r) { return r.ok ? r.json() : { partyVideos: [], newsVideos: [], evaluatorVideos: [] }; })
    ]).then(function (results) {
      var articles = results[0] || [];
      var videos = results[1] || {};
      var partyVideos = videos.partyVideos || [];
      var newsVideos = videos.newsVideos || [];
      var evaluatorVideos = videos.evaluatorVideos || [];

      // 最新日付（トップ表示用）を一度だけ計算
      var maxTime = null;
      for (var i = 0; i < articles.length; i++) {
        var t = parseArticleDate(articles[i]);
        if (t != null && (maxTime === null || t > maxTime)) maxTime = t;
      }

      function matchesParty(article, partyCode) {
        if (!partyCode || partyCode === 'all') return true;
        var p = (article && article.parties ? String(article.parties) : '').trim();
        if (!p) return false;
        // "jimin ishin" のようなスペース区切りにも対応
        return p === partyCode || p.indexOf(partyCode) >= 0;
      }

      // トップのニュース（#news-container）を、最新日付×政党フィルターで再描画する関数を公開
      function renderTopNews(partyCode) {
        if (!newsEl) return;
        var latest = [];
        if (maxTime != null) {
          for (var j = 0; j < articles.length && latest.length < LATEST_ARTICLES_COUNT; j++) {
            if (parseArticleDate(articles[j]) === maxTime && matchesParty(articles[j], partyCode)) {
              latest.push(articles[j]);
            }
          }
        }
        newsEl.innerHTML = latest.length
          ? latest.map(renderArticle).join('')
          : '<p class="text-gray-500 text-center py-8">選択された政党に関連する最新記事はありません。</p>';
      }
      window.__renderTopNews = renderTopNews;

      // 初回は「すべて」でトップを描画
      if (newsEl) renderTopNews('all');

      if (newsAllEl) {
        newsAllEl.innerHTML = articles.length ? articles.map(renderArticle).join('') : '<p class="text-gray-500 text-center py-8">記事はありません。</p>';
      }
      if (partyGrid) {
        partyGrid.innerHTML = partyVideos.map(renderPartyVideo).join('');
      }
      if (partyVideosInNews) {
        partyVideosInNews.innerHTML = partyVideos.map(renderPartyVideo).join('');
      }
      if (newsVideosGrid) {
        newsVideosGrid.innerHTML = newsVideos.map(renderNewsVideo).join('');
      }
      if (evaluatorVideosGrid) {
        evaluatorVideosGrid.innerHTML = evaluatorVideos.map(renderEvaluatorVideo).join('');
      }
      if (videosList) {
        videosList.innerHTML = partyVideos.map(renderPartyVideo).join('');
      }
      if (evaluatorVideosList) {
        evaluatorVideosList.innerHTML = evaluatorVideos.map(renderEvaluatorVideo).join('');
      }

      if (typeof window.reinitLiteYouTube === 'function') {
        window.reinitLiteYouTube();
      }
    }).catch(function () {
      if (newsEl) newsEl.innerHTML = '<p class="text-gray-500 text-center py-8">記事の読み込みに失敗しました。</p>';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
