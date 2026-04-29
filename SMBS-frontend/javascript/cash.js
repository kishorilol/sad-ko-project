import { BASE_URL } from "./config.js";

const token = localStorage.getItem("token");
if(!token){
  window.location.replace("/index.html");
}

window.logout = function(){
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  localStorage.removeItem("cashierId");
  window.location.href = "/index.html"
}

  let selectedProduct = null;
  let cartItems = [];  
  let cartItemsToPrint = [];       // { product_id, name, unitPrice, qty, total }
  let currentCustomer = null;
  let currentDiscount = 0;
  let currentPaymentMethod = "Cash";
  let billCounter = 2001;

  // DOM Elements
  const manualBarcode = document.getElementById("manualBarcode");
  const manualLookupBtn = document.getElementById("manualLookupBtn");
  const startScanner = document.getElementById("startScannerBtn");
  const stopScanner = document.getElementById("stopScannerBtn");
  const dispId = document.getElementById("dispId");
  const dispName = document.getElementById("dispName");
  const dispBarcode = document.getElementById("dispBarcode");
  const dispPrice = document.getElementById("dispPrice");
  const productQty = document.getElementById("productQty");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const clearProductBtn = document.getElementById("clearProductBtn");
  const cartBody = document.getElementById("cartBody");
  const subtotalSpan = document.getElementById("totalAmount");
  const discountInput = document.getElementById("discountInput");
  const netTotalAmountSpan = document.getElementById("netTotalAmount");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const payNetAmount = document.getElementById("payNetAmount");
  const paidAmountInput = document.getElementById("paidAmountInput");
  const changeAmountDisplay = document.getElementById("changeAmountDisplay");
  const digitalField = document.getElementById("digitalField");
  const customerPhoneInput = document.getElementById("customerPhoneInput");
  const fetchCustomerBtn = document.getElementById("fetchCustomerBtn");
  const newCustomerPanel = document.getElementById("newCustomerPanel");
  const showAddCustomerBtn = document.getElementById("showAddCustomerBtn");
  const saveNewCustomerBtn = document.getElementById("saveNewCustomerBtn");
  const newCustName = document.getElementById("newCustName");
  const newCustAddress = document.getElementById("newCustAddress");
  const printBillBtn = document.getElementById("printBillBtn");
  const billIdDisplay = document.getElementById("billIdDisplay");
  const billDateDisplay = document.getElementById("billDateDisplay");
  const billCustName = document.getElementById("billCustName");
  const billCustPhone = document.getElementById("billCustPhone");
  const billCustAddr = document.getElementById("billCustAddr");
  const billItemsBody = document.getElementById("billItemsBody");
  const billTotalSpan = document.getElementById("billTotalSpan");
  const billNetSpan = document.getElementById("billNetSpan");
  const billMethodSpan = document.getElementById("billMethodSpan");
  const username = document.getElementById('cashierName').innerText = localStorage.getItem("username");

  // Helper: find product by barcode
  function findProductByBarcode(barcode) {
    return getProducts(barcode);
  }

  async function getProducts(barcode){
    try{
      let response = await fetch(`${BASE_URL}/product/getByCode/${barcode}`,{
        method: "GET",
        headers: getHeaders()
      });

      if(!response.ok){
        if(response.status === 404){
          return null;
        }
        else{
          alert("Error: " + response.text());
          return;
        }
      }
      const data = await response.json();
      
       if (Array.isArray(data) && data.length > 0) {
            return data[0];
        }
    }
    catch(err){
      console.log(err);
    }
  }

  function getHeaders(){
    const token = localStorage.getItem("token");

    return{
      "Content-Type" : "application/json",
      "Authorization" : `Bearer ${token}`
    };
  }

  // Display product in left panel
  async function displayProduct(product) {
    selectedProduct = product;
    dispId.innerText = product.Id;
    dispName.innerText = product.name;
    dispBarcode.innerText = product.barcode;
    dispPrice.innerText = `Rs. ${product.sellingPrice}`;
    addToCartBtn.disabled = false;
  }

  function clearProductDisplay() {
    selectedProduct = null;
    dispId.innerText = "—";
    dispName.innerText = "—";
    dispBarcode.innerText = "—";
    dispPrice.innerText = "—";
    addToCartBtn.disabled = true;
    productQty.value = 1;
  }

  // Cart functions
  function updateCartUI() {
    cartBody.innerHTML = "";
    let total = 0;
    cartItems.forEach((item, idx) => {
      total += item.total;
      const row = cartBody.insertRow();
      row.insertCell(0).innerText = item.name;
      const qtyCell = row.insertCell(1);
      const qtyInput = document.createElement("input");
      qtyInput.type = "number";
      qtyInput.value = item.qty;
      qtyInput.min = 1;
      qtyInput.style.width = "65px";
      qtyInput.style.borderRadius = "12px";
      qtyInput.style.padding = "4px";
      qtyInput.addEventListener("change", (e) => updateCartItemQty(item.product_id, parseInt(e.target.value) || 1));
      qtyCell.appendChild(qtyInput);
      row.insertCell(2).innerText = `Rs. ${item.unitPrice}`;
      row.insertCell(3).innerText = `Rs. ${item.total.toFixed(2)}`;
      const delCell = row.insertCell(4);
      const delBtn = document.createElement("button");
      delBtn.innerText = "❌";
      delBtn.className = "btn btn-sm";
      delBtn.style.background = "#fee2e2";
      delBtn.onclick = () => removeCartItem(item.product_id);
      delCell.appendChild(delBtn);
    });
    
    subtotalSpan.innerText = `Rs. ${total.toFixed(2)}`;

    if (netTotalAmountSpan) {
    netTotalAmountSpan.innerText = `Rs. ${total.toFixed(2)}`;
    }

    if (payNetAmount) {
      payNetAmount.innerText = `Rs. ${total.toFixed(2)}`;
    }


    
    updatePaymentChange();
    updateBillPreview();
  }

  function updateCartItemQty(productId, newQty) {
    const item = cartItems.find(i => i.product_id === productId);
    if (item) {
      if (newQty <= 0) {
        removeCartItem(productId);
        return;
      }
      item.qty = newQty;
      item.total = item.qty * item.unitPrice;
      updateCartUI();
    }
  }

  function removeCartItem(productId) {
    cartItems = cartItems.filter(i => i.product_id !== productId);
    updateCartUI();
  }

  function addToCartHandler() {
    if (!selectedProduct) return;
    let qty = parseInt(productQty.value);
    if (isNaN(qty) || qty < 1) qty = 1;
    console.log(cartItems);
    const existing = cartItems.find(i => i.product_id === selectedProduct.Id);
    if (existing) {
      existing.qty += qty;
      existing.total = existing.qty * existing.unitPrice;
    } else {
      cartItems.push({
        product_id: selectedProduct.Id,
        barcode: selectedProduct.barcode,
        name: selectedProduct.name,
        unitPrice: selectedProduct.sellingPrice,
        qty: qty,
        total: qty * selectedProduct.sellingPrice
      });
    }
    updateCartUI();
    clearProductDisplay();
  }

  function clearCart() {
    if (cartItems.length && confirm("Clear entire cart?")) {
      cartItems = [];
      updateCartUI();
    }
  }

 

  // Customer handlers
  async function fetchCustomerByPhone(phone) {
    return await getCustomersInfo(phone) || null;
  }

  function displayCustomerDetails(customer) {
  if (customer) {
    currentCustomer = customer;
    newCustomerPanel.style.display = "none";
    document.getElementById("addCustomerTrigger").style.display = "block";
  } else {
    currentCustomer = null;
  }
  updateBillPreview();
}

async function getCustomersInfo(phone){
  try{
    let response = await fetch(`${BASE_URL}/cashier/getByPhone/${phone}`,{
      method: "GET",
      headers: getHeaders()
    })

    if(!response.ok){
      if(response.status === 404){
        return null;
      }
      else{
        alert("Error: " + response.text());
        return;
      }
    }

    return await response.json();
  }
  catch(err){
    console.log(err);
  }
}

function buildBillRequest() {
  return {
    items: cartItems.map(item => ({
      barcode: item.barcode,
      quantity: item.qty
    })),
    paidAmount: parseFloat(payNetAmount.innerText.replace('Rs. ', '')) || 0,
    customerId: currentCustomer ? currentCustomer.customerId : null,
    cashierId: getCashierId()
  };
}

function getCashierId(){
  return localStorage.getItem("Id");
}

async function submitBill() {
  if (cartItems.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const netTotal = parseFloat(payNetAmount.innerText.replace('Rs. ', '')) || 0;
  const paidAmount = parseFloat(paidAmountInput.value) || 0;

  
  const billRequest = buildBillRequest();
  
  if (paidAmount < netTotal) {
    alert(`Amount paid (Rs. ${paidAmount}) is less than total amount (Rs. ${netTotal})!`);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/cashier/bill/payment`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(billRequest)
    });

    if (!response.ok) {
      const errText = await response.text();
      alert("Error: " + errText);
      return;
    }

    const result = await response.json();
    console.log("Bill created:", result);

    alert("Bill generated successfully!");

    billCounter ++;
    const billData = {
      billNumber: `INV-${result.Id}`,
      items: [...cartItems],
      total: netTotal,
      paidAmount: paidAmount,
      change: paidAmount - netTotal,
      customer: currentCustomer ? { ...currentCustomer } : null,
      paymentMethod: currentPaymentMethod,
      date: new Date().toLocaleDateString()
    };

    return billData;

  } catch (err) {
    console.error(err);
    alert("Failed to create bill");
  }
}

function updatePaymentChange() {
  const netTotalText = payNetAmount.innerText.replace('Rs. ', '');
  const netTotal = parseFloat(netTotalText) || 0;
  const paidAmount = parseFloat(paidAmountInput.value) || 0;
  const change = Math.max(0, paidAmount - netTotal);
  changeAmountDisplay.innerText = `Rs. ${change.toFixed(2)}`;
  
}

async function handleFetchCustomer() {
  const phone = customerPhoneInput.value.trim();
  if (!phone) { alert("Enter phone number"); return; }

  const existing = await fetchCustomerByPhone(phone);
  console.log(existing);

  if (existing) {
    displayCustomerDetails(existing);
  } else {
    alert("New customer! Please register.");
    displayCustomerDetails(null);

    newCustomerPanel.style.display = "block";
    document.getElementById("addCustomerTrigger").style.display = "none";

    // 👇 IMPORTANT: force scroll
    newCustomerPanel.scrollIntoView({ behavior: "smooth" });
  }
}

  async function saveNewCustomer() {
    const phone = customerPhoneInput.value.trim();
    const name = newCustName.value.trim();
    const address = newCustAddress.value.trim();
    if (!phone || !name) { alert("Name and phone required"); return; }
    if (await fetchCustomerByPhone(phone)) { alert("Customer already exists!"); return; }
    try {
    const response = await fetch(`${BASE_URL}/cashier/customer/addNewCustomer`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name, phone, address })
    });
    
    if (response.ok) {
      const newCustomer = await response.json();
      displayCustomerDetails(newCustomer);
      newCustomerPanel.style.display = "none";
      document.getElementById("addCustomerTrigger").style.display = "block";
      newCustName.value = "";
      newCustAddress.value = "";
      alert("Customer registered successfully!");
    } else {
      alert("Failed to register customer");
    }
  } catch (err) {
    console.log(err);
    alert("Error registering customer");
  }
  }

  // Bill Preview
  function updateBillPreview() {
    const now = new Date();
    billDateDisplay.innerText = now.toLocaleString();
    billIdDisplay.innerText = `INV-${billCounter}`;
    if (currentCustomer) {
      billCustName.innerText = currentCustomer.name;
      billCustPhone.innerText = currentCustomer.phone;
      billCustAddr.innerText = currentCustomer.address;
    } else {
      billCustName.innerText = "Guest";
      billCustPhone.innerText = "—";
      billCustAddr.innerText = "—";
    }
    let totalCart = 0;
    cartItems.forEach(item => totalCart += item.total);
    billTotalSpan.innerText = `Rs. ${totalCart.toFixed(2)}`;
    billNetSpan.innerText = `Rs. ${totalCart.toFixed(2)}`;
    billMethodSpan.innerText = currentPaymentMethod;

    billItemsBody.innerHTML = "";
    cartItems.forEach(item => {
      const row = billItemsBody.insertRow();
      row.insertCell(0).innerText = item.name;
      row.insertCell(1).innerText = item.qty;
      row.insertCell(2).innerText = `Rs. ${item.unitPrice}`;
      row.insertCell(3).innerText = `Rs. ${item.total.toFixed(2)}`;
    });
    if (cartItems.length === 0) {
      const row = billItemsBody.insertRow();
      row.insertCell(0).colSpan = 4;
      row.insertCell(0).innerText = "No items";
    }
  }

  function printBill(billData) {
    if (!billData) { alert("Cart empty!"); return; }
    window.print();
  }

  // Barcode scanning with Quagga
  let scannerActive = false;
  function startQuagga() {
    if (scannerActive) return;
    Quagga.init({
      inputStream: { type: "LiveStream", target: document.querySelector("#scannerContainer"), constraints: { facingMode: "environment" } },
      decoder: { readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader"] }
    }, (err) => {
      if (err) { console.error(err); alert("Camera error"); return; }
      Quagga.start();
      scannerActive = true;
    });
    Quagga.onDetected((data) => {
      const code = data.codeResult.code;
      let product = findProductByBarcode(code);
      if (product) displayProduct(product);
      else alert(`Product with barcode ${code} not found`);
    });
  }
  function stopQuagga() {
    if (scannerActive) {
      Quagga.stop();
      scannerActive = false;
    }
  }

  // Event Listeners
  manualLookupBtn.addEventListener("click", async () => {
    const code = manualBarcode.value.trim();
    if (!code) return;
    let product = await findProductByBarcode(code);
    if (product) displayProduct(product);
    else alert("Product not found!");
  });
  startScanner.addEventListener("click", startQuagga);
  stopScanner.addEventListener("click", stopQuagga);
  addToCartBtn.addEventListener("click", addToCartHandler);
  clearProductBtn.addEventListener("click", clearProductDisplay);
  clearCartBtn.addEventListener("click", clearCart);
  fetchCustomerBtn.addEventListener("click", handleFetchCustomer);
  showAddCustomerBtn.addEventListener("click", () => {
    newCustomerPanel.style.display = "block";
    showAddCustomerBtn.style.display = "none";
  });
  paidAmountInput.addEventListener("input", updatePaymentChange)
  saveNewCustomerBtn.addEventListener("click", saveNewCustomer);
  printBillBtn.addEventListener("click", async () => {
    const billData = await submitBill();
    if(billData){
      printBill(billData);
      cartItems = [];
      updateCartUI();
      paidAmountInput.value = 0;
      updatePaymentChange();
    }
  });
  const radios = document.querySelectorAll('input[name="paymentMethod"]');
  radios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      currentPaymentMethod = e.target.value;
      digitalField.style.display = currentPaymentMethod === "Digital" ? "flex" : "none";
      billMethodSpan.innerText = currentPaymentMethod;
      updateBillPreview();
    });
  });

  // Initial load
  clearProductDisplay();
  updateCartUI();
  username;
  paidAmountInput.value = 0;
  changeAmountDisplay.innerText = "Rs. 0.00";
  billCashier.innerText = document.getElementById("cashierName").innerText;
  updateBillPreview();
