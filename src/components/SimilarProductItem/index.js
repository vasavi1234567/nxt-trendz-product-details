// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productData} = props
  const {imageUrl, title, brand, price, rating} = productData

  return (
    <li className="list-item">
      <img
        className="item-image"
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <p className="product-item-title">{title}</p>
      <p className="product-item-brand">by {brand}</p>
      <div className="price-rating-container">
        <p className="product-item-price">Rs {price}</p>
        <div className="product-rating-container">
          <p className="product-item-rating">{rating}</p>
          <img
            className="star-icon"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
