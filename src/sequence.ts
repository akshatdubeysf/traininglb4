import {inject} from '@loopback/core';
import {
  FindRoute,
  HttpErrors,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,

  Send,
  SequenceActions,
  SequenceHandler
} from '@loopback/rest';
import * as dotenv from 'dotenv';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {AuthorizationBindings, AuthorizeErrorKeys, AuthorizeFn} from 'loopback4-authorization';
import {LogFn, LOG_BINDINGS, LOG_LEVEL} from './components/logger';
import {User} from './models';

dotenv.config();


export class MySequence implements SequenceHandler {


  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(LOG_BINDINGS.LOG_ACTION) public logger: LogFn,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<User>,
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorisation: AuthorizeFn
  ) { }

  async handle(context: RequestContext) {
    const origins = process.env.ALLOWED_ORIGIN && process.env.ALLOWED_ORIGIN.split(',');
    try {
      const {request, response} = context;
      this.logStart(context);
      if (!request.headers.referer || !origins?.includes(request.headers.referer)) {
        throw new Error('Origin not allowed!');
      }
      const finished = await this.invokeMiddleware(context);
      if (finished) return;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);

      const authUser: User = await this.authenticateRequest(
        request,
        response,
      );


      const isAccessAllowed: boolean = await this.checkAuthorisation(
        (authUser && authUser.role && authUser.role.permissions) || [], // do authUser.permissions if using method #1
        request,
      );
      // Checking access to route here
      if (!isAccessAllowed) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }

      const result = await this.invoke(route, args);
      this.send(response, result);
      this.logEnd();
    } catch (err) {
      this.logError();
      this.reject(context, err);
    }
  }
  private log(str: string, level?: number) {
    this.logger(str, level || LOG_LEVEL.INFO);
  }
  private logStart(context: RequestContext) {
    this.log('Start time - ' + new Date().toLocaleTimeString());
    this.log('Referer - ' + context.request.headers.referer);
    this.log('User Agent - ' + context.request.headers['user-agent']);
    this.log('Request IP - ' + context.request.connection.remoteAddress);
  }

  private logEnd() {
    this.log('End time - ' + new Date().toLocaleTimeString());
  }

  private logError() {
    this.log('Error time - ' + new Date().toLocaleTimeString(), LOG_LEVEL.ERROR);
  }

}
