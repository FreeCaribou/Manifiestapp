import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'programme',
    loadChildren: () => import('./pages/programme/programme.module').then(m => m.ProgrammePageModule)
  },
  {
    path: 'favorite',
    loadChildren: () => import('./pages/favorite/favorite.module').then(m => m.FavoritePageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then(m => m.MapPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'buy-ticket',
    loadChildren: () => import('./pages/buy-ticket/buy-ticket.module').then(m => m.BuyTicketPageModule)
  },
  {
    path: 'playlist',
    loadChildren: () => import('./pages/playlist/playlist.module').then(m => m.PlaylistPageModule)
  },

  // failback routes
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
