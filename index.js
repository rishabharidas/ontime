const { app, BrowserWindow } = require("electron");

const appWindow = () => {
  const instance = new BrowserWindow({
    width: 600,
    height: 400,
  });
  instance.loadFile("index.html");
  // instance.webContents.openDevTools();
};

app.whenReady().then(() => {
  appWindow();
  console.log("testing election here ... . . . . .");
  app.on("activate", () => {
    if (!BrowserWindow.getAllWindows().length) appWindow();
  });
});
