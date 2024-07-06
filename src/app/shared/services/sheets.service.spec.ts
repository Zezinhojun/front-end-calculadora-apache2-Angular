import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SheetsService } from './sheets.service';
import { ApiGoogleSheetsEndpoint } from '../constant';


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
    const mockResponse: { values: any[] } = {
      values: [
        { _id: 1, name: 'Patient A' },
        { _id: 2, name: 'Patient B' }
      ]
    };
    const page = 0;
    const pageSize = 10;

    service.getRows(page, pageSize).subscribe(response => {
      expect(response.values.length).toEqual(mockResponse.values.length);

      expect(service.totalElements()).toEqual(mockResponse.values.length);
      expect(service.totalPages()).toEqual(1);
      expect(service.pacientes()).toEqual(mockResponse.values);
    });
    const req = httpTestingController.expectOne(`${ApiGoogleSheetsEndpoint.GoogleSheets.Rows}?page=${page}&pageSize=${pageSize}`);

    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    httpTestingController.verify();
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
      expect(response).toBeTruthy();
    });
    const req = httpTestingController.expectOne(`${ApiGoogleSheetsEndpoint.GoogleSheets.DeleteRow}`);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ lineId: rowIndex });
    req.flush({});
  });

  it('should create a row in Google Sheets', () => {
    const rowData = { name: 'New Patient', age: 30 };

    service.createRow(rowData).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const req = httpTestingController.expectOne(`${ApiGoogleSheetsEndpoint.GoogleSheets.CreateRow}`);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(rowData);
    req.flush({});
  });
})
