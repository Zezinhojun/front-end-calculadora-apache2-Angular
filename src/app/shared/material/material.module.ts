import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:
    [MatSelectModule,
      MatRadioModule,
      MatProgressSpinnerModule,
      MatFormFieldModule,
      MatDatepickerModule,
      MatCardModule,
      MatAutocompleteModule,
      MatInputModule,
      MatButtonModule,
      MatCheckboxModule,
      MatIconModule,
      MatPaginatorModule,
      MatTableModule,
      MatToolbarModule,
    ]
})
export class MaterialModule { }
