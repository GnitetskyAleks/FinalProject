import { url_category, getData2, postData, patchData, deleteData, getData2Id, check_log, db_res } from "./my_base.js";
import {check_log} from "./my_base";

let what_i_do = 'none';
let my_id = 0;

check_log();

// добавить строчку
function AddOneRow(rowvalue) {
    return `<tr id="${rowvalue.id}">
              <th>${rowvalue.name}</th>
              <th><input class="my_column_button" type="button" value="edit">
                  <input class="my_column_button" type="button" value="del"></th>
            </tr>`
}

// обновить всю структуру грида
function refresh() {
    getData2(url_category)
        .then((data) => {
            document.getElementById('data_place').innerHTML =
            `<tr>
                <th>Название</th>
                <th>Действие</th>
            </tr>` +
                data.reduce(function(accumulator, currentValue) {
                        return accumulator + AddOneRow(currentValue);
                    }
                    ,''
                );
        });
}

// слушатель на добавку категории
document.getElementById("add_category").addEventListener("click",add_category);

// показываем модальное окно для добавления категории
function add_category () {
    what_i_do = "add";
    document.getElementById("category_name").value = "";
    document.getElementById("category_modal").style.display = "block";
}

// отмена добавления категории
document.getElementById("category_cancel").onclick = function() {
    document.getElementById("category_modal").style.display = "none";
};

// добавление и редактирование категории
document.getElementById("category_ok").onclick = function() {
    if (what_i_do === "add") {
        postData(url_category, {name: document.getElementById("category_name").value})
            .then((data) => {
                document.getElementById('data_place').innerHTML =
                    document.getElementById('data_place').innerHTML +
                    AddOneRow(data);
            });
    } else
    if (what_i_do === "edit") {
        patchData(url_category,my_id,{name: document.getElementById("category_name").value})
            .then((data) => {console.log(data);
                             document.getElementById(my_id).outerHTML = AddOneRow(data)});

      //  {});
    }

    document.getElementById("category_modal").style.display = "none";
};

// слушатель кнопок удалить и редактировать
document.getElementById('data_place').onclick = (event) => {
    event.stopPropagation();
    const id = event.target.closest('tr').id;

    if (event.target.value === 'del') {
        deleteData(url_category, id);
        document.getElementById(id).remove();
    }

    if (event.target.value === 'edit') {
        my_id = id
        what_i_do = "edit";

        getData2Id(url_category,my_id)
            .then((data) => {document.getElementById("category_name").value = data.name})
        document.getElementById("category_modal").style.display = "block";
    }
}

refresh();