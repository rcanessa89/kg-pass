import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatDialogModule
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ExportPageComponent } from './pages/export-page/export-page.component';
import { ConfirmDialogComponent } from './share/confirm-dialog/confirm-dialog.component';
import { NavComponent } from './share/nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ExportPageComponent,
    ConfirmDialogComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    HttpClientModule,
    MatDialogModule
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
