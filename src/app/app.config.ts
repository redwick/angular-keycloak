import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {
  AutoRefreshTokenService,
  provideKeycloak,
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  includeBearerTokenInterceptor
} from 'keycloak-angular';
import {HttpErrorResponse, provideHttpClient, withInterceptors} from '@angular/common/http';


export const host = 'https://djarviss.ru/rest/';

export const alert_error = (error: HttpErrorResponse) =>{
  alert(error.status + ' - ' + error.statusText + '\n' + error.error);
}


const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: new RegExp('^' + host + '.*'),
  bearerPrefix: 'Bearer'
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideKeycloak({
      config: {
        url: 'https://sso.djarviss.ru',
        realm: 'ms',
        clientId: 'web'
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
      },
      providers: [AutoRefreshTokenService]
    }),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [urlCondition]
    },
  ]
};
