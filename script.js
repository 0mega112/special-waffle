document.addEventListener('DOMContentLoaded', () => {
    // --- 1. INITIALIZE TELEGRAM & GET ID ---
    // const tg = window.Telegram.WebApp;
    // tg.expand(); // Expands the app to full height

    // // This is the variable that holds the Telegram ID
    // let telegramUserId = null;

    // // specific check to see if we are inside Telegram
    // if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    //     telegramUserId = tg.initDataUnsafe.user.id;
    //     alert("Telegram ID: " + telegramUserId);
    // } else {
    //     alert("No Telegram user data found (are you testing in a regular browser?)");
    // }

    // --- 2. EXISTING UI LOGIC ---
    const inputField = document.getElementById('fyber-input');
    const keypad = document.getElementById('keypad');
    const backspaceBtn = document.getElementById('backspace-btn');
    const loginBtn = document.getElementById('login-btn');

    // Keypad Logic
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

    // --- 3. LOGIN LOGIC ---
    loginBtn.addEventListener('click', async () => {
        const enteredID = inputField.value.trim();

        if (!enteredID) {
            alert("Please enter ID");
            return;
        }

        // Show loading state
        const originalText = loginBtn.textContent;
        loginBtn.textContent = "Checking...";

        try {
            // Fetch the JSON file
            const response = await fetch('../balances.json');
            
            if (!response.ok) {
                throw new Error("Could not connect to database");
            }

            const balancesData = await response.json();

            if (balancesData.hasOwnProperty(enteredID)) {
                
                // SUCCESS
                const userBalance = balancesData[enteredID];

                // You can now use 'telegramUserId' here if you need to send it somewhere
                console.log(`User ${enteredID} logged in. Telegram ID: ${telegramUserId}`);

                // Save to localStorage
                localStorage.setItem("fyber_current_id", enteredID);
                localStorage.setItem("fyber_current_balance", userBalance);
                
                // If you want to save the Telegram ID for later pages:
                if (telegramUserId) {
                    localStorage.setItem("fyber_telegram_id", telegramUserId);
                }

                // Redirect
                window.location.href = "dashboard.html"; 

            } else {
                // FAIL
                alert("❌ Invalid ID\nUser not found.");
                inputField.value = ""; 
                loginBtn.textContent = originalText;
            }

        } catch (error) {
            console.error(error);
            alert("Connection error (check console)");
            loginBtn.textContent = originalText;
        }
    });
});
