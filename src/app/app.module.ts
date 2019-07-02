import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { IndexComponent } from './index';
import { AdminComponent } from './admin';
import { LoginComponent } from './login';
import { CommentFormComponent } from './comment-form';
import { CommentListComponent } from './comment-list';
import { CommentDeleteComponent } from './comment-delete';
import { AlertComponent } from './_components';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AdminComponent,
    LoginComponent,
    CommentFormComponent,
    CommentListComponent,
    CommentDeleteComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider
],
  bootstrap: [AppComponent]
})
export class AppModule { }
