// const state = {
//     page: 1,
//     pageSize: 10,
//     pageIndex: 0
// };


// function pageCounter(objectPagination) {
//     state.pageIndex = objectPagination.total_pages;
// }

// function numeration() { /*для отображения кнопок пагинации.*/
//     let first = Math.max(1, state.page - 2);//первая кнопка пагинации, не меньше 1
//     let btnp = document.getElementById('btn-p');
//     let last = Math.min(state.page + 2, state.pageIndex);//последняя кнопка пагинации, не больше количества страниц
//     btnp.innerHTML = "";
//     for (let i = first; i <= last; i++) {
//         let btn = document.createElement("button");
//         btn.innerHTML = i;
//         btn.onclick = () => goToPage(i); //устанавливает обработчики событий для перехода на другие страницы при клике на кнопки
//         btn.setAttribute("class", "pageButton");
//         btnp.append(btn);
//     }
//     for (let btn of btnp.children) {
//         if (btn.innerHTML == state.page) btn.setAttribute("id", "activePage");
//     }
// }

// function getRequest(page = 1, pageSize = 10, q = "") { //отправляет GET-запрос на сервер, получает данные о фактах и вызывает другие функции для отображения этих данных на странице
//     let url = new URL("facts", url_routes);//запрашиваем данные о фактах
//     url.searchParams.set("page", page);
//     url.searchParams.set("per-page", pageSize);
//     if (q != "") url.searchParams.set("q", q);
//     let xhr = new XMLHttpRequest();
//     xhr.open("GET", url);
//     xhr.send();
//     xhr.onload = function() {
//         let json = JSON.parse(xhr.response);
//         cleanPosts();
//         pageCounter(json._pagination);
//         numeration();
//     };
// }

// function cleanPosts() {
//     let main = document.querySelector(".tbody");
//     main.innerHTML = "";
// }

// function goToPage(pageNum) {
//     state.page = pageNum;
//     getRequest(state.page, state.pageSize);
// }

// function getNextPage() {
//     state.page++;
//     getRequest(state.page, state.pageSize);
// }

// function getBackPage() {
//     state.page--;
//     getRequest(state.page, state.pageSize);   
// }

// function onPagesChange() {
//     let pageSize = document.getElementById('Per-page');
//     state.pageSize = Number(pageSize.value);
//     state.page = 1;
//     getRequest(state.page, state.pageSize);
// }

//     function onSearchButtonClick () {
//         hideLines();
//         state.page = 1;
//         let field = document.querySelector(".search-field");
//         getRequest(state.page, state.pageSize, field.value);
//     }

// function onKeyPress () {
//     let field = document.querySelector(".search-field");
//     getAutocompletition(field.value);
// }

// window.onload = () => {
//     getRequest(state.page, state.pageSize);
//     document.getElementById('Per-page').onchange = onPagesChange;
//     document.querySelector('.search-btn').onclick = onSearchButtonClick;
//     document.querySelector(".search-field").onkeyup = onKeyPress;
//     document.querySelector('.lines').onclick = (event) => {
//         if (event.target.tagName == "P") {
//             state.page = 1;
//             document.querySelector(".search-field").value = event.target.innerHTML;
//             hideLines();
//         }
//     };
// };
////--------------------------------------------------
// let url_routes = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
// let api_key = "afab0af3-0ed6-4223-b414-62e77e098958";
// let url_orders = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders');


// function addRoute(route) {
//     let table = document.getElementById('myTable');
//     body = table.getElementsByTagName('tbody')[0];
//     let newRow = table.insertRow(table.rows.length);
    
//     // Добавление ячеек
//     let cell1 = newRow.insertCell(0);
//     let cell2 = newRow.insertCell(1);
//     let cell3 = newRow.insertCell(2);

//     // Задание содержимого ячеек
//     cell1.innerHTML = route['name'];
//     cell2.innerHTML = route['description'];
//     cell3.innerHTML = route['mainObject'];
// };

// async function getListOfRoutes() {
//     let cur_url = url_routes;
//     cur_url.searchParams.append('api_key', api_key);
//     const response = await fetch(cur_url);
//     let json = await response.json();
//     const routes = json;
//     routes.forEach(route => {
//         console.log(route);
//         addRoute(route);

//     });

// };


// window.onload = function () {
//     //downloadData();
//     //document.querySelector('.search-btn').onclick = searchByName;
//     getListOfRoutes();
// };
// // pag--------------------------------------------

// let table = document.querySelector('#table');
// let pagination = document.querySelector('#pagination');

// let notesOnPage = 3;
// let countOfItems = Math.ceil(users.length / notesOnPage);

// let showPage = (function() {
// 	let active;
	
// 	return function(item) {
// 		if (active) {
// 			active.classList.remove('active');
// 		}
// 		active = item;
		
// 		item.classList.add('active');
		
// 		let pageNum = +item.innerHTML;
		
// 		let start = (pageNum - 1) * notesOnPage;
// 		let end = start + notesOnPage;
		
// 		let notes = users.slice(start, end);
		
// 		table.innerHTML = '';
// 		for (let note of notes) {
// 			let tr = document.createElement('tr');
// 			table.appendChild(tr);
			
// 			createCell(note.name, tr);
// 			createCell(note.surname, tr);
// 			createCell(note.age, tr);
// 		}
// 	};
// }());

// let items = [];
// for (let i = 1; i <= countOfItems; i++) {
// 	let li = document.createElement('li');
// 	li.innerHTML = i;
// 	pagination.appendChild(li);
// 	items.push(li);
// }

// showPage(items[0]);

// for (let item of items) {
// 	item.addEventListener('click', function() {
// 		showPage(this);
// 	});
// }

// function createCell(text, tr) {
// 	let td = document.createElement('td');
// 	td.innerHTML = text;
// 	tr.appendChild(td);
// }



// function addRoute(route) {
//     let table = document.getElementById('myTable');
//     body = table.getElementsByTagName('tbody')[0];
//     let newRow = table.insertRow(table.rows.length);
    
//     // Добавление ячеек
//     let cell1 = newRow.insertCell(0);
//     let cell2 = newRow.insertCell(1);
//     let cell3 = newRow.insertCell(2);

//     // Задание содержимого ячеек
//     cell1.innerHTML = route['name'];
//     cell2.innerHTML = route['description'];
//     cell3.innerHTML = route['mainObject'];
// };

async function getListOfRoutes() {
    let url_routes = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
    let api_key = "afab0af3-0ed6-4223-b414-62e77e098958";
    let cur_url = url_routes;
    cur_url.searchParams.append('api_key', api_key);
    const response = await fetch(cur_url);
    const json = await response.json();   
    return json;
   

    // routes.forEach(route => {
    //     console.log(route);
    //     addRoute(route);

    // });

};

async function getListOfGuides(idRoute) {
    let url_guides = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/'+idRoute+'/guides');
    let api_key = "afab0af3-0ed6-4223-b414-62e77e098958";
    let cur_url = url_guides;
    cur_url.searchParams.append('api_key', api_key);
    const response = await fetch(cur_url);
    const json = await response.json();   
    console.log(json);
    return json;
    
}



// let selectGuide;
// function radioGuideChange(event) {
//    let docElem = document.querySelector("[data-id='" + selectGuide + "']");
//    if (selectGuide && docElem) {
//       let tSelGui = document.querySelector("[data-id='" + selectGuide + "']");
//       tSelGui.parentNode.parentNode.classList.remove("select-guide");
//    }
//    selectGuide = event.target.value;
//    event.target.parentNode.parentNode.classList.add("select-guide");
//    let conBtn = document.querySelector('.container-btn-make-excurtion-request');
//    conBtn.classList.remove("d-none");
// }

async function main() {
console.log(getListOfRoutes());
const tableData = await getListOfRoutes();
console.log("-/n"+tableData);
var currentPage = 1;
var perPage = 8;  // Количество записей на одной странице

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
        newRow.innerHTML = '<td>' + row.name + '</td><td>' + row.language + '</td><td>' +row.workExperience+'</td>'+row.pricePerHour + 'руб.</td>';
        tableBody.appendChild(newRow);
   })
}

function renderTable(data) {
    var tableBody = document.getElementById('table-body1');
    tableBody.innerHTML = '';
    data.forEach(function(row) {
        var description = row.description.length > 200 ? 
            (row.description.substring(0, 200) + '<span class="more-details" style="color: #1aa1c1; cursor: pointer;"> Подробнее</span>') : row.description;
        var mainObject = row.mainObject.length > 200 ? 
            (row.mainObject.substring(0, 200) + '<span class="more-details" style="color: #1aa1c1; cursor: pointer;"> Подробнее</span>') : row.mainObject;

        var newRow = document.createElement('tr');
        newRow.innerHTML = '<td>' + row.name + '</td><td><span class="description">' + description + '</span></td><td><span class="main-object">' + mainObject + '</span></td><td><input type="radio" name="selectedRow" id="'+row.id+'"></td>';
        tableBody.appendChild(newRow);
        var Btn = document.getElementById(row.id)
        Btn.addEventListener('click',async function(){
          const tableDataGuides = await getListOfGuides(row.id);
          renderTable2(tableDataGuides);

        });
    });
    //  for(var i=2; i<9; i++){
    //             var btn = document.getElementById('btn'+i+(perPage*currentPage-1));
    //             btn.addEventListener('click', function(){
    //                 console.log(i);
    //             });
    //         }
    // // Добавляем обработчик события для кнопки "Подробнее"
    // document.addEventListener('DOMContentLoaded', function() {
    // document.getElementById('table-body1').addEventListener('click', function(e) {
    //     if (e.target.classList.contains('more-details')) {
    //         var content = e.target.parentNode.textContent;
    //         e.target.parentNode.innerHTML = content;
    //     }
    // });
// });

}

function renderPageButtons(currentPage) {
    var paginationDiv = document.getElementById('pagination1');
    paginationDiv.innerHTML = '';

    if (currentPage > 1) {
    var firstBtn = document.createElement('button');
    firstBtn.textContent = 'Начало';
    firstBtn.addEventListener('click', function() {
        goToPage(1);
    });
    paginationDiv.appendChild(firstBtn);

    var prevBtn = document.createElement('button');
    prevBtn.textContent = 'Предыдущая';
    prevBtn.addEventListener('click', function() {
        goToPage(currentPage - 1);
    });
    paginationDiv.appendChild(prevBtn);
    }

    for (var i = currentPage; i < currentPage + 5; i++) {
    if (i <= Math.ceil(tableData.length / perPage)) {
        var pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', function() {
            goToPage(parseInt(this.textContent));
        });
        paginationDiv.appendChild(pageBtn);
    }
    }

    if (currentPage < Math.ceil(tableData.length / perPage)) {
    var nextBtn = document.createElement('button');
    nextBtn.textContent = 'Следующая';
    nextBtn.addEventListener('click', function() {
        goToPage(currentPage + 1);
    });
    paginationDiv.appendChild(nextBtn);

    var lastBtn = document.createElement('button');
    lastBtn.textContent = 'Конец';
    lastBtn.addEventListener('click', function() {
        goToPage(Math.ceil(tableData.length / perPage));
    });
    paginationDiv.appendChild(lastBtn);
    }
    }

    function goToPage(pageNumber) {
        currentPage = pageNumber;
        var paginatedData = paginate(tableData, currentPage, perPage);
        renderTable(paginatedData);
        renderPageButtons(currentPage);
    }

    goToPage(1);
    // Инициализация таблицы и пагинации


    window.onload = function () {
        //downloadData();
        //document.querySelector('.search-btn').onclick = searchByName;
    
};

}
main()