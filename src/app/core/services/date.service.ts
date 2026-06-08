import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}