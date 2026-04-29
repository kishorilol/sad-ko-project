import { BASE_URL } from "./config.js";

window.addEventListener("DOMContentLoaded", ()=>{
    getDataFromBackend();
    document.getElementById("search-input").addEventListener("input", filterData);
    document.getElementById("address-select").addEventListener("change", filterData);
})

window.handleDropdown = function(select){
    if(select.value === "logout"){
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("cashierId");
        window.location.href = ("/index.html");
    }
}

const token = localStorage.getItem("token");
if(!token){
    window.location.replace("/index.html");
}

let data = [];
let currentPage = 1;
let rowsPerPage = 5;

async function getDataFromBackend(){
    let response;

    try{
        response = await fetch(`${BASE_URL}/admin/getAllCustomersAndStats`,{
            method : "GET",
            headers : getHeader()
        })

        if(!response.ok){
            const msg = await response.text();
            alert("Error: " + msg)
            return;
        }
        else{
            data = await response.json();
        }

        loadStats(data.totalCustomer, data.customersArrivedToday, data.regularCustomer);
        renderTable(data.customers);

    }catch(err){
        console.log(err);
    }
}

function getHeader(){
    const token = localStorage.getItem("token");
    return {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
    }
}

function loadStats(totalCustomer, customersArrivedToday, regularCustomer){
    try{
        document.getElementById("total-customer").innerHTML = totalCustomer;
        document.getElementById("customer-arrived-today").innerHTML = customersArrivedToday;
        document.getElementById("regular-customer").innerHTML = regularCustomer;
    }catch(err){
        console.log(err);
    }
}

function renderTable(customers) {
    let tableBody = document.querySelector("#table-body");
    tableBody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedCustomers = customers.slice(start, end);

    paginatedCustomers.forEach(customer => {
        let row = `
            <tr>
                <td>${customer.customerId}</td>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.address}</td>
                <td>${customer.lastVisited}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    renderPagination(customers);
}


function filterData() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const selectedAddress = document.getElementById("address-select").value;

    const filteredData = data.customers.filter(customer => {
        const matchesSearchTerm = 
            customer.name.toLowerCase().includes(searchTerm) || customer.phone.includes(searchTerm);
        
        let matchesAddress;

        if (selectedAddress === "all") {
            matchesAddress = true; // Show all customers
        } else if (selectedAddress === "others") {
            matchesAddress = customer.address && customer.address.toLowerCase() !== "kathmandu" &&
                             customer.address.toLowerCase() !== "bhaktapur" &&
                             customer.address.toLowerCase() !== "lalitpur";
        } else {
            matchesAddress = customer.address.toLowerCase() === selectedAddress.toLowerCase(); // Exact match
        }

        return matchesSearchTerm && matchesAddress;
    });

    currentPage = 1;  // Reset to the first page when filtering
    renderTable(filteredData);
}



function renderPagination(customers) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    const pageCount = Math.ceil(customers.length / rowsPerPage);
    
    // Add previous and next buttons
    const prev = document.createElement("span");
    prev.innerText = "<";
    prev.classList.add("prev");
    prev.style.cursor = currentPage === 1 ? "not-allowed" : "pointer";
    prev.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(customers);
        }
    };
    pagination.appendChild(prev);

    for (let i = 1; i <= pageCount; i++) {
        const page = document.createElement("span");
        page.innerText = i;
        page.classList.add("num");

        if (i === currentPage) page.classList.add("active-page");

        page.style.cursor = "pointer";
        page.onclick = () => {
            currentPage = i;
            renderTable(customers);
        };

        pagination.appendChild(page);
    }

    const next = document.createElement("span");
    next.innerText = ">";
    next.classList.add("next");
    next.style.cursor = currentPage === pageCount ? "not-allowed" : "pointer";
    next.onclick = () => {
        if (currentPage < pageCount) {
            currentPage++;
            renderTable(customers);
        }
    };
    pagination.appendChild(next);
}
