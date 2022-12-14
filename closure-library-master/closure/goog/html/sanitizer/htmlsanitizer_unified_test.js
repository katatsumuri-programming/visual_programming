/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

goog.module('goog.html.HtmlSanitizerUnifiedTest');
goog.setTestOnly();

const SafeHtml = goog.require('goog.html.SafeHtml');
const SanitizerBuilder = goog.require('goog.html.sanitizer.HtmlSanitizer.Builder');
const testSuite = goog.require('goog.testing.testSuite');
const testVectors = goog.require('goog.html.htmlTestVectors');

const sanitizer = new SanitizerBuilder().build();

const suite = {};
for (const v of /** @type {?} */ (testVectors.HTML_TEST_VECTORS)) {
  /** @suppress {missingProperties} suppression added to enable type checking */
  suite[`testVector[${v.name}]`] = function() {
    const sanitized = SafeHtml.unwrap(sanitizer.sanitize(v.input));
    assertContains(sanitized, v.acceptable);
  };
}

testSuite(suite);
