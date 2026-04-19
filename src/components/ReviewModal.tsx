'use client'

import { useState } from 'react';
import type { ReviewModalProps } from '../../interface';

export default function ReviewModal({ isOpen, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a star rating");
      return;
    }
    onSubmit(rating, comment);
    setRating(0);
    setHoverRating(0);
    setComment('');
  };

  const handleCancel = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
        
        <h2 className="text-xl font-extrabold text-gray-900">Your Review</h2>
        
        <div 
          className="flex space-x-1" 
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onClick={() => setRating(star)}
            >
              <svg
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-200'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>

        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="write a review..."
          className="w-full resize-none rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 shadow-inner"
        />

        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={handleCancel}
            className="rounded-lg bg-red-400/90 px-5 py-2 text-sm font-bold text-white hover:bg-red-500 transition-colors shadow-sm"
          >
            cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-sky-400 px-5 py-2 text-sm font-bold text-white hover:bg-sky-500 transition-colors shadow-sm"
          >
            submit
          </button>
        </div>

      </div>
    </div>
  );
}
