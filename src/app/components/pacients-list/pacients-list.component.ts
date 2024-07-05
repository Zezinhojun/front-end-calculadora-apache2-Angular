import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-pacients-list',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, MatPaginatorModule, MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './pacients-list.component.html',
  styleUrl: './pacients-list.component.scss'
})
export class PacientsListComponent {

  @Input() pacientes: any = []
  @Output() add = new EventEmitter(false)
  @Output() edit = new EventEmitter(false)
  @Output() delete = new EventEmitter(false)

  displayedColumns: string[] = ['atendimento', 'idade', 'patologia', 'actions'];

  onAdd = () => this.add.emit(true)

  onEdit = (element: any) => this.edit.emit(element)

  onDelete = (element: any) => this.delete.emit(element)

}
