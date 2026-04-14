import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonImg,
  IonButton,
} from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonCol,
    IonGrid,
    IonRow,
    IonCard,
    IonImg,
    IonButton,
  ],
})
export class LoginPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  token: any = localStorage.getItem('token');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {}
  async loginWithGoogle() {
    try {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      let ola = await this.authService.loginWithGoogle();
      ola.subscribe(
        (res: any) => {
          this.isLoading.set(false);
          localStorage.setItem('token', res);
          this.router.navigateByUrl('/folder');
        },
        (err) => {
          if (err.status === 404) {
            this.errorMessage.set('Usuario sin permisos para ingresar');
          }
          this.isLoading.set(false);
          console.log(err);
        },
      );
    } catch (error) {
      this.isLoading.set(false);
      console.log(error);
    }
  }
}
