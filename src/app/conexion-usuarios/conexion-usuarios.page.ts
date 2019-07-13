import { Component, OnInit } from '@angular/core';
import { UsuariosTest } from '../../app/enviroment'; 
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-conexion-usuarios',
  templateUrl: './conexion-usuarios.page.html',
  styleUrls: ['./conexion-usuarios.page.scss'],
})
export class ConexionUsuariosPage implements OnInit {

  usuariosTest: any;

  constructor(private modalController: ModalController) { 
    this.usuariosTest = UsuariosTest();
  }

  ngOnInit() {
    console.log(this.usuariosTest);
  }

  UsuarioSeleccionado(usuario):void {
    console.log(usuario);
    this.modalController.dismiss(usuario);
  }

}
