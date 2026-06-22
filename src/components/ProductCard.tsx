interface ProductCardProps {
  readonly name: string;
  readonly price: string;
  readonly image: string;
  /**
   * When false (the /bad route), image dimensions are intentionally omitted so
   * the card shifts when the image loads — demonstrating CLS.
   */
  readonly stable: boolean;
}

export function ProductCard({ name, price, image, stable }: ProductCardProps) {
  return (
    <article className="product-card">
      {stable ? (
        <img
          className="product-card__img"
          src={image}
          alt={name}
          width={300}
          height={300}
          loading="lazy"
          decoding="async"
        />
      ) : (
        // Intentionally bad: image dimensions are omitted to demonstrate CLS.
        <img className="product-card__img" src={image} alt={name} loading="lazy" />
      )}
      <h4 className="product-card__name">{name}</h4>
      <p className="product-card__price">{price}</p>
    </article>
  );
}
