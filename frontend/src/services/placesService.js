import api from './api';

function transformPlace(dto) {
  const statusMap = {
    ACCESSIBLE: 'accessible',
    PARTIAL: 'partial',
    NOT_ACCESSIBLE: 'not_accessible',
  };

  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    lat: dto.latitude,
    lng: dto.longitude,
    accessibilityScore: dto.accessibilityScore ?? 0,
    status: statusMap[dto.accessibilityStatus] || 'not_accessible',
    features: {
      ramp: !!dto.hasRamp,
      elevator: !!dto.hasElevator,
      accessibleWashroom: !!dto.hasAccessibleToilet,
      parking: !!dto.hasAccessibleParking,
    },
    category: dto.placeType || 'Other',
    image: dto.imageUrl || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
    photos: dto.imageUrl ? [dto.imageUrl] : [],
    reviews: [], // backend doesn't provide reviews yet
  };
}

export async function getPlaces(filters = {}) {
  const response = await api.get('/places');
  let results = response.data.map(transformPlace);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (filters.status) {
    results = results.filter((p) => p.status === filters.status);
  }

  if (filters.features) {
    Object.entries(filters.features).forEach(([key, required]) => {
      if (required) results = results.filter((p) => p.features[key]);
    });
  }

  return results;
}

export async function getPlaceById(id) {
  const response = await api.get(`/places/${id}`);
  return transformPlace(response.data);
}

export async function getFeaturedPlaces() {
  const response = await api.get('/places');
  return response.data
    .map(transformPlace)
    .filter((p) => p.accessibilityScore >= 80)
    .slice(0, 4);
}

export async function searchPlaces(query) {
  return getPlaces({ search: query });
}