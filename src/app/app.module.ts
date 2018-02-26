import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DndListModule } from 'ngx-drag-and-drop-lists';

import { ApiService } from './api.service';

import { AppComponent } from './app.component';
import { AddMediaComponent } from './add-media/add-media.component';
import { ViewMediaComponent } from './view-media/view-media.component';
import { MediaElementComponent } from './view-media/media-element/media-element.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    AddMediaComponent,
    ViewMediaComponent,
    MediaElementComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DndListModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
