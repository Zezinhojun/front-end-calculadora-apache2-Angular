import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutComponent } from './layout.component';
import { AuthService } from '../services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let authService: AuthService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [AuthService, {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { paramMap: new Map().set('id', '123') },
          queryParams: of({}),
          params: of({}),
          url: of([{ path: 'dummy' }])
        }
      }],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout when logout is called', () => {
    spyOn(authService, 'logout');
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should initialize isLoggedIn correctly', () => {
    expect(component.isLoggedIn()).toBe(false);
  });

  it('should update isLoggedIn after logout', () => {
    component.logout();
    expect(component.isLoggedIn()).toBe(false);
  });
});
