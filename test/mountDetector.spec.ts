
import { assert } from 'chai';
import { mountDetector } from '../src/index';

describe('mountDetector', () => {

  it('should export mountDetector function', () => {
    assert.isFunction(mountDetector);
  });

  it('should mount detector using selector', () => {
    const prevState = {
      branchA: {
        subBranchB: {
          value: 1
        }
      }
    };
    const nextState = {
      branchA: {
        subBranchB: {
          value: 5
        }
      }
    };
    function detector(prevState, nextState) {
      if (prevState && prevState.value === 1 && nextState && nextState.value === 5) {
        return [{type: 'SELECTORS_WORKED'}];
      }
    }
    function selector(state) {
      return state.branchA.subBranchB;
    }

    const mountedDetector = mountDetector(selector, detector);

    assert.isFunction(mountedDetector);

    const detectedActions = mountedDetector(prevState, nextState);

    assert.isArray(detectedActions);
    assert.deepEqual(detectedActions, [{ type: 'SELECTORS_WORKED' }]);
  });

});
