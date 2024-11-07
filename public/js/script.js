function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Validate inputs
    if (!validateInputs(username, password)) {
        alert('Please check your username and password!');
        document.getElementById('message').innerText = '';
        return;
    }

    // Make the API call to the TU API
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
            if ((role === 'student' && data.type === 'student') ||
                (role === 'employee' && data.type === 'employee')) {
                
                const student = {
                    userName: data.username,
                    type: data.type,
                    engName: data.displayname_en,
                    email: data.email,
                    faculty: data.faculty
                };

                // Save the student to the database
                fetch('http://localhost:8080/api/student', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(student)
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(err.error || 'Failed to save student');
                        });
                    }
                    return response.json();
                })
                .then(savedStudent => {
                    // Show success message and display data
                    document.getElementById('message').innerHTML = `
                        <div class="success-data">
                            <h3>Login Successful!</h3>
                            <p><strong>Username:</strong> ${savedStudent.userName}</p>
                            <p><strong>Name:</strong> ${savedStudent.engName}</p>
                            <p><strong>Email:</strong> ${savedStudent.email}</p>
                            <p><strong>Faculty:</strong> ${savedStudent.faculty}</p>
                            <p><strong>Type:</strong> ${savedStudent.type}</p>
                        </div>
                    `;
                    alert('Login successful!');
                })
                .catch(error => {
                    console.error('Error saving student:', error);
                    alert(error.message || 'Failed to save user data to database. Please try again.');
                    document.getElementById('message').innerText = '';
                });
            } else {
                // If role doesn't match
                alert('Selected role does not match account type.');
                document.getElementById('message').innerText = '';
            }
        } else {
            // If TU API login fails
            alert(`Login failed: ${data.message}`);
            document.getElementById('message').innerText = '';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing your request. Please try again.');
        document.getElementById('message').innerText = '';
    });
}

const style = document.createElement('style');
style.textContent = `
    .success-data {
        background-color: #f0f8ff;
        padding: 20px;
        border-radius: 5px;
        border: 1px solid #4CAF50;
        margin: 10px 0;
    }
    .success-data h3 {
        color: #4CAF50;
        margin-top: 0;
    }
    .success-data p {
        margin: 5px 0;
    }
`;
document.head.appendChild(style);

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