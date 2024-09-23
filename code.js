const urlBase = 'http://COP4331-1.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = [];

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    var hash = md5(password);
    document.getElementById("loginResult").innerHTML = "";

    if (login === "" || password === "") {
        document.getElementById("loginResult").innerHTML = "Please enter both username and password.";
        return;
    }

    let tmp = { login: login, password: hash };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObject = JSON.parse(xhr.responseText);
            userId = jsonObject.id;
            if (userId < 1) {
                document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                return;
            }

            firstName = jsonObject.firstName;
            lastName = jsonObject.lastName;
            saveCookie();
            window.location.href = "Contacts.html";
        }
    };
    xhr.send(jsonPayload);
}


function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));

    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");

    for (var i = 0; i < splits.length; i++) {

        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");

        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }

        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }

        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }

    else {
        document.getElementById("userName").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
    }
}

function doSignup() {
    let signupFirstName = document.getElementById('signupFirstName').value;
    let signupLastName = document.getElementById('signupLastName').value;
    let signupLogin = document.getElementById('signupLogin').value;
    let signupPassword = document.getElementById('signupPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    var hash = md5(signupPassword);
    if (signupPassword !== confirmPassword) {
        document.getElementById('signupResult').innerHTML = "Passwords do not match!";
        return;
    }

    if ((signupFirstName == "") || (signupLastName == "") || (signupLogin == "") || (signupPassword == "") || (confirmPassword == "")) {
        document.getElementById("signupResult").innerHTML = "All fields are required.";
        return;
    }

    var passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    var loginRegex = /^.{4,}$/;


    if (loginRegex.test(signupLogin) == false) {
        document.getElementById("signupResult").innerHTML = "Username is not valid";
        return;
    }

    if (passwordRegex.test(signupPassword) == false) {
        document.getElementById("signupResult").innerHTML = "Password is not valid";
        return;
    }

    let data = {
        firstName: signupFirstName,
        lastName: signupLastName,
        login: signupLogin,
        password: hash
    };
    let jsonPayload = JSON.stringify(data);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let jsonObject = JSON.parse(xhr.responseText);
            document.getElementById('signupResult').innerHTML = jsonObject.error === "" ? jsonObject.message : jsonObject.error;
        }
    };
    xhr.send(jsonPayload);
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function addContact() {
    let firstname = document.getElementById("contactTextFirst").value;
    let lastname = document.getElementById("contactTextLast").value;
    let phonenumber = document.getElementById("contactTextNumber").value;
    let emailaddress = document.getElementById("contactTextEmail").value;


    let tmp = {
        firstName: firstname,
        lastName: lastname,
        phone: phonenumber,
        email: emailaddress,
        userId: userId
    };

    if ((firstname == "") || (lastName == "") || (phonenumber == "") || (emailaddress == "")) {
        document.getElementById("contactAddResult").innerHTML = "All fields are required.";
        return;
    }

    var phoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
    var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    if (phoneRegex.test(phonenumber) == false) {
        document.getElementById("contactAddResult").innerHTML = "Phone Number is not valid";
        return;
    }

    if (emailRegex.test(emailaddress) == false) {
        document.getElementById("contactAddResult").innerHTML = "Email Address is not valid";
        return;
    }

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactAddResult").innerHTML = "Contact has been added";
                let form = document.getElementById("resetBut");
                if (form) {
                    form.reset();
                } else {
                    console.log("Failure to find form");
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function loadContact() {
    let tmp = {
        search: "",
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }

                let text = "<table border='1'>";
                for (let i = 0; i < jsonObject.results.length; i++) {
                    ids[i] = jsonObject.results[i].ID;
                    let contact = jsonObject.results[i];
                    text += "<tr>";
                    text += `<td>${contact.FirstName}</td>`;
                    text += `<td>${contact.LastName}</td>`;
                    text += `<td>${contact.Email}</td>`;
                    text += `<td>${contact.Phone}</td>`;
                    text += `<td>
                        <button onclick='editContact("${contact.FirstName}", "${contact.LastName}", "${contact.Email}", "${contact.Phone}", ${contact.ID})'>Edit</button>
                        <button onclick='saveContact(${contact.ID})' style='display:none'>Save</button>
                        <button onclick='deleteContact("${contact.FirstName}", "${contact.LastName}", ${contact.ID})'>Delete</button>
                    </td>`;
                    text += "</tr>";
                }
                text += "</table>";
                document.getElementById("contactList").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function searchContact() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";

    let jsonPayload = JSON.stringify({ search: srch, userId: userId });
    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObject = JSON.parse(xhr.responseText);

            if (jsonObject.error != "") {
                document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                return;
            }
            updateContactTable(jsonObject.results);
        }
    };
    xhr.send(jsonPayload);
}

function updateContactTable(contacts) {
    let contactList = document.getElementById("contactList");
    contactList.innerHTML = ""; // Clear current contacts

    contacts.forEach(contact => {
        let row = document.createElement("tr");

        let firstNameCell = document.createElement("td");
        firstNameCell.innerHTML = contact.FirstName;
        row.appendChild(firstNameCell);

        let lastNameCell = document.createElement("td");
        lastNameCell.innerHTML = contact.LastName;
        row.appendChild(lastNameCell);

        let emailCell = document.createElement("td");
        emailCell.innerHTML = contact.Email;
        row.appendChild(emailCell);

        let phoneCell = document.createElement("td");
        phoneCell.innerHTML = contact.Phone;
        row.appendChild(phoneCell);

        let actionsCell = document.createElement("td");

        let editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.onclick = function() {
            editContact(contact.FirstName, contact.LastName, contact.Email, contact.Phone, contact.ID);
        };
        actionsCell.appendChild(editButton);

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = function() {
            if (confirm("Are you sure you want to delete this contact?")) {
                deleteContact(contact.FirstName, contact.LastName, userId);
            }
        };
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        contactList.appendChild(row);
    });
}

function deleteContact(first,last,id) {

    let  jsonPayload = JSON.stringify({
            firstName: first,
        lastName: last,
        userId: userId,
    });

    let  url = urlBase + '/DeleteContact.' + extension;

    let  xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.responseText);
            loadContact();
            if (response.error) {
                alert("Error: " + response.error);
            } else {
                alert(response.message);
                searchContact();
            }
        }
    };
    xhr.send(jsonPayload);
}

function editContact(firstName, lastName, email, phone,id) {
    document.getElementById('editContactId').value = id;
    document.getElementById('editContactFirst').value = firstName;
    document.getElementById('editContactLast').value = lastName;
    document.getElementById('editContactNumber').value = phone;
    document.getElementById('editContactEmail').value = email;

    document.getElementById('editContactForm').style.display = 'block';

}
function saveContact() {
    let contactId = document.getElementById('editContactId').value;
    let firstName = document.getElementById('editContactFirst').value;
    let lastName = document.getElementById('editContactLast').value;
    let phone = document.getElementById('editContactNumber').value;
    let email = document.getElementById('editContactEmail').value;

    if (firstName === "" || lastName === "" || phone === "" || email === "") {
        document.getElementById('editContactResult').innerHTML = "All fields are required.";
        return;
    }

    let data = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        id: contactId
    };

    let jsonPayload = JSON.stringify(data);
    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            console.log("Response status: " + this.status);
            if (this.status == 200) {
                let response = JSON.parse(xhr.responseText);
                console.log("Response from API: ", response);

                if (response.error === "") {
                    document.getElementById('editContactResult').innerHTML = "Contact updated successfully.";
                    loadContact();
                    cancelEdit();
                } else {
                    document.getElementById('editContactResult').innerHTML = response.error;
                }
            } else {
                console.log("Error in response");
            }
        }
    };
    console.log("Payload being sent: ", jsonPayload);
    xhr.send(jsonPayload);
}


function cancelEdit() {
    document.getElementById('editContactForm').style.display = 'none';
}
