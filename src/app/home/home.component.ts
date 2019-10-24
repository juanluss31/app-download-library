import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Hmacsha1Service, ElectronService } from "../core/services";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("pagesModal", { static: true }) pagesModal: ModalDirective;

  libraryForm = new FormGroup({
    jSessionId: new FormControl("", Validators.required),
    ezProxy: new FormControl("", Validators.required),
    bookId: new FormControl("", Validators.required),
    pageFrom: new FormControl("", Validators.required),
    pageTo: new FormControl(""),
    isMultipleDownload: new FormControl(false)
  });

  libroId: number = 0;

  pages: Array<object> = [];
  pagesText: string = "";
  constructor(
    private hMacSha1Service: Hmacsha1Service,
    private electronService: ElectronService,
    private toastr: ToastrService
  ) {}
  // http://bv.unir.net:2116/ib/NPcd/IB_Escritorio_Visualizar?cod_primaria=1000193&libro=4143
  // http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&ultpag=1&id=f38dc7a54df8773c3118b2710ff375f85b210fce
  ngOnInit() {
    this.electronService.ipcRenderer.on("get-pdf-request", (event, arg) => {
      if (!arg.error) {
        try {
          if (!this.electronService.fs.existsSync(arg.bookId)) {
            this.electronService.fs.mkdirSync(arg.bookId);
          }
        } catch (err) {
          console.error(err);
        }
        this.electronService.fs.writeFileSync(
          arg.bookId + "/" + arg.pageNumber + ".pdf",
          arg.data
          // err => {
          //   if (err) {
          //     this.toastr.error(
          //       "Error al descargar o crear fichero",
          //       arg.pageNumber
          //     );
          //     throw err;
          //   }
          //   this.toastr.error(
          //     "Se ha generado correctamente",
          //     arg.pageNumber + ".pdf"
          //   );
          // }
        );
      }
    });
  }

  ngAfterViewInit() {}

  onSubmit() {
    this.pages = [];
    this.pagesText = "";

    if (this.libraryForm.valid) {
      let cookies: string =
        "JSESSIONID=" +
        this.libraryForm.controls.jSessionId.value +
        "; " +
        "ezproxy=" +
        this.libraryForm.controls.ezProxy.value;

      this.electronService.ipcRenderer.sendSync("set-cookies", cookies);
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
        if (pageFrom < pageTo) {
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

  donwloadIpcRequest() {
    if (this.pages.length > 0) {
      for (const page of this.pages) {
        this.electronService.ipcRenderer.sendSync("get-pdf-request", page);
      }
    }
  }

  download(page) {
    this.electronService.ipcRenderer.sendSync("get-pdf-request", page);
  }
}
