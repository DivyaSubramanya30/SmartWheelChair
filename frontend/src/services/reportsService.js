import api from './api';
import { getPlaces } from './placesService';

function transformReport(dto, placeNameMap) {
  return {
    id: dto.id,
    placeName: placeNameMap[dto.placeId] || `Place #${dto.placeId}`,
    status: dto.status,
    features: {
      ramp: !!dto.hasRamp,
      elevator: !!dto.hasElevator,
      accessibleWashroom: !!dto.hasAccessibleToilet,
    },
    description: dto.description,
    submittedAt: dto.createdAt ? new Date(dto.createdAt).toISOString() : null,
    resolved: dto.status === 'APPROVED' || dto.status === 'REVIEWED',
  };
}

export async function getReports() {
  const [reportsRes, places] = await Promise.all([
    api.get('/reports'),
    getPlaces(),
  ]);

  const placeNameMap = {};
  places.forEach((p) => {
    placeNameMap[p.id] = p.name;
  });

  return reportsRes.data
    .map((dto) => transformReport(dto, placeNameMap))
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export async function submitReport(reportData) {
  // Find matching place by name
  const places = await getPlaces();
  const match = places.find(
    (p) => p.name.toLowerCase() === reportData.placeName.trim().toLowerCase()
  );

  if (!match) {
    throw new Error(
      `Place "${reportData.placeName}" not found. Please enter an exact existing place name.`
    );
  }

  const payload = {
    placeId: match.id,
    reporterName: reportData.reporterName,
    reporterEmail: reportData.reporterEmail,
    description: reportData.description,
    hasRamp: reportData.ramp,
    hasElevator: reportData.elevator,
    hasAccessibleToilet: reportData.accessibleWashroom,
    hasWheelchairAccess: false,
    hasAccessibleParking: false,
    status: 'PENDING',
  };

  const response = await api.post('/reports', payload);
  return response.data;
}