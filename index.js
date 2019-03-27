
function getMatchId() {

    var event = matchInformationEvent.value;
    var type = matchInformationType.value;
    var number = parseInt(matchInformationNumber.value);

    // check for valid input
    if (event === "" || type === "" || !isIdNumber(number)) {
        return null;
    }

    return event + '-' + type + '-' + number;
}

function registerAccount() {

    var userId             = parseInt(registrationUserId.value);
    var passwordSha        = sha256(registrationPassword.value);
    var confirmPasswordSha = sha256(registrationConfirmPassword.value);

    // validate input
    if (!isIdNumber(userId) ||
        registrationPassword.value === "" ||
        registrationConfirmPassword.value === "") {

        displayStatusMessage('Missing or invalid fields.');
        return;
    }

    // check for unique id
    if (tableContainsObject('users', 'user-id', userId)) {

        displayStatusMessage('User ID already registered.');
        return;
    }

    // check for matching password and conform password
    if (passwordSha !== confirmPasswordSha) {

        displayStatusMessage('Passwords do not match.');
        return;
    }

    var numTokens = 1000;
    var jsonObj =
        '{"user-id":' + userId + ',' +
        '"password":"' + passwordSha + '",' +
        '"tokens":' + numTokens + '}';

    addObjectToTable('users', jsonObj);
    displayStatusMessage('Created user ' + userId + '.');
}

function registerMatch() {

    var matchId = getMatchId();

    // validate input
    if (!matchId) {

        displayStatusMessage('Missing or invalid fields.');
        return;
    }

    // check for unique match
    if (tableContainsObject('matches', 'match-id', matchId)) {

        displayStatusMessage('Match already registered.');
        return;
    }

    var jsonObj =
        '{"match-id":"' + matchId + '",' +
        '"b1": -1,' +
        '"b2": -1,' +
        '"b3": -1,' +
        '"r1": -1,' +
        '"r2": -1,' +
        '"r3": -1,' +
        '"winner":"u"}';
    
    addObjectToTable('matches', jsonObj);
    displayStatusMessage('Registered match ' + matchId + '.');
}

function addMatchWinner(winner) {

    var matchId = getMatchId();
    var b1      = parseInt(matchInformationB1.value);
    var b2      = parseInt(matchInformationB2.value);
    var b3      = parseInt(matchInformationB3.value);
    var r1      = parseInt(matchInformationR1.value);
    var r2      = parseInt(matchInformationR2.value);
    var r3      = parseInt(matchInformationR3.value);

    // validate input
    if (!matchId ||
        !isIdNumber(b1) || !isIdNumber(b2) || !isIdNumber(b3) ||
        !isIdNumber(r1) || !isIdNumber(r2) || !isIdNumber(r3)) {

        displayStatusMessage('Missing or invalid fields.');
        return;
    }

    // check for match
    if (!tableContainsObject('matches', 'match-id', matchId)) {

        displayStatusMessage('Match not registered.');
        return;
    }

    var match = getObjectsFromTable('matches', 'match-id', matchId)[0];

    // exit of winner already defined
    if (match['winner'] !== 'u') {

        displayStatusMessage('Match winner already set.');
        return;
    }

    match['b1'] = b1;
    match['b2'] = b2;
    match['b3'] = b3;
    match['r1'] = r1;
    match['r2'] = r2;
    match['r3'] = r3;
    match['winner'] = winner;

    var teamNames = { r: "Red team", b: "Blue team" };
    displayStatusMessage('Match winner set to ' + teamNames[winner]);

    // update match
    removeObjectsFromTable('matches', 'match-id', matchId);
    setTimeout(function() { // timeout insures that the adding the object comes after removing the object
        addObjectToTable('matches', JSON.stringify(match));
    }, 0);

    // update user tokens
    var bets = getObjectsFromTable('bets', 'match-id', matchId);
    var newUsers = [];
    for (var i = 0; i < bets.length; i++) {

        var bet = bets[i];
        var user = getObjectsFromTable('users', 'user-id', bet['user-id'])[0];

        if (bet['betting-alliance'] === winner) {
            user['tokens'] += bet['bet-amount'];
        }
        else {
            user['tokens'] -= bet['bet-amount'];
        }

        newUsers.push(JSON.stringify(user));

        removeObjectsFromTable('users', 'user-id', user['user-id']);
    }
    setTimeout(function() { // timeout insures that the adding the object comes after removing the object
        for (var i = 0; i < newUsers.length; i++) {
            addObjectToTable('users', newUsers[i]);
        }
    }, 0);
}

function betAlliance(alliance) {

    var matchId     = getMatchId();
    var userId      = parseInt(bettingUserId.value);
    var passwordSha = sha256(bettingPassword.value);
    var amount      = parseInt(bettingAmount.value);

    // validate input
    if (!matchId) {

        displayStatusMessage('Invalid match information.');
        return;
    }
    if (!isIdNumber(userId) ||
        bettingPassword.value === "" ||
        !Number.isInteger(amount)) {

        displayStatusMessage('Missing or invalid fields.');
        return;
    }

    // check for user
    if (!tableContainsObject('users', 'user-id', userId)) {

        displayStatusMessage('Invalid login credentials.');
        return;
    }

    // get user
    var user = getObjectsFromTable('users', 'user-id', userId)[0];

    // check for password match
    if (passwordSha !== user['password']) {

        displayStatusMessage('Invalid login credentials.');
        return;
    }

    // check for match
    if (!tableContainsObject('matches', 'match-id', matchId)) {

        displayStatusMessage('Match not registered.');
        return;
    }

    // check for double betting
    var bets = getObjectsFromTable('bets', 'match-id', matchId);
    for (var i = 0; i < bets.length; i++) {

        if (bets[i]['user-id'] === userId) {

            displayStatusMessage('Cannot bet twice on the same match.');
            return;
        }
    }

    // check for valid amount of tokens
    if (amount > user['tokens']) {

        displayStatusMessage('Cannot bet more than your net worth');
        return;
    }
    if (amount < 0) {

        displayStatusMessage('Cannot bet a negative amount');
        return;
    }

    var jsonObj =
        '{"user-id":' + userId + ',' +
        '"match-id":"' + matchId + '",' +
        '"betting-alliance":"' + alliance + '",' +
        '"bet-amount":' + amount + '}';
    
    addObjectToTable('bets', jsonObj);
    displayStatusMessage('Created bet for user ' + userId + ' and alliance ' + alliance + '.');
}

function sortLeaderboard() {

    var table = getTable('users');
    table.sort(function(a, b) {

        return b['tokens'] - a['tokens'];
    });

    localStorage.setItem('users', JSON.stringify(table));
}

function displayLeaderboard() {

    sortLeaderboard();

    var users = getTable('users');
    var tbody = leaderboardTable.querySelector('tbody');

    tbody.innerHTML = "";
    for (var i = 0; i < users.length; i++) {

        tbody.innerHTML += '<tr><td>' + users[i]['user-id'] + '</td><td>' + users[i]['tokens'] + '</td></tr>';
    }
}