document.addEventListener("DOMContentLoaded", function () {
  const creditBtn = document.querySelector(".creditBtn");
  const debitBtn = document.querySelector(".debitBtn");
  const amountInput = document.querySelector(".amount");
  const balanceDisplay = document.querySelector(".box h2");
  const transactionHistory = document.querySelector(".transactionHistory");

  // Load previous transaction history and balance from local storage
  let transactionHistoryData = JSON.parse(localStorage.getItem("transactionHistory")) || [];
  let balance = parseFloat(localStorage.getItem("balance")) || 0;

  // Function to update local storage with current data
  function updateLocalStorage() {
    localStorage.setItem("transactionHistory", JSON.stringify(transactionHistoryData));
    localStorage.setItem("balance", balance.toFixed(2));
  }

  // Function to update the UI with transaction history and balance
  function updateUI() {
    // Clear existing transaction history
    transactionHistory.innerHTML = "";

    // Add transactions from local storage to the UI
    for (const transaction of transactionHistoryData) {
      const transactionElement = document.createElement("div");
      transactionElement.classList.add(transaction.color);

      transactionElement.innerHTML = `
        <p>${transaction.name}</p>
        <p>₹${transaction.amount.toFixed(2)} <span class="deleteBtn">Delete</span></p>
        <p>${transaction.date}</p>
      `;

      // Add the new transaction to the transaction history
      transactionHistory.appendChild(transactionElement);

      // Add event listener to the newly added delete button
      const deleteBtn = transactionElement.querySelector(".deleteBtn");
      deleteBtn.addEventListener("click", () => {
        // Update the balance by subtracting the deleted transaction amount
        balance -= transaction.amount;
        balanceDisplay.innerHTML = `₹${balance.toFixed(2)}`;

        // Remove the transaction from the array
        const index = transactionHistoryData.indexOf(transaction);
        if (index !== -1) {
          transactionHistoryData.splice(index, 1);
          updateLocalStorage(); // Update local storage after modifying the data
        }

        transactionElement.remove(); // Remove the transaction when the delete button is clicked

        // Check if there are no more transactions, then reset the balance to zero
        if (transactionHistoryData.length === 0) {
          balance = 0;
          balanceDisplay.innerHTML = `₹${balance.toFixed(2)}`;
          updateLocalStorage(); // Update local storage after modifying the data
        }
      });
    }

    // Update the balance display
    balanceDisplay.innerHTML = `₹${balance.toFixed(2)}`;
  }

  // Initial update of the UI
  updateUI();

  // Event listener for the credit button
  creditBtn.addEventListener("click", () => {
    const transactonNameInput = document.querySelector(".transactonName").value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount === "" || transactonNameInput === "") {
      alert("Please enter transaction name and value.");
      return;
    } else {
      // Update the balance by adding the new transaction amount
      balance += amount;

      // Add the new transaction to the transaction history array
      const currentDate = new Date();
      const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
      const newTransaction = { name: transactonNameInput, amount, color: "green", date: formattedDate };
      transactionHistoryData.push(newTransaction);
      amountInput.value =""
     

      updateLocalStorage(); // Update local storage after modifying the data
      updateUI(); // Update the UI
    }
  });

  // Event listener for the debit button
  debitBtn.addEventListener("click", () => {
    const transactonNameInput = document.querySelector(".transactonName").value;
    
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount === "" || transactonNameInput === "") {
      alert("Please enter transaction name and value.");
      return;
    } else {
      // Update the balance by subtracting the new transaction amount
      balance -= amount;

      // Add the new transaction to the transaction history array
      const currentDate = new Date();
      const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
      const newTransaction = { name: transactonNameInput, amount, color: "red", date: formattedDate };
      transactionHistoryData.push(newTransaction);
      amountInput.value =""
    

      updateLocalStorage(); // Update local storage after modifying the data
      updateUI(); // Update the UI
    }
  });
});
