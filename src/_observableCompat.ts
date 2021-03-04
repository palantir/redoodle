
/**
 * Minimal interface to support Observer integration for Redoodle.
 * Redoodle is not designed as an Observable engine itself. Integration is included only
 * for compatibility with core Redux, which recently added its own Observer support.
 */
export type _ObserverLike<T> = {
  next?(value: T): void
}

/**
 * Minimal interface to support Observable integration for Redoodle.
 * Redoodle is not designed as an Observable engine itself. Integration is included only
 * for compatibility with core Redux, which recently added its own Observer support.
 */
export interface _ObservableLike<T> {
  /**
   * The minimal observable subscription method.
   * @param {Object} observer Any object that can be used as an observer.
   * The observer object should have a `next` method.
   * @returns {subscription} An object with an `unsubscribe` method that can
   * be used to unsubscribe the observable from the store, and prevent further
   * emission of values from the observable.
   */
  subscribe: (observer: _ObserverLike<T>) => { unsubscribe: () => void }
  [Symbol.observable](): _ObservableLike<T>;
}
