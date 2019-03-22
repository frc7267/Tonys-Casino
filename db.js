
function createLocalStorageDatabase() {

    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', '[]');
    }

    if (!localStorage.getItem('matches')) {
        localStorage.setItem('matches', '[]');
    }

    if (!localStorage.getItem('bets')) {
        localStorage.setItem('bets', '[]');
    }
}

function addObjectToTable(name, parameters) {

    var json = localStorage.getItem(name);

    // remove closing bracket
    json = json.substr(0, json.length - 1);

    // if table is not empty, remove closing bracket, then add a comma (separator)
    if (json !== "[") {
        json += ",";
    }

    json += parameters + "]";

    localStorage.setItem(name, json);
}

function getTable(name) {

    return JSON.parse(localStorage.getItem(name));
}

function getObjectsFromTable(name, column, value) {

    var wanted = [];

    var table = getTable(name);
    
    for (var i = 0; i < table.length; i++) {

        var obj = table[i];

        if (obj[column] === value) {
            wanted.push(obj);
        }
    }

    return wanted;
}

function removeObjectsFromTable(name, column, value) {

    var wanted = [];

    var table = getTable(name);
    
    for (var i = 0; i < table.length; i++) {

        var obj = table[i];

        if (obj[column] !== value) {
            wanted.push(obj);
        }
    }

    localStorage.setItem(name, JSON.stringify(wanted));
}

function tableContainsObject(name, column, value) {

    return getObjectsFromTable(name, column, value).length > 0;
}