import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConexionUsuariosPage } from './conexion-usuarios.page';

const routes: Routes = [
  {
    path: '',
    component: ConexionUsuariosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConexionUsuariosPage]
})
export class ConexionUsuariosPageModule {}
