function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!validateInputs(username, password)) {
        return;
    }
    document.getElementById('message').innerText = '';

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
        document.getElementById('message').innerText = data.message;
    })
    .catch(error => console.error('Error:', error));
}

function validateInputs(username, password) {
    const usernameRegex = /^[0-9]{10}$/;
    const passwordRegex = /^[0-9]{13}$/;

    document.getElementById('messageError').innerText = '';

    if (!usernameRegex.test(username)) {
        document.getElementById('messageError').innerText = 'Username must be 10 numeric characters.';
        return false;
    }

    if (!passwordRegex.test(password)) {
        document.getElementById('messageError').innerText = 'Password must be 13 numeric characters.';
        return false;
    }

    return true;
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
