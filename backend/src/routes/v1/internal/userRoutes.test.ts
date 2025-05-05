import request from 'supertest';
import { expect } from 'chai';
import * as sinon from 'sinon';
import app from '../../../driver/startServer';
import * as authService from '../../../services/authService';
import { Auth } from '../../../db/mongo/models/authModel';
import { User } from '../../../db/mongo/models/userModel';

const stubUser = {
  _id: '51048d5a-e3ae-4fc6-926f-8904123e136e',
  displayName: 'Test user',
};

describe('User internal routes', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('GET /internal/can-change-password', () => {
    it('Check if user can change password: success', async () => {
      const stub = sinon.stub(authService, 'userIsLocal');
      stub.resolves(true);

      // Make the request to the endpoint
      const response = await request(app).get(
        '/internal/can-change-password?email=test@email.com'
      );

      // Assert the response
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ status: 0 });
    });

    it('Check if user can change password: failure', async () => {
      const stub = sinon.stub(authService, 'userIsLocal');
      stub.resolves(false);

      // Make the request to the endpoint
      const response = await request(app).get(
        '/internal/can-change-password?email=test@email.com'
      );

      // Assert the response
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ status: 1 });
    });

    it('Check if user can change password: validation error', async () => {
      const stub = sinon.stub(authService, 'userIsLocal');
      stub.resolves(true);

      // Make the request to the endpoint
      const response = await request(app).get(
        '/internal/can-change-password?email=wawa'
      );

      // Assert the response
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
        status: 12,
        message: '"email" must be a valid email',
      });
    });

    it('Check if user can change password: exception', async () => {
      const stub = sinon.stub(authService, 'userIsLocal');
      stub.throws(new Error('Test error'));

      // Make the request to the endpoint
      const response = await request(app).get(
        '/internal/can-change-password?email=test@mail.com'
      );

      // Assert the response
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
        status: 1,
      });
    });
  });

  describe('POST /internal/change-email', () => {
    it('Change user email: success', async () => {
      sinon
        .stub(Auth, 'findById')
        .resolves({ userName: '', provider: '', revision: 0 });
      sinon.stub(User, 'findOne').resolves(stubUser);
      sinon.stub(User, 'findById').value(() => ({
        lean: () => sinon.stub().resolves(stubUser),
        exec: () => ({}),
      }));
      sinon.stub(User, 'findByIdAndUpdate').resolves(stubUser);
      sinon.stub(Auth, 'findOne').value(() => ({
        lean: () =>
          sinon.stub().resolves({
            _id: '45ec29a0-c255-4d58-b5fd-6d85a411d18b',
            userName: '',
            provider: '',
            revision: 0,
          }),
        exec: () => ({}),
      }));
      sinon.stub(Auth, 'findByIdAndUpdate').resolves({
        _id: '45ec29a0-c255-4d58-b5fd-6d85a411d18b',
        userName: '',
        provider: '',
        revision: 0,
      });

      // Make the request to the endpoint
      const response = await request(app).post('/internal/change-email').send({
        oldEmail: 'xz@mail.com',
        newEmail: 'xx@mail.com',
      });

      // Assert the response
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ status: 0 });
    });

    it('Change user email: empty email', async () => {
      // Make the request to the endpoint
      const response = await request(app).post('/internal/change-email').send({
        oldEmail: '',
        newEmail: 'xx@mail.com',
      });

      // Assert the response
      expect(response.status).to.equal(200);
      expect(response.body).to.contain({ status: 9005 });
    });

    it('Change user email: wrong user', async () => {
      sinon.stub(User, 'findOne').resolves(null);

      // Make the request to the endpoint
      const response = await request(app).post('/internal/change-email').send({
        oldEmail: 'xz@mail.com',
        newEmail: 'xx@mail.com',
      });

      // Assert the response
      expect(response.status).to.equal(200);
      expect(response.body).to.contain({ status: 1070 });
    });

    it('Change user email: fail to update', async () => {
      sinon.stub(User, 'findOne').resolves(stubUser);
      sinon.stub(User, 'findById').value(() => ({
        lean: () => sinon.stub().resolves(stubUser),
        exec: () => ({}),
      }));
      sinon.stub(User, 'findByIdAndUpdate').resolves(null);

      // Make the request to the endpoint
      const response = await request(app).post('/internal/change-email').send({
        oldEmail: 'xz@mail.com',
        newEmail: 'xx@mail.com',
      });

      // Assert the response
      expect(response.status).to.equal(200);
      expect(response.body).to.include({ status: 9005 });
    });
  });
});
