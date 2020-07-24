export default function createStore(reducer, initState) {
  let state = initState;

  // 订阅者队列
  const listeners = [];

  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function dispatch(action) {
    state = reducer(state, action);

    listeners.forEach((fn) => fn());
  }

  function getState() {
    return state;
  }

  dispatch({ type: Symbol() });

  return {
    subscribe,
    getState,
    dispatch,
  };
}
