
import { assert } from 'chai';
import { reduceDetectors } from '../src/index';

describe('reduceDetectors', function () {
  it('check if redux-detector exports reduceDetectors', function () {
    assert.isFunction(reduceDetectors);
  });

  it('check if reduction of two detectors returns valid detector', function () {
    function detectorA() {
      return [{type: 'ACTION_A'}, {type: 'ACTION_B'}];
    }

    function detectorB() {
      return [{type: 'ACTION_C'}];
    }

    const detectorAB = reduceDetectors(detectorA, detectorB);

    assert.isFunction(detectorAB);
    assert.isArray(detectorAB({}, {}));

    // we check it twice to be sure that detectorAB doesn't has any internal state.
    assert.deepEqual(detectorAB({}, {}), [{type: 'ACTION_A'}, {type: 'ACTION_B'}, {type: 'ACTION_C'}]);
    assert.deepEqual(detectorAB({}, {}), [{type: 'ACTION_A'}, {type: 'ACTION_B'}, {type: 'ACTION_C'}]);
  });

  it('check if reduction of two detectors passes states in valid order', function () {
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

    const detectorAB = reduceDetectors(detectorA, detectorB);

    assert.deepEqual(detectorAB(-10, 50), ['NEXT_STATE']);
    assert.deepEqual(detectorAB(30, 20), ['PREV_STATE']);
  });

  it('check if it can reduce detectors with undefined result on no-action detect', function () {
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

    const detectorAB = reduceDetectors(detectorA, detectorB);

    assert.deepEqual(detectorAB(-10, 50), ['NEXT_STATE']);
    assert.deepEqual(detectorAB(30, 20), ['PREV_STATE']);
  });

  it('check if it can return valid reduced detector for empty arguments', function() {
    const emptyDetector = reduceDetectors();

    assert.isFunction(emptyDetector);
    assert.deepEqual(emptyDetector(10, 20), []);
  });

  it('check if invalid argument call will throw an exception', function () {
    assert.throws(function () { (reduceDetectors as any)({ 'foo': 'bar' }); }, Error);
    assert.throws(function () { (reduceDetectors as any)(function() {}, undefined); }, Error);
  });
});
