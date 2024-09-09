import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { MaterialModule } from '../material/material.module';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MaterialModule,
    RouterLink,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  private readonly _authSvc = inject(AuthService)

  public isLoggedIn = this._authSvc.isLoggedIn

  ngOnInit = () => this.checkLoginStatus()

  private checkLoginStatus = () => this.isLoggedIn

  public logout = () => this._authSvc.logout()

}
