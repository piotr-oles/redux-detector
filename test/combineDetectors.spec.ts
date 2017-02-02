
import { assert } from 'chai';
import { combineDetectors } from '../src/index';

describe('combineDetectors', function () {
  it('check if redux-detector exports combineDetectors', function () {
    assert.isFunction(combineDetectors);
  });

  it('check if combination of two detectors returns valid detector', function () {
    function detectorA() {
      return [{type: 'ACTION_A'}, {type: 'ACTION_B'}];
    }

    function detectorB() {
      return [{type: 'ACTION_C'}];
    }

    const detectorAB = combineDetectors([detectorA, detectorB]);

    assert.isFunction(detectorAB);
    assert.isArray(detectorAB({}, {}));

    // we check it twice to be sure that detectorAB doesn't has any internal state.
    assert.deepEqual(detectorAB({}, {}), [{type: 'ACTION_A'}, {type: 'ACTION_B'}, {type: 'ACTION_C'}]);
    assert.deepEqual(detectorAB({}, {}), [{type: 'ACTION_A'}, {type: 'ACTION_B'}, {type: 'ACTION_C'}]);
  });

  it('check if combination of two detectors passes states in valid order', function () {
    function detectorA(prevState, nextState) {
      if (prevState > nextState) {
        return ['PREV_STATE'];
      }

      return [];
    }

    function detectorB(prevState, nextState) {
      if (nextState > prevState) {
        return ['NEXT_STATE'];
      }

      return [];
    }

    const detectorAB = combineDetectors([detectorA, detectorB]);

    assert.deepEqual(detectorAB(-10, 50), ['NEXT_STATE']);
    assert.deepEqual(detectorAB(30, 20), ['PREV_STATE']);
  });

  it('check if it can combine detectors with undefined result on no-action detect', function () {
    function detectorA(prevState, nextState) {
      if (prevState > nextState) {
        return ['PREV_STATE'];
      }
    }

    function detectorB(prevState, nextState) {
      if (nextState > prevState) {
        return ['NEXT_STATE'];
      }
    }

    const detectorAB = combineDetectors([detectorA, detectorB]);

    assert.deepEqual(detectorAB(-10, 50), ['NEXT_STATE']);
    assert.deepEqual(detectorAB(30, 20), ['PREV_STATE']);
  });

  it('check if invalid argument call will throw an exception', function () {
    assert.throws(function () { (combineDetectors as any)(); }, Error);
    assert.throws(function () { (combineDetectors as any)({ 'foo': 'bar' }); }, Error);
    assert.throws(function () { (combineDetectors as any)(function () {}, function () {}); }, Error);
    assert.throws(function () { (combineDetectors as any)([function() {}, undefined]); }, Error);
  });
});
