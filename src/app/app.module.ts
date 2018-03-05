import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DndListModule } from 'ngx-drag-and-drop-lists';

import { ApiService } from './api.service';

import { TrimNamePipe } from './trim-name.pipe';

import { AppComponent } from './app.component';
import { AddMediaComponent } from './view-media/add-media/add-media.component';
import { ViewMediaComponent } from './view-media/view-media.component';
import { MediaElementComponent } from './view-media/media-element/media-element.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { SignupComponent } from './signup/signup.component';


@NgModule({
  declarations: [
    AppComponent,
    AddMediaComponent,
    ViewMediaComponent,
    MediaElementComponent,
    LoginComponent,
    SignupComponent,
    TrimNamePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DndListModule,
    AppRoutingModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
