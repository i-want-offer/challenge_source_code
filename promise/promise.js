const PENDING = 'pending';
const RESOLVE = 'fulfilled';
const REJECT = 'rejected';

const isFunction = (fn) => typeof fn === 'function';

class PromiseA {
  constructor(fn) {
    this.state = PENDING;
    this.resolveCallBacks = [];
    this.rejectCallBacks = [];
    this.value = null;

    this.then = this.then.bind(this);

    const _reject = (res) => {
      if (this.state === PENDING) {
        this.state = REJECT;
        this.value = res;
        setTimeout(() => {
          this.rejectCallBacks.forEach((cb) => {
            cb();
          });
        });
      }
    };

    const _resolve = (res) => {
      if (this.state === PENDING) {
        this.state = RESOLVE;
        this.value = res;
        setTimeout(() => {
          this.resolveCallBacks.forEach((cb) => {
            cb();
          });
        });
      }
    };

    try {
      fn(_resolve, _reject);
    } catch (e) {
      _reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    onRejected = typeof onRejected === 'function' ? onRejected : (v) => v;
    const _this = this;
    return new PromiseA((resolve, reject) => {
      if (_this.state === RESOLVE) {
        setTimeout(() => {
          try {
            const x = onFulfilled(_this.value);
            if (x instanceof PromiseA) {
              x.then(resolve, reject);
            } else {
              resolve(x);
            }
          } catch (err) {
            reject(err);
          }
        });
      } else if (_this.state === REJECT) {
        setTimeout(() => {
          try {
            const x = onRejected(_this.value);
            if (x instanceof PromiseA) {
              x.then(resolve, reject);
            } else {
              reject(x);
            }
          } catch (err) {
            reject(err);
          }
        });
      } else if (_this.state === PENDING) {
        this.resolveCallBacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(_this.value);
              if (x instanceof PromiseA) {
                x.then(resolve, reject);
              } else {
                resolve(x);
              }
            } catch (err) {
              reject(err);
            }
          });
        });

        this.rejectCallBacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(_this.value);
              if (x instanceof PromiseA) {
                x.then(resolve, reject);
              } else {
                reject(x);
              }
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    });
  }

  catch(onReject) {
    return this.then(null, onReject);
  }

  finally(cb) {
    return this.then(
      (value) => PromiseA.resolve(cb()).then((value) => value),
      (reason) =>
        PromiseA.resolve(cb()).then(() => {
          throw reason;
        })
    );
  }

  static resolve(val) {
    if (val && val instanceof PromiseA) {
      return val;
    }
    return new PromiseA((resolve, reject) => {
      if (val && typeof val.then === 'function') {
        val.then(resolve, reject);
      } else {
        resolve(val);
      }
    });
  }

  static reject(val) {
    return new PromiseA((resolve, reject) => {
      if (val && typeof val.then === 'function') {
        val.then(reject);
      } else {
        reject(val);
      }
    });
  }

  static all(promises) {
    const len = promises.length;
    const res = [];
    let count = 0;

    return new PromiseA((resolve, reject) => {
      promises.forEach((promise, index) => {
        PromiseA.resolve(promise).then(
          (v) => {
            res[index] = v;
            count++;

            if (count === len) {
              resolve(res);
            }
          },
          (err) => reject(err)
        );
      });
    });
  }

  static race(promises) {
    return new PromiseA((resolve, reject) => {
      promises.forEach((promise) => {
        PromiseA.resolve(promise).then(
          (v) => {
            resolve(v);
          },
          (err) => reject(err)
        );
      });
    });
  }
}
