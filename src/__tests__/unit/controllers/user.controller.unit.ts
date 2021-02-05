import {HttpErrors} from '@loopback/rest';
import {
  createStubInstance,
  expect,

  StubbedInstanceWithSinonAccessor
} from '@loopback/testlab';
import {UserController} from '../../../controllers';
import {UserRepository} from '../../../repositories';
import {givenRoleData, givenUserData} from '../../helpers/database.helper';


describe('UserController (unit)', () => {
  let repository: StubbedInstanceWithSinonAccessor<UserRepository>;
  beforeEach(givenStubbedRepository);

  describe('User controller: fetch', () => {
    it('retrieves all users with roles', async () => {
      const controller = new UserController(repository);
      const testData = givenUserData({
        role: givenRoleData()
      });
      repository.stubs.find.resolves([testData]);

      const details = await controller.find();

      expect(details).to.be.Array();
      expect(details).to.containEql(testData);
    });

    it('retrieves users when none exist', async () => {
      const controller = new UserController(repository);
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

  describe('User controller: count', () => {
    it('retrieves users count', async () => {
      const controller = new UserController(repository);
      repository.stubs.count.resolves({count: 1});

      const details = await controller.count();

      expect(details).to.containEql({count: 1});
    });
    it('check for count when no records exist', async () => {
      const controller = new UserController(repository);
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

  describe('User controller: findById', () => {
    it('retrieves one user', async () => {
      const controller = new UserController(repository);
      const testData = givenUserData({});
      repository.stubs.findById.resolves(testData).withArgs(1);

      const details = await controller.findById(1);

      expect(details).to.eql(testData);
    });
    it('not found for non existant id', async () => {
      const controller = new UserController(repository);
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

  describe('user controller: create', () => {
    it('creates a new user', async () => {
      const controller = new UserController(repository);
      const testData = givenUserData({});
      repository.stubs.create.resolves(testData).withArgs(testData);

      const user = await controller.create(testData)

      expect(user).to.deepEqual(testData);
    })
  })

  describe('user controller: updateAll', () => {
    it('updates a user', async () => {
      const controller = new UserController(repository);
      const testData = givenUserData({});
      repository.stubs.updateAll.resolves({count: 1}).withArgs(testData);

      const count = await controller.updateAll(testData);

      expect(count).to.be.eql({count: 1});
    })
  })

  describe('user controller: updateById', () => {
    it('updates a user by id', async () => {
      const controller = new UserController(repository);
      const testData = givenUserData({});
      repository.stubs.updateById.resolves().withArgs(1, testData);

      const result = await controller.updateById(1, testData);
      expect(result).to.be.undefined();
    })
  })

  describe('user controller: replaceById', () => {
    it('replaces a user by id', async () => {
      const controller = new UserController(repository);
      const testData = givenUserData({});
      repository.stubs.replaceById.resolves().withArgs(1, testData);

      const result = await controller.replaceById(1, testData);
      expect(result).to.be.undefined();
    })
  })

  describe('user controller: delete', () => {
    it('deletes a user record', async () => {
      const controller = new UserController(repository);
      repository.stubs.deleteById.resolves().withArgs(1);

      const result = await controller.deleteById(1);
      expect(result).to.be.undefined();
    })
  })

  function givenStubbedRepository() {
    repository = createStubInstance(UserRepository);
  }
});
