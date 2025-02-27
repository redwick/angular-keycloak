import {effect, inject, Injectable} from '@angular/core';
import Keycloak, {KeycloakProfile} from 'keycloak-js';
import {KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, ReadyArgs, typeEventArgs} from 'keycloak-angular';
import {map, Observable, of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticated = false;

  user: KeycloakProfile | null = null;
  private user$: Subject<KeycloakProfile> = new Subject();


  constructor(private readonly keycloak: Keycloak) {
    const keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

    effect(() => {
      const keycloakEvent = keycloakSignal();

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);
        this.loadProfile();
      }
      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
      }
    });
  }
  getUserName() {
    return this.user?.firstName + ' ' + this.user?.lastName;
  }
  getUserNameShort() {
    return this.user?.firstName?.charAt(0);
  }
  formatUserName(user: KeycloakProfile) {
    return user?.firstName + ' ' + user?.lastName;
  }
  formatShortUserName(user: KeycloakProfile) {
    return user?.firstName?.charAt(0);
  }
  formatSemiUserName(user: KeycloakProfile) {
    return user?.firstName + ' ' + user?.lastName?.charAt(0) + '.';
  }
  getUser(){
    return this.user ? of(this.user) : this.user$;
  }
  getUserId(): Observable<string>{
    return this.user ? of(this.user.id!) : this.user$.pipe(map(x => x.id!));
  }
  login(){
    this.keycloak.login();
  }
  private loadProfile() {
    this.keycloak.loadUserProfile().then(user => {
      this.user = user;
      this.user$.next(user);
    });
  }
  logout() {
    this.keycloak.logout();
  }

  getAttribute(key: string){
    let attributes = this.user?.attributes;
    if (attributes){
      let value = attributes[key] as any[];
      if (value.length > 0) {
        return value[0];
      }
    }
    return '';
  }
}
