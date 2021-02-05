import {expect} from '@loopback/testlab';
import {CustomerController} from '../../../controllers';
import {Customer} from '../../../models';
import {CustomerRepository, RoleRepository, UserRepository} from '../../../repositories';
import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {givenCustomer, givenCustomerData, givenEmptyDatabase} from '../../helpers/database.helper';

describe('CustomerController (integration)', () => {

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
  const controller = new CustomerController(customerRepo);
  let latestId = 0;

  describe('Get all', () => {
    it('retrieves all customers', async () => {
      const customer = await givenCustomer(customerRepo);
      const details = await controller.find();
      latestId = details[0].id as number;
      const keys = Object.keys(customer) as Array<keyof Customer>;
      keys.forEach((key: keyof Customer) => {
        expect(details[0][key]).equal(customer[key]);
      })
    });

    it('gives appropriate response when no customer present', async () => {

      const details = await controller.find();
      expect(details).to.be.eql([]);

    })
  });

  describe('Customer controller: count', () => {
    it('retrieves customer count', async () => {
      await givenCustomer(customerRepo);
      latestId = latestId + 1;
      const details = await controller.count();

      expect(details).to.be.eql({count: 1});
    });

    it('gives appropriate response when no customer present', async () => {
      const details = await controller.count();
      expect(details).to.be.eql({count: 0});
    })
  });

  describe('Customer controller: findById', () => {
    it('retrieves one customer', async () => {
      const customer = await givenCustomer(customerRepo);
      const details = await controller.findById(latestId + 1);

      latestId = details?.id as number;
      const keys = Object.keys(customer) as Array<keyof Customer>;
      keys.forEach((key: keyof Customer) => {
        expect(details[key]).equal(customer[key]);
      })
    })
  });

  describe('Customer controller: create', () => {
    it('creates a new customer', async () => {
      const customerData = givenCustomerData();

      const details = await controller.create(customerData);

      latestId = details?.id as number;

      const keys = Object.keys(customerData) as Array<keyof Customer>;
      keys.forEach((key: keyof Customer) => {
        expect(details[key]).equal(customerData[key]);
      })
    });
  });

  describe('Customer controller: updateAll', () => {
    it('updates a customer', async () => {
      const customerData = await givenCustomer(customerRepo);

      customerData.name = 'newName';
      latestId = latestId + 1;

      const details = await controller.updateAll(customerData, {id: latestId});

      expect(details).to.be.eql({count: 1});

      const updatedCustomer = await customerRepo.findById(latestId);

      expect(updatedCustomer.name).to.be.equal('newName');
    })
  });

  describe('Customer controller: updateById', () => {
    it('updates a customer by id', async () => {
      const customerData = await givenCustomer(customerRepo);

      customerData.name = 'newName';
      latestId = latestId + 1;
      const details = await controller.updateById(latestId, customerData);

      expect(details).to.be.undefined();

      const updatedCustomer = await customerRepo.findById(latestId);

      expect(updatedCustomer.name).to.be.equal('newName');
    })
  });

  describe('Customer controller: replaceById', () => {
    it('replaces a customer by id', async () => {
      const customerData = await givenCustomer(customerRepo);

      customerData.name = 'newName';
      latestId = latestId + 1;
      const details = await controller.replaceById(latestId, customerData);

      expect(details).to.be.undefined();

      const updatedCustomer = await customerRepo.findById(latestId);

      expect(updatedCustomer.name).to.be.equal('newName');
    })
  });

  describe('Customer controller: delete', () => {
    it('deletes a customer record', async () => {
      await givenCustomer(customerRepo);

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

