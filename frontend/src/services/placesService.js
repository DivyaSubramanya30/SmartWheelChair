import api from './api';

const PLACE_TYPE_IMAGES = {
  HOSPITAL: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80',
  RESTAURANT: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
  SHOPPING_MALL: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=400&q=80',
  HOTEL: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&q=80',
  EDUCATIONAL_INSTITUTION: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&q=80',
  TRANSPORTATION: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&q=80',
  ENTERTAINMENT: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
  BANK: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&q=80',
  GOVERNMENT_OFFICE: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&q=80',
  OTHER: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80',
};

function transformPlace(dto) {
  const statusMap = {
    ACCESSIBLE: 'accessible',
    PARTIAL: 'partial',
    NOT_ACCESSIBLE: 'not_accessible',
  };

  const placeType = dto.placeType || 'OTHER';

  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    lat: dto.latitude,
    lng: dto.longitude,
    accessibilityScore: dto.accessibilityScore ?? 0,
    status: statusMap[dto.accessibilityStatus] || 'not_accessible',
    placeType: placeType,
    features: {
      ramp: !!dto.hasRamp,
      elevator: !!dto.hasElevator,
      accessibleWashroom: !!dto.hasAccessibleToilet,
      parking: !!dto.hasAccessibleParking,
    },
    category: placeType,
    image: dto.imageUrl || PLACE_TYPE_IMAGES[placeType] || PLACE_TYPE_IMAGES.OTHER,
    photos: dto.imageUrl ? [dto.imageUrl] : [],
    reviews: [],
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