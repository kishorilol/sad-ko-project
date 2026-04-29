

import { BASE_URL } from './config.js';

const token = localStorage.getItem("token");

if(!token){
    window.location.replace("/index.html");
}

let allProducts = [];

window.addEventListener("DOMContentLoaded", ()=>{
    loadAvailableYears();
    document.getElementById("searchInput").addEventListener("input", handleSearch);
})

window.handleDropdown = function (select) {
    if(select.value === "logout"){
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("cashierId");
        window.location.href = "/index.html";
    }
}

let pageData = [];
let currentPage = 1;
const rowsPerPage = 5;

function getHeaders(){
    const token = localStorage.getItem("token");

    return{
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
    };
}

async function loadAvailableYears(){
    try{
        const response = await fetch(`${BASE_URL}/admin/available-years`,{
            method: "GET",
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const years = await response.json();

        const yearSelect = document.getElementById('year');
        yearSelect.innerHTML = '';

        if(years.length == 0){
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No data available';
            option.disabled = true;
            yearSelect.appendChild(option);
        }
        else{
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });

            yearSelect.value = years[0];
            getData();
        }
    }catch (error) {
        console.error("Error loading available years:", error);
        const yearSelect = document.getElementById('year');
        if (yearSelect) {
            yearSelect.innerHTML = '<option value="">Error loading years</option>';
        }
    }
}

async function getData(){
    const year = document.querySelector("#year").value;

    const data = {year: year};

    try{
        let response = await fetch(`${BASE_URL}/admin/sales-report`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data)
    });

        if(!response.ok){
            alert(response);
        }else{
            pageData = await response.json();
            allProducts = pageData.products;
        }

        loadStats(pageData.salesSummary);
        renderTable(pageData.products);
        createLineGraph(pageData.chart)
        createBarGraph(pageData.topSellingProducts)
    }catch(err){
        console.log(err);
    }
}

function handleSearch(e){
    const searchValue = e.target.value.toLowerCase();

    const filtered = allProducts.filter(product =>
        product.productName.toLowerCase().includes(searchValue)
    );

    currentPage = 1; // reset to first page
    renderTable(filtered);
}

async function loadStats(salesSummary){
    document.querySelector('.total-sales').innerText = "Rs " + salesSummary.totalSales;
    document.querySelector('.total-cost').innerText = "Rs " + salesSummary.totalCost;
    document.querySelector('.total-profit').innerText = "Rs " + salesSummary.totalProfit;
    document.querySelector('.total-product-sold').innerText = salesSummary.totalProductsSold;
}

function renderTable(products){
    pageData.products = products; // update current dataset

    let tableBody = document.querySelector('#table tbody');
    tableBody.innerHTML = "";

    const start = (currentPage -1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = products.slice(start, end);

    paginatedData.forEach(data => {
        let row =`
            <tr>
                <td>${data.productName}</td>
                <td>${data.boughtQuantity}</td>
                <td>${data.soldQuantity}</td>
                <td>${data.avgCostPrice}</td>
                <td>${data.avgSellingPrice}</td>
                <td>${data.totalProfit}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    renderPagination();
}

function renderPagination(){
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    const pageCount = Math.ceil(pageData.products.length/rowsPerPage);

    const prev = document.createElement("span");
    prev.innerText = "<";
    prev.classList.add("prev");
    prev.style.cursor = currentPage === 1? "not-allowed" : "pointer";
    prev.onclick = () => {
        if(currentPage>1){
            currentPage--;
            renderTable(pageData.products);
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
            renderTable(pageData.products);
        };

        pagination.appendChild(page);
    }
}


function createLineGraph(chart){
    const ctx = document.getElementById('profit-trend');

    new Chart(ctx, {
        type: 'line',
        data:{
            labels: chart.map(row => row.year),
            datasets: [
                {
                    label : 'Profit Trend (Yearly)',
                    data: chart.map(row => row.profit),
                    fill: false,
                    borderColor: '#432EDE',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins :{
                positon: "top"
            }
        }
    })
}

function createBarGraph(data){
     const ctx = document.getElementById('top-products');
     
     new Chart(ctx, {
        type: 'bar',
        data: {
            labels : data.map(d => d.productName),
            datasets : [
                {
                    label : 'Top Selling Products Of The Year',
                    data : data.map(d => d.soldQuantity),
                    backgroundColor: '#10AB3B',
                    borderRadius : 6,
                    borderWidth : 1
                }
            ]
        },
        opions: {
            responsive : true,
            maintainAspectRatio : false,
            plugins: {
                legend: {
                    position: "top"
                }
            }
        }
     })
}
