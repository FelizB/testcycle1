import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: '',
      email: '',
      password: '',
    });
  }

  submit() {
    let user = this.form.getRawValue();

    if (user.name == '' || user.email == '' || user.password == '') {
      Swal.fire('Error', 'please enter all the fields', 'error');
    } else {
      this.http
        .post('http://localhost:5000/api/register', user, {
          withCredentials: true,
        })
        .subscribe(
          () => this.router.navigate(['/']),
          (Error: any) => {
            Swal.fire('Error', Error.error.message, 'error');
          }
        );
    }
  }
}
