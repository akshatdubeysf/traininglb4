import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Role, User
} from '../models';
import {RoleRepository, UserRepository} from '../repositories';

export class UserRoleController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(RoleRepository) public roleRepository: RoleRepository
  ) { }

  @get('/users/{id}/role', {
    responses: {
      '200': {
        description: 'User has one Role',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Role),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Role>,
  ): Promise<Role> {
    return this.userRepository.role(id).get(filter);
  }

  @post('/users/{id}/role', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Role)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            key: {
              type: "number"
            }
          },
        },
      },
    }) req: {key: string},
  ): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: {
        key: req.key
      }
    }) as Role;
    return this.userRepository.updateById(id, {
      roleId: role.key
    });
  }


  @patch('/users/{id}/role', {
    responses: {
      '200': {
        description: 'User.Role PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    role: Partial<Role>,
    @param.query.object('where', getWhereSchemaFor(Role)) where?: Where<Role>,
  ): Promise<Count> {
    return this.userRepository.role(id).patch(role, where);
  }

  @del('/users/{id}/role', {
    responses: {
      '200': {
        description: 'User.Role DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Role)) where?: Where<Role>,
  ): Promise<Count> {
    return this.userRepository.role(id).delete(where);
  }
}
