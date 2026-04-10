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
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput
} from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
  ],
})
export class LoginPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {}
  login() {
    console.log('ola');
  }
}
