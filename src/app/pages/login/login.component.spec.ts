import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ApiResponse, User } from '../../shared/model/commom.model';
import { AuthService } from '../../shared/services/auth.service';
import LoginComponent from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockRouter: jasmine.SpyObj<Router>;


  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockRouter = jasmine.createSpyObj(['navigate']);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientModule, BrowserAnimationsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });

  it('should initialize form with default values and validators', () => {

    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('password')).toBeTruthy();
    expect(component.form.get('remember')).toBeTruthy();
    expect(component.form.valid).toBeFalsy();
  });

  it('should show error messages when form is invalid', () => {
    spyOn(component._formUtilsSvc, 'validateAllFormFields');
    component.submit();

    expect(component._formUtilsSvc
      .validateAllFormFields)
      .toHaveBeenCalledWith(component.form);
  });
  it('should submit form when valid', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password',
      remember: false
    };
    const mockApiResponse: ApiResponse<User> = {
      status: true,
      message: 'Login successful',
      data: { _id: '1', name: "name", email: 'test@example.com', password: "password" }
    };
    mockAuthService.login.and.returnValue(of(mockApiResponse));
    component.form.patchValue(loginData);
    component.submit();

    expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
    expect(component['_snackBar'].open)
      .toHaveBeenCalledWith('Usuário logado com sucesso', '', { duration: 2000 });
    expect(component.router.navigate).toHaveBeenCalledWith(['']);
  })

  it('should handle error when login fails', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password',
      remember: false
    };
    const errorMessage = 'Invalid credentials';
    mockAuthService.login.and.returnValue(throwError(() => ({ message: errorMessage })));
    component.form.patchValue(loginData);
    component.submit();
    mockAuthService.login.and.returnValue(throwError(() => ({ message: errorMessage })));

    expect(mockSnackBar.open)
      .toHaveBeenCalledWith(jasmine.objectContaining({ message: errorMessage }),
        'x',
        { duration: 3000 }
      );
  });

  it('should be invalid when email is not provided', () => {
    component.form.controls['email'].setValue('');
    expect(component.form.valid).toBeFalsy();
  });

  it('should be invalid when password is not provided', () => {
    component.form.controls['password'].setValue('');
    expect(component.form.valid).toBeFalsy();
  });
})
