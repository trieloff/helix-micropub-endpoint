/*
 * Copyright 2019 Adobe. All rights reserved.
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

'use strict';

const assert = require('assert');
const index = require('../src/index.js').main;

describe('Index Tests', () => {
  it('Index function rejects unknown types', async () => {
    const result = await index({
      __ow_path: '/trieloff/helix-demo/master',
      __ow_headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      'post-status': 'draft',
      content: `# Hello World

This is a test`,
    });

    assert.equal(result.statusCode, 400, result.body);
  }).timeout(20000);

  it('Index function creates drafts', async () => {
    const result = await index({
      __ow_path: '/trieloff/helix-demo/master',
      __ow_headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      'post-status': 'draft',
      h: 'entry',
      content: `# Hello World

This is a test`,
    });

    assert.equal(result.statusCode, 204, result.body);
  }).timeout(20000);

  it('Index function creates posts', async () => {
    const result = await index({
      __ow_path: '/trieloff/helix-demo/master',
      __ow_headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      h: 'entry',
      content: `# Hello World

This is a test`,
    });

    assert.equal(result.statusCode, 204, result.body);
  }).timeout(20000);
});
