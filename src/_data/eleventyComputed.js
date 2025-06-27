module.exports = {
  // 最新のトレンドデータを計算
  latestTrends: async (data) => {
    if (data.trends && data.trends.latestTrends) {
      return data.trends.latestTrends;
    }
    return [];
  },
  
  // 最新の日付
  latestDate: async (data) => {
    if (data.trends && data.trends.latestDate) {
      return data.trends.latestDate;
    }
    return null;
  },
  
  // 最近の日付リスト
  recentDates: async (data) => {
    if (data.trends && data.trends.recentDates) {
      return data.trends.recentDates;
    }
    return [];
  }
};