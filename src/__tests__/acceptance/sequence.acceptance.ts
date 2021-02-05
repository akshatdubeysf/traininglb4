import {Client, expect} from '@loopback/testlab';
import * as dotenv from 'dotenv';
import {TrainingApplication} from '../..';
import {setupApplication} from './test-helper';

dotenv.config();

describe('Sequence', () => {
  let app: TrainingApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /ping with referrer', async () => {
    const res = await client.get('/ping?msg=world')
      .set('referer', process.env.ALLOWED_ORIGIN ?? '')
      .expect(200);
    expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });

  it('invokes GET /ping without referrer', async () => {
    const res = await client.get('/ping?msg=world')
      .expect(500);
  });
});
