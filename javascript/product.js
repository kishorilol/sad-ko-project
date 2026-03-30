import { BASE_URL } from "./config.js";

const scanBtn = document.getElementById('scan-btn');
const scannerContainer = document.getElementById('scanner-container');
const barcodeInput = document.getElementById('barcode');

console.log(scanBtn);


window.addEventListener("DOMContentLoaded", ()=>{
    console.log("This is product.js")
    loadTable();
    loadStats();
})


window.handleDropdown = function(select){
    if (select.value === "logout") {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}

window.closePopup = function(){
    document.getElementById("popup").style.display = "none";
}

let products = [];
const currentPage = 1;
const rowsPerPage = 5;

let isScanning = false;

window.scanBtn = function(){
    if (!isScanning) {
        startScanner();
        scanBtn.textContent = "Stop Scanning";
    } else {
        stopScanner();
        scanBtn.textContent = "Scan Barcode ||| |||||";
    }
    isScanning = !isScanning;
}


async function loadTable(){
    let response;
    try{
        response = await fetch(`${BASE_URL}/admin/product/getAllProducts`,{
            method : "GET",
            headers : getHeader()
        });

        if(!response.ok){
            const msg = await response.text();
            alert("Error " + msg);
            products = [];
            return;
        }else{
            products = await response.json();
        }

        render();
    }catch(err){
        console.log(err);
    }
}

function getHeader(){
    const token = localStorage.getItem("token");

    return{
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
    }
}

function startScanner() {
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: scannerContainer, // camera feed goes inside blue box
            constraints: {
                facingMode: "environment" // back camera
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"]
        }
    }, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            Quagga.start();
    });

    Quagga.onDetected((data) => {
        const code = data.codeResult.code;
        stopScanner();
        fillForm(code);
        scanBtn.textContent = "Scan Barcode";
        isScanning = false;
    });
}

function fillForm(code){
    const productName = document.getElementById('name');
    barcodeInput().value = code;

    for(i=0; i<products.length; i++){
        if(code === products.barcode){
            productName.value = products.name;
            document.getElementById('add-new-product').style.cursor = "not-allowed";
        }else{
            document.getElementById('add-new-batch').style.cursor = "not-allowed";
        }
    }
}

function stopScanner() {
    Quagga.stop();
}

function render(){
    let tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedProducts = products.slice(start, end);

    let status = "Available";

    paginatedProducts.forEach(product=>{
    let availableStock = 0;

    product.batches.forEach(batch =>{
        availableStock += batch.stock;
    })

    if(product.deleted) status = "Unavailable"

    console.log(product);

    let row = `
        <tr>
            <td>${product.Id}</td>
            <td>${product.name}</td>
            <td>${product.barcode}</td>
            <td>${availableStock}</td>
            <td>${product.sellingPrice}</td>
            <td>${status}
            <td>
                <button class = "edit-btn" data-barcode="${product.barcode}">Edit</button>
                <button class = "delete-btn" data-barcode="${product.barcode}">Delete</button>
            </td>
        </tr>`;

        tbody.innerHTML += row;
    });

    renderPagination();
    attachEvents();

};

function attachEvents(){
    document.querySelectorAll('.edit-btn').forEach(btn =>{
        btn.addEventListener("click", () => editProducts(btn.dataset.barcode));
    });

    
    document.querySelectorAll('.delete-btn').forEach(btn =>{
        btn.addEventListener("click", () => deleteProduct(btn.dataset.barcode));
    });
}

function renderPagination(){
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    const pageCount = Math.ceil(products.length/rowsPerPage);

    const prev = document.createElement("span");
    prev.innerText = "<";
    prev.classList.add("prev");
    prev.style.cursor = currentPage === 1? "not-allowed" : "pointer";
    prev.onclick = () => {
        if(currentPage>1){
            currentPage--;
            renderTable();
        }
    };
    pagination.appendChild(prev);

    for(let i =1; i<=pageCount; i++){
        const page = document.createElement("span");
        page.innerText = i;
        page.classList.add("num");

        if(i === currentPage) page.classList.add("active-page");
        
        page.style.cursor = "pointer";

        page.onclick = () =>{
            currentPage = i;
            renderTable();
        };

        pagination.appendChild(page);
    }

    const next = document.createElement("span");
    next.innerText= ">";
    next.classList.add("next");
    next.style.cursor = currentPage === pageCount ? "not-allowed" : "pointer";
    next.onclick = () =>{
        if(currentPage < pageCount){
            currentPage++;
            renderTable();
        }
    }
    pagination.appendChild(next);
        
}

async function loadStats(){
    try{
        document.getElementById('total-product').innerText = await fetch(`${BASE_URL}/admin/product/getTotalItemsCount`,{method:"GET", headers : getHeader()}).then(r => r.json());
        document.getElementById('low-stock-product').innerText = await fetch(`${BASE_URL}/admin/product/getLowStockProductsCount`,{method:"GET", headers : getHeader()}).then(r => r.json());
        document.getElementById('on-stock-product').innerText = await fetch(`${BASE_URL}/admin/product/getOnStockProductsCount`,{method:"GET", headers : getHeader()}).then(r => r.json());
        document.getElementById('out-of-stock').innerText = await fetch(`${BASE_URL}/admin/product/getOutOfStockProductsCount`,{method:"GET", headers : getHeader()}).then(r => r.json());
    }catch(err){
        console.log(err);
    }
}

async function deleteProduct(barcode){
    if(!confirm("Are you sure?")) return;

    await fetch(`${BASE_URL}/admin/deleteProductByBarcode/${barcode}`,{
        method : "DELETE",
        headers : getHeader()
    });

    loadStats();
    loadTable
}

function editProducts(barcode){
    const p = products.find(c => c.barcode == barcode)
    document.getElementById("name").value = p.name;
    document.getElementById("barcode").value = p.barcode;
    document.getElementById("price").value = p.sellingPrice;
    document.getElementById("status").value = p.deleted;

    document.getElementById("form-title").innerText = "Update Product Details";
    document.getElementById("popup").style.display = "block";
}


window.onload = function () {
    document.querySelector(".admin select").selectedIndex = 0;
};

