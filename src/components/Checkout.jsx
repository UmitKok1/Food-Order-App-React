import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
  method: 'POST',
  headers: {
    'Content-type': 'application/json'
  }
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgresCtx = useContext(UserProgressContext);
  const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData
  } = useHttp(
    'http://localhost:3000/orders',
    requestConfig
  );

  function handleClose() {
    userProgresCtx.hideCheckout();
  }

  function handleFinish() {
    userProgresCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());
    sendRequest(JSON.stringify({
      order: {
        items: cartCtx.items,
        customer: customerData
      }
    }));
    console.log("FormData entries:", [...fd.entries()]);
    console.log("Customer Data:", customerData);
  }

  let actions = (<>
    <Button type="button" textOnly onClick={handleClose}>Close</Button>
    <Button type="submit">Submit Order</Button>
  </>);

  if (isSending) {
    actions = <span>Sending order data...</span>;
  }
  if (data && !error) {
    return <Modal open={userProgresCtx.progress === 'checkout'} onClose={handleFinish}>
      <h2>Success!</h2>
      <p>Your order was submitted successfully.</p>
      <p className="modal-actions">
        <Button onClick={handleFinish}>
          Okay
        </Button>
      </p>
    </Modal>
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
        {error && <Error title="Failed to submit order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );

}