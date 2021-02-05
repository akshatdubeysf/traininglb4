import {HttpErrors} from '@loopback/rest';
import {
  createStubInstance,
  expect,

  StubbedInstanceWithSinonAccessor
} from '@loopback/testlab';
import {CustomerController} from '../../../controllers';
import {CustomerRepository} from '../../../repositories';
import {givenCustomerData} from '../../helpers/database.helper';


describe('CustomerController (unit)', () => {
  let repository: StubbedInstanceWithSinonAccessor<CustomerRepository>;
  beforeEach(givenStubbedRepository);

  describe('Customer controller: fetch', () => {
    it('retrieves all Customers', async () => {
      const controller = new CustomerController(repository);
      const testData = givenCustomerData();
      repository.stubs.find.resolves([testData]);

      const details = await controller.find();

      expect(details).to.be.Array();
      expect(details).to.containEql(testData);
    });

    it('retrieves customers when none exist', async () => {
      const controller = new CustomerController(repository);
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

  describe('Customer controller: count', () => {
    it('retrieves Customer count', async () => {
      const controller = new CustomerController(repository);
      repository.stubs.count.resolves({count: 1});

      const details = await controller.count();

      expect(details).to.containEql({count: 1});
    });
    it('check for count when no records exist', async () => {
      const controller = new CustomerController(repository);
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

  describe('Customer controller: findById', () => {
    it('retrieves one Customer', async () => {
      const controller = new CustomerController(repository);
      const testData = givenCustomerData({});
      repository.stubs.findById.resolves(testData).withArgs(1);

      const details = await controller.findById(1);

      expect(details).to.eql(testData);
    });
    it('not found for non existant id', async () => {
      const controller = new CustomerController(repository);
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

  describe('Customer controller: create', () => {
    it('creates a new Customer', async () => {
      const controller = new CustomerController(repository);
      const testData = givenCustomerData({});
      repository.stubs.create.resolves(testData).withArgs(testData);

      const user = await controller.create(testData)

      expect(user).to.deepEqual(testData);
    })
  })

  describe('Customer controller: updateAll', () => {
    it('updates a Customer', async () => {
      const controller = new CustomerController(repository);
      const testData = givenCustomerData({});
      repository.stubs.updateAll.resolves({count: 1}).withArgs(testData);

      const count = await controller.updateAll(testData);

      expect(count).to.be.eql({count: 1});
    })
  })

  describe('Customer controller: updateById', () => {
    it('updates a Customer by id', async () => {
      const controller = new CustomerController(repository);
      const testData = givenCustomerData({});
      repository.stubs.updateById.resolves().withArgs(1, testData);

      const result = await controller.updateById(1, testData);
      expect(result).to.be.undefined();
    })
  })

  describe('Customer controller: replaceById', () => {
    it('replaces a Customer by id', async () => {
      const controller = new CustomerController(repository);
      const testData = givenCustomerData({});
      repository.stubs.replaceById.resolves().withArgs(1, testData);

      const result = await controller.replaceById(1, testData);
      expect(result).to.be.undefined();
    })
  })

  describe('Customer controller: delete', () => {
    it('deletes a Customer record', async () => {
      const controller = new CustomerController(repository);
      repository.stubs.deleteById.resolves().withArgs(1);

      const result = await controller.deleteById(1);
      expect(result).to.be.undefined();
    })
  })

  function givenStubbedRepository() {
    repository = createStubInstance(CustomerRepository);
  }
});
