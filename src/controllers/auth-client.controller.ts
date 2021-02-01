import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody,
  response
} from '@loopback/rest';
import {AuthClient} from '../models/auth-client.model';
import {AuthClientRepository} from '../repositories';

export class AuthClientController {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
  ) { }

  @post('/auth-clients')
  @response(200, {
    description: 'AuthClient model instance',
    content: {'application/json': {schema: getModelSchemaRef(AuthClient)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AuthClient, {
            title: 'NewAuthClient',
            exclude: ['id'],
          }),
        },
      },
    })
    authClient: Omit<AuthClient, 'id'>,
  ): Promise<AuthClient> {
    return this.authClientRepository.create(authClient);
  }

  @get('/auth-clients/count')
  @response(200, {
    description: 'AuthClient model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AuthClient) where?: Where<AuthClient>,
  ): Promise<Count> {
    return this.authClientRepository.count(where);
  }

  @get('/auth-clients')
  @response(200, {
    description: 'Array of AuthClient model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AuthClient, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AuthClient) filter?: Filter<AuthClient>,
  ): Promise<AuthClient[]> {
    return this.authClientRepository.find(filter);
  }

  @patch('/auth-clients')
  @response(200, {
    description: 'AuthClient PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AuthClient, {partial: true}),
        },
      },
    })
    authClient: AuthClient,
    @param.where(AuthClient) where?: Where<AuthClient>,
  ): Promise<Count> {
    return this.authClientRepository.updateAll(authClient, where);
  }

  @get('/auth-clients/{id}')
  @response(200, {
    description: 'AuthClient model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AuthClient, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AuthClient, {exclude: 'where'}) filter?: FilterExcludingWhere<AuthClient>
  ): Promise<AuthClient> {
    return this.authClientRepository.findById(id, filter);
  }

  @patch('/auth-clients/{id}')
  @response(204, {
    description: 'AuthClient PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AuthClient, {partial: true}),
        },
      },
    })
    authClient: AuthClient,
  ): Promise<void> {
    await this.authClientRepository.updateById(id, authClient);
  }

  @put('/auth-clients/{id}')
  @response(204, {
    description: 'AuthClient PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() authClient: AuthClient,
  ): Promise<void> {
    await this.authClientRepository.replaceById(id, authClient);
  }

  @del('/auth-clients/{id}')
  @response(204, {
    description: 'AuthClient DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.authClientRepository.deleteById(id);
  }
}
