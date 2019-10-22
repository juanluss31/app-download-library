import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";

import { HomeComponent } from "./home.component";
import { SharedModule } from "../shared/shared.module";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// https://mdbootstrap.com
import { MDBBootstrapModule } from "angular-bootstrap-md";
@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule {}
