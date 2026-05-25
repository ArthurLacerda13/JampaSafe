import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// Configurações globais de provedores (serviços e rotas da aplicação)
export const appConfig: ApplicationConfig = {
  providers: [
    // Captura e trata erros globais no navegador
    provideBrowserGlobalErrorListeners(),
    // Permite chamadas HTTP (para buscar o JSON)
    provideHttpClient(),
    // Configura o sistema de rotas e o pré-carregamento SSR
    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
