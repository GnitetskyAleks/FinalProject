import {my_path, url_operate, url_category, getData2, postData, patchData, deleteData, getData2Id, check_log, db_res } from "./my_base.js";

let what_i_do = 'none';
let my_id = 0;
let summa, summa_was;

check_log();

// кнопка LogOut
var button_ok = document.getElementById("log_cancel");
button_ok.onclick = function() {
    logout();
};

function logout() {
    localStorage.setItem("user", "");
    check_log()
}

// переход в категории
document.getElementById('go_to_category').onclick = function() {
    document.location.href = my_path + "category.html";
};

// добавить строчку в грид
function AddOneRow(rowvalue) {
    var today = new Date(rowvalue.date);

    return `<tr id="${rowvalue.id}">
              <th>${today.toLocaleDateString()}</th>
              <th>${rowvalue.type}</th>
              <th>${rowvalue.category}</th>
              <th>${rowvalue.summa}</th>
              <th><input class="my_column_button" type="button" value="edit">
                  <input class="my_column_button" type="button" value="del"></th>
            </tr>`
}

// обновить всю структуру грида
function refresh() {
    getData2(url_operate)
        .then((data) => {
            // просчет баланса
            document.getElementById('balance').value =
                data.reduce(function(accumulator, currentValue) {
                        return accumulator + currentValue.summa;
                    }
                    ,0
                );

            // отрисовка таблицы
            document.getElementById('data_place').innerHTML =
                `<tr>
                    <th>Дата</th>
                    <th>Операция</th>
                    <th>Категория</th>
                    <th>Сумма</th>
                    <th>Действие</th>
                </tr>`
                +
                data.reduce(function(accumulator, currentValue) {
                        return accumulator + AddOneRow(currentValue);
                    }
                    ,''
                );
        });
}

// запускаем первый полный рефреш
refresh();

// слушатель на добавку операции
document.getElementById("add_operate").addEventListener("click",add_operate);

// создания выпадающего списка категорий
function CreateSelector(category) {
    getData2(url_category)
        .then((data) => {
                console.log(data)
                if (category === '')
                  { category = data[0].name
                  }
                console.log(category);

                document.getElementById('list_of_category').innerHTML =
                    `<option disabled>Выберите категорию</option>` +
                    data.reduce(function (accumulator, currentValue) {
                            return accumulator + `<option ${currentValue.name === category ? "selected" : ""} value="${currentValue.name}">${currentValue.name}</option>`;
                        }
                        , ''
                    );
            }
        );
}

// показываем модальное окно для добавления категории
function add_operate () {
    what_i_do = "add";
    CreateSelector("");
    document.getElementById("category_modal").style.display = "block";
}

// отмена добавления операции
document.getElementById("category_cancel").onclick = function() {
    document.getElementById("category_modal").style.display = "none";
};

// добавление и редактирование операции
document.getElementById("category_ok").onclick = function() {
    summa = Number(document.getElementById("my_summa").value);
    if (document.getElementById("Dohod").checked !== true)
    {summa = -1*summa}

    // непосредственно добавление
    if (what_i_do === "add") {
        var today = new Date();
        postData(url_operate, {
            type: document.getElementById("Dohod").checked === true ? "Доход" : "Расход",
            category : document.getElementById("list_of_category").value,
            date : today.toJSON(),
            summa : summa
             })
            .then((data) => {
                document.getElementById('data_place').innerHTML =
                    document.getElementById('data_place').innerHTML +
                    AddOneRow(data);
                document.getElementById('balance').value = Number(document.getElementById('balance').value) + summa;
            });
    } else
    // непосредственно редактирование
    if (what_i_do === "edit") {
        patchData(url_operate,my_id,
            {
                type: document.getElementById("Dohod").checked === true ? "Доход" : "Расход",
                category : document.getElementById("list_of_category").value,
                summa : summa})
            .then((data) => {console.log(data);
                document.getElementById(my_id).outerHTML = AddOneRow(data)
                document.getElementById('balance').value = Number(document.getElementById('balance').value) - summa_was + summa;
            });

        //  {});
    }
    document.getElementById("category_modal").style.display = "none";
};

// слушатель кнопок удалить и редактировать
document.getElementById('data_place').onclick = (event) => {
    event.stopPropagation();
    const id = event.target.closest('tr').id;

    // если удаление - то дел, чистка грида, правка баланса без перечитки
    if (event.target.value === 'del') {
        getData2Id(url_operate,id)
            .then((data) => {
                summa = data.summa;
                document.getElementById('balance').value = Number(document.getElementById('balance').value) - summa;
                deleteData(url_operate, id);
                document.getElementById(id).remove();
            })
    }

    // если редактирование - то подготовка формы редактирования данных - установка всех элементов в те значения что и запись
    if (event.target.value === 'edit') {
        my_id = id
        what_i_do = "edit";

        getData2Id(url_operate,my_id)
            .then((data) => {
                if (data.type === "Доход") {
                    document.getElementById("Dohod").checked = true;
                } else {
                    document.getElementById("Rashod").checked = true;
                }
                summa_was = data.summa;
                if (data.type !== "Доход") {
                    summa_was = -1*summa_was;
                }
                document.getElementById("my_summa").value = summa_was;

                CreateSelector(data.category);
            })
        document.getElementById("category_modal").style.display = "block";

    }
}

