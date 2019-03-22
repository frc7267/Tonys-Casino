
const sha256 = require('js-sha256');

function getMatchId() {

    var event = matchInformationEvent.value;
    var type = matchInformationType.value;
    var number = parseInt(matchInformationNumber.value);

    // check for valid input
    if (event === "" || type === "" || !Number.isInteger(number)) {
        return null;
    }

    return event + '-' + type + '-' + number;
}

function registerAccount() {

    var userId             = parseInt(registrationUserId.value);
    var passwordSha        = sha256(registrationPassword.value);
    var confirmPasswordSha = sha256(registrationConfirmPassword.value);

    // validate input
    if (!Number.isInteger(userId) ||
        registrationPassword.value === "" ||
        registrationConfirmPassword.value === "") {

        displayStatusMessage('Missing fields.');
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

    var jsonObj =
        '{"user-id":' + userId + ',' +
        '"password":"' + passwordSha + '"}';

    addObjectToTable('users', jsonObj);
    displayStatusMessage('Created user ' + userId + '.');
}

function registerMatch() {

    var matchId = getMatchId();

    // validate input
    if (!matchId) {

        displayStatusMessage('Missing fields.');
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
        !Number.isInteger(b1) || !Number.isInteger(b2) || !Number.isInteger(b3) ||
        !Number.isInteger(r1) || !Number.isInteger(r2) || !Number.isInteger(r3)) {

        displayStatusMessage('Missing fields.');
        return;
    }

    // check for match
    if (!tableContainsObject('matches', 'match-id', matchId)) {

        displayStatusMessage('Match not registered.');
        return;
    }

    var matchObj = getObjectsFromTable('matches', 'match-id', matchId)[0];

    matchObj['b1'] = b1;
    matchObj['b2'] = b2;
    matchObj['b3'] = b3;
    matchObj['r1'] = r1;
    matchObj['r2'] = r2;
    matchObj['r3'] = r3;
    matchObj['winner'] = winner;

    // update match
    removeObjectsFromTable('matches', 'match-id', matchId);
    setTimeout(function() { // timeout insures that the adding the object comes after removing the object
        addObjectToTable('matches', JSON.stringify(matchObj));
    }, 0);
}

function betAlliance(alliance) {

    var matchId     = getMatchId();
    var userId      = parseInt(bettingUserId.value);
    var passwordSha = sha256(bettingPassword.value);

    // validate input
    if (!matchId) {

        displayStatusMessage('Invalid match information.');
        return;
    }
    if (!Number.isInteger(userId) ||
        bettingPassword.value === "") {

        displayStatusMessage('Missing fields.');
        return;
    }

    // check for user
    if (!tableContainsObject('users', 'user-id', userId)) {

        displayStatusMessage('Invalid login credentials.');
        return;
    }

    // check for password match
    var userObj = getObjectsFromTable('users', 'user-id', userId)[0];
    if (passwordSha !== userObj['password']) {

        displayStatusMessage('Invalid login credentials.');
        return;
    }

    // check for match
    if (!tableContainsObject('matches', 'match-id', matchId)) {

        displayStatusMessage('Match not registered.');
        return;
    }

    // check for double betting
    var betObjs = getObjectsFromTable('bets', 'match-id', matchId);
    for (var i = 0; i < betObjs.length; i++) {

        if (betObjs[i]['user-id'] === userId) {

            displayStatusMessage('Cannot bet twice on the same match.');
            return;
        }
    }

    var jsonObj =
        '{"user-id":' + userId + ',' +
        '"match-id":"' + matchId + '",' +
        '"betting-alliance":"' + alliance + '"}';
    
    addObjectToTable('bets', jsonObj);
    displayStatusMessage('Created bet for user ' + userId + ' and alliance ' + alliance + '.');
}