document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('fyber-input');
    const keypad = document.getElementById('keypad');
    const backspaceBtn = document.getElementById('backspace-btn');
    const loginBtn = document.getElementById('login-btn');

    // --- SIMULATED GOOGLE SHEET DATABASE ---
    // In a real app, this data would come from a server.
    // For now, add the IDs you want to test with here.
    const googleSheetData = [
        { id: "1111", balance: "150.00" },
        { id: "2222", balance: "5000.00" },
        { id: "8888", balance: "120.50" },
        { id: "admin", balance: "999999.00" }
    ];

    // Keypad & Backspace Logic (Kept same as before)
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

    // --- LOGGING LOGIC (THE PARSER METHOD) ---
    loginBtn.addEventListener('click', () => {
        const enteredID = inputField.value.trim();

        if (!enteredID) {
            alert("Пожалуйста, введите ID");
            return;
        }

        // 1. PARSE: Search for the user in our "Sheet"
        const foundUser = googleSheetData.find(user => user.id === enteredID);

        if (foundUser) {
            // 2. SUCCESS: User found
            // We save the ID and Balance to browser memory so the next page can read it
            localStorage.setItem("fyber_current_id", foundUser.id);
            localStorage.setItem("fyber_current_balance", foundUser.balance);

            // Optional: Loading effect
            loginBtn.textContent = "Вход...";
            
            setTimeout(() => {
                // Redirect to the dashboard
                window.location.href = "dashboard.html"; 
            }, 500);

        } else {
            // 3. FAIL: User not found (Logic: "if no such id then wrong id")
            alert("❌ Неверный ID\nТакого пользователя нет в базе.");
            inputField.value = ""; // Clear input
        }
    });
});