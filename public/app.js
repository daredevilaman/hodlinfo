document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/tickers');
        const data = await response.json();
        const tableBody = document.getElementById('table-body');

        data.forEach((ticker, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${ticker.name}</td>
                <td>₹${ticker.last}</td>
                <td>₹${ticker.buy} / ₹${ticker.sell}</td>
                <td>---</td>
                <td>---</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
});
