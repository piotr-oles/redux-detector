
import { assert } from 'chai';
import { reduceDetectors } from '../src/index';

describe('reduceDetectors', function () {
  it('should export reduceDetectors function', function () {
    assert.isFunction(reduceDetectors);
  });

  it('should return valid detector for reduction of two detectors', function () {
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

  it('should pass states in valid order for reduction of two detectors', function () {
    function detectorA(prevState, nextState) {
      if (prevState > nextState) {
        return [{type: 'PREV_STATE_GREATER'}];
      }

      return [];
    }

    function detectorB(prevState, nextState) {
      if (nextState > prevState) {
        return [{type: 'NEXT_STATE_GREATER'}];
      }

      return [];
    }

    const detectorAB = reduceDetectors(detectorA, detectorB);

    assert.deepEqual(detectorAB(-10, 50), [{type: 'NEXT_STATE_GREATER'}]);
    assert.deepEqual(detectorAB(30, 20), [{type: 'PREV_STATE_GREATER'}]);
  });

  it('should allow to reduce detectors with undefined result on no-action detect', function () {
    function detectorA(prevState, nextState) {
      if (prevState > nextState) {
        return [{type: 'PREV_STATE_GREATER'}];
      }
    }

    function detectorB(prevState, nextState) {
      if (nextState > prevState) {
        return [{type: 'NEXT_STATE_GREATER'}];
      }
    }

    const detectorAB = reduceDetectors(detectorA, detectorB);

    assert.deepEqual(detectorAB(-10, 50), [{type: 'NEXT_STATE_GREATER'}]);
    assert.deepEqual(detectorAB(30, 20), [{type: 'PREV_STATE_GREATER'}]);
  });

  it('should allow to reduce detectors with array and single result', () => {
    function detectorA() {
      return [{type: 'ARRAY_DETECTOR'}];
    }

    function detectorB(prevState, nextState) {
      return {type: 'SINGLE_DETECTOR'};
    }

    const detectorAB = reduceDetectors(detectorA, detectorB);

    assert.deepEqual(detectorAB(undefined, undefined), [{type: 'ARRAY_DETECTOR'}, {type: 'SINGLE_DETECTOR'}]);
  });

  it('should return valid reduced detector for empty arguments', function() {
    const emptyDetector = reduceDetectors();

    assert.isFunction(emptyDetector);
    assert.deepEqual(emptyDetector(10, 20), []);
  });

  it('should throw an exception for invalid arguments', function () {
    assert.throws(function () { (reduceDetectors as any)({ 'foo': 'bar' }); }, Error);
    assert.throws(function () { (reduceDetectors as any)(function() {}, undefined); }, Error);
  });
});
