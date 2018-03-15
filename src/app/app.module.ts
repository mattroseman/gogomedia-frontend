import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DndListModule } from 'ngx-drag-and-drop-lists';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { ApiService } from './api.service';

import { TrimNamePipe } from './trim-name.pipe';

import { AppComponent } from './app.component';
import { AddMediaComponent } from './view-media/add-media/add-media.component';
import { ViewMediaComponent } from './view-media/view-media.component';
import { MediaElementComponent } from './view-media/media-element/media-element.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { SignupComponent } from './signup/signup.component';
import { EditMediaComponent } from './view-media/edit-media/edit-media.component';


@NgModule({
  declarations: [
    AppComponent,
    AddMediaComponent,
    ViewMediaComponent,
    MediaElementComponent,
    LoginComponent,
    SignupComponent,
    TrimNamePipe,
    EditMediaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DndListModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule
  ],
  entryComponents: [EditMediaComponent],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
