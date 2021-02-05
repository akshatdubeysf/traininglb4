import {HttpErrors} from '@loopback/rest';
import {
  createStubInstance,
  expect,

  StubbedInstanceWithSinonAccessor
} from '@loopback/testlab';
import {RoleController} from '../../../controllers';
import {RoleRepository} from '../../../repositories';
import {givenRoleData} from '../../helpers/database.helper';
;


describe('RoleController (unit)', () => {
  let repository: StubbedInstanceWithSinonAccessor<RoleRepository>;
  beforeEach(givenStubbedRepository);

  describe('Role controller: fetch', () => {
    it('retrieves all Roles', async () => {
      const controller = new RoleController(repository);
      const testData = givenRoleData()
      repository.stubs.find.resolves([testData]);

      const details = await controller.find();

      expect(details).to.be.Array();
      expect(details).to.containEql(testData);
    });

    it('retrieves Roles when none exist', async () => {
      const controller = new RoleController(repository);
      repository.stubs.find.rejects(new HttpErrors[404])

      try {
        const details = await controller.find();
        expect(details).to.be.undefined();
      }
      catch (e) {
        expect(e).to.be.instanceOf(HttpErrors[404]);
      }
    });
  });

  describe('Role controller: count', () => {
    it('retrieves Roles count', async () => {
      const controller = new RoleController(repository);
      repository.stubs.count.resolves({count: 1});

      const details = await controller.count();

      expect(details).to.containEql({count: 1});
    });
    it('check for count when no records exist', async () => {
      const controller = new RoleController(repository);
      repository.stubs.count.rejects(new HttpErrors[404]);

      try {
        const details = await controller.count();
        expect(details).to.be.undefined();
      }
      catch (e) {
        expect(e).to.instanceOf(HttpErrors[404]);
      }
    })
  })

  describe('Role controller: findById', () => {
    it('retrieves one Role', async () => {
      const controller = new RoleController(repository);
      const testData = givenRoleData({});
      repository.stubs.findById.resolves(testData).withArgs(1);

      const details = await controller.findById(1);

      expect(details).to.eql(testData);
    });
    it('not found for non existant id', async () => {
      const controller = new RoleController(repository);
      repository.stubs.findById.rejects(new HttpErrors[404]).withArgs(1);

      try {
        const details = await controller.findById(1);
        expect(details).to.be.undefined();
      }
      catch (e) {
        expect(e).to.be.instanceOf(HttpErrors[404]);
      }
    })
  });

  describe('Role controller: create', () => {
    it('creates a new Role', async () => {
      const controller = new RoleController(repository);
      const testData = givenRoleData({});
      repository.stubs.create.resolves(testData).withArgs(testData);

      const user = await controller.create(testData)

      expect(user).to.deepEqual(testData);
    })
  })

  describe('Role controller: updateAll', () => {
    it('updates a Role', async () => {
      const controller = new RoleController(repository);
      const testData = givenRoleData({});
      repository.stubs.updateAll.resolves({count: 1}).withArgs(testData);

      const count = await controller.updateAll(testData);

      expect(count).to.be.eql({count: 1});
    })
  })

  describe('Role controller: updateById', () => {
    it('updates a Role by id', async () => {
      const controller = new RoleController(repository);
      const testData = givenRoleData({});
      repository.stubs.updateById.resolves().withArgs(1, testData);

      const result = await controller.updateById(1, testData);
      expect(result).to.be.undefined();
    })
  })

  describe('Role controller: replaceById', () => {
    it('replaces a Role by id', async () => {
      const controller = new RoleController(repository);
      const testData = givenRoleData({});
      repository.stubs.replaceById.resolves().withArgs(1, testData);

      const result = await controller.replaceById(1, testData);
      expect(result).to.be.undefined();
    })
  })

  describe('Role controller: delete', () => {
    it('deletes a Role record', async () => {
      const controller = new RoleController(repository);
      repository.stubs.deleteById.resolves().withArgs(1);

      const result = await controller.deleteById(1);
      expect(result).to.be.undefined();
    })
  })

  function givenStubbedRepository() {
    repository = createStubInstance(RoleRepository);
  }
});
