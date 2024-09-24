// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('data-container');
    const searchBar = document.getElementById('searchBar');
    const searchBtn = document.getElementById('searchBtn');
    const statusSelect = document.getElementById('statusSelect');
    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');
    const filterBtn = document.getElementById('filterBtn');
    const pagination = document.getElementById('pagination');

    let allPayments = [];
    let currentPage = 1;
    const itemsPerPageOptions = [5, 10, 20, 50];
    let itemsPerPage = itemsPerPageOptions[0]; // Default to 5 items per page

    function fetchPayments() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/api/payments', true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.response);
                allPayments = response.items;
                displayPayments(allPayments);
                setupPagination(allPayments.length);
            }
        };
        xhr.send();
    }

    function displayPayments(payments) {
        dataContainer.innerHTML = '';
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedPayments = payments.slice(startIndex, endIndex);

        paginatedPayments.forEach(payment => {
            const div = document.createElement('div');
            div.className = `transaction ${payment.status === 'authorized' ? 'bg-green-100' : 'bg-red-100'} border border-gray-300 rounded-lg p-4 mb-2`;
            div.innerHTML = `
                <p class="font-semibold"><strong>ID:</strong> ${payment.id}</p>
                <p class="font-semibold"><strong>Status:</strong> ${payment.status}</p>
                <p><strong>Amount:</strong> ${payment.amount / 100} INR</p>
                <p><strong>Email:</strong> ${payment.email}</p>
                <p><strong>Contact:</strong> ${payment.contact}</p>
                <p><strong>Date:</strong> ${new Date(payment.created_at * 1000).toLocaleDateString()}</p>
            `;
            dataContainer.appendChild(div);
        });
    }

    function filterPayments() {
        const selectedStatus = statusSelect.value;
        const fromDate = new Date(fromDateInput.value);
        const toDate = new Date(toDateInput.value);
        toDate.setHours(23, 59, 59, 999); // Set end of the day for toDate

        const filteredPayments = allPayments.filter(payment => {
            const paymentDate = new Date(payment.created_at * 1000);
            const matchesStatus = selectedStatus ? payment.status === selectedStatus : true;
            const matchesDate = (!fromDate || paymentDate >= fromDate) && (!toDate || paymentDate <= toDate);
            return matchesStatus && matchesDate;
        });

        currentPage = 1; // Reset to the first page
        displayPayments(filteredPayments);
        setupPagination(filteredPayments.length);
    }

    function setupPagination(totalItems) {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.className = `px-4 py-2 border rounded-lg ${i === currentPage ? 'bg-green-600 text-white' : 'bg-white text-green-600'}`;
            button.addEventListener('click', () => {
                currentPage = i;
                displayPayments(allPayments);
                setupPagination(totalItems);
            });
            pagination.appendChild(button);
        }
    }

    // Handling items per page selection
    const itemsPerPageSelect = document.createElement('select');
    itemsPerPageSelect.className = 'border rounded-lg p-2 my-4';
    itemsPerPageOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.innerText = option;
        itemsPerPageSelect.appendChild(opt);
    });
    itemsPerPageSelect.addEventListener('change', (e) => {
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1; // Reset to first page on items change
        displayPayments(allPayments);
        setupPagination(allPayments.length);
    });
    document.querySelector('.my-4').appendChild(itemsPerPageSelect);

    searchBtn.addEventListener('click', () => {
        const query = searchBar.value.toLowerCase();
        const transactions = Array.from(dataContainer.children);
        transactions.forEach(transaction => {
            const email = transaction.querySelector('p:nth-child(4)').innerText.toLowerCase();
            const status = transaction.querySelector('p:nth-child(2)').innerText.toLowerCase();
            if (email.includes(query) || status.includes(query)) {
                transaction.style.display = 'block';
            } else {
                transaction.style.display = 'none';
            }
        });
    });

    filterBtn.addEventListener('click', filterPayments);

    fetchPayments();
});
