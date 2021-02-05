import {expect} from '@loopback/testlab';
import {UserController} from '../../../controllers';
import {User} from '../../../models';
import {CustomerRepository, RoleRepository, UserRepository} from '../../../repositories';
import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {givenEmptyDatabase, givenUser, givenUserData} from '../../helpers/database.helper';

describe('UserController (integration)', () => {

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
  const controller = new UserController(userRepo);
  let latestId = 0;

  describe('Get all', () => {
    it('retrieves all users', async () => {
      const user = await givenUser(userRepo);
      const details = await controller.find();
      latestId = details[0].id as number;
      const keys = Object.keys(user) as Array<keyof User>;
      keys.forEach((key: keyof User) => {
        expect(details[0][key]).equal(user[key]);
      })
    });

    it('gives appropriate response when no user present', async () => {

      const details = await controller.find();
      expect(details).to.be.eql([]);

    })
  });

  describe('User controller: count', () => {
    it('retrieves users count', async () => {
      await givenUser(userRepo);
      latestId = latestId + 1;
      const details = await controller.count();

      expect(details).to.be.eql({count: 1});
    });

    it('gives appropriate response when no user present', async () => {
      const details = await controller.count();
      expect(details).to.be.eql({count: 0});
    })
  });

  describe('User controller: findById', () => {
    it('retrieves one user', async () => {
      const user = await givenUser(userRepo);
      const details = await controller.findById(latestId + 1);

      latestId = details?.id as number;
      const keys = Object.keys(user) as Array<keyof User>;
      keys.forEach((key: keyof User) => {
        expect(details[key]).equal(user[key]);
      })
    })
  });

  describe('user controller: create', () => {
    it('creates a new user', async () => {
      const userData = givenUserData();

      const details = await controller.create(userData);

      latestId = details?.id as number;

      const keys = Object.keys(userData) as Array<keyof User>;
      keys.forEach((key: keyof User) => {
        expect(details[key]).equal(userData[key]);
      })
    });

    it('expects first name as mandatory', async () => {
      const userData = givenUserData();

      delete (userData as Partial<User>).firstName;

      try {
        const details = await controller.create(userData);
        expect(details).to.be.undefined();
      }
      catch (e) {
        expect(JSON.parse(JSON.stringify(e))?.details?.messages).to.be.eql({"firstName": ["can't be blank"]})
      }
    })

    it('expects email as mandatory', async () => {
      const userData = givenUserData();

      delete (userData as Partial<User>).email;

      try {
        const details = await controller.create(userData);
        expect(details).to.be.undefined();
      }
      catch (e) {
        expect(JSON.parse(JSON.stringify(e))?.details?.messages).to.be.eql({"email": ["can't be blank"]})
      }
    })

    it('expects role as mandatory', async () => {
      const userData = givenUserData();

      delete (userData as Partial<User>).roleId;

      try {
        const details = await controller.create(userData);
        expect(details).to.be.undefined();
      }
      catch (e) {
        expect(JSON.parse(JSON.stringify(e))?.details?.messages).to.be.eql({"roleId": ["can't be blank"]})
      }
    })
  });

  describe('user controller: updateAll', () => {
    it('updates a user', async () => {
      const userData = await givenUser(userRepo);

      userData.firstName = 'newFirstName';
      latestId = latestId + 1;

      const details = await controller.updateAll(userData, {id: latestId});

      expect(details).to.be.eql({count: 1});

      const updatedUser = await userRepo.findById(latestId);

      expect(updatedUser.firstName).to.be.equal('newFirstName');
    })
  });

  describe('user controller: updateById', () => {
    it('updates a user by id', async () => {
      const userData = await givenUser(userRepo);

      userData.firstName = 'newFirstName';
      latestId = latestId + 1;
      const details = await controller.updateById(latestId, userData);

      expect(details).to.be.undefined();

      const updatedUser = await userRepo.findById(latestId);

      expect(updatedUser.firstName).to.be.equal('newFirstName');
    })
  });

  describe('user controller: replaceById', () => {
    it('replaces a user by id', async () => {
      const userData = await givenUser(userRepo);

      userData.firstName = 'newFirstName';
      latestId = latestId + 1;
      const details = await controller.replaceById(latestId, userData);

      expect(details).to.be.undefined();

      const updatedUser = await userRepo.findById(latestId);

      expect(updatedUser.firstName).to.be.equal('newFirstName');
    })
  });

  describe('user controller: delete', () => {
    it('deletes a user record', async () => {
      await givenUser(userRepo);

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

