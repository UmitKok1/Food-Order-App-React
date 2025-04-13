import { useContext } from 'react';
import Button from './UI/Button';
import logoImg from '../assets/logo.jpg';
import CartContext from '../store/CartContext';
import UserProgressContext from '../store/UserProgressContext';

export default function Header() {
    const cartCtx = useContext(CartContext);
    const userProgresCtx = useContext(UserProgressContext);
    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
        return totalNumberOfItems + item.quantity;
    }, 0);

    function handleShowCart() {
        userProgresCtx.showCart();
        console.log(userProgresCtx.progress)
    }

    return <header id="main-header">
        <div id="title">
            <img src={logoImg} alt='' />
            <h1>Food App</h1>
        </div>
        <nav>
            <Button textOnly onClick={handleShowCart}>
                Cart ({totalCartItems})
            </Button>
        </nav>
    </header>
}