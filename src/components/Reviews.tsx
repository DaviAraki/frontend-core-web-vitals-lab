interface Review {
  readonly id: string;
  readonly author: string;
  readonly avatar: string;
  readonly rating: number;
  readonly text: string;
}

interface ReviewsProps {
  /** When false (the /bad route), avatar dimensions are omitted to cause CLS. */
  readonly stable: boolean;
  readonly reviews?: readonly Review[];
}

const DEFAULT_REVIEWS: readonly Review[] = [
  {
    id: 'r1',
    author: 'Maya R.',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%236366f1"/><text x="50%" y="58%" font-size="28" text-anchor="middle" fill="white" font-family="sans-serif">M</text></svg>',
    rating: 5,
    text: 'Light, comfortable, and the battery lasts forever. Best headphones I’ve owned.',
  },
  {
    id: 'r2',
    author: 'Devin K.',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%23ec4899"/><text x="50%" y="58%" font-size="28" text-anchor="middle" fill="white" font-family="sans-serif">D</text></svg>',
    rating: 4,
    text: 'Sound is excellent. The app could use some polish but the hardware is great.',
  },
  {
    id: 'r3',
    author: 'Priya S.',
    avatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%230ea5e9"/><text x="50%" y="58%" font-size="28" text-anchor="middle" fill="white" font-family="sans-serif">P</text></svg>',
    rating: 5,
    text: 'Noise cancellation is unreal on flights. Totally worth it.',
  },
];

export function Reviews({ stable, reviews = DEFAULT_REVIEWS }: ReviewsProps) {
  return (
    <section className="reviews" aria-label="Customer reviews">
      <h2>Reviews</h2>
      <ul className="reviews__list">
        {reviews.map((review) => (
          <li key={review.id} className="review">
            {stable ? (
              <img
                className="review__avatar"
                src={review.avatar}
                alt={`Avatar of ${review.author}`}
                width={48}
                height={48}
                loading="lazy"
              />
            ) : (
              // Intentionally bad: avatar dimensions are omitted to demonstrate CLS.
              <img className="review__avatar" src={review.avatar} alt={`Avatar of ${review.author}`} />
            )}
            <div className="review__body">
              <div className="review__head">
                <strong>{review.author}</strong>
                <span aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}</span>
              </div>
              <p>{review.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
