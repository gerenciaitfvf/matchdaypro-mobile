import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private URL = `${environment.apiurl}/eventos`;

  constructor(private http: HttpClient) {}
  
  getAll() {
    return this.http.get(this.URL);
  }
 
}
