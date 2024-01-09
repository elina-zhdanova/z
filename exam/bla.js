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
        let url_guides = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/'+idRoute+'/guides');
        let api_key = "afab0af3-0ed6-4223-b414-62e77e098958";
        let cur_url = url_guides;
        cur_url.searchParams.append('api_key', api_key);
        const response = await fetch(cur_url);
        const json = await response.json();   
        console.log(json);
        return json;
        
        }
        
        function splitJsonStrings(array) {
            let resultArray = [];
                array.forEach(obj => {
                    if (obj.hasOwnProperty("mainObject")) {
                    let splitValues = obj["mainObject"].split(/\d\. | - |- |\b\d{2}\b\. /);
                        resultArray = resultArray.concat(splitValues);
                        }
                });
        return resultArray;
        }
        function createSelectOptions(data) {
            var selectElement = document.getElementById('select1');
            var options = new Set();
            var defaultOptionElement = document.getElementById('all1');
            defaultOptionElement.value = "По достопримечательности";
                data.forEach(function(row) {
                options.add(row); 
            });
    

            options.forEach(function(option) {
                var optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                selectElement.appendChild(optionElement);
            });
        }
        function createSelectOptionsGid(data) {
            var selectElement = document.getElementById('select2');
            var options = new Set();
            var defaultOptionElement = document.getElementById('all2');
            defaultOptionElement.value = "Язык(Не выбран)";
                data.forEach(function(row) {
                options.add(row.language); 
            });
    

            options.forEach(function(option) {
                var optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                selectElement.appendChild(optionElement);
            });
        }
       function modalWindow(){
            var modal = document.getElementById("myModal");
        
            var span = document.getElementsByClassName("close")[0];
            modal.style.display = "block";

            span.onclick = function() {
                modal.style.display = "none";
            }
        
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
       }
       
        let filteredData = []; 
        let selectedOption = null;
        let selectedBtn = null;  
        let selectedBtn2 = null;  
        async function main() {
        const tableData = await getListOfRoutes();
        filteredData = tableData;
        createSelectOptions(splitJsonStrings(tableData)); 
       
        console.log(tableData);;
        console.log("-/n"+tableData);
        var currentPage = 1;
        var perPage = 8;  // Количество записей на одной странице
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
            newRow.innerHTML = '<td>' + row.name + '</td><td>' + row.language + '</td><td>' +row.workExperience+'</td>'+row.pricePerHour + 'руб.</td><td>'+ 
            '</span></td><td><input type="radio" name="selectedRow" id="btn2'+row.id+'"></td>';
            tableBody.appendChild(newRow);
            var Btn2 = document.getElementById('btn2'+row.id);
             Btn2.addEventListener('click', function(){
                    selectedBtn2 = row.id;
                    var Reg = document.getElementById("regisApplic")
                    Reg.classList.remove('d-none');
                    Reg.onclick = function() {
                        modalWindow();
                        }
                    
                 });
             });
        
        }

        function renderTable(data) {
            console.log('renderTable called with', data);
            var tableBody = document.getElementById('table-body1');
            tableBody.innerHTML = '';
            data.forEach(function(row) {
                var description = row.description.length > 200 ? 
                    (row.description.substring(0, 200) + '<span class="more-details" style="color: #1aa1c1; cursor: pointer;"> Подробнее</span>') : row.description;
                var mainObject = row.mainObject.length > 200 ? 
                    (row.mainObject.substring(0, 200) + '<span class="more-details" style="color: #1aa1c1; cursor: pointer;"> Подробнее</span>') : row.mainObject;
        
                var newRow = document.createElement('tr');
                newRow.innerHTML = '<td>' + row.name + '</td><td><span class="description">' + description + '</span></td><td><span class="main-object">' + mainObject
                 + '</span></td><td><input type="radio" name="selectedRow" id="btn1'+row.id+'"></td>';
                tableBody.appendChild(newRow);
                var Btn = document.getElementById('btn1'+row.id);
                Btn.addEventListener('click',async function(){
                  const tableDataGuides = await getListOfGuides(row.id);   
                  renderTable2(tableDataGuides);
                  createSelectOptionsGid(tableDataGuides); 
                  selectedBtn =row.id; 
                });
                if (row.id === selectedBtn) {
                    Btn.click();
                }
            });
        }

        function renderPageButtons(currentPage,dataLength ) {
        var paginationDiv = document.getElementById('pagination1');
        paginationDiv.innerHTML = '';

        if (currentPage > 1) {
        var firstBtn = document.createElement('button');
        firstBtn.textContent = 'Начало';
        firstBtn.addEventListener('click', function() {
            goToPage(1,searchTerm);
        });
        paginationDiv.appendChild(firstBtn);

        var prevBtn = document.createElement('button');
        prevBtn.textContent = 'Предыдущая';
        prevBtn.addEventListener('click', function() {
            goToPage(currentPage - 1, searchTerm);
        });
        paginationDiv.appendChild(prevBtn);
        }

        for (var i = currentPage; i < currentPage + 5; i++) {
        if (i <= Math.ceil(dataLength / perPage)) {
            var pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', function() {
                goToPage(parseInt(this.textContent), searchTerm);
            });
            paginationDiv.appendChild(pageBtn);
        }
        }

        if (currentPage < Math.ceil(dataLength / perPage)) {
        var nextBtn = document.createElement('button');
        nextBtn.textContent = 'Следующая';
        nextBtn.addEventListener('click', function() {
            goToPage(currentPage + 1, searchTerm);
        });
        paginationDiv.appendChild(nextBtn);

        var lastBtn = document.createElement('button');
        lastBtn.textContent = 'Конец';
        lastBtn.addEventListener('click', function() {
            goToPage(Math.ceil(dataLength / perPage), searchTerm);
        });
        paginationDiv.appendChild(lastBtn);
        }
        }

        function goToPage(pageNumber, searchTerm) {
            currentPage = pageNumber;
            var filteredSearchData = filteredData.filter(function(row) {
                return row.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (selectedOption ? row.mainObject.includes(selectedOption) : true); 
                //В этом коде я использовал тернарный оператор (selectedOption ? row.mainObject.includes(selectedOption) : true), чтобы проверить, выбран ли вариант селекта. 
                //Если вариант выбран (selectedOption не равен null), то функция фильтрации будет проверять, включает ли mainObject выбранный вариант. 
                //Если вариант не выбран, то все строки будут проходить этот фильтр.
            });
            var paginatedData = paginate(filteredSearchData, currentPage, perPage);
            renderTable(paginatedData);
            renderPageButtons(currentPage, filteredSearchData.length); 
        }
   
        
        goToPage(1, searchTerm); // Инициализация таблицы и пагинации
        
        document.getElementById('searchInput1').addEventListener('input', function() {
            searchTerm = this.value;
            goToPage(1, searchTerm); // Переход на первую страницу после ввода нового поискового запроса
        });
        
        function filterAndRenderTable(data, selectedOption) {
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
        async function applyFiltersAndRender() {
            let selectedLanguageOption = document.getElementById('select2').value;
            let experienceFrom = document.getElementById('experienceFrom');
            let experienceTo = document.getElementById('experienceTo');
        
            let fromValue = parseInt(experienceFrom.value) || 0;  // Если значение не введено, считаем его равным 0
            let toValue = parseInt(experienceTo.value) || Infinity;  // Если значение не введено, считаем его равным бесконечности
           
            const tableData2 = await getListOfGuides(selectedBtn);
            let filteredData2 = tableData2.filter(row => 
                (selectedLanguageOption === "Язык(Не выбран)" || row.language === selectedLanguageOption) && 
                row.workExperience >= fromValue &&
                row.workExperience <= toValue
            );
            renderTable2(filteredData2);
            if (selectedBtn2 !== null) {
                document.getElementById('btn2' + selectedBtn2).click();
            }
        }
        
        document.getElementById('select2').addEventListener('change', applyFiltersAndRender);
        document.getElementById('experienceFrom').addEventListener('input', applyFiltersAndRender);
        document.getElementById('experienceTo').addEventListener('input', applyFiltersAndRender);


    }
main();