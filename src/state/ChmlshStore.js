/**
 * ChmlshStore - State management solution for Reactive chmlsh
 * A lightweight Redux-like state management system
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Create context for the store
const StoreContext = createContext(null);
const DispatchContext = createContext(null);

/**
 * Combine multiple reducers into a single reducer
 * @param {Object} reducers - Object with reducer functions
 * @returns {Function} Combined reducer function
 */
export function combineReducers(reducers) {
  return (state = {}, action) => {
    const nextState = {};
    let hasChanged = false;

    for (const key in reducers) {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

/**
 * Create a middleware chain for the store
 * @param {Array} middlewares - Array of middleware functions
 * @returns {Function} Middleware chain
 */
export function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, initialState) => {
    const store = createStore(reducer, initialState);
    let dispatch = store.dispatch;
    
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action),
    };
    
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = chain.reduce((a, b) => (...args) => a(b(...args)))(store.dispatch);
    
    return {
      ...store,
      dispatch,
    };
  };
}

/**
 * Create a store with the given reducer and initial state
 * @param {Function} reducer - Reducer function
 * @param {Object} initialState - Initial state
 * @param {Function} enhancer - Store enhancer (e.g., applyMiddleware)
 * @returns {Object} Store object
 */
export function createStore(reducer, initialState, enhancer) {
  if (typeof enhancer === 'function') {
    return enhancer(createStore)(reducer, initialState);
  }
  
  let currentState = initialState;
  let currentListeners = [];
  let nextListeners = currentListeners;
  let isDispatching = false;
  
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  
  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing.');
    }
    
    return currentState;
  }
  
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }
    
    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing.');
    }
    
    let isSubscribed = true;
    
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      
      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing.');
      }
      
      isSubscribed = false;
      
      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  
  function dispatch(action) {
    if (typeof action !== 'object' || action === null) {
      throw new Error('Actions must be plain objects.');
    }
    
    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property.');
    }
    
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }
    
    try {
      isDispatching = true;
      currentState = reducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    
    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
    
    return action;
  }
  
  // Initialize the store with a dummy action
  dispatch({ type: '@@chmlsh/INIT' });
  
  return {
    getState,
    dispatch,
    subscribe,
  };
}

/**
 * Create a selector function to extract data from the state
 * @param {Function} selector - Function to select data from state
 * @param {Function} equalityFn - Function to compare previous and next values
 * @returns {Function} Memoized selector
 */
export function createSelector(selector, equalityFn = (a, b) => a === b) {
  let lastState = null;
  let lastResult = null;
  
  return (state) => {
    if (lastState === null || !equalityFn(lastState, state)) {
      lastResult = selector(state);
      lastState = state;
    }
    
    return lastResult;
  };
}

/**
 * Create an action creator
 * @param {string} type - Action type
 * @returns {Function} Action creator function
 */
export function createAction(type) {
  return (payload) => ({
    type,
    payload,
  });
}

/**
 * ChmlshProvider component for providing store to the app
 * @param {Object} props - Component props
 * @returns {React.Element} Provider component
 */
export function ChmlshProvider({ children, store }) {
  return (
    <StoreContext.Provider value={store.getState()}>
      <DispatchContext.Provider value={store.dispatch}>
        {children}
      </DispatchContext.Provider>
    </StoreContext.Provider>
  );
}

/**
 * Hook to access the store state
 * @returns {Object} Store state
 */
export function useStore() {
  const store = useContext(StoreContext);
  
  if (store === null) {
    throw new Error('useStore must be used within a ChmlshProvider');
  }
  
  return store;
}

/**
 * Hook to access the store dispatch function
 * @returns {Function} Dispatch function
 */
export function useDispatch() {
  const dispatch = useContext(DispatchContext);
  
  if (dispatch === null) {
    throw new Error('useDispatch must be used within a ChmlshProvider');
  }
  
  return dispatch;
}

/**
 * Hook to select data from the store
 * @param {Function} selector - Function to select data from state
 * @returns {any} Selected data
 */
export function useSelector(selector) {
  const store = useStore();
  return selector(store);
}

/**
 * Hook to create and dispatch an action
 * @param {string} type - Action type
 * @returns {Function} Function to dispatch the action with payload
 */
export function useAction(type) {
  const dispatch = useDispatch();
  
  return useCallback((payload) => {
    dispatch({
      type,
      payload,
    });
  }, [dispatch, type]);
}
