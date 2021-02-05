import {expect} from '@loopback/testlab';
import {RoleController} from '../../../controllers';
import {Role} from '../../../models';
import {CustomerRepository, RoleRepository, UserRepository} from '../../../repositories';
import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {givenEmptyDatabase, givenRole, givenRoleData} from '../../helpers/database.helper';

describe('RoleController (integration)', () => {

  beforeEach(givenEmptyDatabase);


  const roleRepo: RoleRepository = new RoleRepository(testdb);
  const customerRepo: CustomerRepository = new CustomerRepository(testdb,
    async () => userRepo);
  const userRepo: UserRepository = new UserRepository(
    async () => undefined,
    testdb,
    async () => customerRepo,
    async () => roleRepo
  )
  const controller = new RoleController(roleRepo);
  let latestId = 0;

  describe('Get all', () => {
    it('retrieves all roles', async () => {
      const role = await givenRole(roleRepo);
      const details = await controller.find();
      latestId = details[0].id as number;
      const keys = Object.keys(role) as Array<keyof Role>;
      keys.forEach((key: keyof Role) => {
        expect(details[0][key]).eql(role[key]);
      })
    });

    it('gives appropriate response when no role present', async () => {

      const details = await controller.find();
      expect(details).to.be.eql([]);

    })
  });

  describe('Role controller: count', () => {
    it('retrieves role count', async () => {
      await givenRole(roleRepo);
      latestId = latestId + 1;
      const details = await controller.count();

      expect(details).to.be.eql({count: 1});
    });

    it('gives appropriate response when no role present', async () => {
      const details = await controller.count();
      expect(details).to.be.eql({count: 0});
    })
  });

  describe('Role controller: findById', () => {
    it('retrieves one role', async () => {
      const role = await givenRole(roleRepo);
      const details = await controller.findById(latestId + 1);

      latestId = details?.id as number;
      const keys = Object.keys(role) as Array<keyof Role>;
      keys.forEach((key: keyof Role) => {
        expect(details[key]).eql(role[key]);
      })
    })
  });

  describe('Role controller: create', () => {
    it('creates a new role', async () => {
      const roleData = givenRoleData();

      const details = await controller.create(roleData);

      latestId = details?.id as number;

      const keys = Object.keys(roleData) as Array<keyof Role>;
      keys.forEach((key: keyof Role) => {
        expect(details[key]).eql(roleData[key]);
      })
    });
  });

  describe('Role controller: updateAll', () => {
    it('updates a role', async () => {
      const role = await givenRole(roleRepo);

      role.name = 'newName';
      latestId = latestId + 1;

      const details = await controller.updateAll(role, {id: latestId});

      expect(details).to.be.eql({count: 1});

      const updatedRole = await roleRepo.findById(latestId);

      expect(updatedRole.name).to.be.equal('newName');
    })
  });

  describe('Role controller: updateById', () => {
    it('updates a role by id', async () => {
      const role = await givenRole(roleRepo);

      role.name = 'newName';
      latestId = latestId + 1;
      const details = await controller.updateById(latestId, role);

      expect(details).to.be.undefined();

      const updatedRole = await roleRepo.findById(latestId);

      expect(updatedRole.name).to.be.equal('newName');
    })
  });

  describe('Role controller: replaceById', () => {
    it('replaces a role by id', async () => {
      const role = await givenRole(roleRepo);

      role.name = 'newName';
      latestId = latestId + 1;
      const details = await controller.replaceById(latestId, role);

      expect(details).to.be.undefined();

      const updatedRole = await roleRepo.findById(latestId);

      expect(updatedRole.name).to.be.equal('newName');
    })
  });

  describe('Role controller: delete', () => {
    it('deletes a role record', async () => {
      await givenRole(roleRepo);

      latestId = latestId + 1;

      let count = await controller.count();

      expect(count).to.be.eql({count: 1});

      const details = await controller.deleteById(latestId);

      expect(details).to.be.undefined();

      count = await controller.count();

      expect(count).to.be.eql({count: 0});
    })
  })
});

