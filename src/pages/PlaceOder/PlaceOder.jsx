import React, { useContext, useEffect, useState } from 'react'
import './PlaceOder.css'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function PlaceOder() {
  const {getTotalCartAmount,token,food_list,cartItem,url}=useContext(StoreContext)
  const [data,setData]=useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const onchangeHanlder=(event)=>{
    const name=event.target.name
    const value=event.target.value
    setData(data=>({...data,[name]:value}))
  }
  const placeOrder= async(event)=>{
   event.preventDefault();
   let orderItems=[];
   food_list.map((item)=>{
    if(cartItem[item._id]>0){
      let itemInfo=item;
      itemInfo["quantity"]=cartItem[item._id]
      orderItems.push(itemInfo)
    }
   })
   let orderData={
    address:data,
    items:orderItems,
    amount:getTotalCartAmount()+2,
   }
   let response =await axios.post(url+"/api/order/place",orderData,{headers:{token}})
   if(response.data.success){
    const {session_url}=response.data;
    window.location.replace(session_url)
   }
   else{
    alert("Error")
   }
  }

  const navigate=useNavigate()
  useEffect(()=>{
       if(!token){
        navigate("/cart")
       }else{
        if(getTotalCartAmount()===0)
        {
          navigate('/cart')
        }
       }
  },[])
  // console.log(data);
  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className='place-order-left'>
       <p className='title'>Delivery Information</p>
       <div className="multi-fields">
        <input required name='firstName' onChange={onchangeHanlder} value={data.firstName} type="text" placeholder='first Name'/>
        <input required name='lastName' onChange={onchangeHanlder} value={data.lastName} type="text"  placeholder='Last Name' />
       </div>
       <input required name='email' onChange={onchangeHanlder} value={data.email} type="email" placeholder='Email address'/>
       <input required name='street' onChange={onchangeHanlder} value={data.street} type="text" placeholder='Street'/>
       <div className="multi-fields">
        <input required name='city' onChange={onchangeHanlder} value={data.city}  type="text" placeholder='City'/>
        <input required name='state' onChange={onchangeHanlder} value={data.state} type="text"  placeholder='State' />
       </div>
       <div className="multi-fields">
        <input required name='zipcode' onChange={onchangeHanlder} value={data.zipcode} type="text" placeholder='Zip'/>
        <input required name='country' onChange={onchangeHanlder} value={data.country}  type="text"  placeholder='Country' />
       </div>
       <input required name='phone' onChange={onchangeHanlder} value={data.phone} type="text" placeholder='Phone'/>
      </div>
      <div className="place-oder-right">
      <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div>
          <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Devliver Fee</p>
              <p>₹{getTotalCartAmount()===0?0: getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount()+2}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOder
