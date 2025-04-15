import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgresCtx = useContext(UserProgressContext);
  const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);

  function handleClose() {
    userProgresCtx.hideCheckout();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());

    console.log("FormData entries:", [...fd.entries()]);
    console.log("Customer Data:", customerData);

    if (!customerData.email) {
      console.error("Email field is missing or empty!");
    }

    fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData
        }
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => console.log("Order response:", data))
      .catch(error => console.error("Error:", error));
  }


  return (
    <Modal open={userProgresCtx.progress === 'checkout'} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
        <Input label="Full Name" type="text" id="name" name="name" />
        <Input label="E-mail Address" type="email" id="email" name="email" />
        <Input label="Street" type="text" id="street" name="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" name="postal-code" />
          <Input label="City" type="text" id="city" name="city" />
        </div>
        <p className="modal-actions">
          <Button type="button" textOnly onClick={handleClose}>Close</Button>
          <Button type="submit">Submit Order</Button>
        </p>
      </form>
    </Modal>
  );

}