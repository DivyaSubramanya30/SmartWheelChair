import { Link } from 'react-router-dom';
import AccessibilityBadge from './AccessibilityBadge';
import { getScoreColor } from '../../utils/accessibility';

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

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80';

export default function PlaceCard({ place }) {
  const type = place.placeType || place.place_type;
  const image = place.imageUrl || place.image || PLACE_TYPE_IMAGES[type] || DEFAULT_IMAGE;

  console.log('PlaceCard debug:', place.name, '| type:', type, '| image:', image);

  return (
    <Link
      to={`/places/${place.id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={place.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
        />
        <div className="absolute right-3 top-3">
          <AccessibilityBadge status={place.accessibilityStatus || place.status} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 group-hover:text-primary-700">{place.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{place.address}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {type?.replace(/_/g, ' ') || place.category}
          </span>
          <span className={`text-lg font-bold ${getScoreColor(place.accessibilityScore)}`}>
            {place.accessibilityScore}
            <span className="text-xs font-normal text-slate-400">/100</span>
          </span>
        </div>
      </div>
    </Link>
  );
}