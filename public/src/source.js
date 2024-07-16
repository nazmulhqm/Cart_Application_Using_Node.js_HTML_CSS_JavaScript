let shop = document.getElementById("shop");
let dataArray = JSON.parse(localStorage.getItem("data")) || [];
let ShoppingCart = document.getElementById("shopping-cart");
let label = document.getElementById("label");
let productDetail = JSON.parse(localStorage.getItem("productDetail"));

//index

let generateShop = () => {
  return (shop.innerHTML = shopItemsData
    .map((x) => {
      let { id, name, desc, img, price } = x;
      let search = dataArray.find((y) => y.id === id) || [];
      return `
    <div class="item">
      <img width="220" src="${img}" alt="" onclick="showProductDetail('${id}')">
      <div class="details">
        <h3 onclick="showProductDetail('${id}')">${name}</h3>

        <div class="price-quantity">
          <h2>$ ${price} </h2>
          <div class="buttons">
            <i onclick="decrement('${id}')" class="bi bi-dash-lg"></i>
            <div id="${id}" class="quantity">${
        search.item === undefined ? 0 : search.item
      }</div>
            <i onclick="increment('${id}')" class="bi bi-plus-lg"></i>
          </div>
        </div>
      </div>
    </div>
    `;
    })
    .join(""));
};

function showProductDetail(productId) {
  const product = shopItemsData.find((item) => item.id === productId);

  localStorage.setItem("productDetail", JSON.stringify(product));
  window.location.href = "product.html";
}

//cart

let generateCartItems = () => {
  if (dataArray.length !== 0) {
    return (ShoppingCart.innerHTML = dataArray
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((x) => x.id === id);
        if (!search) {
          return "";
        }
        let { img, price, name } = search;

        return `
      <div class="cart-item">
        <img width="100" src=${img} alt="" onclick="showProductDetail('${id}')/>
        <div class="details">
        
          <div class="title-price-x">
            <h4 class="title-price">
              <p >${name}</p>
              <p class="cart-item-price">$ ${price}</p>
            </h4>
            <i onclick="removeItem('${id}')" class="bi bi-x-lg"></i>
          </div>

          <div class="cart-buttons">
            <div class="buttons">
              <i onclick="decrement('${id}')" class="bi bi-dash-lg"></i>
              <div id="${id}" class="quantity">${item}</div>
              <i onclick="increment('${id}')" class="bi bi-plus-lg"></i>
            </div>
          </div>

          <h3>$ ${item * price}</h3>
        
        </div>
      </div>
      `;
      })
      .join(""));
  } else {
    ShoppingCart.innerHTML = "";
    label.innerHTML = `
    <h2>Cart is Empty</h2>
    <a href="index.html">
      <button class="HomeBtn">Back to Home</button>
    </a>
    `;
  }
};

//product

let generateDetailsItem = (productDetail) => {
  if (productDetail) {
    const productInfo = document.getElementById("product-info");
    productInfo.innerHTML = `
      <h1>${productDetail.name}</h1>
      <div class="image">
        <img src="${productDetail.img}" alt="${productDetail.name}">
      </div>
      <div class="content">
        <div class="price">Price: $${productDetail.price}</div>
        <div class="description">${productDetail.desc}</div>
        <div class="cart-options">
          <button onclick="increment('${productDetail.id}')">Add to Cart</button>
          <button onclick="decrement('${productDetail.id}')">Remove from Cart</button>
        </div>
      </div>
    `;
  }
};

//recipt

let generateReceipt = () => {
  let receiptContent = "<h2>Receipt</h2>";

  dataArray.forEach(({ id, item }) => {
    const { name, price } = shopItemsData.find(
      (itemData) => itemData.id === id
    );
    receiptContent += `<p>${name}: ${item} x $${price.toFixed(2)} = $${(
      item * price
    ).toFixed(2)}</p>`;
  });

  const totalAmount = dataArray.reduce((total, { id, item }) => {
    const { price } = shopItemsData.find((itemData) => itemData.id === id);
    return total + item * price;
  }, 0);

  receiptContent += `<p>Total: $${totalAmount.toFixed(2)}</p>`;

  label.innerHTML = receiptContent;
};

//All

let increment = (id) => {
  let selectedItem = id;
  let search = dataArray.find((x) => x.id === selectedItem);

  if (search === undefined) {
    dataArray.push({
      id: selectedItem,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  update(selectedItem);
  localStorage.setItem("data", JSON.stringify(dataArray));
};

let decrement = (id) => {
  let selectedItem = id;
  let search = dataArray.find((x) => x.id === selectedItem);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }

  update(selectedItem);
  dataArray = dataArray.filter((x) => x.item !== 0);
  localStorage.setItem("data", JSON.stringify(dataArray));
};

let update = (id) => {
  let search = dataArray.find((x) => x.id === id);

  let quantityElement = document.getElementById(id);
  if (quantityElement) {
    quantityElement.innerHTML = search ? search.item : 0;
  }
  calculation();
};

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = dataArray.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();

let removeItem = (id) => {
  let selectedItem = id;
  dataArray = dataArray.filter((x) => x.id !== selectedItem);
  calculation();
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(dataArray));
};

let TotalAmount = () => {
  if (dataArray.length !== 0) {
    let amount = dataArray
      .map((x) => {
        let { id, item } = x;
        let filterData = shopItemsData.find((x) => x.id === id);
        return filterData.price * item;
      })
      .reduce((x, y) => x + y, 0);

    return (label.innerHTML = `
    <h2>Total Bill : $ ${amount}</h2>
    <a href="checkout.html"><button class="checkout">Checkout</button><a>
    <button onclick="clearCart(); generateCartItems()" class="removeAll">Clear Cart</button>
    `);
  } else return;
};

let clearCart = () => {
  dataArray = [];

  calculation();
  localStorage.setItem("data", JSON.stringify(dataArray));
};
