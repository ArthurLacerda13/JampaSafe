import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Inicializa a aplicação Angular usando o componente raiz e as configurações principais
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
