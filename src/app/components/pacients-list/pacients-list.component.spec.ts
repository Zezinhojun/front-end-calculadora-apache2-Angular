import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientsListComponent } from './pacients-list.component';
import { MatTableModule } from '@angular/material/table';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PacientsListComponent', () => {
  let component: PacientsListComponent;
  let fixture: ComponentFixture<PacientsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTableModule, PacientsListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PacientsListComponent);
    component = fixture.componentInstance;
    component.pacientes = [
      { atendimento: 23214, risco: 'Sem desnutrição', cirurgico: 'Não cirúrgico', patologia: 'Teste 1' },
    ] as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit delete event when onDelete is called', () => {
    spyOn(component.delete, 'emit');
    const testElement = { atendimento: 4433 };
    component.onDelete(testElement);
    expect(component.delete.emit).toHaveBeenCalledWith(testElement);
  });

  it('should emit add event when onAdd is called', () => {
    spyOn(component.add, 'emit');
    component.onAdd();
    expect(component.add.emit).toHaveBeenCalledWith(true);
  });

  it('should display patients correctly', () => {
    fixture.detectChanges();
    const tableRows = fixture.nativeElement.querySelectorAll('mat-row');

    expect(tableRows.length).toBe(1, 'Should have one row for the single patient');
    expect(tableRows[0].textContent).toContain('23214');
    expect(tableRows[0].textContent).toContain('Sem desnutrição');
    expect(tableRows[0].textContent).toContain('Não cirúrgico');
    expect(tableRows[0].textContent).toContain('Teste 1');
  });
});
