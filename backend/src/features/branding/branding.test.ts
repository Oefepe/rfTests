import request from 'supertest';
import nock from 'nock';
import { expect } from 'chai';
import app from '../../driver/startServer';
import config from '../../config/config';

describe('Branding Endpoint', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should return branding data from legacy', async () => {
    // Mock the external API call
    nock(`${config.lumenUrl}`)
      .get('/jwt/posting-keys/1')
      .reply(200, { status: 0, token: 'token' });
    nock(`${config.lumenUrl}`)
      .get('/v2/branding/1')
      .replyWithFile(200, `src/features/legacyApi/__mock__/branding.json`);

    // Make the request to the /branding/1 endpoint
    const response = await request(app).get('/api/branding/1');

    // Assert the response
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal(0);
    expect(response.body.data.accountName).to.equal('QA Test Account');
  });

  it('should return default branding data if legacy call fails', async () => {
    // Mock the external API call
    nock(`${config.lumenUrl}`)
      .get('/jwt/posting-keys/1')
      .reply(500, { status: 1 });

    // Make the request to the /branding/1 endpoint
    const response = await request(app).get('/api/branding/1');

    // Assert the response
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal(0);
    expect(response.body.data.accountName).to.equal('RapidFunnel');
    expect(response.body.data.primaryColor).to.equal('#77B800');
  });

  it('should return default branding data if legacy returns wrong data', async () => {
    // Mock the external API call
    nock(`${config.lumenUrl}`)
      .get('/jwt/posting-keys/1')
      .reply(200, { status: 0, token: 'token' });
    nock(`${config.lumenUrl}`)
      .get('/v2/branding/1')
      .replyWithFile(200, `src/features/legacyApi/__mock__/branding.fail.json`);

    // Make the request to the /branding/1 endpoint
    const response = await request(app).get('/api/branding/1');

    // Assert the response
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal(0);
    expect(response.body.data.accountName).to.equal('RapidFunnel');
    expect(response.body.data.primaryColor).to.equal('#77B800');
  });
});
