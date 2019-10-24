import { app, BrowserWindow, screen, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import * as http from "http";

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === "--serve");

function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  });

  if (serve) {
    require("electron-reload")(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL("http://localhost:4200");
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  ipcMain.on("get-pdf-request", (event, arg) => {
    getPdfRequest(event, arg);
    console.log("sartu da");
  });
  ipcMain.on("set-cookies", (event, arg) => {
    setCookies(arg);
    event.returnValue = "";
  });
}

let cookies: string = "";
function setCookies(arg) {
  cookies = arg;
}
function getPdfRequest(event: Electron.IpcMainEvent, arg) {
  const myURL = new URL(arg.url);
  const path = url.parse(arg.url).path;
  const pageNumber = myURL.searchParams.get("pagina");
  const libro = myURL.searchParams.get("libro");

  // http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&ultpag=1&id=a201e3881ada281aed23c848a8dc52c54b7d4719
  let options: string | http.RequestOptions | url.URL = {
    host: myURL.hostname,
    port: myURL.port,
    path: path,
    method: "GET",
    headers: {
      Cookie: cookies
    }
  };
  let results = "";
  let req = http.request(options, res => {
    res.setEncoding("binary");
    res.on("data", chunk => {
      // results = results + chunk;
      console.log(chunk);
      //TODO
    });
    res.on("end", () => {
      console.log("res", res);
      //TODO
      console.log("end request");
      event.reply("get-pdf-request", {
        error: false,
        data: results,
        pageNumber: pageNumber,
        bookId: libro
      });
      console.log("reply eta gero");
      event.returnValue = "";
    });
  });

  req.on("error", e => {
    console.log("error", e);
    event.reply("get-pdf-request", {
      error: true,
      data: e,
      pageNumber: pageNumber,
      bookId: libro
    });
    console.log("reply eta gero");
    event.returnValue = "";
    //TODO
  });
  req.end();
}
try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", createWindow);

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
