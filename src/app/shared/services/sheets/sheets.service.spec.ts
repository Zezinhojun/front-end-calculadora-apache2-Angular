import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SheetsService } from './sheets.service';
import { ApiGoogleSheetsEndpoint } from '../../constant';
import { ISheetsResponse } from '../../model/commom.model';


describe('SheetsService', () => {
  let service: SheetsService;
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SheetsService],

    });
    service = TestBed.inject(SheetsService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpTestingController.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should fetch rows from Google Sheets', () => {
    const mockResponse: ISheetsResponse = {
      values: [
        [1, 30, 'Patologia1', ''],
        [2, 40, 'Patologia2', ''],
      ]
    };
    service.getRows(0, 10).subscribe(pacientes => {
      expect(pacientes.length).toBe(2);
      expect(pacientes[0]).toEqual({
        atendimento: 1,
        idade: 30,
        patologia: 'Patologia1',
        internacao: '',

      });
      expect(pacientes[1]).toEqual({
        atendimento: 2,
        idade: 40,
        patologia: 'Patologia2',
        internacao: '',
      });
    });
    const req = httpTestingController.expectOne(`${ApiGoogleSheetsEndpoint.GoogleSheets.Rows}?page=0&pageSize=10`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse)
  })

  it('should fetch patology data from Google Sheets', () => {
    const mockResponse = { data: 'Patology data' };
    service.getPatology().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpTestingController.expectOne(`${ApiGoogleSheetsEndpoint.GoogleSheets.Patology}`);

    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should fetch treatments data from Google Sheets', () => {
    const mockResponse = { data: 'Treatments data' };
    service.getTreatments().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpTestingController.expectOne(`${ApiGoogleSheetsEndpoint.GoogleSheets.Treatments}`);

    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should delete a row from Google Sheets', () => {
    const rowIndex = 1;
    service.deleteRow(rowIndex).subscribe(response => {
      expect(response).toBeTruthy(); // Assuming your deleteRow method returns true on success
    });

    const req = httpTestingController.expectOne(`${ApiGoogleSheetsEndpoint.GoogleSheets.DeleteRow}`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ lineId: rowIndex });
    req.flush({}); // Mocking an empty response for deletion
  });

})
