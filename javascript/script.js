
  let selectedProduct = null;
  let cartItems = [];         // { product_id, name, unitPrice, qty, total }
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
  const dispExpiry = document.getElementById("dispExpiry");
  const dispStock = document.getElementById("dispStock");
  const productQty = document.getElementById("productQty");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const clearProductBtn = document.getElementById("clearProductBtn");
  const cartBody = document.getElementById("cartBody");
  const subtotalSpan = document.getElementById("subtotalAmount");
  const discountInput = document.getElementById("discountInput");
  const netTotalAmountSpan = document.getElementById("netTotalAmount");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const payNetAmount = document.getElementById("payNetAmount");
  const paidAmountInput = document.getElementById("paidAmountInput");
  const changeAmountDisplay = document.getElementById("changeAmountDisplay");
  const digitalField = document.getElementById("digitalField");
  const customerPhoneInput = document.getElementById("customerPhoneInput");
  const fetchCustomerBtn = document.getElementById("fetchCustomerBtn");
  const custIdSpan = document.getElementById("custId");
  const custNameSpan = document.getElementById("custName");
  const custPhoneSpan = document.getElementById("custPhone");
  const custAddressSpan = document.getElementById("custAddress");
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
  const billDiscountSpan = document.getElementById("billDiscountSpan");
  const billNetSpan = document.getElementById("billNetSpan");
  const billMethodSpan = document.getElementById("billMethodSpan");

  // Helper: find product by barcode
  function findProductByBarcode(barcode) {
    return productsDB.find(p => p.barcode === barcode) || null;
  }

  // Display product in left panel
  function displayProduct(product) {
    selectedProduct = product;
    dispId.innerText = product.product_id;
    dispName.innerText = product.name;
    dispBarcode.innerText = product.barcode;
    dispPrice.innerText = `Rs. ${product.price}`;
    dispExpiry.innerText = product.expiry_date;
    dispStock.innerText = product.stock;
    addToCartBtn.disabled = false;
  }

  function clearProductDisplay() {
    selectedProduct = null;
    dispId.innerText = "—";
    dispName.innerText = "—";
    dispBarcode.innerText = "—";
    dispPrice.innerText = "—";
    dispExpiry.innerText = "—";
    dispStock.innerText = "—";
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
    const discountVal = parseFloat(discountInput.value) || 0;
    const net = Math.max(0, total - discountVal);
    netTotalAmountSpan.innerText = `Rs. ${net.toFixed(2)}`;
    payNetAmount.value = `Rs. ${net.toFixed(2)}`;
    currentDiscount = discountVal;
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
    if (qty > selectedProduct.stock) {
      alert(`Only ${selectedProduct.stock} items in stock!`);
      return;
    }
    const existing = cartItems.find(i => i.product_id === selectedProduct.product_id);
    if (existing) {
      existing.qty += qty;
      existing.total = existing.qty * existing.unitPrice;
    } else {
      cartItems.push({
        product_id: selectedProduct.product_id,
        name: selectedProduct.name,
        unitPrice: selectedProduct.price,
        qty: qty,
        total: qty * selectedProduct.price
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
  function fetchCustomerByPhone(phone) {
    return customersDB.find(c => c.phone === phone) || null;
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

function handleFetchCustomer() {
  const phone = customerPhoneInput.value.trim();
  if (!phone) { alert("Enter phone number"); return; }

  const existing = fetchCustomerByPhone(phone);

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

  function saveNewCustomer() {
    const phone = customerPhoneInput.value.trim();
    const name = newCustName.value.trim();
    const address = newCustAddress.value.trim();
    if (!phone || !name) { alert("Name and phone required"); return; }
    if (fetchCustomerByPhone(phone)) { alert("Customer already exists!"); return; }
    const newId = `CUST${String(customersDB.length + 1).padStart(3, '0')}`;
    const newCust = { customer_id: newId, name, phone, address };
    customersDB.push(newCust);
    displayCustomerDetails(newCust);
    newCustomerPanel.style.display = "none";
    document.getElementById("addCustomerTrigger").style.display = "block";
    newCustName.value = "";
    newCustAddress.value = "";
    alert("Customer registered successfully!");
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
    const discount = parseFloat(discountInput.value) || 0;
    const netTotal = Math.max(0, totalCart - discount);
    billTotalSpan.innerText = `Rs. ${totalCart.toFixed(2)}`;
    billDiscountSpan.innerText = `Rs. ${discount.toFixed(2)}`;
    billNetSpan.innerText = `Rs. ${netTotal.toFixed(2)}`;
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

  function printBill() {
    if (cartItems.length === 0) { alert("Cart empty!"); return; }
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
      const product = findProductByBarcode(code);
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
  manualLookupBtn.addEventListener("click", () => {
    const code = manualBarcode.value.trim();
    if (!code) return;
    const prod = findProductByBarcode(code);
    if (prod) displayProduct(prod);
    else alert("Product not found!");
  });
  startScanner.addEventListener("click", startQuagga);
  stopScanner.addEventListener("click", stopQuagga);
  addToCartBtn.addEventListener("click", addToCartHandler);
  clearProductBtn.addEventListener("click", clearProductDisplay);
  clearCartBtn.addEventListener("click", clearCart);
  discountInput.addEventListener("input", () => updateCartUI());
  paidAmountInput.addEventListener("input", updatePaymentChange);
  fetchCustomerBtn.addEventListener("click", handleFetchCustomer);
  showAddCustomerBtn.addEventListener("click", () => {
    newCustomerPanel.style.display = "block";
    showAddCustomerBtn.style.display = "none";
  });
  saveNewCustomerBtn.addEventListener("click", saveNewCustomer);
  printBillBtn.addEventListener("click", printBill);
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
  paidAmountInput.value = 0;
  changeAmountDisplay.value = "Rs. 0.00";
  billCashier.innerText = document.getElementById("cashierName").innerText;
  updateBillPreview();
