const stripe = Stripe("pk_test_51IC7c9LUluwUeI5RWs0CjwAHCWrfjvZdeuUQWzA6ZejJ4AMhewpBauS2lRj7ESbkmHcy8KVKmmVDlXc5BtSS0wSY00rnCEcsBx");

const cart_empty = document.querySelector(".cart-empty");
const cart_filled = document.querySelector(".cart-filled");
const addToCart = document.querySelectorAll(".add-to-cart");
const cart = document.querySelector(".cart");
const insideCart = document.querySelector(".inside-cart");
const cross = document.querySelector(".cross");
const plus = document.querySelectorAll(".plus");
const minus = document.querySelectorAll(".minus");
const pay = document.querySelector(".pay");
const quantity = document.querySelectorAll(".quantity");
const noItems = document.querySelector(".no-items");
const totalAmount = document.querySelector(".total-amount");
const itemPrice = document.querySelectorAll(".item-price");
const payButton = document.querySelector(".pay-button");

let total = 0;

const items = ["Images/choco-butter.png","Images/peanut-butter.png","Images/almond-butter.jpg","Images/cashew-butter.jpg"];

const itemNames = ['Chocolate Hazelnut Butter', 'Peanut Butter', 'Almond Butter', 'Cashew Butter'];
const itemPresent = [false,false,false,false];

plus.forEach((p,i) => {
    p.addEventListener("click", () => {
        if(parseInt(quantity[i].value) >= 1){
            let v = parseInt(quantity[i].value) + 1;
            quantity[i].value = v.toString();
            total += parseInt(itemPrice[i].innerHTML.split(" ")[1]);
            totalAmount.innerHTML = `Total <br> ₹${total}`;
            totalAmount.style.opacity = 1;
            let tmp = document.getElementById(`${i}`);
            let tmpChild = tmp.querySelector(".cart-item-name");
            tmpChild.innerHTML = itemNames[i] + `<br>${quantity[i].value}`;
        }
    });
});

minus.forEach((m,i) => {
    m.addEventListener("click", () => {
        if(parseInt(quantity[i].value) > 0){
            if(parseInt(quantity[i].value) === 1){
                const tmp = document.getElementById(`${i}`);
                insideCart.removeChild(tmp);
                let v = parseInt(quantity[i].value) - 1;
                quantity[i].value = v.toString();
                itemPresent[i] = false;
                total -= parseInt(itemPrice[i].innerHTML.split(" ")[1]);
                totalAmount.innerHTML = `Total <br> ₹${total}`;
                if(insideCart.getElementsByClassName("cart-items").length === 0){
                    pay.style.opacity = 0;
                    pay.style.pointerEvents = "none";
                    noItems.style.opacity = 1;
                    totalAmount.style.opacity = 0;
                }
            }else{
                let v = parseInt(quantity[i].value) - 1;
                quantity[i].value = v.toString();
                let tmp = document.getElementById(`${i}`);
                let tmpChild = tmp.querySelector(".cart-item-name");
                tmpChild.innerHTML = itemNames[i] + `<br>${quantity[i].value}`;
                total -= parseInt(itemPrice[i].innerHTML.split(" ")[1]);
                totalAmount.innerHTML = `Total <br> ₹${total}`;
                totalAmount.style.opacity = 1;
            }
        }
    });
});

[addToCart,plus].forEach(element => {
    element.forEach((item,i) => {
        item.addEventListener("click", () => {
            if(parseInt(quantity[i].value) === 0){
                quantity[i].value = 1;
            }
            if(itemPresent[i] === false){
                noItems.style.opacity = 0;
                pay.style.opacity = 1;
                pay.style.pointerEvents = "all";
                pay.style.cursor = "pointer";
                const cartItem = document.createElement("div");
                cartItem.id = i.toString();
                cartItem.classList.add("cart-items");
                const cartItemImg = document.createElement("img");
                cartItemImg.src = items[i];
                cartItemImg.classList.add("cart-items-img");
                const cartItemText = document.createElement("div");
                // cartItemText.id = i.toString();
                cartItemText.innerHTML = itemNames[i] + `<br>${quantity[i].value}`;
                total += parseInt(itemPrice[i].innerHTML.split(" ")[1]);
                totalAmount.innerHTML = `Total <br> ₹${total}`;
                totalAmount.style.opacity = 1;
                cartItemText.classList.add("cart-item-name");
                const itemPriceTag = document.createElement("div");
                itemPriceTag.innerHTML = "₹ 695";
                itemPriceTag.classList.add("item-price-tag");
                insideCart.appendChild(cartItem);
                cartItem.appendChild(cartItemImg);
                cartItem.appendChild(cartItemText);
                cartItem.appendChild(itemPriceTag);
                itemPresent[i] = true;
            }
        });
    });
});


[cart_empty,cart_filled].forEach(item=>{
    item.addEventListener('click',()=>{
        insideCart.style.right = "0px";
        cross.style.opacity = 1;
        cross.style.pointerEvents = "all";
        cross.style.cursor = "pointer";
        item.style.opacity = 0;
        item.style.pointerEvents = "none";
    });
});
cross.addEventListener('click', ()=>{
    insideCart.style.right = "-400px";
    cross.style.transform = "rotate(360deg)";
    cross.style.opacity = 0;
    cross.style.pointerEvents = "none";
    cross.style.pointerEvents = "none";
    cart_empty.style.pointerEvents = "all";
    cart_empty.style.opacity = 1;
});

pay.addEventListener("click", ()=>{
    console.log("pay button clicked");
    let items = [...insideCart.getElementsByClassName('cart-item-name')];
    let prices = [...insideCart.getElementsByClassName('item-price-tag')];
    console.log(items);
    let finalItems = [];
    items.forEach((item,i) =>{
        finalItems.push({name: item.innerHTML.split("<br>")[0], quantity: parseInt(item.innerHTML.split("<br>")[1]), amount: parseInt(prices[i].innerHTML.split(" ")[1])*100, currency: "inr"});
    })
    fetch("/create-checkout-session",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({finalItems: finalItems})
    })
    .then((res)=>{
        return res.json();
    })
    .then((session)=>{
        return stripe.redirectToCheckout({
            sessionId: session.id
        })
    })
    .then((result)=>{
        if(result.error){
            alert(result.error.message);
        }
    })
    .catch((error)=>{
        console.error("Error:",error);
    })
})