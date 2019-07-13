import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase';
import {ListaUsuarios} from '../../app/enviroment'; 
import { ToastController, NavController } from '@ionic/angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {ConexionUsuariosPage} from '../conexion-usuarios/conexion-usuarios.page';
import { timer } from 'rxjs';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  usuarios : any;

  usuarioSeleccionado: any;

  // imagen = '../../assets/LogoKidTabSolo.png';

  ref = firebase.database().ref('usuarios/');

  public formGroup: FormGroup;

  imagen = '../../assets/iconoqr2.png';

  constructor(
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    public navController: NavController,
    private storage: Storage) 
  {
    this.buildForm();
  }

  ngOnInit() {
  }

  private buildForm(){
    this.formGroup = this.formBuilder.group({    
      email: ['', [Validators.email, Validators.required]],
      clave: ['', [Validators.required]]
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ConexionUsuariosPage,
      componentProps: { value: 123 }
    });

    modal.onDidDismiss()
      .then((data) => {
        
        this.usuarioSeleccionado = data.data; // Here's your selected user!
        console.log(this.usuarioSeleccionado.clave);
        console.log(this.usuarioSeleccionado.correo);

        // this.formGroup.value.email = this.usuarioSeleccionado.correo;
        // this.formGroup.value.clave = this.usuarioSeleccionado.clave;

        this.formGroup.controls['email'].setValue(this.usuarioSeleccionado.correo);
        this.formGroup.controls['clave'].setValue(this.usuarioSeleccionado.clave);
      });

    return await modal.present();
  }
  
  async loginToast(validado:boolean) {
    
    if(validado){
      const toast = await this.toastController.create({
        message: 'Bienvenido ' + this.usuarioSeleccionado.correo,
        //showCloseButton: true,
        position: 'middle',
        //closeButtonText: 'Aceptar',
        duration: 3000,
        //color: 'success',
        animated: true,
        cssClass: 'toastOk'
      });
      toast.present();
    }
    else{
      const toast = await this.toastController.create({
        message: 'Clave o Usuario Incorrecto',
        //showCloseButton: true,
        position: 'middle',
        duration: 3000,
        //color: 'danger',
        animated: true,
        cssClass: 'toastFail'
      });
      toast.present();
    }  
  }
  


  enviar(){  

    let flagLogin = false;

    this.ref.on('value', resp => {    
      
      this.usuarios = ListaUsuarios(resp);      
      
      for(let usuario of this.usuarios){
        if(usuario.correo == this.formGroup.value.email && usuario.clave == this.formGroup.value.clave){
          
          //VALIDADO
          flagLogin = true;
          this.loginToast(flagLogin);        
          
          this.storage.set('usuario', usuario);
          
          timer(2500).subscribe(() => this.navController.navigateForward('/menu')); 
          
          break;
        }
      }      
      
      //NO VALIDADO
      if(!flagLogin){
        this.loginToast(flagLogin);   
      }  
    });

  }

  mostrarUsuarios(){
    this.presentModal();

  }
    

}
