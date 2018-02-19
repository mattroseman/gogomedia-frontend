import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AddMediaComponent } from './add-media/add-media.component';
import { ViewMediaComponent } from './view-media/view-media.component';


@NgModule({
  declarations: [
    AppComponent,
    AddMediaComponent,
    ViewMediaComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
