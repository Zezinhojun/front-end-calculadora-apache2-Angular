import { DOCUMENT } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ApiEndpoint, LocalStorage } from '../../constant';
import { ApiResponse, LoginPayload, RegisterPayload, User } from '../../model/commom.model';
import { AuthService } from './auth.service';

const storageSpy = {
  getItem: jasmine.createSpy('getItem').and.returnValue(null),
  setItem: jasmine.createSpy('setItem'),
  removeItem: jasmine.createSpy('removeItem'),
  clear: jasmine.createSpy('clear')
};
const routerSpy = {
  navigate: jasmine.createSpy('navigate')
};
describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController
  let localStorage: Storage;
  let documentSpy: any;

  beforeEach(async () => {
    documentSpy = {
      defaultView: {
        localStorage: storageSpy
      },
      querySelectorAll: () => []
    }
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [
        AuthService,
        { provide: DOCUMENT, useValue: documentSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Storage, useValue: storageSpy }
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    localStorage = TestBed.inject(Storage);
    documentSpy = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {

    expect(authService).toBeTruthy();
  });

  it("should register a new user", () => {
    const payload: RegisterPayload = {
      name: "name",
      email: "email@email.com",
      password: "passwordhashed"
    };
    const mockResponse: ApiResponse<User> = {
      success: true,
      data: {
        _id: "1",
        email: "email@email.com",
        name: "name",
        token: "token"
      }
    };

    authService.register(payload).subscribe((res) => {
      expect(res).toEqual(mockResponse)
    })

    const req = httpTestingController.expectOne(ApiEndpoint.Auth.Register);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  })

  it("should login user and set token in localstorage", () => {
    const payload: LoginPayload = {
      email: "email@email.com",
      password: "passwordhashed"
    };
    const mockResponse: ApiResponse<User> = {
      success: true,
      data: {
        _id: "1",
        email: "email@email.com",
        name: "name",
        token: "token"
      }
    };

    authService.login(payload).subscribe((res) => {

      expect(res).toEqual(mockResponse);

      storageSpy.getItem.and.returnValue('token')

      expect(authService.getUserToken()).toBe('token')
    });

    const req = httpTestingController.expectOne(ApiEndpoint.Auth.Login);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockResponse);
    httpTestingController.verify();
  });

  it("should logout the user, remove token from localstorage and navigate to login", () => {
    authService.logout()

    expect(storageSpy.removeItem).toHaveBeenCalledWith(LocalStorage.token);
    expect(authService.isLoggedIn()).toBeFalsy()
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  })

  it("should return the user token from localstorage", () => {
    storageSpy.getItem.and.returnValue('token')

    expect(authService.getUserToken()).toBe('token')
  })

  it("should get current user data", () => {
    const mockUser: User = {
      _id: "1",
      email: "email@email.com",
      name: "name"
    };

    authService.me().subscribe((response: ApiResponse<User>) => {

      expect(response.data._id).toEqual(mockUser._id);
      expect(response.data.email).toEqual(mockUser.email);
      expect(response.data.name).toEqual(mockUser.name);
    });

    const req = httpTestingController.expectOne(ApiEndpoint.Auth.Me);

    expect(req.request.method).toEqual('GET');

    req.flush({ success: true, data: mockUser });
    httpTestingController.verify();
  });
});
