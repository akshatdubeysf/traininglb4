import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {PdbDataSource} from '../datasources';
import {Customer, CustomerRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
  > {

  public readonly user: HasOneRepositoryFactory<User, typeof Customer.prototype.id>;

  constructor(
    @inject('datasources.pdb') dataSource: PdbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Customer, dataSource);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.modifiedOn = new Date();
    });
  }
}
