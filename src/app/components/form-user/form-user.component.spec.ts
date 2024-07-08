import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUserComponent } from './form-user.component';
import { FormUtilsService } from '../../shared/services/form/form-utils.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('FormUserComponent', () => {
  let component: FormUserComponent;
  let fixture: ComponentFixture<FormUserComponent>;
  let mockFormUtilsService: jasmine.SpyObj<FormUtilsService>;
  let mockAuthService: AuthService;
  let mockSnackBar: MatSnackBar;
  let mockRouter: Router;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    mockFormUtilsService = jasmine.createSpyObj(['getErrorMessage', 'validateAllFormFields']);
    mockAuthService = jasmine.createSpyObj(['login']);
    mockSnackBar = jasmine.createSpyObj(['open']);
    mockRouter = jasmine.createSpyObj(['navigate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [
        FormBuilder,
        { provide: FormUtilsService, useValue: mockFormUtilsService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter }
      ]
    })

      .compileComponents();

    formBuilder = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(FormUserComponent);
    component = fixture.componentInstance;

    const formGroup = formBuilder.group({
      email: '',
      password: ''
    });

    component.form = formGroup;

    component.fields = [
      {
        label: 'Email',
        inputType: 'email',
        formControlName: 'email',
        name: 'email',
        id: 'email',
        autocomplete: 'username',
        required: true
      },
      {
        label: 'Senha',
        inputType: 'password',
        formControlName: 'password',
        name: 'password',
        id: 'password',
        autocomplete: 'current-password',
        required: true
      }
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should emit submit", () => {
    spyOn(component.formSubmit, 'emit');
    component.submit();
    expect(component.formSubmit.emit).toHaveBeenCalled();
  });

  it('should display error messages', () => {
    const controlName = 'email';
    mockFormUtilsService.getErrorMessage.and.returnValue('Email is required');
    const errorMessage = component.getErrorMessage(controlName);
    expect(errorMessage).toBe('Email is required');
  });

});
