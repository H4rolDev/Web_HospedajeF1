import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  /* Spinner para activacion en cada solicitud */
  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  private requests = 0;

  show() {
    this.requests++;
    this.loading.next(true);
  }

  hide() {
    this.requests = Math.max(0, this.requests - 1);
    if (this.requests === 0) {
      this.loading.next(false);
    }
  }
}
