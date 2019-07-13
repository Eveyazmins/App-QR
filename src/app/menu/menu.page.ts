import { Component } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import * as firebase from 'firebase';
//import { snapshotToArray } from '../../app/app.firebase.config';
import { SaldoUsuarios, Codigos } from '../../app/enviroment';
import { Storage } from '@ionic/storage';
import { element } from '@angular/core/src/render3';



// @IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.page.html'
})
export class MenuPage {
  private creditosUsuario: { key: string, usuario: string, codigo: string }[] = [];
  private usuario: any;
  private creditos: { key: string, usuario: string, codigo: string }[] = [];
  private codigos: { codigo: string, valor: number }[] = [];
  private creditoTotal: number = 0;

  private scannerqr: boolean;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    private qrScanner: QRScanner,
    public toastCtrl: ToastController,
    private storage: Storage) {
    
      this.scannerqr = false;

      this.storage.get('usuario').then((val) => {
      
        this.usuario = val;
        
        console.log('El usuario es', this.usuario);
      });
    
      this.traerCodigos();
      this.traerCreditoUsuario();
  }

  // ionViewWillLoad() {
  //   if (sessionStorage.getItem('usuario')) {
  //     this.toastCtrl.create({
  //       message: 'Bienvenido a FacilQRed, ' + JSON.parse(sessionStorage.getItem('usuario')).correo,
  //       duration: 3000,
  //       position: 'top'
  //     }).present();
  //   }
  //}

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  scan() {
    
    this.scannerqr = true;

    //this.hideElements();
    //this.agregarCredito("ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172");
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted

          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            // alert(text);
            this.agregarCredito(text);

            

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            this.scannerqr = false;
          });
          this.qrScanner.resumePreview();
          // show camera preview
          this.qrScanner.show()
            .then((data: QRScannerStatus) => {
              //console.log('datashowing', data.showing);
              // alert(data.showing);
            }, err => {
              alert(err);
            });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  traerCreditoUsuario() {
    let ref = firebase.database().ref('usuario_credito/');
    this.creditoTotal = 0;

    ref.on('value', resp => {
      
      //TOMAR SALDO DE LOS USUARIOS

      this.creditos = SaldoUsuarios(resp);
      
      console.log("saldos: ", this.creditos);
      
      if (this.creditos != []) {
        this.creditosUsuario = this.creditos.filter(elem => elem.usuario == this.usuario.correo)
      }

      console.log("saldosmios: ", this.creditosUsuario);

      this.creditosUsuario.forEach(credito => {
        let codigo = this.codigos.find(elem => elem.codigo == credito.codigo);
        
        console.log("codigo66: "+ codigo.valor);
        this.creditoTotal = this.creditoTotal + codigo.valor;
        console.log("micredtotal" + this.creditoTotal);
      });
    });

  }

  traerCodigos() {
    let ref = firebase.database().ref('creditos/');

    ref.on('value', resp => {
      
      //TRAER CODIGOS
      this.codigos = Codigos(resp);
      console.log("trajo los codigos: ", this.codigos);
      
      this.traerCreditoUsuario();
    });
  }

  agregarCredito(codigo: string) {
    console.info('AgregarCredito código: ' + codigo);
    // this.spin(true);
    let credito: number = 0;
    let cred: any;

    this.traerCreditoUsuario();
    cred = this.creditosUsuario.find(elem => {
      return elem.codigo == codigo;
    });

    if (cred === undefined) {
      this.cargarCredito(codigo);
    } else if (cred !== undefined) {
      // this.spin(false);
      alert('¡Código ya cargado!');
      // this.Modal('Información', '¡Código ya cargado!');
    }
    this.traerCreditoUsuario();
    this.scannerqr = true;
  }

  cargarCredito(codigo: string) {
    let creditoACargar = {
      'usuario': this.usuario.correo,
      'codigo': codigo
    };

    let ref = firebase.database().ref('usuario_credito/');
    let newCredito = ref.push();
    newCredito.set(creditoACargar);
    alert('El código N° ' + codigo + ' ha sido cargado al usuario ' + this.usuario.correo);

    // let objetoJsonGenerico = nuevo.dameJSON();
    // console.log(creditoACargar);
    // this.objFirestore.collection('creditosUsuario').add(JSON.parse(JSON.stringify(creditoACargar))).then(
    //   Retorno => {
    //     console.log('id= ${Retorno.id} ,  mensaje= ${Retorno.path}');

    //     //this.traerCreditoUsuario();
    //     // this.spin(false);
    //     alert('El código N° ' + codigo + ' ha sido cargado al usuario ' + this.usuario.nombre);
    //     // this.Modal('Código cargado', 'El código N° ' + codigo + ' ha sido cargado al usuario ' + this.usuario.nombre);
    //   }
    // ).catch(error => {
    //   // this.spin(false);
    //   console.error(error);
    //   alert('Error: ' + error);
    //   // this.Modal('Error', 'Detalle: ' + error);
    // });
  
  
    this.scannerqr = false;
    this.traerCreditoUsuario();
  }


  hideElements() {
    
    
    
    // window.document.querySelector('ion-content').classList.add('cameraView');
    // window.document.querySelector('ion-app').classList.add('cameraView');
    // window.document.getElementById('btnScaneo').hidden = true;
    // window.document.getElementById('btnDelete').hidden = true;
    // window.document.querySelector('ion-fab').classList.remove('hidden');
    // window.document.querySelector('ion-fab').classList.add('visible');
    // window.document.getElementById('imageQrCreative').hidden = true;
    // window.document.getElementById('creditTotalText').hidden = true;
    
  }

  // showElements() {
  //   window.document.querySelector('ion-content').classList.remove('cameraView');
  //   window.document.querySelector('ion-app').classList.remove('cameraView');
  //   window.document.getElementById('btnScaneo').hidden = false;
  //   window.document.getElementById('btnDelete').hidden = false;
  //   window.document.querySelector('ion-fab').classList.remove('visible');
  //   window.document.querySelector('ion-fab').classList.add('hidden');
  //   window.document.getElementById('imageQrCreative').hidden = false;
  //   window.document.getElementById('creditTotalText').hidden = false;
  // }

  backScan() {
    //this.showElements();
    this.scannerqr = false;
  }

  delete(){
    firebase.database().ref('usuario_credito/').remove();
    this.traerCreditoUsuario();
    // this.creditosUsuario.forEach(credito => {
    //   firebase.database().ref('usuario_credito/' + credito.key).remove();
    // });
  }



}