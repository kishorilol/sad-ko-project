import { BASE_URL} from './config.js'

let filteredCashiers = [];

const token = localStorage.getItem("token");
if(!token){
    window.location.replace("/index.html");
}

window.addEventListener("DOMContentLoaded", () => {
    loadCashiers();
    loadStats();
    document.getElementById("search-input").addEventListener("input", applyFilters);
    document.getElementById("shift-filter").addEventListener("change", applyFilters);
    document.getElementById("status-filter").addEventListener("change", applyFilters);
})

window.addCashier = function() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("form-title").innerText = "Add Cashier";
    document.querySelector('#username-field').style.display = "block";
    document.querySelector('#password-field').style.display = "block";
    clearForm();
    editId = null;
}

window.closePopup = function(){
    document.getElementById("popup").style.display = "none";
}

window.saveCashier = async function (){
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let phone = document.getElementById("phone").value;
    let shift = document.getElementById("shift").value;
    let status = document.getElementById("status").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById('password').value;

    if(!name || !phone || !address || !shift || !status){
        alert("Please fill all the details!!!");
        return;
    }

    const data = {name, address, phone, shift, status};

    let response;

    try{
        if(editId) {
            response = await fetch(`${BASE_URL}/admin/update/${editId}`,{
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
        }else{
            if(!username){
                alert("Username is required!");
                return;
            }
            response = await fetch(`${BASE_URL}/admin/registerUser`,{
                method: "POST",
                headers: getHeaders(),
                body : JSON.stringify({
                user: {
                    username: username,
                    role: "CASHIER",
                    password: password
                },
                cashier: {
                    name, address, phone, shift, status
                }})
            });

            if (!response.ok) {
                const msg = await response.text();
                alert("Error: " + msg);
                return;
            }
        }
        closePopup();
        clearForm();

        await loadCashiers();
        await loadStats();
    }catch(err){
        console.log(err);
    }
};

window.handleDropdown = function (select) {
    if (select.value === "logout") {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("cashierId");
        window.location.href = "/index.html";
    }
};


let cashiers = [];
let editId = null;
let currentPage = 1;
const rowsPerPage = 5;

function getHeaders(){
    const token = localStorage.getItem("token");

    return {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
    };
}



async function loadCashiers(){
    try{
        const response = await fetch(`${BASE_URL}/admin/getAllCashiers`,{
            headers: getHeaders()
        });

        if(response.status == 204){
            cashiers = [];
        }else{
            cashiers = await response.json();
        }

        renderTable();
    }catch(err){
        console.assert(err);
    }
}

async function loadStats(){
    try{
        const total = await fetch(`${BASE_URL}/admin/getAllSize`, {headers: getHeaders()}).then(r => r.json());
        const active = await fetch(`${BASE_URL}/admin/getActiveSize`, {headers: getHeaders()}).then(r => r.json());
        const inactive = await fetch(`${BASE_URL}/admin/getInactiveSize`, {headers: getHeaders()}).then(r => r.json());
        const onShift = await fetch(`${BASE_URL}/admin/getOnShiftCashiers`, {headers: getHeaders()}).then(r => r.json());


        document.querySelector('.total').innerText = total;
        document.querySelector('.actives').innerText = active;
        document.querySelector('.inactive').innerText = inactive;
        document.querySelector('.onshift').innerText = onShift;

    }catch(err){
        console.log(err);
    }
}

function applyFilters(){
    const searchValue = document.getElementById("search-input").value.toLowerCase();
    const shiftValue = document.getElementById("shift-filter").value;
    const statusValue = document.getElementById("status-filter").value;

    filteredCashiers = cashiers.filter(c => {

        const matchSearch =
            c.cashierId.toString().includes(searchValue) ||
            c.name.toLowerCase().includes(searchValue);

        const matchShift = shiftValue === "" || c.shift === shiftValue;

        const matchStatus = statusValue === "" || c.status === statusValue;

        return matchSearch && matchShift && matchStatus;
    });

    currentPage = 1; // reset page
    renderTable();
}

function renderTable() {
    let tbody = document.querySelector("#table tbody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const data = filteredCashiers.length ? filteredCashiers : cashiers;
    const paginatedCashiers = data.slice(start, end);

    paginatedCashiers.forEach(cashier => {
        let statusClass = cashier.status.toLowerCase() === "active" ? "active-status" : "inactive-status";


        let row = `
            <tr>
                <td>${cashier.cashierId}</td>
                <td>${cashier.name}</td>
                <td>${cashier.address}</td>
                <td>${cashier.phone}</td>
                <td>${cashier.shift}</td>
                <td><span class="${statusClass}">${cashier.status}</span></td>
                <td>
                    <button class = "edit-btn" data-id="${cashier.cashierId}">Edit</button>
                    <button class = "delete-btn" data-id="${cashier.cashierId}">Delete</button>
                </td>
            </tr>
        `;

        tbody.innerHTML +=row;
    });

    renderPagination();
    attachEvents();
}

function attachEvents(){
    document.querySelectorAll('.edit-btn').forEach(btn =>{
        btn.addEventListener("click", () => editCashier(btn.dataset.id));
    });

    
    document.querySelectorAll('.delete-btn').forEach(btn =>{
        btn.addEventListener("click", () => deleteCashier(btn.dataset.id));
    });
}

function renderPagination(){
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    const data = filteredCashiers.length ? filteredCashiers : cashiers;
    const pageCount = Math.ceil(data.length / rowsPerPage);

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


function clearForm(){
    document.getElementById("name").value = "";
    document.getElementById("address").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("shift").value = "";
    document.getElementById("status").value = "";
}



async function deleteCashier(id){
    if(!confirm("Are you sure?")) return;

    await fetch(`${BASE_URL}/admin/delete/${id}`,{
        method: "DELETE",
        headers: getHeaders()
    });

    loadCashiers();
    loadStats();
}

function editCashier(id) {
    const c = cashiers.find(x => x.cashierId == id);
    
    console.log(c.name);
    document.getElementById("name").value = c.name;
    document.getElementById("address").value = c.address;
    document.getElementById("phone").value = c.phone;
    document.getElementById("shift").value = c.shift;
    document.getElementById("status").value = c.status;

    document.querySelector('#username-field').style.display = "none";
    document.querySelector('#password-field').style.display = "none";

    editId = id;

    document.getElementById("form-title").innerText = "Update Cashier";
    document.getElementById("popup").style.display = "block";

}
