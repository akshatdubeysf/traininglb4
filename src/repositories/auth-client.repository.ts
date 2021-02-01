import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PdbDataSource} from '../datasources';
import {AuthClient, AuthClientRelations} from '../models/auth-client.model';

export class AuthClientRepository extends DefaultCrudRepository<
  AuthClient,
  typeof AuthClient.prototype.id,
  AuthClientRelations
  > {
  constructor(
    @inject('datasources.pdb') dataSource: PdbDataSource,
  ) {
    super(AuthClient, dataSource);
  }
}
