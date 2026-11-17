import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  studentId: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  readonly currentUser = signal<User | null>(null);

  checkSession(): Observable<User> {
    return this.http.get<User>('/api/session').pipe(tap((user) => this.currentUser.set(user)));
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/logout', {}).pipe(tap(() => this.currentUser.set(null)));
  }
}
