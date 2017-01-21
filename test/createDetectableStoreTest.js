
var chai = require('chai');
var spies = require('chai-spies');
var createDetectableStore = require('../dist/index').createDetectableStore;

chai.use(spies);
var assert = chai.assert;

describe('createDetectableStore', function () {
  it('check if redux-detector exports createDetectableStore', function () {
    assert.isFunction(createDetectableStore);
  });

});