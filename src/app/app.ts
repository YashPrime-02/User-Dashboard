import { Component } from '@angular/core';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserDashboardComponent],
  template: `<app-user-dashboard />`
})
export class App {}