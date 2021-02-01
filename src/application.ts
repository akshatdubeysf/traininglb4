import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
import {AuthorizationBindings, AuthorizationComponent} from 'loopback4-authorization';
import path from 'path';
import {LogComponent, LOG_BINDINGS, LOG_LEVEL} from './components/logger';
import {BearerTokenVerifyProvider} from './providers/bearer-verifier.provider';
import {GoogleOauth2VerifyProvider} from './providers/google-verifier.provider';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class TrainingApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);


    this.component(LogComponent);
    this.bind(LOG_BINDINGS.APP_LOG_LEVEL).to(LOG_LEVEL.WARN);
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    this.bind(Strategies.Passport.GOOGLE_OAUTH2_VERIFIER).toProvider(
      GoogleOauth2VerifyProvider,
    );
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifyProvider,
    );

    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.component(AuthorizationComponent);


    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
