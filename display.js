
function hidePageWrappers() {

    for (var i = 0; i < pageWrappers.length; i++) {
        pageWrappers[i].style.display = 'none';
    }
}

function displayPageWrapper(id) {

    hidePageWrappers();
    document.querySelector('#' + id).style.display = 'block';

}

function displayStatusMessage(message, duration=200) {

    statusBox.innerHTML = message;

    if (statusBox.classList.contains('init-fade')) {
        statusBox.classList.toggle('init-fade');
    }
    else {
        statusBox.classList.toggle('fade');
    }

    // add fade tag after 'duration' milliseconds -> opacity goes to 0 over 700 milliseconds
    setTimeout(function() {
        statusBox.classList.toggle('fade');
    }, duration);
}