function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!validateInputs(username, password)) {
        document.getElementById('message').innerText = '';
        return;
    }
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "UserName": username,
            "PassWord": password
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const loginContainer = document.getElementById('loginSection');
            loginContainer.classList.add('shift-left');
            showAccountInfo(data.userData);
            document.getElementById('message').innerText = data.message;
        } else {
            document.getElementById('message').innerText = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = `An error occurred: ${error.message || error.error || 'Unknown error'}`;
    });
}

function validateInputs(username, password) {
    const usernameRegex = /^[0-9]{10}$/;
    const passwordRegex = /^[0-9]{13}$/;

    // Clear previous error messages
    document.getElementById('messageErrorU').innerText = '';
    document.getElementById('messageErrorP').innerText = '';

    let isValid = true;

    if (!usernameRegex.test(username)) {
        document.getElementById('messageErrorU').innerText = 'Username must be 10 numeric characters.';
        isValid = false; // Set valid flag to false
    }

    if (!passwordRegex.test(password)) {
        document.getElementById('messageErrorP').innerText = 'Password must be 13 numeric characters.';
        isValid = false; // Set valid flag to false
    }

    return isValid; // Return the final validation result
}

document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const loginButton = document.querySelector('button[type="button"]:nth-of-type(1)');

    function checkInputs() {
        const isUsernameFilled = usernameInput.value.trim() !== '';
        const isPasswordFilled = passwordInput.value.trim() !== '';
        const isRoleSelected = roleSelect.value !== '';

        loginButton.disabled = !(isUsernameFilled && isPasswordFilled && isRoleSelected);
    }

    usernameInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);
    roleSelect.addEventListener('change', checkInputs);

    checkInputs();
});

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleText = document.getElementById('togglePassword');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleText.innerText = 'Hide Password';
    } else {
        passwordInput.type = 'password';
        toggleText.innerText = 'Show Password';
    }
}

function showAccountInfo(data) {
    const accountInfoContainer = document.getElementById('accountInfo');

    // Populate the account info content
    accountInfoContainer.innerHTML = `
        <div class="mac-buttons">
            <div class="button close"></div>
            <div class="button minimize"></div>
            <div class="button maximize"></div>
        </div>
        <h2>Account Information</h2>
        <p><strong>Username:</strong> ${data.username}</p>
        <p><strong>Display Name (TH):</strong> ${data.displayname_th}</p>
        <p><strong>Display Name (EN):</strong> ${data.displayname_en}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Department:</strong> ${data.department}</p>
        <p><strong>Faculty:</strong> ${data.faculty}</p>
        <p><strong>Current Status:</strong> ${data.tu_status}</p>
    `;

    // Show the account info container
    accountInfoContainer.style.display = 'block';

    // Trigger the smooth transition
    setTimeout(() => {
        accountInfoContainer.classList.add('visible');
    }, 50);  // Delay to ensure DOM update
}

function hideAccountInfo() {
    const accountInfoContainer = document.getElementById('accountInfo');

    // Hide with a smooth transition
    accountInfoContainer.classList.remove('visible');
    setTimeout(() => {
        accountInfoContainer.style.display = 'none'; // Completely hide after the transition
    }, 1000);  // Delay matches the transition duration
}

// function call_REST_API_Hello() {
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     const url = (
//         'http://localhost:8080/testmicroservice1/hello?' +
//         new URLSearchParams({myName: username, lastName: password}).toString()
//     );

//     fetch(url)
//        .then(response => response.text())
//        .then(text => {
//             console.log("text return from REST API: "+text);
//             document.getElementById('message').innerText = text;
//        })
//        .catch(error => console.error('Error:', error));
// }