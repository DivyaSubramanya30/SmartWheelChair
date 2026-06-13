import api from './api';

const COLORS = {
  ACCESSIBLE: '#10b981',
  PARTIAL: '#f59e0b',
  NOT_ACCESSIBLE: '#ef4444',
};

const LABELS = {
  ACCESSIBLE: 'Accessible',
  PARTIAL: 'Partial',
  NOT_ACCESSIBLE: 'Not Accessible',
};

function transformStats(dto) {
  const accessibilityDistribution = ['ACCESSIBLE', 'PARTIAL', 'NOT_ACCESSIBLE'].map((key) => ({
    name: LABELS[key],
    value:
      key === 'ACCESSIBLE'
        ? dto.accessiblePlaces
        : key === 'PARTIAL'
        ? dto.partiallyAccessiblePlaces
        : dto.notAccessiblePlaces,
    color: COLORS[key],
  }));

  return {
    totalPlaces: dto.totalPlaces,
    accessiblePlaces: dto.accessiblePlaces,
    partialPlaces: dto.partiallyAccessiblePlaces,
    notAccessiblePlaces: dto.notAccessiblePlaces,
    totalReports: 0, // not provided by backend yet
    resolvedReports: 0, // not provided by backend yet
    averageScore: Math.round(dto.averageAccessibilityScore ?? 0),
    accessibilityDistribution,
  };
}

export async function getDashboardStats() {
  const response = await api.get('/dashboard/stats');
  return transformStats(response.data);
}

export async function getHomeStats() {
  const stats = await getDashboardStats();
  return {
    totalPlaces: stats.totalPlaces,
    accessiblePlaces: stats.accessiblePlaces,
    averageScore: stats.averageScore,
    totalReports: stats.totalReports,
  };
}