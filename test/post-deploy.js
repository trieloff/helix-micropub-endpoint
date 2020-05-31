
/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const chaiHttp = require('chai-http');
const packjson = require('../package.json');

chai.use(chaiHttp);
const { expect } = chai;

function getbaseurl() {
  const namespace = 'trieloff';
  const package = 'helix-micropub';
  const name = 'publish';
  let version = `${packjson.version}`;
  if (process.env.CI && process.env.CIRCLE_BUILD_NUM && process.env.CIRCLE_BRANCH !== 'master') {
    version = `ci${process.env.CIRCLE_BUILD_NUM}`;
  }
  return `api/v1/web/${namespace}/${package}/${name}@${version}`;
}

describe('Post-Deploy Tests', () => {
  it('Publish a Blog Post (draft)', async () => {
    console.log(`Trying https://adobeioruntime.net/${getbaseurl()}/trieloff/helix-demo/master`);

    await chai
      .request('https://adobeioruntime.net/')
      .post(`${getbaseurl()}/trieloff/helix-demo/master`)
      .type('form')
      .set('Authorization', `Bearer ${process.env.GITHUB_TOKEN}`)
      .send({
        'post-status': 'draft',
        h: 'entry',
        content: `# My awesome blog post

Hello world from CircleCI. This is build # ${process.env.CIRCLE_BUILD_NUM}
`,
      })
      .then((response) => {
        expect(response).to.have.status(204);
      })
      .catch((e) => {
        throw e;
      });
  }).timeout(10000);
});
