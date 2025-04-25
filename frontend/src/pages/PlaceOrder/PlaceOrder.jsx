import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PlaceOrder() {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]: value}))
  }
  
  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item)=>{
      if(cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo)
      }
    })
    // console.log(orderItems);
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 50,
    }
    let response = await axios.post(url+"/api/order/place", orderData, {headers: {token}})
    if(response.data.success) {
      const {session_url} = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error")
    }
  }

  // const navigate = useNavigate();


  useEffect(()=> {
    if(!token) {
      navigate('/cart')
    } else if(getTotalCartAmount() === 0){
      navigate('/cart')
    }
  },[token])

  return (
    <form className='place-order' onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" placeholder='First name'  name='firstName' value={data.firstName} onChange={onChangeHandler} required/>
          <input type="text" name='lastName' placeholder='Last name' value={data.lastName}  onChange={onChangeHandler} required/>
        </div>
        <input type="text" name='email' placeholder='Email address' value={data.email} onChange={onChangeHandler} required/>
        <input type="text" name='street' placeholder='Street' value={data.street} onChange={onChangeHandler} required/>
        <div className="multi-fields">
          <input type="text" name='city' placeholder='City' value={data.city} onChange={onChangeHandler} required/>
          <input type="text" name='state' placeholder='State' value={data.state} onChange={onChangeHandler} required/>
        </div>
        <div className="multi-fields">
          <input type="text" name='zipcode' placeholder='Zip code' value={data.zipcode} onChange={onChangeHandler} required/>
          <input type="text" name='country' placeholder='Country' value={data.country} onChange={onChangeHandler} required/>
        </div>
        <input type="text" name='phone' placeholder='Phone' value={data.phone} onChange={onChangeHandler} required/>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="">
          <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
           <hr />
           <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 50}</p>
            </div>
           <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount() === 0 ? 0 :getTotalCartAmount() + 50}</b>
            </div>
          </div>
          <button type='submit' onClick={() => navigate('/')}>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder