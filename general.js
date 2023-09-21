let generellCounter = localStorage.getItem('generellCounter') || 0;
let totalCart = localStorage.getItem('totalCart') || 0;
let cartDani = JSON.parse(localStorage.getItem('cartDani')) || [];
document.getElementById("spanCartCounter").innerHTML = generellCounter;
//function to show the dropdown on the webpage
function dropdownFunction(isShown) {
    
    const dropContent = document.querySelector(`.dropContent`);

    if(isShown == true){    
        dropContent.innerHTML = '';
    }
    else{
        dropContent.classList.toggle("show");
        dropContent.innerHTML = '';
    }
    if (cartDani.length === 0) {
        document.querySelector(".dropContent").textContent = "Dein Warenkorb ist leer!";
    } 
    else {
        const dropContainerEinheit = document.createElement('div');
        const cartElements = document.createElement('div');
        const cartCounter = document.createElement('div');
        const cartTotalPrize = document.createElement('div');
    
        const dropContainerZusammenfassung = document.createElement('div');
    
        let htmlContentElements = '';
        let htmlContentCounter = '';
        let htmlContentTotalPrize = '';
    
        cartElements.innerHTML = `
            <div class="cartElements">Element</div>
        `;
        cartCounter.innerHTML = `
            <div class="cartCounter">Anzahl</div>
        `;
        cartTotalPrize.innerHTML = `
            <div class="cartTotalPrize">Total Preis</div>
        `;
    
        cartDani.forEach((element) => {
            let totalItem = element.counter * element.prize;
            htmlContentElements += `
                <div class="elementNamesAndCounter">
                    <div>${element.name}</div>
                </div>
            `;
            htmlContentCounter += `
                <div class="elementNamesAndCounter">
                    <div class="counterMinusPlus">
                    <button onclick="itemReduction('${element.name}', '${element.prize}')">-</button>
                    <div>${element.counter}</div>
                    <button onclick="itemIncrease('${element.name}', '${element.prize}')">+</button>
                    </div>
                </div>
            `;
            htmlContentTotalPrize += `
                <div class="elementNamesAndCounter">
                    <div>${totalItem}</div>
                </div>
            `;
        });
        cartElements.innerHTML += htmlContentElements;
        cartCounter.innerHTML += htmlContentCounter;
        cartTotalPrize.innerHTML += htmlContentTotalPrize;

        cartElements.classList.add("cartElements");
        cartCounter.classList.add("cartCounter");
        cartTotalPrize.classList.add("cartTotalPrize");
    
        dropContainerEinheit.appendChild(cartElements);
        dropContainerEinheit.appendChild(cartCounter);
        dropContainerEinheit.appendChild(cartTotalPrize);
    
        dropContainerZusammenfassung.innerHTML = `
            <div class="total">
                <div>Total:</div>
                <div>${totalCart}</div>
            </div>
            <div class="proceedPayment">
                <button id="dropContentProceedPaymentBtn" onclick="paymentFunction()">Bezahlen</button>
            <div>
        `;
    
        dropContent.appendChild(dropContainerEinheit);
        dropContainerEinheit.classList.add("dropContainerEinheit");
        
        dropContent.appendChild(dropContainerZusammenfassung);
        dropContainerZusammenfassung.classList.add("dropContainerZusammenfassung");
    }
}
//receives
document.addEventListener('DOMContentLoaded', function(){
    const form = document.querySelector(".form");
    document.querySelector(".form").addEventListener('submit', function (event){
        event.preventDefault();
        if(form.checkValidity()){
            document.getElementById("bodyDiv").innerHTML = '';
            document.getElementById("bodyDiv").innerHTML += `<h1 class="bodyTitle">Thanks for your feedback!</h1>`
        }
    });
})
async function paymentFunction(){
    document.getElementById("bodyDiv").innerHTML = '';
    resetCart();
    dropdownFunction(false);
    document.getElementById("spanCartCounter").innerHTML = '0';
    document.getElementById("bodyDiv").innerHTML += `<h1 class="bodyTitle">Thanks for your Order!</h1>`
}
//gets called by billingConfirmation.html to wipe everything from cart
async function resetCart() {
    localStorage.clear();
    generellCounter = 0;
    totalCart = 0;
    cartDani = [];
}
//adds items to cartDani
function addToCart(name, prize) {
    const cartIcon = document.querySelector(".cartButton");
    cartIcon.classList.add("pop");
    //document.getElementById("spanCartCounter").innerHTML = generellCounter;
    cartIcon.addEventListener("animationend", () => {
    cartIcon.classList.remove("pop");
    });

    const newItem = { name: name, counter: 1, prize: prize };
    let contains = false;

    if(cartDani.length === 0){
        cartDani.push(newItem);
        contains = true;
    }
    else{
        for(let i = 0; i < cartDani.length; i++){
            if(cartDani[i].name === name){
                cartDani[i].counter++;
                contains = true;
            }
        }
    }
    if (contains == false){
        cartDani.push(newItem);
    }
    localStorage.setItem('cartDani', JSON.stringify(cartDani));
    generellCounter++;
    localStorage.setItem("generellCounter", generellCounter.toString());
    totalCart = parseInt(prize) + parseInt(totalCart);
    localStorage.setItem("totalCart", totalCart.toString());
    let isShown = true;
    document.getElementById("spanCartCounter").innerHTML = generellCounter;
    dropdownFunction(isShown);
}
//if clicked on "-" it decreases the number until 0; then it gets deleted
function itemReduction(name, prize){
    for(let i = 0; i < cartDani.length; i++){
        if(cartDani[i].name === name && cartDani[i].counter===0){
            cartDani.splice(i, 1);
        }
        else if(cartDani[i].name === name && cartDani[i].counter!=0){
            cartDani[i].counter--;
            if(cartDani[i].name === name && cartDani[i].counter===0){
                cartDani.splice(i, 1);
            }
        }
    }
    localStorage.setItem('cartDani', JSON.stringify(cartDani));
    generellCounter--;
    localStorage.setItem("generellCounter", generellCounter.toString());
    totalCart = parseInt(totalCart) - parseInt(prize);
    localStorage.setItem("totalCart", totalCart.toString());
    let isShown = true;
    document.getElementById("spanCartCounter").innerHTML = generellCounter;
    dropdownFunction(isShown);
}
//if clicked on "+" it increases the number
function itemIncrease(name, prize){
    for(let i = 0; i < cartDani.length; i++){
        if(cartDani[i].name === name && cartDani[i].counter!=0){
            cartDani[i].counter++;
        }
    }
    localStorage.setItem('cartDani', JSON.stringify(cartDani));
    generellCounter++;
    localStorage.setItem("generellCounter", generellCounter.toString());
    totalCart = parseInt(prize) + parseInt(totalCart);
    localStorage.setItem("totalCart", totalCart.toString());
    let isShown = true;
    document.getElementById("spanCartCounter").innerHTML = generellCounter;
    dropdownFunction(isShown);
}
//gets called by pizza.html to show the inner body
function showPizza(){
    fetch("/Pizza/pizzas.json")
    .then(res => res.json())
    .then(pizzas => {
      pizzas.forEach((pizza, index) => {
        const pizzaItem = document.querySelector(`.BodyInnerEachDivPizza[data-index="${index}"]`);
        var numericString = pizza.prize.replace(/\D/g, '');
        var integerValue = parseInt(numericString, 10);

        const pizzaContainer = document.createElement('div');

        pizzaContainer.innerHTML = `
        <div class="PizzaImageContainer">
            <img class="PizzaImg" src="${pizza.imageUrl}" alt="A very good looking Pizza!">
        </div>
        <div class="PizzaDescription">
            <div class="PizzaTopDescription">
                <h2>${pizza.name}</h2>
                <div class="PizzaInfo">
                    <h2>${pizza.prize}</h2>
                    <button onclick="addToCart('${pizza.name}', '${integerValue}')" class="cartButton">
                        <img src="/cart.jpg" class="Cart" alt="Cart">
                    </button>
                </div>
            </div>
            <div class="PizzaIngredients">${pizza.ingredients.join(', ')}</div>
        </div>
        `;
        pizzaItem.appendChild(pizzaContainer);
      });
    });
}
//gets called by salad.html to show the inner body
function showSalad(){
    fetch("/Salad/salads.json")
    .then(res => res.json())
    .then(salads => {
      salads.forEach((salad, index) => {
        const saladItem = document.querySelector(`.BodyInnerEachDivSalad[data-index="${index}"]`);
        var numericString = salad.prize.replace(/\D/g, '');
        var integerValue = parseInt(numericString, 10);

        const saladContainer = document.createElement('div');

        saladContainer.innerHTML = `
        <div class="SaladImageContainer">
            <img class="SaladImg" src="${salad.imageUrl}" alt="A very good looking Salad!">
        </div>
        <div class="SaladDescription">
            <div class="SaladTopDescription">
                <h3 class="SaladTitel">${salad.name}</h3>
                <h5 class="SaladIngredients">${salad.ingredients.join(', ')}</h5>
            </div>
            <div class="SaladInfoContainer">
                <select class="SaladSelektor" name="dressing_GreenSalad" id="dressing_GreenSalad">
                    <option value="italian_dressing">Italian dressing</option>
                    <option value="french_dressing">French dressing</option>
                    <option value="no_dressing">No dressing</option>
                </select>
                <h3>${salad.prize}</h3>
                <button onclick="addToCart('${salad.name}', '${integerValue}')" class="cartButton">
                    <img src="/cart.jpg" class="Cart" alt="Cart">
                </button>
            </div>
        </div>
        `;
        saladItem.appendChild(saladContainer);
      });
    });
}
//gets called by softdrink.html to show the inner body
function showSoftdrink(){
    fetch("./softdrinks.json")
    .then(res => res.json())
    .then(softdrinks => {
      softdrinks.forEach((softdrink, index) => {
        const softdrinkItem = document.querySelector(`.BodyInnerEachDivSoft[data-index="${index}"]`);
        var numericString = softdrink.prize.replace(/\D/g, '');
        var integerValue = parseInt(numericString, 10);

        const softdrinkContainer = document.createElement('div');

        softdrinkContainer.innerHTML = `
        <div class="SoftImageContainer">
            <img class="SoftImg" src="${softdrink.imageUrl}" alt="A very good looking Softdrink!">
        </div>
        <div class="SoftDescription">
            <div class="SoftTopDescription">
                <h3 class="SoftTitel">${softdrink.name}</h3>
            </div>
            <div class="SoftInfo">
                <select class="SoftSelektor" name="dressing_RocketSalad" id="dressing_RocketSalad">
                    <option value="50cl">${softdrink.volume}</option>
                    <option value="100cl">100cl</option>
                </select>
                <div class="SoftInfoPrizeCart">
                    <h3 class="prizeTag">${softdrink.prize}</h3>
                    <button onclick="addToCart('${softdrink.name}', '${integerValue}')" class="cartButton">
                        <img src="/cart.jpg" class="Cart" alt="Cart">
                    </button>
                </div>
            </div>
        </div>
        `;
        softdrinkItem.appendChild(softdrinkContainer);
      });
    });
}
//when page has loaded, these functions get called to create the inner bodies
window.addEventListener("load", function(){
    showPizza();
    showSalad();
    showSoftdrink();
})