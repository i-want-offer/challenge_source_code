import { createStore, combineReducers } from "./redux";
import counterReducer from "./reducers/counter";
import infoReducer from "./reducers/info";

const reducer = combineReducers({
  counter: counterReducer,
  info: infoReducer,
});

/*返回了一个 dispatch 被重写过的 store*/
const store = createStore(reducer, {});

const unsubscribe = store.subscribe(() => {
  let state = store.getState();
  console.log(state.counter.count);
  console.log(state.info);
});

// 可以取消
// unsubscribe()

/*自增*/
store.dispatch({
  type: "INCREMENT",
});
store.dispatch({
  type: "DECREMENT",
});
