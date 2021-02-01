import {Entity, model, property} from '@loopback/repository';
import {Permissions} from 'loopback4-authorization';
import {Roles} from '../enums/roles';

@model()
export class Role extends Entity implements Permissions<string>{

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;


  @property({
    type: 'string',
  })
  name?: string;

  @property({
    jsonSchema: {
      enum: Object.keys(Roles)
    },
    postgresql: {
      enum: Roles
    },
    required: true,
  })
  key: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
  })
  userId?: number;

  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions: string[];


  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
