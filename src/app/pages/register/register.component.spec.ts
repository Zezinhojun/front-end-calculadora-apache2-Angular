import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ApiResponse, User } from '../../shared/model/commom.model';
import { AuthService } from '../../shared/services/auth/auth.service';
import RegisterComponent from './register.component';


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthServive', ['register'])
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientModule,
        BrowserAnimationsModule],
      providers: [FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with default values and validators", () => {
    expect(component.form.get('name')).toBeTruthy();
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('password')).toBeTruthy();
    expect(component.form.valid).toBeFalsy();
  })

  it('should submit form when valid', () => {
    const mockUser: User = {
      _id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password'
    };

    const expectedRegisterData = {
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password
    };

    const mockApiResponse: ApiResponse<User> = {
      status: true,
      message: 'Usuário cadastrado com sucesso',
      data: mockUser
    };

    mockAuthService.register.and.returnValue(of(mockApiResponse));
    component.form.patchValue(mockUser);
    component.submit();

    expect(mockAuthService.register).toHaveBeenCalledWith(expectedRegisterData);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Usuário cadastrado com sucesso', '', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
  })

  it('should handle error when register fails', () => {
    const registerData = {
      name: "name",
      email: 'test@example.com',
      password: 'password',

    };
    const errorMessage = 'Invalid credentials';
    mockAuthService.register.and.returnValue(throwError(() => ({ message: errorMessage })));
    component.form.patchValue(registerData);
    component.submit();
    mockAuthService.register.and.returnValue(throwError(() => ({ message: errorMessage })));

    expect(mockSnackBar.open)
      .toHaveBeenCalledWith(jasmine.objectContaining({ message: errorMessage }),
        'x',
        { duration: 3000 }
      );
  });


  it('should be invalid when name is not provided', () => {
    component.form.controls['name'].setValue('');
    expect(component.form.valid).toBeFalsy();
  });

  it('should be invalid when password is not provided', () => {
    component.form.controls['email'].setValue('');
    expect(component.form.valid).toBeFalsy();
  });

  it('should be invalid when email is not provided', () => {
    component.form.controls['password'].setValue('');
    expect(component.form.valid).toBeFalsy();
  });
});
