let my_path = location.pathname;
my_path = my_path.slice(0, my_path.lastIndexOf("index.html"));
my_path = 'http://localhost:63342/FinalProject/';

let url_user = 'http://localhost:3000/users';
let url_category = 'http://localhost:3000/category';
let url_operate = 'http://localhost:3000/operate';
let db_res;

function getData (url) {
    fetch(url)
        .then((res) => res.json())
        .then((result) => {
            //console.log(result);
            //renderlist(result);
            db_res = result;
            return result;
        })
};


// получение данных
async function getData2(url) {
    // Default options are marked with *
    const response = await fetch(url);
    return await response.json(); // parses JSON response into native JavaScript objects
};

// получение данных
async function getData2Id(url,id) {
    // Default options are marked with *
    const response = await fetch(`${url}/${id}`);
    return await response.json(); // parses JSON response into native JavaScript objects
};

// вставка данных
async function postData (url, data) {
    // Default options are marked with *
    const response = await fetch(url,
        {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
    return await response.json(); // parses JSON response into native JavaScript objects
};

// изменение  данных
async function patchData (url, id, data) {
    const response = await fetch(
        `${url}/${id}`,
        {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    return await response.json(); // parses JSON response into native JavaScript objects
}

// удаление данных
async function deleteData (url, id) {
    const response = await fetch(
        `${url}/${id}`,
        {
            method: "DELETE"
        }
    ).then((res) => console.log(res))
}

function check_log() {
    if (localStorage.getItem("user") === "") {
        document.location.href = my_path + "index.html";
    }
}


export { my_path, url_user, url_category, url_operate,
         getData, getData2, postData, patchData, deleteData, getData2Id, check_log, db_res };
