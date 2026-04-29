import { BASE_URL } from "./config.js";

const token = localStorage.getItem("token");
if(!token){
    window.location.replace("/index.html");
}

window.addEventListener("DOMContentLoaded", ()=>{
    loadData();
})

window.handleDropdown = function (select){
    if(select.value === 'logout'){
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("cashierId");
        window.location.href = '/index.html';
    }
}

let data = [];

async function loadData(){
    let response;
    try{
        response = await fetch(`${BASE_URL}/admin/dashboard`, {
            method: "GET",
            headers: getHeaders()
        });

        if(!response.ok){
            data = [];
            alert("Error" + response.text());
            return;
        }else{
            data = await response.json();
        }
        
        loadStats(data.dashboardStats);
        salesOverviewChart(data.salesOverview);
        topSellingProducts(data.topSellingProductsData);
        customerTrend(data.customerGrowthData);
        activeCashier(data.activeCashiers);
    }catch(err){
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

function loadStats(stats){
    document.getElementById('products-sold-today').innerText = stats.productsSoldToday;
    document.getElementById('total-customers-today').innerText = stats.totalCustomersToday;
    document.getElementById('total-profit-today').innerText ="Rs. " + stats.totalProfitToday;
    document.getElementById('total-sales-today').innerText ="Rs. " + stats.totalSalesToday;
}

function topSellingProducts(data){
    let container = document.getElementById('ul-list');
    container.innerHTML = "";
    console.log(data);

    if(data.length ==0){
        container.innerHTML = `<li>No products sold today<li>`
    }
    else{
        data.forEach((d, index) =>{
            container.innerHTML += `<li class="db-product-item"><span>${index + 1} ${d.productName}</span><span>${d.soldQuantity} sold</span></li>`;
        })
    }
}

function activeCashier(data){
    let activeCashier = document.getElementById('table-body');
    activeCashier.innerHTML = "";
    data.forEach((d) =>{
        let row = `
            <tr>
                <td>${d.cashierId}</td>
                <td>${d.name}</td>
                <td>${d.phone}</td>
            </tr>
        `
        activeCashier.innerHTML += row;
    });
}

function customerTrend(data){
    const ctx = document.getElementById('customer-growth');

    if(!ctx) return;
    const years = data.map(item => item.year);
    const number = data.map(item => item.numberOfCustomers)
    new Chart(ctx, {
        type: 'line',
        data : {
            labels: years,
            datasets: [{
                label: "Customer Growth",
                data : number,
                fill : false,
                borderColor : '#2D13EB',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top"
                }
            }
        }
    });
}

function salesOverviewChart(data){
    const labels = data.map(items => items.year);
    const salesData = data.map(items => items.sales);
    const profitData = data.map(items => items.profit);

    const ctx = document.getElementById('sales-overview').getContext('2d');

    new Chart(ctx,{
        type : "bar",
        data : {
            labels : labels,
            datasets: [{
                label : 'Sales',
                data : salesData,
                backgroundColor : '#3D7DED',
                borderRadius : 6,
                barPercentage : 0.6 
            },
            {
                label : 'Profit',
                data : profitData,
                backgroundColor : '#2BEB55',
                borderRadius : 6,
                barPercentage : 0.6
            }]
        },
        options : {
            responsive : true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top"
                }
            }
        }
    });
}