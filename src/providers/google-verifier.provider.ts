import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';
import {UserRepository} from '../repositories';

export class GoogleOauth2VerifyProvider
  implements Provider<VerifyFunction.GoogleAuthFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
  ) { }

  value(): VerifyFunction.GoogleAuthFn {
    return async (accessToken, refreshToken, profile) => {
      const user = await this.userRepository.findOne({
        include: ['role'],
        where: {
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          email: (profile as any)._json.email,
        },
      });
      if (!user) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      if (
        !user ||
        user.authProvider !== 'google'
      ) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      return user;
    };
  }
}
