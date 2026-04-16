import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private URL = `${environment.apiurl}/checklist`;
  private http = inject(HttpClient);

  getAll(id: number) {
    return this.http.get(`${this.URL}/evento/${id}`);
  }
  updateStatus(data: any) {
    return this.http.put(
      `${this.URL}/evento/${data.id}/item/${data.item_id}`,
      data,
    );
  }
}
