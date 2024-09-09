import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPaciente } from '../../shared/model/commom.model';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
  selector: 'app-pacients-list',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './pacients-list.component.html',
  styleUrl: './pacients-list.component.scss',
})
export class PacientsListComponent {
  @Input() pacientes: IPaciente[] = [];
  @Output() add = new EventEmitter(false);
  @Output() edit = new EventEmitter(false);
  @Output() delete = new EventEmitter(false);

  displayedColumns: string[] = ['atendimento', 'risco', 'cirurgico', 'patologia', 'actions'];

  onAdd = () => this.add.emit(true);

  onEdit = (lineId: number) => this.edit.emit(lineId);

  onDelete = (element: any) => this.delete.emit(element);
}
