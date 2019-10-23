import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from "@angular/core";
import { Hmacsha1Service, ElectronService } from "../core/services";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { WebviewTag } from "electron";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("webViewId", { static: false }) webview: ElementRef;

  libraryForm = new FormGroup({
    jSessionId: new FormControl("", Validators.required),
    bookId: new FormControl("", Validators.required),
    pageFrom: new FormControl("", Validators.required),
    pageTo: new FormControl(""),
    isMultipleDownload: new FormControl(false)
  });

  libroId: number = 0;
  constructor(
    private hMacSha1Service: Hmacsha1Service,
    private http: HttpClient,
    private cookieService: CookieService,
    private electronService: ElectronService
  ) {}
  // http://bv.unir.net:2116/ib/NPcd/IB_Escritorio_Visualizar?cod_primaria=1000193&libro=4143
  // http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&ultpag=1&id=f38dc7a54df8773c3118b2710ff375f85b210fce
  ngOnInit() {}

  ngAfterViewInit() {
    let webviewNative: WebviewTag = this.webview.nativeElement;
    console.log(webviewNative);
    webviewNative.addEventListener("dom-ready", () => {
      console.log(
        webviewNative
          .getWebContents()
          .session.cookies.get(
            { url: "http://bv.unir.net:2116/ib/NPcd/" },
            (error: Error, cookies: Electron.Cookie[]) => {
              // console.log("error", error);
              console.log("cookies", cookies);
              // let cookieStr = "";
              for (let c of cookies) {
                let info = c;
                // cookieStr += `${info.name}=${info.value};`;
                // console.log(info.value, info.name);
                if (info.name === "JSESSIONID") {
                  console.log(info);
                }
              }
              // console.log(cookieStr);
            }
          )
      );
      // this.electronService.remote.session.defaultSession.on(
      //   "will-download",
      //   (event, item, webContents) => {
      //     event.preventDefault();
      //     require("request")(item.getURL(), data => {
      //       require("fs").writeFileSync("/somewhere", data);
      //       console.log("data", data);
      //       console.log("item", item);
      //       console.log("webcontents", webContents);
      //     });
      //   }
      // );

      //(method) Electron.Session.on(event: "will-download", listener: (event: Electron.Event, item: Electron.DownloadItem, webContents: Electron.WebContents) => void): Electron.Session
      //Emitted when Electron is about to download item in webContents.Calling event.preventDefault()
      // will cancel the download and item will not be available from next tick of the process.

      webviewNative.getWebContents().session.cookies.set({
        url: "http://bv.unir.net:2116/ib",
        name: "JSESSIONID",
        value: "E8171293A88D476918E8599043A90D2B",
        domain: "bv.unir.net"
      });

      // webviewNative.loadURL(
      //   "http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&ultpag=1&id=b00fecc3bb84c4350816694ac0c29c742e05ed2f"
      // );
      // webviewNative
      //   .getWebContents()
      //   .session.on("will-download", (event, item, webContents) => {
      //     console.log("will download");
      //     console.log(item.getSavePath());
      //     // event.preventDefault();
      //   });
    });

    webviewNative.addEventListener("new-window", e => {
      const protocol = require("url").parse(e.url).protocol;
      if (protocol === "http:" || protocol === "https:") {
        console.log(e.url);
        if (!e.url.includes("https://bv.unir.net:2610/2.0.0/link")) {
          webviewNative.loadURL(e.url);
        } else {
          console.log(e);
          // this.electronService.remote.net
          //   .request({
          //     method: "POST",
          //     url: e.url
          //   })
          //   .on("response", response => {
          //     console.log(`STATUS: ${response.statusCode}`);
          //     response.on("error", error => {
          //       console.log(`ERROR: ${JSON.stringify(error)}`);
          //     });
          //   });
          // const request = net.request({
          //   method: 'GET',
          //   protocol: 'https:',
          //   hostname: 'github.com',
          //   port: 443,
          //   path: '/'
          // })
        }
      }
    });
    // Modificar el user agent para todas las consultas de las siguientes urls.
    // const filter = {
    //   urls: ["https://bv.unir.net:2610/2.0.0/link*"]
    // };
    // this.electronService.remote.session.defaultSession.webRequest.onBeforeSendHeaders(
    //   filter,
    //   (details, callback) => {
    //     console.log("details", details);
    //     callback({ requestHeaders: details.requestHeaders });

    //     // callback({ cancel : true });
    //   }
    // );
    // console.log(this.electronService.remote.session);
  }

  download() {
    let webviewNative: WebviewTag = this.webview.nativeElement;
    webviewNative.loadURL(
      "http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&id=b00fecc3bb84c4350816694ac0c29c742e05ed2f"
    );
  }
  onSubmit() {
    console.log(this.libraryForm);
    if (this.libraryForm.valid) {
      this.cookieService.set(
        "Cookie",
        "JSESSIONID=13773CD6CC4E8B6181382A885ACEEAC0;"
      );
      this.libroId = this.libraryForm.controls.bookId.value;
      if (!this.libraryForm.controls.isMultipleDownload.value) {
        let page: number = parseInt(this.libraryForm.controls.pageFrom.value);
        if (page > 0) {
          this.getPage(page);
        }
      }
    } else {
    }
  }

  getPage(pageNumber) {
    let id: string = "";
    id = this.generateHash(pageNumber);
    console.log(id);

    // http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&ultpag=1&id=f38dc7a54df8773c3118b2710ff375f85b210fce
    let url =
      "http://bv.unir.net:2116/ib/IB_Browser?pagina=" +
      pageNumber +
      "&libro=" +
      this.libroId +
      "&id=" +
      id;
    console.log(url);

    //     Accept: text / html, application / xhtml + xml, application / xml; q = 0.9, image / webp, image / apng,*/*;q=0.8,application/signed-exchange;v=b3
    // Accept-Encoding: gzip, deflate
    // Accept-Language: es-ES,es;q=0.9
    // Cache-Control: max-age=0
    // Connection: keep-alive
    // Cookie: JSESSIONID=13773CD6CC4E8B6181382A885ACEEAC0; _ga=GA1.2.1747179845.1570105908; _fbp=fb.1.1571150407448.449575931; _hjid=18ff1b07-303b-4820-b902-822b708d0523; notice_gdpr_prefs=0,1,2:; notice_preferences=2:; cmapi_cookie_privacy=permit 1,2,3; cmapi_gtm_bl=; _gcl_au=1.1.1070751318.1571325080; _gid=GA1.2.224476255.1571657777; notice_behavior=implied,eu; _pk_ref.1.a93c=%5B%22%22%2C%22%22%2C1571811412%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_ses.1.a93c=1; ezproxy=SfSjkR7CiQWAyDl; SERVERID=catalogobiblioteca_https; AWSALB=jLiFJLFhwF0cHtcZ4Hg6+q4t8KLhYZdep9alfAoa+uL6b7M2uTjNneiUI3883Hx1gWmxsQOCHl9nv62f5pF7EJRpZCcdjoFGBYc6JJwHGWcF3TdfZaXz2ejr1UVO; _pk_id.1.a93c=77a4f4909ce47764.1570105830.26.1571815903.1571811412.
    // Host: bv.unir.net:2116
    // Upgrade-Insecure-Requests: 1
    // User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36
    // let headers = new HttpHeaders();
    // headers.set("Access-Control-Allow-Origin", "*");
    // headers.set(
    //   "Accept",
    //   "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3"
    // );
    // headers.set("Accept-Language", "es-ES,es;q=0.9");
    // headers.set("Cache-Control", "max-age=0");
    // headers.set("Connection", "keep-alive");
    // headers.set(
    //   "Cookie",
    //   "JSESSIONID=13773CD6CC4E8B6181382A885ACEEAC0; _ga=GA1.2.1747179845.1570105908; _fbp=fb.1.1571150407448.449575931; _hjid=18ff1b07-303b-4820-b902-822b708d0523; notice_gdpr_prefs=0,1,2:; notice_preferences=2:; cmapi_cookie_privacy=permit 1,2,3; cmapi_gtm_bl=; _gcl_au=1.1.1070751318.1571325080; _gid=GA1.2.224476255.1571657777; notice_behavior=implied,eu; _pk_ref.1.a93c=%5B%22%22%2C%22%22%2C1571811412%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_ses.1.a93c=1; ezproxy=SfSjkR7CiQWAyDl; SERVERID=catalogobiblioteca_https; AWSALB=jLiFJLFhwF0cHtcZ4Hg6+q4t8KLhYZdep9alfAoa+uL6b7M2uTjNneiUI3883Hx1gWmxsQOCHl9nv62f5pF7EJRpZCcdjoFGBYc6JJwHGWcF3TdfZaXz2ejr1UVO; _pk_id.1.a93c=77a4f4909ce47764.1570105830.26.1571814116.1571811412.; _gat_UA-3953434-13=1"
    // );
    // headers.set("Host", "bv.unir.net:2116");
    // headers.set("Upgrade-Insecure-Requests", "1");
    // headers.set(
    //   "User-Agent",
    //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36"
    // );

    console.log(
      this.http
        .get(url, {
          headers: {
            "Access-Control-Allow-Origin": "*",

            "Cache-Control": "max-age=0",

            "Upgrade-Insecure-Requests": "1",
            "Accept-Language": "es-ES,es;q=0.9"
          }
        })
        .subscribe((value: object) => {
          console.log(value);
        })
    );
  }

  generateHash(page) {
    return this.hMacSha1Service.hex_sha1(
      this.libraryForm.controls.jSessionId.value +
        "." +
        this.libroId +
        "." +
        page
    );
  }
  // console.log(
  //   this.hMacShaService.hex_sha1("DA53F2506D3CC0055E4FA42D76DA81E4.4143.2")
  //   );
}
