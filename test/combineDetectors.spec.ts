
import { assert } from 'chai';
import { combineDetectors } from '../src/index';

describe('combineDetectors', () => {
  it('should export combineDetectors function', () => {
    assert.isFunction(combineDetectors);
  });

  it('should return valid detector for combination of two detectors', () => {
    function detectorA() {
      return [{type: 'ACTION_A'}, {type: 'ACTION_B'}];
    }

    function detectorB() {
      return [{type: 'ACTION_C'}];
    }

    const detectorAB = combineDetectors(detectorA, detectorB);

    assert.isFunction(detectorAB);
    assert.isArray(detectorAB({}, {}));

    // we check it twice to be sure that detectorAB doesn't has any internal state.
    assert.deepEqual(detectorAB({}, {}), [{type: 'ACTION_A'}, {type: 'ACTION_B'}, {type: 'ACTION_C'}]);
    assert.deepEqual(detectorAB({}, {}), [{type: 'ACTION_A'}, {type: 'ACTION_B'}, {type: 'ACTION_C'}]);
  });

  it('should passes states in valid order for combination of two detectors', () => {
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

    const detectorAB = combineDetectors(detectorA, detectorB);

    assert.deepEqual(detectorAB(-10, 50), [{type: 'NEXT_STATE_GREATER'}]);
    assert.deepEqual(detectorAB(30, 20), [{type: 'PREV_STATE_GREATER'}]);
  });

  it('should allow to combine detectors with undefined result on no-action detect', () => {
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

    const detectorAB = combineDetectors(detectorA, detectorB);

    assert.deepEqual(detectorAB(-10, 50), [{type: 'NEXT_STATE_GREATER'}]);
    assert.deepEqual(detectorAB(30, 20), [{type: 'PREV_STATE_GREATER'}]);
  });

  it('should throw an exception for call with invalid argument', () => {
    assert.throws(() => { (combineDetectors as any)(); }, Error);
    assert.throws(() => { (combineDetectors as any)({ 'foo': 'bar' }); }, Error);
    assert.throws(() => { (combineDetectors as any)(function () {}, function () {}); }, Error);
    assert.throws(() => { (combineDetectors as any)([function() {}, undefined]); }, Error);
  });
});
