export default function applyMiddleware(...middlewares) {
  return function rewriteCreateStoreFunc(oldCreateStore) {
    return function newCreateStore(reducer, initState) {
      // 生成store
      const store = oldCreateStore(reducer, initState);

      /*给每个 middleware 传下store，相当于 const logger = loggerMiddleware(store);*/
      /* const chain = [exception, time, logger]*/
      const chain = middlewares.map(middleware => middleware(store))
      
      /* 实现 exception(time((logger(dispatch))))*/
      let dispatch = store.dispatch
      /* 从里到外,依次调用 */
      chain.reverse().forEach(middleware => {
        dispatch = middleware(dispatch)
      })

      store.dispatch = dispatch;
      return store
    };
  };
}
