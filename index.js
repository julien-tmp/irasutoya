'use strict';

const cheerio = require('cheerio');
const request = require('request');
const p       = require('@fand/promisify');

const opts = {
  xmlMode             : true,
  withDomLvl1         : false,
  normalizeWhitespace : true,
};

function run (query) {
  return p(request)(`https://www.irasutoya.com/search?q=${encodeURIComponent(query)}`).then((res) => {
    const $ = cheerio.load(res.body, opts);
    return $('.boxim > a').map((i, e) => $(e).attr('href'));
  })
  .then((urls) => {
    if (urls.length === 0) {
      throw new Error('No illusts found');
    }

    const entryUrl = urls[Math.floor(Math.random() * urls.length)];
    return p(request)(entryUrl);
  })
  .then((res) => {
    const $ = cheerio.load(res.body, opts);
    let imageUrl = $('.entry .separator a').attr('href');
    if (imageUrl.startsWith("//")) {
      imageUrl = `https:${imageUrl}`;
    }

    console.log(imageUrl);
    return imageUrl;
  })
  .catch((e) => {
    console.log(e);
    throw e;
  });
}

module.exports = run;
