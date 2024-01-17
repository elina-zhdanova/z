/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
async function getListOfsendData() {
    // eslint-disable-next-line max-len
    let url_guides = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders');
    let api_key = "afab0af3-0ed6-4223-b414-62e77e098958";
    let cur_url = url_guides;
    cur_url.searchParams.append('api_key', api_key);
    const response = await fetch(cur_url);
    const json = await response.json();   
    console.log(json);

    return json;
};
    
   
async function getListOfRoutesName(id) {
    let url_routes = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes');
    let api_key = "afab0af3-0ed6-4223-b414-62e77e098958";
    let cur_url = url_routes;
    cur_url.searchParams.append('api_key', api_key);
    const response = await fetch(cur_url);
    const json = await response.json();   
    console.log(json);
    console.log(id);
    let route = json.find(route => Number(route.id) === id);
    return route ? route.name : null; // Если объект не найден, возвращаем null
}
let tableData = [];
async function main() {
        

    tableData = await getListOfsendData();
    var currentPage = 1;
    var perPage = 3; // Количество записей на одной странице
    function paginate(data, page, perPage) {
        var start = (page - 1) * perPage;
        var end = start + perPage;
        return data.slice(start, end);
    }
    async function deletApplic(id) {
        // eslint-disable-next-line max-len
        let url = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/' + id);
        // eslint-disable-next-line max-len
        url.searchParams.append('api_key', "afab0af3-0ed6-4223-b414-62e77e098958");
        let formData = new FormData();

        try {
            let response = await fetch(url, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            let jsonData = await response.json();
            console.log(jsonData);
            tableData = tableData.filter(item => item.id !== id); 
            return jsonData; 
        } catch (error) {
            console.error('Error:', error);
        }
    }
    function modalWindowcDelte(id) {
    
        var modal = document.getElementById("myModlDelet");
        var span = document.getElementById("No");
        modal.style.display = "block";
        span.onclick = function() {
            modal.style.display = "none";
        };
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    
        // eslint-disable-next-line max-len
        document.getElementById('Yes').addEventListener('click', async function(event) {
            event.preventDefault(); 
            await deletApplic(id); // Wait for the delete request to complete
            modal.style.display = "none";
            tableData = tableData.filter(item => item.id !== id);
            goToPage(currentPage);
        });

    }

    function renderTable(data) {
        var tableBody = document.getElementById('table-body3');
        tableBody.innerHTML = '';
        data.forEach(async function(row) {
            var newRow = document.createElement('tr');
            newRow.innerHTML = '<td>' + row.id + '</td><td>' + await getListOfRoutesName(row.route_id) + '</td><td>' + row.date + '</td><td>' + row.price + 
        '</td>' + '</span></td><td><input type="radio" name="See" id="see' + row.id + '"></td>' + '</span></td><td><input type="radio" name="Edit" id="edit' + row.id + '"></td>'
        + '</span></td><td><input type="radio" name="Delete" id="delete' + row.id + '"></td>';;
            tableBody.appendChild(newRow);
            var Delete = document.getElementById('delete' + row.id);
            Delete.addEventListener('click', async function() {
                modalWindowcDelte(row.id);
          
                goToPage(currentPage);

            });
        });
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

        for (var i = currentPage; i < currentPage + 3; i++) {
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

}
main();