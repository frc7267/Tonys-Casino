
// include dependencies
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");

let win;

app.on('ready', function() {

    win = new BrowserWindow({
        width: 640,
        height: 300
    });

    win.setMenu(null);
    win.setResizable(false);

    win.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
    }));

    win.on("closed", () => {

        win = null;
    });

});