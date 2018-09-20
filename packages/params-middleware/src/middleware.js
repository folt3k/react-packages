// @flow

import { RSAA } from 'redux-api-middleware';

import type { Dispatch } from 'redux';
import type { Action } from './types';

function parametriseEndpoint({ endpoint, types }) {
  const params = types[0]?.meta?.params;

  if (typeof endpoint === 'function' || !params) {
    return endpoint;
  }

  const searchParams = new URLSearchParams();

  Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .forEach(key => {
      if (Array.isArray(params[key])) {
        params[key].forEach(inner => searchParams.append(`${key}[]`, inner));
      } else {
        searchParams.append(key, params[key]);
      }
    });

  return endpoint + '?' + searchParams.toString();
}

export default function paramsMiddleware() {
  return (next: Dispatch<Action>) => (action: Action) => {
    const apiMiddleware = action[RSAA];

    if (!apiMiddleware) {
      return next(action);
    }

    return next({
      [RSAA]: {
        ...apiMiddleware,
        endpoint: parametriseEndpoint(apiMiddleware),
      },
    });
  };
}
