/* eslint-disable max-len */
async function getListOfRoutes() {
    let url_routes = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
    let api_key = "afab0af3-0ed6-4223-b414-62e77e098958";
    let cur_url = url_routes;
    cur_url.searchParams.append('api_key', api_key);
    const response = await fetch(cur_url);
    const json = await response.json();   
    return json;
}

async function getListOfGuides(idRoute) {
    let url_guides = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/' + idRoute + '/guides');
    let api_key = "afab0af3-0ed6-4223-b414-62e77e098958";
    let cur_url = url_guides;
    cur_url.searchParams.append('api_key', api_key);
    const response = await fetch(cur_url);
    const json = await response.json();   
    console.log(json);
    return json;

}
// async function getListOfsendDataID() {
//     let url_guides = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders');
//     let api_key = "afab0af3-0ed6-4223-b414-62e77e098958";
//     let cur_url = url_guides;
//     cur_url.searchParams.append('api_key', api_key);
//     const response = await fetch(cur_url);
//     const json = await response.json();  
//     console.log(json);
//     if (json.length > 0) {
//         // Если есть, возвращаем ID последнего элемента
//         return json.length+1;
//     } else {
//         // Если нет, возвращаем 1
//         return 1;
//     }}
    
async function sendData(date, duration, guide_id, optionFirst, optionSecond, persons, price, route_id, student_id, time) {
    let url = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders');
    url.searchParams.append('api_key', "afab0af3-0ed6-4223-b414-62e77e098958");
    // let id = await getListOfsendDataID();
    // console.log(id)
    let data = { //данные, что мы отправим
        // 'id': Number('21'+id) ,
        'guide_id': guide_id,
        'route_id': route_id,
        'date': date,
        'time': time,
        'duration': duration,
        'persons': persons,
        'price': price,
        'optionFirst': optionFirst,
        'optionSecond': optionSecond,
        // 'student_id': student_id,            
    };
    console.log(data);
    let formData = new FormData();//чтобы отправить ключ-значение в виде формы
    for (let key in data) {
        formData.append(key, data[key]);
    }    
    for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]); 
    }
    try {
        let response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let jsonData = await response.json();
        console.log(jsonData);
    } catch (error) {
        console.error('Error:', error);
        alert("Невозможно отправить запрос! Перезагрузите страницу.");
    }
}


function splitJsonStrings(array) {//разделение для достопримечательностей
    let resultArray = [];
    array.forEach(obj => {
        if (obj.hasOwnProperty("mainObject")) {
            let splitValues = obj["mainObject"].split(/\d\. | - |- |\b\d{2}\b\. /);
            resultArray = resultArray.concat(splitValues);
        }
    });
    return resultArray;
}
function createSelectOptions(data) {//выпадающий список по дост.
    var selectElement = document.getElementById('select1');
    var options = new Set();
    var defaultOptionElement = document.getElementById('allsights');
    defaultOptionElement.value = "По достопримечательности";
    data.forEach(function(row) {
        options.add(row); 
    });


    options.forEach(function(option) {
        var optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);//добавляем в выпадающий список
    });
}
function createSelectOptionsGid(data) {//селект по языкам
    var selectElement = document.getElementById('select2');
    var options = new Set();
    var defaultOptionElement = document.getElementById('alllang');
    defaultOptionElement.value = "Язык(Не выбран)";
    data.forEach(function(row) {//перебираем элементы в массиве data и добавляем в сет
        options.add(row.language); 
    });


    options.forEach(function(option) {//для каждого из option создаем новый элемент
        var optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

function modalWindow(nameRote, nameGuid, idRoute, idGuid, pricePerHour) {
    console.log(idRoute, idGuid, pricePerHour);

    var Price;
    document.getElementById('lablefio').textContent = 'ФИО гида ' + nameRote;
    document.getElementById('lableRote').textContent = 'Названия маршрута ' + nameGuid;
    var time;
    var date;
    var duration;
    var col_people;
    var first_option = false;
    var second_option = false;
    function calculatePrice() {
        // Проверяем, заполнены ли все необходимые поля
        if (date && time && duration && col_people !== undefined) {

            Price = pricePerHour * Number(duration);
            let dateObject = new Date(date);
            let month = dateObject.getUTCMonth() + 1;
            let day = dateObject.getUTCDate();
            let nDay = dateObject.getUTCDay();//номер дня
            console.log(month, day, nDay);
            if (nDay == 6 || nDay == 0) isThisDayOff = 1.5;
            else if (((month == 1) && (day >= 1 && day <= 9)) ||
            ((month == 3) && (day >= 6 && day <= 8)) ||
            ((month == 4) && (day >= 30) || (month == 5) && (day <= 3)) ||
            ((month == 5) && (day >= 7 && day <= 10)) ||
            ((month == 6) && (day >= 11 && day <= 13)) ||
            ((month == 11) && (day >= 4 && day <= 6))) {
                isThisDayOff = 1.5;
            } else {
                isThisDayOff = 1;
            }

            Price = Price * isThisDayOff;

            let Morning, Evening;
            let hoursTime = Number(time.split(":")[0]);
            if (hoursTime >= 9 && hoursTime <= 12) {
                Morning = 400;
                Evening = 0;
            } else if (hoursTime >= 20 && hoursTime <= 23) {
                Evening = 1000;
                Morning = 0;
            } else {
                Morning = 0;
                Evening = 0;
            }
            Price = Price + Morning + Evening;

            let numberOfVisitors;
            if (col_people >= 1 &&
                col_people <= 5) numberOfVisitors = 0;
            else if (col_people > 5 &&
                col_people <= 10) numberOfVisitors = 1000;
            else if (col_people > 10 &&
                col_people <= 20) numberOfVisitors = 1500;
            Price = Price + numberOfVisitors;
            
            if (first_option) {
                Price = Price - Price * 0.15;
            }
            if (second_option) {
                Price = Price + col_people * 1000;
            }

            document.getElementById('price').textContent = 'Итоговая стоимость: ' + Price;
        }
    } 

    //считываем данные с окна
    document.getElementById('date').addEventListener('change', function() {
        console.log('Дата изменена:', typeof(this.value), this.value);
        date = this.value;
        calculatePrice();
    });

    document.getElementById('time').addEventListener('change', function() {
        console.log('Время изменено:', typeof(this.value), this.value);
        time = this.value;
        calculatePrice();
    });

    document.getElementById('selectmodal').addEventListener('change', function() {
        console.log('Длительность экскурсии изменена:', typeof(this.value), this.value);
        duration = this.value;
        calculatePrice();
    });
    document.getElementById('col_people').addEventListener('input', function() {
        console.log('Количество человек изменено:', typeof(this.value), this.value);
        col_people = this.value;
        calculatePrice();
    });

    document.getElementById('first_option').addEventListener('change', function() {
        console.log('Первая опция изменена:', this.checked);
        first_option = this.checked;
        calculatePrice();
    });


    document.getElementById('second_option').addEventListener('change', function() {
        console.log('Вторая опция изменена:', typeof(this.value), this.checked);
        second_option = this.checked;
        calculatePrice();
    });

    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    };
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    document.getElementById('send').addEventListener('click', function(event) {//отправка 
        event.preventDefault();//чтоб страница не обновлялась
        
        if (date && time && duration && col_people !== undefined) {// если заполнены все поля 
            console.log(date, Number(duration), Number(idGuid), first_option, second_option, Number(col_people), Number(idRoute), 1223, time + ":00");
            sendData(date, Number(duration), Number(idGuid), Number(first_option), Number(second_option), Number(col_people), Price, Number(idRoute), 122334, time);
            //обнуляем для след. отправки и закрываем 
            document.getElementById('date').value = '';
            document.getElementById('time').value = '';
            document.getElementById('selectmodal').value = '';
            document.getElementById('col_people').value = '';
            document.getElementById('first_option').checked = false;
            document.getElementById('second_option').checked = false;
            document.getElementById('alert').style.display = 'block';
            modal.style.display = "none";
        } else {
            alert("Заполните все поля");
        }
    });
}

var Reg = document.getElementById("regisApplic");//оформить заявку-регистрация
let routName;
let routid;
let filteredData = []; 
let selectedOption = null;
let selectedBtn = null;  
let selectedBtnIDGuid = null;  
async function main() {
    const tableData = await getListOfRoutes();
    filteredData = tableData;
    createSelectOptions(splitJsonStrings(tableData)); 

    console.log(tableData);;
    console.log("-/n" + tableData);
    var currentPage = 1;
    var perPage = 8; // Количество записей на одной странице
    var searchTerm = '';

    function paginate(data, page, perPage) {
        var start = (page - 1) * perPage;
        var end = start + perPage;
        return data.slice(start, end);
    }   

    function renderTable2(data) {
        var tableBody = document.getElementById('table-body2');
        tableBody.innerHTML = '';
        data.forEach(function(row) {
            var newRow = document.createElement('tr');
            newRow.innerHTML = '<td>' + row.name + '</td><td>' + row.language + '</td><td>' + row.workExperience + '</td>' + row.pricePerHour + 'руб.</td><td>' + 
            '</span></td><td><input type="radio" name="selectedRow1" id="btn2' + row.id + '"></td>';
            tableBody.appendChild(newRow);
            var Btn2 = document.getElementById('btn2' + row.id);
            Btn2.addEventListener('click', function() {
                selectedBtnIDGuid = row.id;
                Reg.classList.remove('d-none');
                Reg.onclick = function() {
                    modalWindow(routName, row.name, routid, row.id, row.pricePerHour);
                };       
            });
        });

    }

    function renderTable(data) {
        console.log('renderTable called with', data);
        var tableBody = document.getElementById('table-body1');
        tableBody.innerHTML = '';
        data.forEach(function(row) {
            var description = row.description.length > 200 ? 
                (row.description.substring(0, 200) + '<span class="more-details" style=cursor: pointer;"> Подробнее</span>') : row.description;
            var mainObject = row.mainObject.length > 200 ? 
                (row.mainObject.substring(0, 200) + '<span class="more-details" style=cursor: pointer;"> Подробнее</span>') : row.mainObject;

            var newRow = document.createElement('tr');
            newRow.innerHTML = '<td>' + row.name + '</td><td><span class="description">' + description + '</span></td><td><span class="main-object">' + mainObject
                + '</span></td><td><input type="radio" name="selectedRow" id="btn1' + row.id + '"></td>';
            tableBody.appendChild(newRow);
            var Btn = document.getElementById('btn1' + row.id);
            Btn.addEventListener('click', async function() {
                const tableDataGuides = await getListOfGuides(row.id); 
                routName = row.name;
                routid = row.id;  
                renderTable2(tableDataGuides);
                createSelectOptionsGid(tableDataGuides); 
                Reg.classList.add('d-none');//прячем кнопку оформить заявку при выборе другого маршрута
                selectedBtn = row.id; //сохраняем кнопку маршрута
            });
            if (row.id === selectedBtn) {
                Btn.click();
            }
        });
    }

    function renderPageButtons(currentPage, dataLength) {
        var paginationDiv = document.getElementById('pagination1');
        paginationDiv.innerHTML = '';

        if (currentPage > 1) {
            var firstBtn = document.createElement('button');
            firstBtn.textContent = 'Начало';
            firstBtn.addEventListener('click', function() {
                // eslint-disable-next-line no-use-before-define
                goToPage(1, searchTerm);
                if (selectedBtnIDGuid !== null) {
                    document.getElementById('btn2' + selectedBtnIDGuid).click();
                }
            });
            paginationDiv.appendChild(firstBtn);

            var prevBtn = document.createElement('button');
            prevBtn.textContent = 'Предыдущая';
            prevBtn.addEventListener('click', function() {
                // eslint-disable-next-line no-use-before-define
                goToPage(currentPage - 1, searchTerm);
                if (selectedBtnIDGuid !== null) {
                    document.getElementById('btn2' + selectedBtnIDGuid).click();
                }
            });
            paginationDiv.appendChild(prevBtn);
        }

        for (var i = currentPage; i < currentPage + 5; i++) {
            if (i <= Math.ceil(dataLength / perPage)) {
                var pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', function() {
                    // eslint-disable-next-line no-use-before-define
                    goToPage(parseInt(this.textContent), searchTerm);
                });
                if (selectedBtnIDGuid !== null) {//для сохранения прожатия кнопки в таблицу с гидами
                    document.getElementById('btn2' + selectedBtnIDGuid).click();
                }
                paginationDiv.appendChild(pageBtn);
            }
        }

        if (currentPage < Math.ceil(dataLength / perPage)) {
            var nextBtn = document.createElement('button');
            nextBtn.textContent = 'Следующая';
            nextBtn.addEventListener('click', function() {
                // eslint-disable-next-line no-use-before-define
                goToPage(currentPage + 1, searchTerm);
                if (selectedBtnIDGuid !== null) {
                    document.getElementById('btn2' + selectedBtnIDGuid).click();
                }
            });
            paginationDiv.appendChild(nextBtn);

            var lastBtn = document.createElement('button');
            lastBtn.textContent = 'Конец';
            lastBtn.addEventListener('click', function() {
                // eslint-disable-next-line no-use-before-define
                goToPage(Math.ceil(dataLength / perPage), searchTerm);
                if (selectedBtnIDGuid !== null) {
                    document.getElementById('btn2' + selectedBtnIDGuid).click();
                }
            });
            paginationDiv.appendChild(lastBtn);
        }
    }

    function goToPage(pageNumber, searchTerm) {
        currentPage = pageNumber;
        var filteredSearchData = filteredData.filter(function(row) {
            return row.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedOption ? row.mainObject.includes(selectedOption) : true); 
            //В этом коде я использовала тернарный оператор (selectedOption ? row.mainObject.includes(selectedOption) : true), чтобы проверить, выбран ли вариант селекта. 
            //Если вариант выбран (selectedOption не равен null), то функция фильтрации будет проверять, включает ли mainObject выбранный вариант. 
            //Если вариант не выбран, то все строки будут проходить этот фильтр.
        });
        var paginatedData = paginate(filteredSearchData, currentPage, perPage);
        renderTable(paginatedData);
        renderPageButtons(currentPage, filteredSearchData.length); 
        if (selectedBtnIDGuid !== null) {
            document.getElementById('btn2' + selectedBtnIDGuid).click();
        }
    }


    goToPage(1, searchTerm); // Инициализация таблицы и пагинации

    document.getElementById('searchInput1').addEventListener('input', function() {//поиск по названию маршрута
        searchTerm = this.value;
        goToPage(1, searchTerm); // Переход на первую страницу после ввода нового поискового запроса
    });

    function filterAndRenderTable(data, selectedOption) {//для фильтрации(поиск по названию маршрута с выбранным селектом)
        console.log('filterAndRenderTable called with', selectedOption);
        var localFilteredData = data.filter(function(row) {
            return row.mainObject.includes(selectedOption);
        });
        console.log('Filtered data:', localFilteredData);
        renderTable(localFilteredData);
        renderPageButtons(currentPage, localFilteredData.length);
    }

    document.getElementById('select1').addEventListener('change', function() {
        selectedOption = this.value;
        console.log("Selected option: ", selectedOption); 
        if (selectedOption === "По достопримечательности") {
            // Сбросить фильтр и отобразить все данные
            selectedOption = null;
            goToPage(1, searchTerm);
        } else {
            // Применить фильтр и отобразить отфильтрованные данные
            filterAndRenderTable(filteredData, selectedOption);
        }
    });

    // eslint-disable-next-line max-len
    async function applyFiltersAndRender() {//для селекта с гидами и выбором их опыта работы
        let selectedLanguageOption = document.getElementById('select2').value;
        let experienceFrom = document.getElementById('experienceFrom');
        let experienceTo = document.getElementById('experienceTo');

        // eslint-disable-next-line max-len
        let fromValue = parseInt(experienceFrom.value) || 0;  
        // Если значение не введено, считаем его равным 0
        let toValue = parseInt(experienceTo.value) || Infinity; 
        // Если значение не введено, считаем его равным бесконечности
        
        const tableData2 = await getListOfGuides(selectedBtn);
        //запрашиваем таблицу гидов в id маршрута
        let filteredData2 = tableData2.filter(row => 
            // eslint-disable-next-line max-len
            (selectedLanguageOption === "Язык(Не выбран)" || row.language === selectedLanguageOption) && 
            row.workExperience >= fromValue &&
            row.workExperience <= toValue
        );
        renderTable2(filteredData2);
        if (selectedBtnIDGuid !== null) {
            document.getElementById('btn2' + selectedBtnIDGuid).click();
        }
    }

    document.getElementById('select2').addEventListener('change', applyFiltersAndRender);
    document.getElementById('experienceFrom').addEventListener('input', applyFiltersAndRender);
    document.getElementById('experienceTo').addEventListener('input', applyFiltersAndRender);
}
main();