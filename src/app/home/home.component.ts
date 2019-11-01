import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Hmacsha1Service, ElectronService } from "../core/services";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService, ToastContainerDirective } from "ngx-toastr";
import { WriteStream } from "fs";
import { PdfmergeService } from "../core/services/pdfmerge/pdfmerge.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("pagesModal", { static: true }) pagesModal: ModalDirective;

  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective;

  cookies: string = "";
  libroId: number = 0;

  savePath: string = "";

  isDownloadAll: boolean = false;
  downloadAllIndex: number = 0;

  libraryForm = new FormGroup({
    jSessionId: new FormControl("", Validators.required),
    ezProxy: new FormControl("", Validators.required),
    bookId: new FormControl("", Validators.required),
    pageFrom: new FormControl("", Validators.required),
    pageTo: new FormControl(""),
    isMultipleDownload: new FormControl(false)
  });

  pages: Array<object> = [];
  pagesText: string = "";

  constructor(
    private hMacSha1Service: Hmacsha1Service,
    private electronService: ElectronService,
    private pdfMergeService: PdfmergeService,
    private toastr: ToastrService
  ) {}

  // http://bv.unir.net:2116/ib/NPcd/IB_Escritorio_Visualizar?cod_primaria=1000193&libro=4143
  // http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&ultpag=1&id=f38dc7a54df8773c3118b2710ff375f85b210fce
  ngOnInit() {
    this.toastr.overlayContainer = this.toastContainer;
  }

  ngAfterViewInit() {}

  onSubmit() {
    this.pages = [];
    this.pagesText = "";

    if (this.libraryForm.valid) {
      this.cookies =
        "JSESSIONID=" +
        this.libraryForm.controls.jSessionId.value +
        "; " +
        "ezproxy=" +
        this.libraryForm.controls.ezProxy.value;

      this.libroId = this.libraryForm.controls.bookId.value;

      if (!this.libraryForm.controls.isMultipleDownload.value) {
        let page: number = parseInt(this.libraryForm.controls.pageFrom.value);
        if (page > 0) {
          this.getPage(page);
          this.pagesText = "pages=['" + this.pages[0] + "']";
        }
      } else {
        let pageFrom = parseInt(this.libraryForm.controls.pageFrom.value);
        let pageTo = parseInt(this.libraryForm.controls.pageTo.value);
        if (pageFrom < pageTo && pageFrom > 0) {
          for (let pageIndex = pageFrom; pageIndex <= pageTo; pageIndex++) {
            this.getPage(pageIndex);
          }
          this.pagesText = "pages=[";
          for (let index = 0; index < this.pages.length - 1; index++) {
            const element = this.pages[index];
            this.pagesText += "'" + element + "', ";
          }
          this.pagesText += "'" + this.pages[this.pages.length - 1] + "'" + "]";
        }
      }
      this.pagesModal.show();
    } else {
    }
  }

  getPage(pageNumber) {
    let id: string = "";
    id = this.generateHash(pageNumber);

    // http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&ultpag=1&id=f38dc7a54df8773c3118b2710ff375f85b210fce
    let url =
      "http://bv.unir.net:2116/ib/IB_Browser?pagina=" +
      pageNumber +
      "&libro=" +
      this.libroId +
      "&id=" +
      id;

    this.pages.push({ url: url, pageNumber: pageNumber });
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

  closeModal() {
    this.pagesModal.hide();
  }

  getPdfRequest(page) {
    const myURL = new URL(page.url);
    const path = this.electronService.url.parse(page.url).path;
    const pageNumber = myURL.searchParams.get("pagina");
    const libro = myURL.searchParams.get("libro");

    let responseResults: string = "";

    let ws: WriteStream = this.electronService.fs.createWriteStream(
      this.savePath + "/" + libro + "/" + pageNumber + ".pdf",
      { flags: "w" }
    );
    ws.on("open", () => {
      // http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&ultpag=1&id=a201e3881ada281aed23c848a8dc52c54b7d4719
      let options = {
        host: myURL.hostname,
        port: myURL.port,
        path: path,
        method: "GET",
        headers: {
          Cookie: this.cookies
        }
      };

      let req = this.electronService.http.request(options, res => {
        // res.setEncoding("binary");
        res.on("data", chunk => {
          responseResults += chunk.toString("utf8");
          //TODO
          ws.write(chunk);
        });
        res.on("end", () => {
          ws.end();

          if (responseResults !== "") {
            this.toastr.success(
              "Fichero correcto: " + pageNumber + ".pdf",
              "Descargado",
              {
                timeOut: 5000,
                positionClass: "toast-bottom-right"
              }
            );
          } else {
            this.toastr.error(
              "Error en el fichero: " +
                pageNumber +
                ".pdf" +
                ", Vuelve a generar las cookies en la biblioteca",
              "Fichero vacio",
              {
                timeOut: 5000,
                positionClass: "toast-bottom-right"
              }
            );
          }
        });
      });

      req.on("error", e => {
        // console.log("request error", e);
        this.toastr.error(
          "Error en el fichero: " + pageNumber + ".pdf",
          "Error de Petición",
          {
            timeOut: 5000,
            positionClass: "toast-bottom-right"
          }
        );
      });

      req.end(() => {
        this.downloadAllIndex++;
        if (this.isDownloadAll && this.downloadAllIndex < this.pages.length) {
          this.getPdfRequest(this.pages[this.downloadAllIndex]);
        }
      });
    });
  }

  download(page) {
    if (this.createDirectory()) {
      this.isDownloadAll = false;
      this.getPdfRequest(page);
    }
  }

  downloadAll() {
    if (this.createDirectory()) {
      this.isDownloadAll = true;
      this.downloadAllIndex = 0;
      if (this.pages.length > 0) {
        this.getPdfRequest(this.pages[this.downloadAllIndex]);
      }
    }
  }

  createDirectory() {
    try {
      this.savePath = "";
      this.savePath = this.electronService.remote.dialog.showOpenDialogSync({
        properties: ["openDirectory"]
      })[0];

      if (this.savePath !== "") {
        if (
          !this.electronService.fs.existsSync(
            this.savePath + "/" + this.libroId
          )
        ) {
          this.electronService.fs.mkdirSync(this.savePath + "/" + this.libroId);
        }
        return true;
      }
      // }
    } catch (err) {
      // console.error(err);
      return false;
    }
  }

  mergePdf() {
    let sourceFiles: Array<string> = [];
    sourceFiles = this.electronService.remote.dialog.showOpenDialogSync({
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "PDF", extensions: ["pdf"] }]
    });
    if (sourceFiles) {
      if (sourceFiles.length > 1) {
        let destinationPath: string = "";
        let extension = this.electronService.path.extname(sourceFiles[0]);
        let destFirstFile = this.electronService.path.basename(
          sourceFiles[0],
          extension
        );
        let destLastFile = this.electronService.path.basename(
          sourceFiles[sourceFiles.length - 1],
          extension
        );

        let destDir = this.electronService.path.dirname(sourceFiles[0]);

        let destinationFilePath =
          destFirstFile + "-" + destLastFile + extension;

        destinationPath = this.electronService.path.join(
          destDir,
          destinationFilePath
        );

        this.pdfMergeService
          .pdfMerge(sourceFiles, destinationPath)
          .then(done => {
            // console.log(done); // success
            this.toastr.success(destinationPath, "Fusion hecha: ", {
              timeOut: 5000,
              positionClass: "toast-bottom-full-width"
            });
          })
          .catch(error => {
            console.log(error);
            console.error(error.code); // Logs error code if an error occurs
          });
      }
    }
  }
}
