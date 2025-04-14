import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import UserProgressContext from "../store/UserProgressContext";
import Button from "./UI/Button";
import CartItem from "./CartItem";

export default function Cart() {
    const cartCtx = useContext(CartContext);
    const userProgresCtx = useContext(UserProgressContext);
    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);

    function handleCloseCart() {
        userProgresCtx.hideCart();
    }

    return <Modal className="cart" open={userProgresCtx.progress === 'cart'}>
        <h2>Your cart</h2>
        <ul>
            {cartCtx.items.map(item => (
                <CartItem
                    key={item.id}
                    name={item.name}
                    quantity={item.quantity}
                    price={item.price}
                    onDecrease={() => cartCtx.removeItem(item.id)}
                    onIncrease={() => cartCtx.addItem(item)}
                />
            ))}
        </ul>
        <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
        <p className="modal-actions">
            <Button textOnly onClick={handleCloseCart}>
                Close
            </Button>
            <Button textOnly onClick={handleCloseCart}>
                Go to Checkout
            </Button>
        </p>
    </Modal>
}