import { useState } from 'react';

function ReviewForm({ onSubmit }) {
  const [review, setReview] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(review);
    setReview({ rating: 5, comment: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group">
        <label>Оценка</label>
        <select 
          value={review.rating}
          onChange={(e) => setReview({...review, rating: parseInt(e.target.value)})}
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num} ★</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Комментарий</label>
        <textarea 
          value={review.comment}
          onChange={(e) => setReview({...review, comment: e.target.value})}
          required
        />
      </div>
      
      <button type="submit" className="btn-primary">Отправить отзыв</button>
    </form>
  );
}

export default ReviewForm;