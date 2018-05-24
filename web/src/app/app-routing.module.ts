import { NgModule } from '@angular/core';
import { Routes, Route, RouterModule } from '@angular/router';

// Pages
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ExportPageComponent } from './pages/export-page/export-page.component';

// Resolvers
import { RegistriesResolverService } from './providers/resolvers/registries-resolver.service';

const home: Route = {
  path: '',
  component: HomePageComponent,
  resolve: {
    people: RegistriesResolverService
  }
};

const exportsFile: Route = {
  path: 'exports',
  component: ExportPageComponent
};

const routes: Routes = [
  home,
  exportsFile
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
