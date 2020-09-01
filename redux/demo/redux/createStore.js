export default function createStore(
  reducer,
  initState,
  rewriteCreateStoreFunc
) {
  if (typeof rewriteCreateStoreFunc === "function") {
    const newCreateStore = rewriteCreateStoreFunc(createStore);
    return newCreateStore(reducer, initState);
  }

  let state = initState;
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
