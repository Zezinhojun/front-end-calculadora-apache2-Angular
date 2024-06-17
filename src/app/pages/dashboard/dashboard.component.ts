import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { User } from '../../shared/model/commom.model';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

export interface PeriodicElement {
  atendimento: number;
  idade: number;
  patologia: string;
  internacao: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { atendimento: 5267036, idade: 65, patologia: "Cirurgia cardíaca", internacao: '15/04' },
];
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatToolbarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['atendimento', 'idade', 'patologia', 'internacao', 'actions'];
  dataSource = ELEMENT_DATA;
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  _authSvc = inject(AuthService)
  user!: User

  ngOnInit(): void {
    this._authSvc.me().subscribe({
      next: (response) => {
        this.user = response.data
      }
    });
  }

  logout() {
    this._authSvc.logout()
  }

  onAdd() {
    this.router.navigate(['patientform'])
  }

}
