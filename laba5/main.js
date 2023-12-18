'use strict';

/* сохраняем URL-адрес JSON, который мы хотим получить в переменной.*/
const BASE_URL = new URL("http://cat-facts-api.std-900.ist.mospolytech.ru");

const state = {
    page: 1,
    perPage: 10,
    pageCount: 0
};


/*она находит элемент списка с помощью метода querySelector и сохраняет его в переменную lines. 
Затем устанавливает для этого элемента атрибут id со значением "hidden", который скрывает элемент с помощью CSS. 
Далее функция очищает содержимое списка, устанавливая его innerHTML в пустую строку. 
Таким образом, список автодополнения становится пустым и скрытым.*/
const hideLines = () => { /* для скрытия списка автодополнения */
    let lines = document.querySelector(".lines");
    lines.setAttribute("id", "hidden");
    lines.innerHTML = "";
};

/* Данная функция заполняет список автодополнения элементами из переданной коллекции (collection).
Сначала она находит элемент списка с помощью метода querySelector и сохраняет его в переменную lines. 
Затем удаляет у этого элемента атрибут id, который ранее использовался для скрытия списка.
Далее функция проходит по каждому элементу в коллекции и добавляет его в список автодополнения. 
Для этого используется свойство innerHTML, которое позволяет изменять содержимое элемента HTML. 
Каждый элемент коллекции оборачивается в тег <p>, чтобы отображаться в виде отдельной строки в списке.
Таким образом, после выполнения функции список автодополнения будет заполнен элементами из переданной коллекции и отображаться на странице. */
const fillLineByCollection = (collection) => { /*для заполнения списка автодополнения*/
    let lines = document.querySelector(".lines");
    lines.removeAttribute("id");
    for (let element of collection) {
        lines.innerHTML += `<p>${element}</p>`;
    }
};


/*Данная функция заполняет страницу фактами из переданной коллекции (collection).
Сначала она находит элемент с id="post_t" с помощью метода getElementById и сохраняет его в переменную template. 
Этот элемент является шаблоном для отдельного факта.
Затем функция проходит по каждому элементу в коллекции и создает копию шаблона с помощью метода cloneNode. 
Каждый факт заполняется данными из соответствующего элемента коллекции.
Для заполнения текстового содержимого факта используется свойство textContent, которое позволяет изменять текстовое содержимое элемента HTML.
Для заполнения имени пользователя используется условный оператор ?. (оператор безопасной навигации), 
который позволяет избежать ошибок, если какое-то свойство объекта не определено.
Наконец, созданный факт добавляется в основной контейнер с помощью метода append.
Таким образом, после выполнения функции страница будет заполнена фактами из переданной коллекции. 
Каждый факт будет содержать текст и имя пользователя, если оно определено в элементе коллекции. 
 */
const fillPageByCollection = (collection) => { /*заполнения страницы фактов*/
    let template = document.getElementById("post_t");
    const main = document.querySelector(".posts");
    for (let record of collection) {
        let post = template.content.cloneNode(true);
        post.querySelector("p").textContent = record.text;
        post.querySelector(".userCard").textContent = 
            record?.user?.name?.first +
            " " +
            record?.user?.name?.last;
        main.append(post);
    }
};

function pageCounter(objectPagination) {
    state.pageCount = objectPagination.total_pages;
}

/*Данная функция предназначена для отображения кнопок пагинации на странице.
 Она вызывается каждый раз, когда происходит изменение состояния страницы (например, при поиске или переходе на другую страницу).

Функция начинается с определения переменных first и last, которые определяют первую и последнюю кнопки пагинации, 
которые будут отображаться на странице. 
При этом первая кнопка будет не меньше 1, а последняя не больше значения переменной state.pageCount (количество страниц).

Затем функция получает элемент кнопки пагинации с помощью метода getElementById и очищает ее содержимое с помощью свойства innerHTML.

Далее функция создает кнопки пагинации с помощью цикла for, который проходит по всем страницам, 
начиная с первой (first) и заканчивая последней (last). 
Каждая кнопка создается с помощью метода createElement и добавляется в контейнер кнопок пагинации с помощью метода append.

При этом каждая кнопка получает обработчик события onclick, который вызывает функцию goToPage с номером страницы в качестве аргумента.

Каждая кнопка также получает класс "pageButton", чтобы ее можно было стилизовать с помощью CSS.

После создания всех кнопок пагинации функция проходит по всем дочерним элементам контейнера кнопок пагинации и 
устанавливает атрибут "id" для активной страницы (текущей страницы), чтобы ее можно было выделить стилями.

Таким образом, функция numeration отображает кнопки пагинации на странице и устанавливает обработчики событий для перехода на другие страницы при клике на кнопки. */


function numeration() { /*для отображения кнопок пагинации.*/
    let first = Math.max(1, state.page - 2);//первая кнопка пагинации, не меньше 1
    let btnp = document.getElementById('btn-p');
    let last = Math.min(state.page + 2, state.pageCount);//последняя кнопка пагинации, не больше количества страниц
    btnp.innerHTML = "";
    for (let i = first; i <= last; i++) {
        let btn = document.createElement("button");
        btn.innerHTML = i;
        btn.onclick = () => goToPage(i);
        btn.setAttribute("class", "pageButton");
        btnp.append(btn);
    }
    for (let btn of btnp.children) {
        if (btn.innerHTML == state.page) btn.setAttribute("id", "activePage");
    }
}
/**Данная функция предназначена для отправки GET-запроса на сервер и получения данных о фактах. 
 Она принимает три параметра: номер страницы (page), количество записей на странице (perPage) и строку поиска (q).

Сначала функция создает новый объект URL с помощью конструктора URL, указывая в качестве первого параметра строку "facts" 
(что означает, что мы запрашиваем данные о фактах) и в качестве второго параметра - базовый URL (BASE_URL). 
Затем функция устанавливает параметры запроса (page, per-page и q) с помощью метода searchParams.set.

Далее функция создает новый объект XMLHttpRequest с помощью конструктора XMLHttpRequest и открывает соединение с сервером с помощью метода open, 
указывая тип запроса (GET) и URL. Затем функция отправляет запрос на сервер с помощью метода send.

После отправки запроса функция устанавливает обработчик события onload для объекта XMLHttpRequest. 
Когда ответ от сервера будет получен, обработчик вызовется автоматически. 
Внутри обработчика функция парсит полученный JSON-объект с помощью метода JSON.parse и вызывает другие функции: 
cleanPosts (очистка контейнера с постами), fillPageByCollection (заполнение контейнера с постами данными из полученного JSON-объекта), 
pageCounter (отображение количества страниц) и numeration (отображение кнопок пагинации).

Таким образом, функция getRequest отправляет GET-запрос на сервер, получает данные о фактах и вызывает другие функции для отображения этих данных на странице. */

function getRequest(page = 1, perPage = 10, q = "") {
    let url = new URL("facts", BASE_URL);
    url.searchParams.set("page", page);
    url.searchParams.set("per-page", perPage);
    if (q != "") url.searchParams.set("q", q);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onload = function() {
        let json = JSON.parse(xhr.response);
        cleanPosts();
        fillPageByCollection(json.records);
        pageCounter(json._pagination);
        numeration();
    };
}

/*Данная функция предназначена для отправки GET-запроса на сервер и получения данных для автодополнения. 
Она принимает один параметр - строку поиска (q), которая является необязательным и по умолчанию равна пустой строке.

Сначала функция создает новый объект URL с помощью конструктора URL, указывая в качестве первого параметра строку "autocomplete" 
(что означает, что мы запрашиваем данные для автодополнения) и в качестве второго параметра - базовый URL (BASE_URL). 
Затем функция устанавливает параметр запроса q с помощью метода searchParams.set.

Далее функция создает новый объект XMLHttpRequest с помощью конструктора XMLHttpRequest и открывает соединение с сервером 
с помощью метода open, указывая тип запроса (GET) и URL. Затем функция отправляет запрос на сервер с помощью метода send.

После отправки запроса функция устанавливает обработчик события onload для объекта XMLHttpRequest. 
Когда ответ от сервера будет получен, обработчик вызовется автоматически. 
Внутри обработчика функция парсит полученный JSON-объект с помощью метода JSON.parse и вызывает другие функции: 
hideLines (скрытие контейнера с результатами предыдущего поиска), 
fillLineByCollection (заполнение контейнера с результатами данными из полученного JSON-объекта).

Таким образом, функция getAutocompletition отправляет GET-запрос на сервер, получает данные для автодополнения 
и вызывает другие функции для отображения этих данных на странице. */
function getAutocompletition(q = "") {
    let url = new URL("autocomplete", BASE_URL);
    url.searchParams.set("q", q);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onload = function() {
        let json = JSON.parse(xhr.response);
        hideLines();
        fillLineByCollection(json);
    };
}

function cleanPosts() {
    let main = document.querySelector(".posts");
    main.innerHTML = "";
}

function goToPage(pageNum) {
    state.page = pageNum;
    getRequest(state.page, state.perPage);
}

function getNextPage() {
    state.page++;
    getRequest(state.page, state.perPage);
}

function getBackPage() {
    state.page--;
    getRequest(state.page, state.perPage);   
}

function onPagesChange() {
    let perPage = document.getElementById('Per-page');
    state.perPage = Number(perPage.value);
    state.page = 1;
    getRequest(state.page, state.perPage);
}


/*Данная функция является обработчиком события onclick на кнопке с классом "search-btn". Она вызывается при клике на эту кнопку.
Первым действием функция вызывает функцию hideLines, которая скрывает контейнер с классом "lines".
Затем функция устанавливает значение переменной state.page в 1, так как при новом поиске нужно начинать с первой страницы.
Далее функция получает элемент поля ввода с классом "search-field" и его значение. 
Затем она вызывает функцию getRequest, передавая ей значения переменных state.page, state.perPage и значение поля ввода. 
Функция getRequest отправляет GET-запрос на сервер, получает ответ в формате JSON и заполняет страницу данными из ответа.
Таким образом, при клике на кнопку поиска происходит отправка запроса на сервер с новыми параметрами поиска, и страница обновляется с новыми результатами. */
    function onSearchButtonClick () {
        hideLines();
        state.page = 1;
        let field = document.querySelector(".search-field");
        getRequest(state.page, state.perPage, field.value);
    }

function onKeyPress () {
    let field = document.querySelector(".search-field");
    getAutocompletition(field.value);
}

/*Данная функция является обработчиком события onload, то есть она будет выполнена после полной загрузки страницы.
Первым действием функция вызывает функцию getRequest, передавая ей значения переменных state.page и state.perPage. 
Эта функция отправляет GET-запрос на сервер, получает ответ в формате JSON и заполняет страницу данными из ответа.

Затем функция добавляет обработчики событий на элементы страницы:

- На элемент select с id="Per-page" добавляется обработчик onchange, который вызывает функцию onPagesChange при изменении значения выбранного пункта.
- На кнопку с классом "search-btn" добавляется обработчик onclick, который вызывает функцию onSearchButtonClick при клике на кнопку.
- На поле ввода с классом "search-field" добавляется обработчик onkeyup, который вызывает функцию onKeyPress при отпускании клавиши на клавиатуре.
- На контейнер с классом "lines" добавляется обработчик onclick, который вызывает функцию hideLines при клике на элемент p внутри контейнера.

Функция hideLines скрывает контейнер с классом "lines", чтобы пользователь мог увидеть результаты поиска. 

Таким образом, после выполнения данной функции на странице будут установлены обработчики событий,
которые будут реагировать на действия пользователя и выполнять соответствующие функции.*/

window.onload = () => {
    getRequest(state.page, state.perPage);
    document.getElementById('Per-page').onchange = onPagesChange;
    document.querySelector('.search-btn').onclick = onSearchButtonClick;
    document.querySelector(".search-field").onkeyup = onKeyPress;
    document.querySelector('.lines').onclick = (event) => {
        if (event.target.tagName == "P") {
            state.page = 1;
            document.querySelector(".search-field").value = event.target.innerHTML;
            hideLines();
        }
    };
};