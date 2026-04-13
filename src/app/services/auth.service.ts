import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
  }
  async loginWithGoogle() {
    try {
      // Magia pura: Esta función se encarga de todo, tanto en Web como en Android nativo
      const resultado = await FirebaseAuthentication.signInWithGoogle();
      
      console.log('Usuario autenticado:', resultado.user);
      console.log('Token de Firebase:', resultado.credential?.idToken);
      
      return resultado.user;
    } catch (error) {
      console.error('Error en login con Firebase:', error);
      throw error;
    }
  }

  async logout() {
    await FirebaseAuthentication.signOut();
  }

}
