const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");
const apiBaseUrl = "https://ecommerce.routemisr.com/api/v1/";
const productsEndPoint = "products";
const cartEndPoint = "cart";
var cart = [];
if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

async function fetchProducts(page, pagination) {
  const womenCategoryId = "6439d58a0049ad0b52b9003f";
  const menCategoryId = "6439d5b90049ad0b52b90048";
  const params = new URLSearchParams();
  params.append("category", menCategoryId);
  params.append("category", womenCategoryId);
  params.append("page", page);
  params.append("limit", 12);
  const apiUrl = `${apiBaseUrl}${productsEndPoint}?${params.toString()}`;
  console.log(`fetcheng new data with page : ${page}`);
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseJson = await response.json();
    if (pagination) {
      initPagination(responseJson.metadata.numberOfPages);
    }
    console.log(`for page ${page} response : ${responseJson.data}`);
    updateProductSection(responseJson.data, false);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
function updateProductSection(products, isNewArrival) {
  const productContainer = document.querySelector(
    `${isNewArrival ? "#new-arrival" : "#featured-products"
    } #product1 .pro-container`
  );

  productContainer.innerHTML = ""; // Clear previous products

  products.forEach((product) => {
    const productHTML = `
            <div class="pro">
                <img src="${product.imageCover}" alt="${product.title}" onclick="handleProductClick('${product._id}')">
                <div class="des">
                    <span>${product.brand.name}</span>
                    <h5>${product.title}</h5>
                    <div class="star">${generateStars(
      product.ratingsAverage
    )}</div>
                    <h4>$${product.price}</h4>
                </div>
                <div class="cart-btn" data-product='${JSON.stringify(product).replace(/'/g, "&apos;").replace(/"/g, "&quot;")}'><i class="fa-solid fa-cart-shopping cart"></i></div>
            </div>
        `;

    //const productElement = document.createElement("div");
    productContainer.innerHTML += productHTML;

    //const productDiv = productElement.firstElementChild;

    // productDiv.onclick = function () {
    //   // handleProductClick(product);
    // };

    //productContainer.appendChild(productDiv);

  });
  document.querySelectorAll('.cart-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const product = JSON.parse(button.getAttribute('data-product'));
      await addToCart(product);
      console.log("Adding product to cart:", product);
      // Add your cart handling logic here
    });
  });

}

function handleProductClick(productId) {
  console.log("Product clicked:", productId);
  window.location.href = `sproduct.html?id=${productId}`;
}

function generateStars(rating) {
  let starsHTML = "";
  for (let i = 1; i <= 5; i++) {
    starsHTML +=
      i <= rating
        ? `<i class="fa-solid fa-star"></i>`
        : `<i class="fa-regular fa-star"></i>`;
  }
  return starsHTML;
}
async function fetchNewProducts() {
  const womenCategoryId = "6439d58a0049ad0b52b9003f";
  const menCategoryId = "6439d5b90049ad0b52b90048";
  const params = new URLSearchParams();
  params.append("category", menCategoryId);
  params.append("category", womenCategoryId);
  params.append("limit", 8);
  const apiUrl = `${apiBaseUrl}${productsEndPoint}?${params.toString()}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseJson = await response.json();
    updateProductSection(responseJson.data, true);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
function initPagination(numOfPages) {
  const pagination = document.querySelector("#pagination");
  for (let index = 0; index < numOfPages; index++) {
    const page = index + 1;
    pagination.innerHTML += `<a href="#" onclick="fetchProducts(${page},${false})">${page}</a>`;
  }
}
async function fetchSpecificProduct() {
  const productId = getQueryParam("id");
  const apiUrl = `${apiBaseUrl}${productsEndPoint}/${productId}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseJson = await response.json();
    console.log(`response : ${responseJson.data}`);
    updateSpecificProduct(responseJson.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
function updateSpecificProduct(product) {
  const productCoverImage = document.querySelector(
    "#prodetails .single-pro-image"
  );
  const productDetailsContainer = document.querySelector(
    "#prodetails .single-pro-details"
  );

  productDetailsContainer.innerHTML += `<h4>Product Details</h4>
    <span>${product.description}
    </span>`;
  const addToCartButton = document.querySelector(
    "#prodetails .single-pro-details .normal"
  );
  const details = document.querySelector(
    "#prodetails .single-pro-details #details"
  );

  details.innerHTML = `<h6>${product.category.name}</h6>
                <h4>${product.title}</h4>
                <h2>$${product.price}</h2>`;
  productCoverImage.innerHTML = `
            <img src="${product.imageCover}" width="100%" id="MainImg" alt=${product.title}}>
             <div class="small-img-group"></div>`;
  const productSmallImages = document.querySelector(
    "#prodetails .single-pro-image .small-img-group"
  );

  product.images.forEach((image) => {
    productSmallImages.innerHTML += `<div class="small-img-col">
             <img src="${image}" width="100%" class="small-img" alt="">
           </div>`;
  });
  addToCartButton.onclick = async function () {
    await addToCart(product);
    console.log("event listener");
  };
  handleDetailsImages(product.images.length);
}
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
function handleDetailsImages(length) {
  var MainImg = document.getElementById("MainImg");
  var smalling = document.getElementsByClassName("small-img");
  console.log(smalling);
  for (let index = 0; index < length; index++) {
    smalling[index].onclick = function () {
      MainImg.src = smalling[index].src;
      console.log(MainImg);
    };
  }
}

// Login script
async function getUserInfo() {
  const response = await fetch('./login_feature/get_user_info.php');
  const data = await response.json();
  return data;
}
async function isGuest() {
  const userInfo = await getUserInfo();
  console.log((!userInfo || !userInfo.token) ? "guest" : "real user");
  return (!userInfo || !userInfo.token);
}

if (!isGuest())
  logoutButton.style.display = "block";

async function authUser() {
  const userInfo = await getUserInfo();
  // console.log("User info:" + JSON.stringify(userInfo));

  if (userInfo.token) {
    // User is logged in, proceed to checkout
    // console.log("User is logged in. Redirecting to checkout...");
    // POST products to api logic here
    // TO-DO
  } else {
    // User is not logged in showing pop up
    // console.log("User not logged in. Redirecting to login page.");
    const modalHTML = `
   <div id="authModal">
        <div id="PopUp-container">
            <img src="assets/Asset 3.png" width="200px" style="margin-top: 10px;margin-bottom: 10px;" alt="">
            <h3 style="margin-top:10px ;">Hello there,</h3>
            <h3 style="margin-top:10px ;font-size: 16px;">You're almost there! Click the button below to Login or Sign
                Up to proceed checkout</h3>
            <button id="loginButton">Log In</button>
            <button id="signupButton">Sign Up</button>
            <button id="closeModalButton">Cancel</button>
        </div>
    </div>
`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    document.getElementById("authModal").style.display = "block";
    // Modal Button Logic
    document.getElementById("loginButton").addEventListener("click", () => {
      window.location.href = "./login.html"; // Redirect to login page
    });

    document.getElementById("signupButton").addEventListener("click", () => {
      window.location.href = "./Signup.html"; // Redirect to sign-up page
    });

    document
      .getElementById("closeModalButton")
      .addEventListener("click", () => {
        // Close the modal
        document.getElementById("authModal").style.display = "none";
      });
  }
}

async function addToCart(product) {
  // Validate product object
  if (!product || !product._id || !product.description) {
    console.error("Invalid product data:", product);
    return;
  }

  const userInfo = await getUserInfo();

  // Check if user is logged in
  if (!userInfo || !userInfo.token) {
    saveLocalCartItem(product);// Add product to local cart
    console.log(`Product: ${product.description} added to local cart.`);
    return;
  }

  console.log(`Product: ${product.description} added to cart API.`);

  // Set up headers
  const myHeaders = new Headers();
  myHeaders.append("token", userInfo.token);
  myHeaders.append("Content-Type", "application/json"); // Ensure correct content type

  // Prepare request body
  const raw = JSON.stringify({ productId: product._id });

  // Define request options
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const apiUrl = `https://ecommerce.routemisr.com/api/v1/cart`;

  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Product added to cart successfully:", result);
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}

async function getCart() {
  const userInfo = await getUserInfo();
  if (!userInfo || !userInfo.token) {
    updateCartProducts(getLocalCartItems(), false);
    return;
  }
  var myHeaders = new Headers();
  console.log(userInfo.token);
  myHeaders.append("token", userInfo.token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const apiUrl = `${apiBaseUrl}${cartEndPoint}`;
  try {
    const response = await fetch(apiUrl, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseJson = await response.json();
    updateCartProducts(responseJson.data, true);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
function updateCartProducts(cart, isLogged) {
  const productsTable = document.querySelector("#cart table tbody");
  const products = isLogged ? cart.products : cart;
  // Validate that the table exists
  if (!productsTable) {
    console.error("Products table not found");
    return;
  }

  // Clear existing content
  productsTable.innerHTML = "";
  if (!Array.isArray(products)) {
    console.error("Invalid ARRAY products data:", products);
    return;
  }
  console.log(products);

  // Build the HTML string
  const rows = products.map((data) => {
    const product = isLogged ? data.product : data;

    // Validate product properties
    if (!product || !product.imageCover || !product.title) {
      console.error("Invalid product data", product);
      return "";
    }
    console.log("product adding : " + product);
    return `<tr>
              <td>
                  <a href="#" onclick= "removeCartItem('${product._id}')"> <i class="far fa-times-circle"></i></a>
              </td>
              <td>
                  <img src="${product.imageCover}" alt="">
              </td>
              <td>${product.title}</td>
              <td>${data.price}</td>
              <td><input type="number" value="${data.count ?? 1}" disabled></td>
              <td>${data.price * (data.count ?? 1)}</td>
            </tr>`;
  }).join(""); // Join array of rows into a single string
  const subtotalContainer = document.querySelector("#cart-add #subtotal table");
  subtotalContainer.innerHTML = `<tr>
                <td>Cart Subtotal</td>
                <td>$ ${cart.totalCartPrice ?? "Login to See price"}</td>
            </tr>
            <tr>
                <td>Shipping</td>
                <td>Free</td>
            </tr>
            <tr>
                <td>
                    <strong>Total</strong>
                </td>
                <td><strong>$ ${cart.totalCartPrice ?? "Login to See price"}</strong></td>
            </tr>`
  // Update table content
  productsTable.innerHTML = rows;
}
function getLocalCartItems() {
  const cartData = localStorage.getItem('user_cart');
  return cartData ? JSON.parse(cartData) : []; // Return parsed data or an empty array
}
function clearLocalCartItems() {
  localStorage.removeItem('user_cart');
  console.log('Cart data cleared.');
}
function saveLocalCartItem(cartItem) {
  // Retrieve the existing cart items from localStorage
  const existingCart = JSON.parse(localStorage.getItem('user_cart')) || [];

  // Add the new cart item to the list
  existingCart.push(cartItem);

  // Save the updated list back to localStorage
  localStorage.setItem('user_cart', JSON.stringify(existingCart));

  console.log('Cart items saved locally:', existingCart);
}
function removeLocalCartItem(itemId) {
  // Retrieve the existing cart from localStorage
  let existingCart = localStorage.getItem('user_cart');

  try {
    // Parse the cart data
    existingCart = JSON.parse(existingCart);
    if (!Array.isArray(existingCart)) {
      console.warn("Invalid cart data in localStorage. Cannot remove item.");
      return;
    }
  } catch (error) {
    console.error("Error parsing cart data from localStorage.", error);
    return;
  }

  // Filter out the item with the matching ID
  const updatedCart = existingCart.filter((item) => item._id !== itemId);

  // Save the updated cart back to localStorage
  localStorage.setItem('user_cart', JSON.stringify(updatedCart));
  updateCartProducts(updatedCart);

  console.log(`Item with ID ${itemId} removed from cart. Updated cart:`, updatedCart);
}
async function removeCartItem(itemId) {
  const userInfo = await getUserInfo();
  if (!userInfo || !userInfo.token) {
    removeLocalCartItem(itemId);
    return;
  }
  var myHeaders = new Headers();
  myHeaders.append("token", userInfo.token);

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };
  const apiUrl = `${apiBaseUrl}${cartEndPoint}/${itemId}`;
  try {
    const response = await fetch(apiUrl, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseJson = await response.json();
    updateCartProducts(responseJson.data, true);
    console.log(`product : ${itemId} deleted successfully`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
async function proceedToCheckout() {
  const userInfo = await getUserInfo();
  if (!userInfo || !userInfo.token) {
    authUser();
    return;
  }
  var myHeaders = new Headers();
  myHeaders.append("token", userInfo.token);

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };
  const apiUrl = `${apiBaseUrl}${cartEndPoint}`;
  try {
    const response = await fetch(apiUrl, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseJson = await response.json();
    updateCartProducts([], true);
    console.log(`cart deleted successfully`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
async function isGuest() {
  const userInfo = await getUserInfo();
  console.log((!userInfo || !userInfo.token) ? "guest" : "real user");
  return (!userInfo || !userInfo.token);
}
async function register() {
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("Welcome");
    const userInfo = await getUserInfo();
    console.log('userinfo:' + userInfo.userName + '\n isregister:' + userInfo.isRegister);

    if (!userInfo || !userInfo.token || !userInfo.isRegister) {
      console.log("error not coming from register");
      return;
    }

    const products = getLocalCartItems();

    // Function to add a delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const product of products) {
      await addToCart(product); // Call addToCart
      await delay(1000); // Wait for 2 seconds
    }

    clearLocalCartItems(); // Clear local cart items after adding all
  });
}
