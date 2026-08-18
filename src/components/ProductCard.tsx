import type { Product } from '../types/catalog';
import { useAppDispatch } from '../redux/hooks';
import { addToCart } from '../redux/cartSlice';

const FALLBACK_IMAGE = 'https://via.placeholder.com/300x300?text=No+Image';

const ProductCard: React.FC<{ product: Product }> = ({product}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="product-card">
        <h3>{product.title}</h3>
        <p className="product-card-category">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
        <p className="product-card-price">${product.price}</p>
        <img 
          src={product.image} 
          alt={product.title} 
          className="product-card-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        <p className="product-card-rating">Rating: {product.rating.rate} ({product.rating.count})</p>
        <p className="product-card-description">{product.description}</p>
        <button onClick={() => dispatch(addToCart(product))}>Add to Cart</button> 
    </div>
  );
};

export default ProductCard;