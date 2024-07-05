import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientsListComponent } from './pacients-list.component';

describe('PacientsListComponent', () => {
  let component: PacientsListComponent;
  let fixture: ComponentFixture<PacientsListComponent>;

  beforeEach(async () => {
    component = new PacientsListComponent()
    await TestBed.configureTestingModule({
      declarations: [],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PacientsListComponent);
    component = fixture.componentInstance;
    component.pacientes = [
      { atendimento: 23214, idade: 30, patologia: 'Teste 1' },
      { atendimento: 3456, idade: 45, patologia: 'Teste 2' },
      { atendimento: 123213, idade: 50, patologia: 'Teste 3' }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should emit delete event when onDelete is called", () => {
    spyOn(component.delete, 'emit');
    const testElement = { atendiment: 4433, name: "Luciano" }
    component.onDelete(testElement)
    expect(component.delete.emit).toHaveBeenCalledWith(testElement)
  })

  it("should emit edit event when onEdit is called", () => {
    spyOn(component.edit, 'emit');
    const testElement = { atendiment: 4433, name: "Luciano" }
    component.onEdit(testElement)
    expect(component.edit.emit).toHaveBeenCalledWith(testElement)
  })

  it("should emit add event when onAdd is called", () => {
    spyOn(component.add, 'emit');
    component.onAdd()
    expect(component.add.emit).toHaveBeenCalledWith(true)
  })

  it("should display patients correctly", () => {
    const tableRow = fixture.nativeElement.querySelectorAll('mat-row');
    expect(tableRow[0].textContent).toContain("23214")
    expect(tableRow[0].textContent).toContain('30');
    expect(tableRow[0].textContent).toContain('Teste 1');
    expect(tableRow[1].textContent).toContain('3456');
  })
});
