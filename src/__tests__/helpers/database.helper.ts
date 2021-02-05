import {Customer, Role, User} from '../../models';
import {CustomerRepository, RoleRepository, UserRepository} from '../../repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';

export async function givenEmptyDatabase() {
  const customerRepository: CustomerRepository = new CustomerRepository(
    testdb,
    async () => userRepository
  );;
  const userRepository: UserRepository = new UserRepository(
    async () => undefined,
    testdb,
    async () => customerRepository,
    async () => roleRepository,
  );
  const roleRepository: RoleRepository = new RoleRepository(
    testdb
  );

  await customerRepository.deleteAll();
  await userRepository.deleteAll();
  await roleRepository.deleteAll();
}

export function userDefault(): Partial<User> {
  return {
    firstName: 'First',
    middleName: 'Middle',
    lastName: 'Last',
    email: 'email',
    roleId: 'SuperAdmin',
    authProvider: 'google'
  }
}
export function givenUserData(data?: Partial<User>): User {
  return Object.assign(
    new User({
      ...userDefault()
    }),
    data,
  );
}

export async function givenUser(repo: UserRepository, data?: Partial<User>) {
  await repo.create(givenUserData(data));
  return givenUserData(data);
}

export function roleDefault(): Partial<Role> {
  return {
    name: 'SuperAdmin',
    key: 'SuperAdmin',
    description: 'SuperAdmin',
    permissions: []
  }
}

export function givenRoleData(data?: Partial<Role>): Role {
  return Object.assign(
    new Role({
      ...roleDefault()
    }),
    data
  )
}

export async function givenRole(repo: RoleRepository, data?: Partial<Role>) {
  await repo.create(givenRoleData(data));
  return givenRoleData(data);
}

export function customerDefault(): Partial<Customer> {
  return {
    name: 'Customer',
    website: 'test.com',
    address: 'test, test'
  }
}

export function givenCustomerData(data?: Partial<Customer>): Customer {
  return Object.assign(
    new Customer({
      ...customerDefault()
    }),
    data
  )
}

export async function givenCustomer(repo: CustomerRepository, data?: Partial<Customer>) {
  await repo.create(givenCustomerData(data));
  return givenCustomerData(data);
}
