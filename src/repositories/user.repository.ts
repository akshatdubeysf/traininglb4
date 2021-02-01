import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {AuthenticationBindings, IAuthUser} from 'loopback4-authentication';
import {SoftCrudRepository} from 'loopback4-soft-delete';
import {PdbDataSource} from '../datasources';
import {Customer, Role, User, UserRelations} from '../models';
import {CustomerRepository} from './customer.repository';
import {RoleRepository} from './role.repository';

export class UserRepository extends SoftCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {

  public readonly customer: BelongsToAccessor<Customer, typeof User.prototype.id>;

  public readonly role: HasOneRepositoryFactory<Role, typeof User.prototype.id>;

  constructor(
    @inject.getter(AuthenticationBindings.CURRENT_USER, {optional: true})
    protected readonly getCurrentUser: Getter<IAuthUser | undefined>,
    @inject('datasources.pdb') dataSource: PdbDataSource, @repository.getter('CustomerRepository') protected customerRepositoryGetter: Getter<CustomerRepository>, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(User, dataSource, getCurrentUser);
    this.role = this.createHasOneRepositoryFactoryFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter,);
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
  }
}
