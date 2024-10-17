function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value; // Get the selected role

    // First, validate inputs
    if (!validateInputs(username, password)) {
        document.getElementById('message').innerText = ''; // Clear success message if validation fails
        return; // Stop the function if validation fails
    }

    // Proceed to make the API call if inputs are valid
    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TU2ecedd420922b9c533378fbfd1a1135f335e072a347689002caa1a73ac6c0c4a98954a78a147ea2b7ae10bdefe2fb198'
        },
        body: JSON.stringify({ 
            "UserName": username, 
            "PassWord": password 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            // Check if the selected role matches the data type
            if ((role === 'student' && data.type === 'student') || 
                (role === 'employee' && data.type === 'employee')) {

                const loginContainer = document.getElementById('loginSection');
                loginContainer.classList.add('shift-left');
                showAccountInfo(data);
                document.getElementById('message').innerText = data.message;
            } else {
                // If role doesn't match
                document.getElementById('message').innerText = 'Selected role does not match account type.';
            }
        } else {
            document.getElementById('message').innerText = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'An error occurred while processing your request.';
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