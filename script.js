
document.addEventListener("DOMContentLoaded", () => {
  const expenseTypes = {
      savings: "Savings 💰",
      expense: "Expense 📜",
      investment: "Investment 🏠"
  };

  let currentType = "savings";
  let totalBudget = 0;
  const expenses = {
      savings: [],
      expense: [],
      investment: []
  };

  const expenseListElement = document.querySelector('.expense-list');
  const monthBudgetElement = document.getElementById('month-budget');
  const trackingTextElement = document.querySelector('.tracking-text');
  const expenseChartElement = document.getElementById('expense-chart').getContext('2d');
  const chartColors = ['#4caf50', '#ff9800', '#03a9f4'];

  const updateBudget = () => {
      totalBudget = expenses.savings.reduce((acc, item) => acc + item.value, 0) -
                    expenses.expense.reduce((acc, item) => acc + item.value, 0) +
                    expenses.investment.reduce((acc, item) => acc + item.value, 0);
      monthBudgetElement.innerHTML = `$${totalBudget}`;
  };

  const updateExpenseList = () => {
      expenseListElement.innerHTML = '';
      expenses[currentType].forEach((expense, index) => {
          const expenseItem = document.createElement('div');
          expenseItem.className = 'expense-row clearfix';
          expenseItem.innerHTML = `
              <span>${expense.description}</span>
              <span class="float-right">$${expense.value}</span>
          `;
          expenseListElement.appendChild(expenseItem);
      });
  };

  const updateChart = () => {
      const expenseValues = Object.keys(expenses).map(type => expenses[type].reduce((acc, item) => acc + item.value, 0));
      new Chart(expenseChartElement, {
          type: 'pie',
          data: {
              labels: Object.values(expenseTypes),
              datasets: [{
                  data: expenseValues,
                  backgroundColor: chartColors
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false
          }
      });
  };

  document.querySelectorAll('.expense-type').forEach(item => {
      item.addEventListener('click', (event) => {
          currentType = event.target.dataset.type;
          trackingTextElement.innerHTML = `Tracking ${expenseTypes[currentType]}`;
          updateExpenseList();
      });
  });

  document.querySelector('.btn-submit-expense').addEventListener('click', () => {
      const description = document.querySelector('.input-expense-description').value.trim();
      const value = parseFloat(document.querySelector('.input-expense-value').value);

      if (description && !isNaN(value) && value > 0) {
          expenses[currentType].push({ description, value });
          document.querySelector('.input-expense-description').value = '';
          document.querySelector('.input-expense-value').value = '';
          updateBudget();
          updateExpenseList();
          updateChart();
      } else {
          alert('Please enter a valid description and value.');
      }
  });

  const updateCurrentMonth = () => {
      const now = new Date();
      const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
      ];
      const currentMonth = monthNames[now.getMonth()] + " " + now.getFullYear();
      document.getElementById('current-month').innerHTML = currentMonth;
  };

  updateCurrentMonth();
  updateChart();
});
