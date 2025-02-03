// @deno-types="npm:@types/react"
import React, { JSX, useState } from 'react';
import { useDB } from '@goatdb/goatdb/react';
import { kSchemeEvent } from '../../../schema.ts';

interface EventCreateProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface EventFormData {
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  entry_fee: string;
  status: 'draft' | 'published';
}

export function EventCreate({
  userId,
  onClose,
  onSuccess,
}: EventCreateProps): JSX.Element {
  const db = useDB();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    location: '',
    start_date: '',
    end_date: '',
    entry_fee: '',
    status: 'draft',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate dates
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      if (endDate < startDate) {
        setError('End date must be after start date');
        return;
      }

      // Create event
      const eventId = crypto.randomUUID();
      await db.create(`/data/events/${eventId}`, kSchemeEvent, {
        ...formData,
        organizer_id: userId,
        entry_fee: parseFloat(formData.entry_fee),
        start_date: startDate,
        end_date: endDate,
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Entry Fee ($)
            </label>
            <input
              type="number"
              name="entry_fee"
              value={formData.entry_fee}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
