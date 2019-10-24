import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Hmacsha1Service, ElectronService } from "../core/services";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ModalDirective } from "angular-bootstrap-md";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("pagesModal", { static: true }) pagesModal: ModalDirective;

  libraryForm = new FormGroup({
    jSessionId: new FormControl("", Validators.required),
    bookId: new FormControl("", Validators.required),
    pageFrom: new FormControl("", Validators.required),
    pageTo: new FormControl(""),
    isMultipleDownload: new FormControl(false)
  });

  libroId: number = 0;

  pages: Array<string> = [];
  pagesText: string = "";
  constructor(
    private hMacSha1Service: Hmacsha1Service,
    private electronService: ElectronService
  ) {}
  // http://bv.unir.net:2116/ib/NPcd/IB_Escritorio_Visualizar?cod_primaria=1000193&libro=4143
  // http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&ultpag=1&id=f38dc7a54df8773c3118b2710ff375f85b210fce
  ngOnInit() {}

  ngAfterViewInit() {}

  onSubmit() {
    this.pages = [];
    this.pagesText = "";

    if (this.libraryForm.valid) {
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
    console.log(id);

    // http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&ultpag=1&id=f38dc7a54df8773c3118b2710ff375f85b210fce
    let url =
      "http://bv.unir.net:2116/ib/IB_Browser?pagina=" +
      pageNumber +
      "&libro=" +
      this.libroId +
      "&id=" +
      id;
    this.pages.push(url);
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
        this.electronService.ipcRenderer.sendSync("get-pdf-request", "ping");
      }
    }
  }
}
