import {Component} from 'react'
import {BiRupee} from 'react-icons/bi'
import {AiFillStar} from 'react-icons/ai'
import {HiOutlineMinusSm} from 'react-icons/hi'
import {BsPlus} from 'react-icons/bs'
import itemClass from './FoodItem.module.css'
import './index.css'

class FoodItem extends Component {
  state = {
    isFound: false,
    quantity: 0,
  }

  // get the local storage data
  componentDidMount() {
    this.findTheCartItemInList()
  }

  findTheCartItemInList = () => {
    const cartData = JSON.parse(localStorage.getItem('cartData')) || []
    const {foodItem} = this.props
    const cartItem = cartData.filter(each => each.id === foodItem.id)
    if (cartItem.length !== 0) {
      if (cartItem[0].quantity > 0) {
        this.setState({quantity: cartItem[0].quantity, isFound: true})
      } else if (cartItem[0].quantity < 1) {
        this.removeCartItem()
        this.setState({quantity: cartItem[0].quantity, isFound: false})
      }
    }
  }

  incrementCartItemQuantity = () => {
    const cartData = JSON.parse(localStorage.getItem('cartData'))
    const {foodItem} = this.props
    const updatedCartData = cartData.map(eachItem => {
      if (eachItem.id === foodItem.id) {
        const updatedQuantity = eachItem.quantity + 1
        return {...eachItem, quantity: updatedQuantity}
      }
      return eachItem
    })
    localStorage.setItem('cartData', JSON.stringify(updatedCartData))
    this.findTheCartItemInList()
  }

  decrementCartItemQuantity = () => {
    const cartData = JSON.parse(localStorage.getItem('cartData'))
    const {foodItem} = this.props
    const updatedCartData = cartData.map(eachItem => {
      if (eachItem.id === foodItem.id) {
        if (eachItem.quantity > 0) {
          const updatedQuantity = eachItem.quantity - 1
          return {...eachItem, quantity: updatedQuantity}
        }
      }
      return eachItem
    })
    localStorage.setItem('cartData', JSON.stringify(updatedCartData))
    this.findTheCartItemInList()
  }

  removeCartItem = () => {
    const cartData = JSON.parse(localStorage.getItem('cartData'))
    const {foodItem} = this.props
    const updatedCartData = cartData.filter(
      eachCartItem => eachCartItem.id !== foodItem.id,
    )
    localStorage.setItem('cartData', JSON.stringify(updatedCartData))
    this.findTheCartItemInList()
  }

  addCartItem = () => {
    const cartData = JSON.parse(localStorage.getItem('cartData')) || []
    const {foodItem} = this.props
    const cartItem = {...foodItem, quantity: 1}
    cartData.push(cartItem)
    localStorage.setItem('cartData', JSON.stringify(cartData))
    this.findTheCartItemInList()
    this.setState({isFound: true})
  }

  render() {
    const {foodItem} = this.props
    const {isFound, quantity} = this.state
    console.log(quantity)
    return (
      <li className={itemClass.ListItem} data-testid="foodItem">
        <img
          src={foodItem.imageUrl}
          alt="food-item"
          className={itemClass.RestaurantImage}
        />
        <div className={itemClass.ItemDetails}>
          <h1 className={itemClass.ItemName}>{foodItem.name}</h1>
          <div className={itemClass.ItemRateContainer}>
            <BiRupee className={itemClass.ItemRupee} />
            <p className={itemClass.ItemCost}>{foodItem.cost}</p>
          </div>
          <div className={itemClass.ItemRatingContainer}>
            <AiFillStar className={itemClass.ItemStar} />
            <p className={itemClass.ItemRatingText}>{foodItem.rating}</p>
          </div>
          {isFound ? (
            <div className="each-item-counter-container" id={foodItem.id}>
              <button
                type="button"
                className="minus-icon-container"
                data-testid="decrement-count"
                onClick={this.decrementCartItemQuantity}
                aria-label="decrement quantity"
              >
                <HiOutlineMinusSm className="minus-icon" />
              </button>
              <button
                type="button"
                className="count-value"
                data-testid="active-count"
                aria-label={`current quantity is ${quantity}`}
              >
                {quantity}
              </button>
              <button
                type="button"
                className="plus-icon-container"
                data-testid="increment-count"
                onClick={this.incrementCartItemQuantity}
                aria-label="increment quantity"
              >
                <BsPlus className="plus-icon" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={itemClass.AddButton}
              onClick={this.addCartItem}
              aria-label="add to cart"
            >
              Add
            </button>
          )}
        </div>
      </li>
    )
  }
}

export default FoodItem
