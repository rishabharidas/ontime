const { app, BrowserWindow } = require("electron");

const appWindow = () => {
  const instance = new BrowserWindow({
    width: 1024,
    height: 720,
  });
  instance.loadFile("src/index.html");
  // instance.webContents.openDevTools();
};

app.whenReady().then(() => {
  appWindow();
  console.log("testing election here ... . . . . .");
  app.on("activate", () => {
    if (!BrowserWindow.getAllWindows().length) appWindow();
  });
});
