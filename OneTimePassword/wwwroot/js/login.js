var timer;
function generatePassword(event) {
    if (event) {
        event.preventDefault();
    }

    var userId = document.getElementById('userId').value;
    fetch('generate-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userId),
    })
        .then((response) => response.json())
        .then((data) => {
            var password = data.password;
            clearTimer(timer);

            document.getElementById('passwordOperationsContainer').classList.remove('hide');
            document.querySelector('.login-form').classList.add('hide');
            document.getElementById('password').value = '';
            document.getElementById('confirmedUserId').innerText = 'UserId:' + document.getElementById('userId').value;
            document.getElementById('generatedPassword').innerText = 'Your One Time Password: ' +  password;

            var timerElement = document.getElementById('timer');
            var remainingTime = 30;
            updateTimer();

            timer = setInterval(updateTimer, 1000);

            function updateTimer() {
                timerElement.innerText = remainingTime;
                remainingTime--;

                if (remainingTime <= 0) {
                    clearInterval(timer);
                    timerElement.innerText = '';
                    document.getElementById('generatedPassword').innerText = '';
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function checkPassword(event) {
    event.preventDefault();
    var password = document.getElementById('password').value;
    var userId = document.getElementById('userId').value;

    var data = {
        userId: userId,
        password: password
    };
    fetch('check-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
        .then((response) => response.json())
        .then(function (data) {
            if (data && data.success) {
                displayModal('Password check successful');
            } else {
                displayModal('Wrong password');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function displayModal(message) {
    var modal = document.getElementById("modalContainer");
    var closeBtn = document.querySelector(".close");

    var messageElement = document.getElementById("message");
    messageElement.innerHTML = message;
    modal.style.display = "block";

    closeBtn.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function goToUserSelection() {
    document.getElementById('passwordOperationsContainer').classList.add('hide');
    document.querySelector('.login-form').classList.remove('hide');
    document.getElementById('password').value = '';
    clearTimer();
}

function clearTimer() {
    clearInterval(timer);
    var timerElement = document.getElementById('timer');
    timerElement.innerText = '';
    document.getElementById('generatedPassword').innerText = '';
}