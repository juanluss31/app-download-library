import { Component, OnInit } from "@angular/core";
import { Hmacsha1Service } from "../core/services";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  libraryForm = new FormGroup({
    jSessionId: new FormControl("", Validators.required),
    bookId: new FormControl("", Validators.required),
    pageFrom: new FormControl("", Validators.required),
    pageTo: new FormControl(""),
    isMultipleDownload: new FormControl(false)
  });

  constructor(private hMacSha1: Hmacsha1Service) {}
  // http://bv.unir.net:2116/ib/NPcd/IB_Escritorio_Visualizar?cod_primaria=1000193&libro=4143
  // http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&ultpag=1&id=f38dc7a54df8773c3118b2710ff375f85b210fce
  ngOnInit() {}

  onSubmit() {
    console.log(this.libraryForm);
    if (this.libraryForm.valid) {
      console.log("valide");
    } else {
      console.log("invalid");
    }
  }
}
