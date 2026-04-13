import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = `${environment.apiurl}/auth`;

  constructor(private http: HttpClient) {}
  async loginWithGoogle() {
    try {
      const resultado = await FirebaseAuthentication.signInWithGoogle();
      if (!resultado.user) {
        throw new Error('No se pudo iniciar sesión con Google.');
      }
      const email = { email: resultado.user.email, app: 'MATCHDAYPRO' };
      const response = await this.http.post(`${this.URL}/login-app`, email);
      return response;
    } catch (error) {
      console.error('Error en login con Firebase:', error);
      throw error;
    }
  }

  async logout() {
    localStorage.removeItem('token');
    await FirebaseAuthentication.signOut();
  }
  hasValidToken(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No hay token');
      return false;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(window.atob(base64));

      return true;
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return false;
    }
  }
}
