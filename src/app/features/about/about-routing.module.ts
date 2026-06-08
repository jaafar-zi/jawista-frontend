
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './pages/about-page/about-page.component';

const routes: Routes = [
  {
    path: '',
    component: AboutPageComponent,
    title: 'About Jawista — Designed for the Moment',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutRoutingModule {}