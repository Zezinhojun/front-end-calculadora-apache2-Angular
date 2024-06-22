import { Component, inject } from '@angular/core';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  private readonly _spinnerSvc = inject(SpinnerService)
  public isLoading = this._spinnerSvc.isLoading
}
