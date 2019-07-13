import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ConexionUsuariosPage } from '../app/conexion-usuarios/conexion-usuarios.page';
import {ConexionUsuariosPageModule} from '../app/conexion-usuarios/conexion-usuarios.module';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

import { MenuPage} from '../app/menu/menu.page';
import { MenuPageModule } from '../app/menu/menu.module';

import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [ConexionUsuariosPage, MenuPage],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,
    ConexionUsuariosPageModule,
    MenuPageModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
