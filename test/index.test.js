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

  it('Index shows documentation on GET', async () => {
    const result = await index({
      __ow_path: '/trieloff/helix-demo/master',
      __ow_method: 'get',
      __ow_headers: {
      },
    });

    assert.equal(result.statusCode, 200, result.body);
    assert.equal(result.headers.link, '<https://adobeioruntime.net/api/v1/web/trieloff/helix-micropub/publish@v1/trieloff/helix-demo/master>; rel="micropub"');
  }).timeout(20000);

  it('Index shows config on GET ?q=config', async () => {
    const result = await index({
      __ow_path: '/trieloff/helix-demo/master',
      __ow_method: 'get',
      __ow_headers: {
      },
      q: 'config',
    });

    assert.equal(result.statusCode, 200, result.body);
    assert.ok(Array.isArray(result.body.destination), JSON.stringify(result.body));
  }).timeout(20000);

  it('Index shows config on GET ?q=config as JSON when JSON has been requested', async () => {
    const result = await index({
      __ow_path: '/trieloff/helix-demo/master',
      __ow_method: 'get',
      __ow_headers: {
        accept: 'application/json',
      },
      q: 'config',
    });

    assert.equal(typeof result, 'object', result);
    assert.ok(Array.isArray(result.destination), JSON.stringify(result));
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

    assert.equal(result.statusCode, 201, result.body);
  }).timeout(20000);

  it('Index function creates drafts from JSON', async () => {
    // captured from Proxie
    const body = {
      type: ['h-entry'],
      properties: {
        name: ['Testy test'],
        content: ['Testy test.'],
        'post-status': ['draft'],
      },
    };

    const result = await index({
      __ow_path: '/trieloff/helix-demo/master',
      __ow_headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      ...body,
    });

    assert.equal(result.statusCode, 201, result.body);
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

    assert.equal(result.statusCode, 201, result.body);
  }).timeout(20000);
});
