import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of } from 'rxjs';

import { FormUtilsService } from '../../shared/services/form-utils/form-utils.service';
import { SheetsService } from '../../shared/services/sheets/sheets.service';
import PacienteFormComponent from './paciente-form.component';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';

describe('PacienteFormComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: PacienteFormComponent;
  let fixture: ComponentFixture<PacienteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserAnimationsModule],
      providers: [
        FormBuilder,
        MatSnackBar,
        FormUtilsService,
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '123' }) }
        },
        {
          provide: SheetsService,
          useValue: {
            createRow: () => of({}),
            getPatology: () => of({ values: [['Patologia 1'], ['Patologia 2']] }),
            getTreatments: () => of({ values: [['Tratamento 1'], ['Tratamento 2']] }),
            isLoading: signal<boolean>(false),
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PacienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize form correctly', () => {
  //   expect(component.form).toBeDefined();
  //   expect(component.form.controls['atendimento']).toBeDefined();
  //   expect(component.form.controls['age']).toBeDefined();
  //   expect(component.form.controls['patologia']).toBeDefined();
  //   expect(component.form.controls['internacao']).toBeDefined();
  //   expect(component.form.controls['glim']).toBeDefined();
  //   expect(component.form.controls['dignosticoGlim']).toBeDefined();
  //   expect(component.form.controls['desfecho']).toBeDefined();
  //   expect(component.form.controls['sexo']).toBeDefined();
  //   expect(component.form.controls['tempoDeInternacao']).toBeDefined();
  //   expect(component.form.controls['falenciaOrImuno']).toBeDefined();
  //   expect(component.form.controls['temperatura']).toBeDefined();
  //   expect(component.form.controls['pressao']).toBeDefined();
  //   expect(component.form.controls['freqCardiaca']).toBeDefined();
  //   expect(component.form.controls['freqRespiratoria']).toBeDefined();
  //   expect(component.form.controls['pao2']).toBeDefined();
  //   expect(component.form.controls['phOrHco3']).toBeDefined();
  //   expect(component.form.controls['sodio']).toBeDefined();
  //   expect(component.form.controls['potassio']).toBeDefined();
  //   expect(component.form.controls['creatinina']).toBeDefined();
  //   expect(component.form.controls['hematocrito']).toBeDefined();
  //   expect(component.form.controls['leucocitos']).toBeDefined();
  //   expect(component.form.controls['glasgow']).toBeDefined();
  //   expect(component.form.controls['ageApache']).toBeDefined();
  //   expect(component.form.controls['criticalHealth']).toBeDefined();
  //   expect(component.form.controls['totalApache']).toBeDefined();
  //   expect(component.form.controls['campaignOne']).toBeDefined();
  // });

  // it('should load patologies on init', () => {
  //   const patologiesData = { values: [['Patologia 1'], ['Patologia 2']] };
  //   const spyGetPatology = spyOn(
  //     component['_sheetSvc'],
  //     'getPatology',
  //   ).and.returnValue(of(patologiesData));
  //   component.ngOnInit();

  //   expect(spyGetPatology).toHaveBeenCalled();
  //   expect(component.patologies.length).toBe(patologiesData.values.length);
  //   expect(component.patologies()).toBe('Patologia 1');
  //   expect(component.filteredOptions.length).toBe(patologiesData.values.length);
  // });

  // it('should call getTreatments on initialization and map data correctly', () => {
  //   const treatmentsData = { values: [[1234], [2345]] };
  //   const getTreatmentsSpy = spyOn(
  //     component['_sheetSvc'],
  //     'getTreatments',
  //   ).and.returnValue(of(treatmentsData));
  //   component.ngOnInit();

  //   expect(getTreatmentsSpy).toHaveBeenCalled();

  //   let mappedData: number[] = [];
  //   component['_sheetSvc'].getTreatments().subscribe((data) => {
  //     mappedData = data.values.map((item: any[]) => Number(item[0]));
  //   });

  //   expect(mappedData.length).toBe(treatmentsData.values.length);
  //   expect(mappedData[0]).toBe(1234);
  //   expect(mappedData[1]).toBe(2345);
  // });
});
