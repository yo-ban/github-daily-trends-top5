const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

/**
 * 解析結果のMarkdownファイルから11ty用のデータを生成
 */
async function generateSiteData() {
    const siteRoot = path.join(__dirname, '..');
    const dataDir = path.join(siteRoot, 'data');
    
    // data/analysis_YYYY-MM-DD ディレクトリを検索
    const dirs = await fs.readdir(dataDir);
    const analysisDirs = dirs.filter(d => d.startsWith('analysis_')).sort().reverse();
    
    if (analysisDirs.length === 0) {
        console.log('解析データが見つかりません');
        return;
    }
    
    // 各日付のデータを処理
    for (const dir of analysisDirs) {
        const date = dir.replace('analysis_', '');
        const analysisPath = path.join(dataDir, dir);
        
        try {
            // その日のリポジトリファイルを読み込み
            const files = await fs.readdir(analysisPath);
            const repoFiles = files.filter(f => f.match(/^repo_\d+_.*\.md$/));
            
            const repos = [];
            
            for (const file of repoFiles) {
                const content = await fs.readFile(path.join(analysisPath, file), 'utf-8');
                const repoData = parseRepoMarkdown(content, file);
                if (repoData) {
                    repos.push(repoData);
                }
            }
            
            // 日付別のMarkdownファイルを生成
            await generateDatePage(date, repos, siteRoot);
            
            // 各リポジトリの詳細ページを生成
            for (const repo of repos) {
                await generateRepoPage(date, repo, siteRoot);
            }
            
        } catch (error) {
            console.error(`${dir} の処理中にエラー: ${error.message}`);
        }
    }
    
    // グローバルデータファイルを生成
    await generateGlobalData(analysisDirs, dataDir, siteRoot);
}

/**
 * リポジトリのMarkdownを解析
 */
function parseRepoMarkdown(content, filename) {
    const lines = content.split('\n');
    const repo = {
        rank: parseInt(filename.match(/repo_(\d+)_/)[1]),
        slug: filename.replace(/^repo_\d+_/, '').replace('.md', ''),
        content: content
    };
    
    // リポジトリ名を抽出
    const nameMatch = content.match(/# リポジトリ解析: (.+)/);
    if (nameMatch) {
        repo.name = nameMatch[1];
    }
    
    // スター数を抽出
    const starsMatch = content.match(/スター数: ([\d,]+)/);
    if (starsMatch) {
        repo.stars = parseInt(starsMatch[1].replace(/,/g, ''));
    }
    
    // フォーク数を抽出
    const forksMatch = content.match(/フォーク数: ([\d,]+)/);
    if (forksMatch) {
        repo.forks = parseInt(forksMatch[1].replace(/,/g, ''));
    }
    
    // 言語を抽出
    const langMatch = content.match(/主要言語: (.+)/);
    if (langMatch) {
        repo.language = langMatch[1];
    }
    
    // ライセンスを抽出
    const licenseMatch = content.match(/ライセンス: (.+)/);
    if (licenseMatch) {
        repo.license = licenseMatch[1];
    }
    
    // 一言で言うとを抽出（新フォーマット対応）
    const oneLinerMatch = content.match(/### 一言で言うと\r?\n+(.+?)(?=\r?\n###|\r?\n##|\r?\n*$)/s);
    if (oneLinerMatch) {
        repo.summary = oneLinerMatch[1].trim();
    } else {
        // 旧フォーマット対応
        const summaryMatch = content.match(/## 概要\r?\n+(.+?)(?=\r?\n##|\r?\n*$)/s);
        if (summaryMatch) {
            repo.summary = summaryMatch[1].trim().split(/\r?\n/)[0];
        }
    }
    
    // 主な特徴を抽出
    const featuresMatch = content.match(/### 主な特徴\r?\n+((?:- .+\r?\n?)+)/);
    if (featuresMatch) {
        repo.features = featuresMatch[1].trim().split(/\r?\n/).map(f => f.replace(/^- /, ''));
    }
    
    return repo;
}

/**
 * 日付ページを生成
 */
async function generateDatePage(date, repos, siteRoot) {
    const dateDir = path.join(siteRoot, 'src', 'trends', date);
    await fs.mkdir(dateDir, { recursive: true });
    
    const frontmatter = {
        layout: 'date.njk',
        title: `${date} のGitHubトレンド`,
        date: date,
        repos: repos.map(r => ({
            rank: r.rank,
            name: r.name,
            slug: r.slug,
            stars: r.stars,
            language: r.language,
            summary: r.summary
        })),
        tags: ['trend']
    };
    
    const content = `---
layout: ${frontmatter.layout}
title: "${frontmatter.title}"
date: ${frontmatter.date}
repos: ${JSON.stringify(frontmatter.repos, null, 2)}
tags:
${frontmatter.tags.map(tag => `  - ${tag}`).join('\n')}
---

${date} のGitHubトレンドリポジトリ一覧です。`;
    
    await fs.writeFile(path.join(dateDir, 'index.md'), content);
}

/**
 * リポジトリ詳細ページを生成
 */
async function generateRepoPage(date, repo, siteRoot) {
    const repoDir = path.join(siteRoot, 'src', 'trends', date, repo.slug);
    await fs.mkdir(repoDir, { recursive: true });
    
    const frontmatter = {
        layout: 'repo.njk',
        title: repo.name,
        date: date,
        repo: {
            rank: repo.rank,
            name: repo.name,
            slug: repo.slug,
            stars: repo.stars,
            language: repo.language,
            forks: repo.forks || 0,
            license: repo.license || null,
            features: repo.features || []
        },
        tags: ['repo', `lang-${repo.language?.toLowerCase() || 'unknown'}`]
    };
    
    const content = `---
layout: ${frontmatter.layout}
title: "${frontmatter.title}"
date: ${frontmatter.date}
repo:
  rank: ${frontmatter.repo.rank}
  name: "${frontmatter.repo.name}"
  slug: "${frontmatter.repo.slug}"
  stars: ${frontmatter.repo.stars}
  language: "${frontmatter.repo.language}"
  forks: ${frontmatter.repo.forks}
  license: ${frontmatter.repo.license ? `"${frontmatter.repo.license}"` : 'null'}
  features:
${frontmatter.repo.features.map(f => `    - "${f}"`).join('\n') || '    []'}
tags:
${frontmatter.tags.map(tag => `  - ${tag}`).join('\n')}
---

${repo.content}`;
    
    await fs.writeFile(path.join(repoDir, 'index.md'), content);
}

/**
 * グローバルデータを生成
 */
async function generateGlobalData(analysisDirs, dataDir, siteRoot) {
    const eleventyDataDir = path.join(siteRoot, 'src', '_data');
    await fs.mkdir(eleventyDataDir, { recursive: true });
    
    // 最新のトレンドデータ
    if (analysisDirs.length > 0) {
        const latestDate = analysisDirs[0].replace('analysis_', '');
        const latestPath = path.join(dataDir, analysisDirs[0]);
        const files = await fs.readdir(latestPath);
        const repoFiles = files.filter(f => f.match(/^repo_\d+_.*\.md$/));
        
        const latestTrends = [];
        for (const file of repoFiles) {
            const content = await fs.readFile(path.join(latestPath, file), 'utf-8');
            const repoData = parseRepoMarkdown(content, file);
            if (repoData) {
                latestTrends.push({
                    rank: repoData.rank,
                    name: repoData.name,
                    slug: repoData.slug,
                    stars: repoData.stars,
                    language: repoData.language,
                    summary: repoData.summary
                });
            }
        }
        
        // 各日付のリポジトリ数を収集
        const dateRepoCount = {};
        for (const dir of analysisDirs.slice(0, 7)) {
            const date = dir.replace('analysis_', '');
            const analysisPath = path.join(dataDir, dir);
            try {
                const files = await fs.readdir(analysisPath);
                const repoFiles = files.filter(f => f.match(/^repo_\d+_.*\.md$/));
                dateRepoCount[date] = repoFiles.length;
            } catch (error) {
                dateRepoCount[date] = 0;
            }
        }
        
        const trendsData = {
            latestDate: latestDate,
            latestTrends: latestTrends,
            recentDates: analysisDirs.slice(0, 7).map(d => d.replace('analysis_', '')),
            dateRepoCount: dateRepoCount
        };
        
        await fs.writeFile(
            path.join(eleventyDataDir, 'trends.json'),
            JSON.stringify(trendsData, null, 2)
        );
    }
}

// 実行
if (require.main === module) {
    generateSiteData()
        .then(() => console.log('サイトデータの生成が完了しました'))
        .catch(error => {
            console.error('エラーが発生しました:', error);
            process.exit(1);
        });
}

module.exports = { generateSiteData };