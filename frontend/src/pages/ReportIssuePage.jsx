import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitReport } from '../services/reportsService';
import { STATUS_LABELS } from '../utils/constants';

export default function ReportIssuePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    placeName: location.state?.placeName || '',
    reporterName: '',
    reporterEmail: '',
    status: 'partial',
    ramp: false,
    elevator: false,
    accessibleWashroom: false,
    description: '',
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleChange('photo', file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await submitReport(form);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="rounded-2xl border border-accent-200 bg-accent-50 p-8">
          <p className="text-4xl">✅</p>
          <h2 className="mt-4 text-xl font-bold text-accent-800">Report Submitted!</h2>
          <p className="mt-2 text-sm text-accent-600">Thank you for helping improve accessibility.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Report Accessibility Issue</h1>
        <p className="mt-1 text-slate-500">
          Help the community by reporting accessibility problems or improvements
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="placeName" className="mb-1.5 block text-sm font-medium text-slate-700">
              Place Name
            </label>
            <input
              id="placeName"
              type="text"
              value={form.placeName}
              onChange={(e) => handleChange('placeName', e.target.value)}
              placeholder="Enter place name..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>

          <div>
            <label htmlFor="reporterName" className="mb-1.5 block text-sm font-medium text-slate-700">
              Your Name
            </label>
            <input
              id="reporterName"
              type="text"
              value={form.reporterName}
              onChange={(e) => handleChange('reporterName', e.target.value)}
              placeholder="Enter your name..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>

          <div>
            <label htmlFor="reporterEmail" className="mb-1.5 block text-sm font-medium text-slate-700">
              Your Email
            </label>
            <input
              id="reporterEmail"
              type="email"
              value={form.reporterEmail}
              onChange={(e) => handleChange('reporterEmail', e.target.value)}
              placeholder="Enter your email..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-700">
              Accessibility Status
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-700">Available Features</legend>
            <div className="space-y-2">
              {[
                { key: 'ramp', label: 'Ramp Available' },
                { key: 'elevator', label: 'Elevator Available' },
                { key: 'accessibleWashroom', label: 'Accessible Washroom' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    className="rounded text-primary-600"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              placeholder="Describe the accessibility issue or improvement..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>

          <div>
            <label htmlFor="photo" className="mb-1.5 block text-sm font-medium text-slate-700">
              Upload Photo (optional)
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
            />
            {form.photo && (
              <p className="mt-1 text-xs text-slate-400">Selected: {form.photo.name}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-accent-600 py-3 text-sm font-semibold text-white transition hover:bg-accent-700 disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}