// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: '',
    similarProductDetails: '',
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProducts()
  }

  getFormattedDetails = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    price: data.price,
    description: data.description,
  })

  getProducts = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedDetails(fetchedData)
      const updatedSimilarData = fetchedData.similar_products.map(product =>
        this.getFormattedDetails(product),
      )
      this.setState({
        productDetails: updatedData,
        similarProductDetails: updatedSimilarData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="80" width="80" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="failure-view-heading">Product Not Found</h1>
      <Link to="/products">
        <button className="button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderProductsView = () => {
    const {productDetails, similarProductDetails, quantity} = this.state
    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      price,
      description,
    } = productDetails

    return (
      <div className="products-view-container">
        <div className="product-details-container">
          <img className="product-image" src={imageUrl} alt="product" />
          <div className="product-container">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}</p>
            <div className="ratings-reviews-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  className="rating-image"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="value-container">
              <p className="label">Availability: </p>
              <p className="value">{availability}</p>
            </div>
            <div className="value-container">
              <p className="label">Brand: </p>
              <p className="value">{brand}</p>
            </div>
            <hr className="line" />
            <div className="quantity-container">
              <button
                className="quantity-button"
                type="button"
                data-testid="minus"
                onClick={this.onDecrementQuantity}
              >
                <BsDashSquare className="quantity-icon" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                className="quantity-button"
                type="button"
                data-testid="plus"
                onClick={this.onIncrementQuantity}
              >
                <BsPlusSquare className="quantity-icon" />
              </button>
            </div>
            <button className="add-to-cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products">Similar Products</h1>
        <ul className="similar-products-list-container">
          {similarProductDetails.map(similarProduct => (
            <SimilarProductItem
              key={similarProduct.id}
              productData={similarProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
