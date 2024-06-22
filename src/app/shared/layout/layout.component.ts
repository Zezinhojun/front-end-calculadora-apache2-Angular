import { Component, effect, inject, Injector, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SpinnerService } from '../services/spinner/spinner.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    SpinnerComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  _authSvc = inject(AuthService)
  _spinnerSvc = inject(SpinnerService)
  isLoading = this._spinnerSvc.isLoading
  isLoggedin = false
  injector = inject(Injector)
  ngOnInit(): void {
    effect(() => {
      this.isLoggedin = this._authSvc.isLoggedIn()
    }, { injector: this.injector })
  }
  logout() {
    this._authSvc.logout()
  }

}
