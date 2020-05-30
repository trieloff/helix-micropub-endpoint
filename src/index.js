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
const { wrap } = require('@adobe/openwhisk-action-utils');
const { logger } = require('@adobe/openwhisk-action-logger');
const { wrap: statusCheck } = require('@adobe/helix-status');
const { epsagon } = require('@adobe/helix-epsagon');
const { Octokit } = require('@octokit/rest');

/**
 * This is the main function
 * @param {string} name name of the person to greet
 * @returns {object} a greeting
 */
async function main(params) {
  try {
    const now = Math.round((new Date()).getTime() / 1000);
    const year = new Date().getUTCFullYear();
    const {
      // eslint-disable-next-line camelcase
      __ow_path, h, content, __ow_headers: { authorization },
    } = params;

    if (h !== 'entry') {
      return {
        statusCode: 400,
        body: `Unknown type ${h}`,
      };
    }
    const status = params['post-status'] || 'published'; // default is published
    const [owner, repo, base] = __ow_path.replace(/^\//, '').split('/');

    const auth = authorization.split(' ').pop();

    // assume everything is there
    const github = new Octokit({ auth, userAgent: 'helix-micropub-endpoint' });

    const user = (await github.users.getAuthenticated()).data;

    const mybranch = await github.repos.getBranch({ owner, repo, branch: base });
    const { sha } = mybranch.data.commit;

    const head = `new-post-${now}`;
    const ref = status === 'draft' ? `refs/heads/${head}` : `refs/heads/${base}`;

    if (status === 'draft') {
    // create the branch
      await github.git.createRef({
        owner,
        repo,
        ref,
        sha,
      });
    }

    // update the file
    await github.repos.createOrUpdateFile({
      owner,
      repo,
      branch: head,
      path: `${year}/post-${now}.md`,
      content: Buffer.from(content).toString('base64'),
      committer: {
        name: user.name,
        email: user.email,
      },
      author: {
        name: user.name,
        email: user.email,
      },
      message: 'New blog post by helix-micropub-endpoint',
    });

    if (status === 'draft') {
    // create a PR
      const result = await github.pulls.create({
        owner,
        repo,
        title: `New Blog Post ${new Date().toLocaleDateString()}`,
        body: 'Please review my new blog post',
        base,
        head,
      });

      return {
        statusCode: '204',
        headers: {
          // eslint-disable-next-line no-underscore-dangle
          Location: result.data._links.html.href,
        },
        body: 'post created.',
      };
    }

    return {
      statusCode: '204',
      headers: {
        Location: `https://github.com/${owner}/${repo}/blob/${base}/${year}/post-${now}.md`,
      },
      body: 'post created.',
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e.toString(),
    };
  }
}

module.exports.main = wrap(main)
  .with(epsagon)
  .with(statusCheck)
  .with(logger.trace)
  .with(logger);
