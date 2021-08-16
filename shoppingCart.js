let productsInCart = JSON.parse(localStorage.getItem('shoppingCart'));
if(!productsInCart){
	productsInCart = []; //add products to cart
}
const parentElement = document.querySelector('#buyItems'); //item in cart - parentItem-buyItem
const cartSumPrice = document.querySelector('#sum-prices');
const products = document.querySelectorAll('.product-under'); //to selct all products


const countTheSumPrice = function () { // 4
	let sum = 0;
	productsInCart.forEach(item => {
		sum += item.price;
	});
	return sum;
}

const updateShoppingCartHTML = function () {  //products present, Generate HTML code
	localStorage.setItem('shoppingCart', JSON.stringify(productsInCart));
	if (productsInCart.length > 0) {
		let result = productsInCart.map(product => { //use map to search through the products and HTML 
			return `
				<li class="buyItem">
					<img src="${product.image}">
					<div>
						<h5>${product.name}</h5>
						<h6>$${product.price}</h6>
						<div>
							<button class="button-minus" data-id=${product.id}>-</button>
							<span class="countOfProduct">${product.count}</span>
							<button class="button-plus" data-id=${product.id}>+</button>
						</div>
					</div>
				</li>`
		});
		parentElement.innerHTML = result.join(''); //map returns an array of html codes and we just need one html code so 
		document.querySelector('.checkout').classList.remove('hidden');
		cartSumPrice.innerHTML = '$' + countTheSumPrice();

	}
	else {
		document.querySelector('.checkout').classList.add('hidden');
		parentElement.innerHTML = '<h4 class="empty">Your shopping cart is empty</h4>';
		cartSumPrice.innerHTML = '';
	}
}

function updateProductsInCart(product) { //check if product is in the list, Yes- update cartPrice and icr Prod by 1, NO- Add product to cart
	for (let i = 0; i < productsInCart.length; i++) {
		if (productsInCart[i].id == product.id) { // check the product id = prduct index IF YES then...
			productsInCart[i].count += 1;
			productsInCart[i].price = productsInCart[i].basePrice * productsInCart[i].count;
			return; //after updating the price, count we have exit from the function
		}
	} // if Product not present then
	productsInCart.push(product);
}

products.forEach(item => {   // 1
	item.addEventListener('click', (e) => { //callback function
		if (e.target.classList.contains('addToCart')) { 
			// grab the product and add it to the cart - line 144 button add to cart
			const productID = e.target.dataset.productId;
			const productName = item.querySelector('.productName').innerHTML;
			const productPrice = item.querySelector('.priceValue').innerHTML;
			const productImage = item.querySelector('img').src;
			let product = { // creating an object for the products info
				name: productName,
				image: productImage,
				id: productID,
				count: 1, //default value
				price: +productPrice, //convert the string to int so +
				basePrice: +productPrice, // the price will be changed each time count increments
			}
			updateProductsInCart(product); //add the above object to cart 
			updateShoppingCartHTML(); //update in HTML cart too
		} // to chk if element has this clas in the clasList
	});
});

//we are able to add the product into cart but should be able to incr or decr it.
parentElement.addEventListener('click', (e) => { // Last
	const isPlusButton = e.target.classList.contains('button-plus');
	const isMinusButton = e.target.classList.contains('button-minus');
	if (isPlusButton || isMinusButton) {
		for (let i = 0; i < productsInCart.length; i++) {
			if (productsInCart[i].id == e.target.dataset.id) { //by checking this id we know which product we want to update
				if (isPlusButton) {
					productsInCart[i].count += 1
				}
				else if (isMinusButton) {
					productsInCart[i].count -= 1
				}
				productsInCart[i].price = productsInCart[i].basePrice * productsInCart[i].count; //if count of product = 0, remove from cart

			}
			if (productsInCart[i].count <= 0) {
				productsInCart.splice(i, 1); //takes splice(index, how many items to be removed)
			}
		}
		updateShoppingCartHTML(); //updated resp  function as well
	}
});

updateShoppingCartHTML();