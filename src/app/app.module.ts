import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AddMediaComponent } from './add-media/add-media.component';
import { ViewMediaComponent } from './view-media/view-media.component';
import { MediaService } from './media.service';


@NgModule({
  declarations: [
    AppComponent,
    AddMediaComponent,
    ViewMediaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [MediaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
