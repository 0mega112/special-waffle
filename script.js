document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('fyber-input');
    const keypad = document.getElementById('keypad');
    const backspaceBtn = document.getElementById('backspace-btn');
    const loginBtn = document.getElementById('login-btn');

    // --- KEYPAD LOGIC (Unchanged) ---
    keypad.addEventListener('click', (e) => {
        const key = e.target.closest('.key');
        if (!key || key.classList.contains('backspace')) return;
        const value = key.getAttribute('data-value');
        if (value) insertAtCursor(inputField, value);
    });

    backspaceBtn.addEventListener('click', () => {
        const start = inputField.selectionStart;
        const end = inputField.selectionEnd;
        const currentText = inputField.value;
        if (start !== end) {
            inputField.value = currentText.substring(0, start) + currentText.substring(end);
            inputField.setSelectionRange(start, start);
        } else if (start > 0) {
            inputField.value = currentText.substring(0, start - 1) + currentText.substring(end);
            inputField.setSelectionRange(start - 1, start - 1);
        }
        inputField.focus();
    });

    function insertAtCursor(input, text) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const currentText = input.value;
        input.value = currentText.substring(0, start) + text + currentText.substring(end);
        input.setSelectionRange(start + 1, start + 1);
        input.focus();
    }

    // --- NEW LOGGING LOGIC USING FETCH ---
    loginBtn.addEventListener('click', async () => {
        const enteredID = inputField.value.trim();

        if (!enteredID) {
            alert("Пожалуйста, введите ID");
            return;
        }

        // Show loading state
        const originalText = loginBtn.textContent;
        loginBtn.textContent = "Проверка...";

        try {
            // 1. Fetch the JSON file
            // Note: This requires running on a local server (localhost), not just file://
            const response = await fetch('balances.json');
            
            if (!response.ok) {
                throw new Error("Could not connect to database");
            }

            const balancesData = await response.json();

            // 2. Check if ID exists in the JSON object keys
            if (balancesData.hasOwnProperty(enteredID)) {
                
                // SUCCESS: Get the balance associated with the ID
                const userBalance = balancesData[enteredID];

                // Save to localStorage
                localStorage.setItem("fyber_current_id", enteredID);
                localStorage.setItem("fyber_current_balance", userBalance);

                // Redirect
                window.location.href = "dashboard.html"; 

            } else {
                // FAIL: ID not found in JSON
                alert("❌ Неверный ID\nТакого пользователя нет в базе.");
                inputField.value = ""; 
                loginBtn.textContent = originalText;
            }

        } catch (error) {
            console.error(error);
            alert("Ошибка соединения с базой данных (check console)");
            loginBtn.textContent = originalText;
        }
    });
});
