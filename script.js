const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");
const apiBaseUrl = "https://ecommerce.routemisr.com/api/v1/";
const productsEndPoint = "products";
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
    `${isNewArrival ? '#new-arrival' : '#featured-products'} #product1 .pro-container`
  );

  productContainer.innerHTML = ""; // Clear previous products

  products.forEach((product) => {
    const productHTML = `
            <div class="pro">
                <img src="${product.imageCover}" alt="${product.title}">
                <div class="des">
                    <span>${product.brand.name}</span>
                    <h5>${product.title}</h5>
                    <div class="star">${generateStars(
      product.ratingsAverage
    )}</div>
                    <h4>$${product.price}</h4>
                </div>
                <a href="#" class="cart-btn"><i class="fa-solid fa-cart-shopping cart"></i></a>
            </div>
        `;
    const productElement = document.createElement("div");
    productElement.innerHTML = productHTML;

    const productDiv = productElement.firstElementChild;

    productDiv.onclick = function () {
      handleProductClick(product);
    };

    productContainer.appendChild(productDiv);
  });
}

function handleProductClick(product) {
  console.log("Product clicked:", product);
  window.location.href = `sproduct.html?id=${product._id}`;
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
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('authModal').style.display = 'block';
    // Modal Button Logic
    document.getElementById('loginButton').addEventListener('click', () => {
      window.location.href = './login.html'; // Redirect to login page
    });

    document.getElementById('signupButton').addEventListener('click', () => {
      window.location.href = './Signup.html'; // Redirect to sign-up page
    });

    document.getElementById('closeModalButton').addEventListener('click', () => {
      // Close the modal
      document.getElementById('authModal').style.display = 'none';
    });

  }
}

