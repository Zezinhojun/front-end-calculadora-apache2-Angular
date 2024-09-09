import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { MaterialModule } from '../material/material.module';


@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MaterialModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FormsModule,

    MatDialogTitle],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  onConfirm(result: boolean): void {
    this.dialogRef.close(result);
  }
}
