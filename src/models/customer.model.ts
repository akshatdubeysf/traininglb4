import {Entity, model, property, hasOne} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Customer extends Entity {
  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  website?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @hasOne(() => User)
  user: User;

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
