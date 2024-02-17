import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Emitters } from '../emmitters/emitter';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  authenticated = false;
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    Emitters.auhEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }

  logOut() {
    this.http
      .post('http://localhost:5000/api/logOut', {}, { withCredentials: true })
      .subscribe(() => (this.authenticated = false));
  }
}
