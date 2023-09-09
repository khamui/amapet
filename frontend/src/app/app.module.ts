import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

// prime components
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

// custom modules
import { ContainersModule } from './containers/containers.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ButtonModule,
    MenuModule,
    ContainersModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
