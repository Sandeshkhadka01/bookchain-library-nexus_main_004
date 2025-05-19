import { BorrowHistory, ActivityStats } from '@/types/book';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const calculateActivityStats = (
  borrowHistory: BorrowHistory[],
  timeWindowDays: number = 7
): ActivityStats => {
  const now = new Date();
  const startDate = new Date(now.getTime() - (timeWindowDays * DAY_IN_MS));
  
  try {
    // Validate and parse dates
    const validHistory = borrowHistory.map(record => ({
      ...record,
      borrowDate: new Date(record.borrowDate),
      returnDate: record.returnDate ? new Date(record.returnDate) : null
    }));

    // Calculate recent activity within time window
    const recentActivity = validHistory.filter(record => 
      record.borrowDate >= startDate || 
      (record.returnDate && record.returnDate >= startDate)
    );

    // Calculate statistics
    const stats: ActivityStats = {
      timeWindow: {
        start: startDate,
        end: now
      },
      borrows: {
        total: validHistory.length,
        active: validHistory.filter(record => !record.returnDate).length,
        recent: recentActivity.filter(record => record.borrowDate >= startDate).length
      },
      returns: {
        total: validHistory.filter(record => record.returnDate).length,
        recent: recentActivity.filter(record => record.returnDate && record.returnDate >= startDate).length
      },
      lastUpdated: now
    };

    return stats;
  } catch (error) {
    console.error('Error calculating activity stats:', error);
    // Return default stats on error
    return {
      timeWindow: { start: startDate, end: now },
      borrows: { total: 0, active: 0, recent: 0 },
      returns: { total: 0, recent: 0 },
      lastUpdated: now
    };
  }
}; 