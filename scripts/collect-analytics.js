/**
 * アナリティクスデータ収集スクリプト
 * 
 * このスクリプトは、サイトのアナリティクスデータを収集してリポジトリに保存します。
 * GitHub Actionsから実行されることを想定しています。
 */

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

// GitHub API クライアントの初期化
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_REPOSITORY_OWNER || 'tsubasagit';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'shuinsen2026';

// 今日の日付を取得
const today = new Date();
const dateStr = today.toISOString().split('T')[0];
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');

// アナリティクスデータのディレクトリ構造
const analyticsDir = path.join('analytics', String(year), month);
const filePath = path.join(analyticsDir, `analytics_${dateStr}.json`);

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(analyticsDir)) {
  fs.mkdirSync(analyticsDir, { recursive: true });
}

// アナリティクスデータのテンプレート
const analyticsData = {
  date: dateStr,
  timestamp: today.toISOString(),
  source: 'github-actions',
  note: 'このデータはGitHub Actionsによって自動生成されました。実際のアナリティクスデータは、サイトのlocalStorageから取得する必要があります。',
  data: {
    pageviews: 0,
    sessions: 0,
    tabViews: {},
    dailyViews: {},
    hourlyViews: {}
  }
};

// 既存のデータがある場合は読み込む
if (fs.existsSync(filePath)) {
  try {
    const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    analyticsData.data = existingData.data || analyticsData.data;
  } catch (error) {
    console.error('Error reading existing data:', error);
  }
}

// データを保存
fs.writeFileSync(filePath, JSON.stringify(analyticsData, null, 2), 'utf8');
console.log(`✅ Analytics data saved to ${filePath}`);

// リポジトリにコミット
async function commitToRepo() {
  try {
    // ファイルの内容を読み込む
    const content = fs.readFileSync(filePath, 'utf8');
    const contentBase64 = Buffer.from(content).toString('base64');
    
    // ファイルが既に存在するか確認
    let sha = null;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: filePath
      });
      sha = data.sha;
    } catch (error) {
      // ファイルが存在しない場合は新規作成
      console.log('📝 File does not exist, creating new file');
    }
    
    // ファイルをコミット
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `📊 Daily analytics update: ${dateStr}`,
      content: contentBase64,
      sha: sha,
      branch: 'main'
    });
    
    console.log(`✅ Successfully committed analytics data for ${dateStr}`);
  } catch (error) {
    console.error('❌ Error committing to repository:', error);
    throw error;
  }
}

// メイン処理
commitToRepo().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
