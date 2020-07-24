import { my_path, url_user, getData, db_res } from "./my_base.js";

if (localStorage.getItem("user") !== "") {
    document.location.href = my_path + "content.html";
}

// авторизация пользователя
async function authorization(login, pass) {
    console.log(db_res);

    db_res.forEach(element => {
        console.log(element.login);
        console.log(element.password);
        if (element.login === login) {
             if (element.password === pass) {
                 console.log(`${login} is authorization`);
                 localStorage.setItem("user", login);
             }
        }
    });

    if (localStorage.getItem("user") === "") {
         alert(`${login} isn't authorization`);
    }
    // переход на контент
    if (localStorage.getItem("user") !== "") {
         document.location.href = my_path + "content.html";
    }
}

var button_ok = document.getElementById("log_ok");

button_ok.onclick = function() {
    let login = document.getElementById("login").value;
    let pass = document.getElementById("pass").value;
    authorization(login, pass);
};

getData(url_user);

//document.location.href = my_path + "content.html";
//document.location.href = my_path + "category.html";

