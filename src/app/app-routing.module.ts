import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  // { path: 'menu', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: '', loadChildren: './home/home.module#HomePageModule'},
  { path: 'conexion-usuarios', loadChildren: './conexion-usuarios/conexion-usuarios.module#ConexionUsuariosPageModule' },
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' }
];



@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
