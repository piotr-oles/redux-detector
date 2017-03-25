
import * as chai from 'chai';
import * as spies from 'chai-spies';
import { assert, expect } from 'chai';
import { Detector, combineDetectors } from '../src/index';

chai.use(spies);

describe('combineDetectors', function () {
  it('should export reduceDetectors function', function () {
    assert.isFunction(combineDetectors);
  });

  it('should return valid detector for empty map', function () {
    const detector = combineDetectors({});

    assert.isFunction(detector);
    assert.deepEqual([], detector({}, {}));
    assert.deepEqual([], detector(undefined, {}));
  });

  it('should return detector that binds detectors to local state', function () {
    const aDetector = chai.spy();
    const bDetector = chai.spy();
    const detector = combineDetectors({
      a: aDetector,
      b: bDetector
    });

    const prevState = {
      a: 'foo',
      b: 'bar'
    };
    const nextState = {
      a: 123,
      b: 321
    };

    assert.isFunction(detector);
    assert.deepEqual([], detector(prevState, nextState));
    expect(aDetector).to.have.been.called.once.with('foo', 123);
    expect(bDetector).to.have.been.called.once.with('bar', 321);
  });

  it('should merge actions returned by combined detectors', function () {
    function detectorA(prevState, nextState) {
      if (prevState === 'a' && nextState === 'b') {
        return [{ type: 'A_TO_B_TRANSITION' }];
      }
    }
    function detectorB(prevState, nextState) {
      if (prevState !== nextState && (prevState === 'a' || prevState === 'b')) {
        return { type: 'FROM_A_OR_B_TRANSITION' };
      }
    }
    function detectorC(prevState, nextState) {
      return undefined;
    }

    const detector: Detector<any> = combineDetectors({
      a: detectorA,
      b: detectorB,
      c: detectorC
    });

    assert.deepEqual([], detector({}, {}));
    assert.deepEqual([], detector(undefined, {}));
    assert.deepEqual(
      [
        { type: 'A_TO_B_TRANSITION' },
        { type: 'FROM_A_OR_B_TRANSITION' }
      ],
      detector(
        {
          a: 'a',
          b: 'a'
        },
        {
          a: 'b',
          b: 'b',
          c: 'c'
        }
      )
    );
    assert.deepEqual(
      [
        { type: 'FROM_A_OR_B_TRANSITION' },
      ],
      detector(
        {
          a: 'b',
          b: 'b',
          c: 'a'
        },
        {
          a: 'c',
          b: 'd',
          c: 'b'
        }
      )
    );
  });
});