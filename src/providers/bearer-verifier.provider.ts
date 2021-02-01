import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {TokenData} from '../models/token.model';
import {UserRepository} from '../repositories';


export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository
  ) { }

  value(): VerifyFunction.BearerFn {
    return async token => {
      const tokenInfo = verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
      }) as TokenData;
      const user = await this.userRepository.findOne({
        include: ['role'],
        where: {
          email: tokenInfo.sub as string
        }
      })
      return user;
    };
  }
}
