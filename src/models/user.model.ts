import {belongsTo, Entity, hasOne, model, property} from '@loopback/repository';
import {Roles} from '../enums/roles';
import {Customer} from './customer.model';
import {Role, RoleRelations} from './role.model';

@model({
  // settings: {
  //   foreignKeys: {
  //     fk_user_role: {
  //       name: 'fk_user_role',
  //       entity: 'Role',
  //       entityKey: 'id',
  //       foreignKey: 'roleId',
  //     },
  //   }
  // }
})
export class User extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  middleName?: string;

  @property({
    type: 'string',
  })
  lastName: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  phoneNumber?: string;

  @property({
    type: 'date',
    default: () => new Date()
  })
  createdOn?: string;

  @property({
    type: 'date',
  })
  modifiedOn?: string;

  @belongsTo(() => Customer, {keyTo: 'id'})
  customerId: number;

  @property({
    type: 'number',
    postgresql: {
      enum: Object.keys(Roles)
    }
  })
  roleId: string;

  @hasOne(() => Role, {keyTo: 'id', keyFrom: 'roleId'})
  role: Role;

  @property({
    type: 'string',
  })
  username: string;

  // Auth provider - 'google'
  @property({
    type: 'string',
    required: true,
    name: 'auth_provider',
  })
  authProvider: string;

  // Id from external provider
  @property({
    type: 'string',
    name: 'auth_id',
  })
  authId?: string;

  @property({
    type: 'string',
    name: 'auth_token',
  })
  authToken?: string;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
  role: RoleRelations;
}

export type UserWithRelations = User & UserRelations;
