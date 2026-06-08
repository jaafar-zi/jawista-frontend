import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoServerLoader } from './shared/transloco/transloco-server.loader';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'ar', 'fr'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: true,
      },
      loader: TranslocoServerLoader, 
    }),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);