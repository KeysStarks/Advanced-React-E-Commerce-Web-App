import type { Product } from '../types/catalog';
import { useAppDispatch } from '../redux/hooks';
import { addToCart } from '../redux/cartSlice';

const FALLBACK_IMAGE = 'https://via.placeholder.com/300x300?text=No+Image';

const ProductCard: React.FC<{ product: Product }> = ({product}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="col-md-5 p-3 d-flex flex-column align-items-center gap-3 shadow">
        <h3>{product.title}</h3>
        <img 
          src={product.image} 
          alt={product.title} 
          className="img-fluid"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        <p>${product.price}</p>
        <h5>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</h5>
        <p>Rating: {product.rating.rate} ({product.rating.count} reviews)</p>
        <p>{product.description}</p>
        <button onClick={() => dispatch(addToCart(product))}>Add to Cart</button> 
    </div>
  );
};

export default ProductCard;