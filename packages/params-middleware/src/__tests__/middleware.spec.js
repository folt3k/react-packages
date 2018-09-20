import { RSAA } from 'redux-api-middleware';

import paramsMiddleware from '../middleware';

describe('Params middleware', () => {
  test('handles only RSAA', () => {
    const next = jest.fn();

    paramsMiddleware()(next)({
      type: 'FOO',
    });

    expect(next).toHaveBeenCalledWith({
      type: 'FOO',
    });
  });

  test('parametrises endpoint unless it is a function', () => {
    const next = jest.fn();

    paramsMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        endpoint: '/foo',
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        foo: 'bar',
        endpoint: '/foo',
      }),
    });

    paramsMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        endpoint: '/foo',
        types: [
          {
            type: 'REQUEST',
            meta: {},
          },
          'SUCCESS',
          'FAILURE',
        ],
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        foo: 'bar',
        endpoint: '/foo',
      }),
    });

    paramsMiddleware()(next)({
      [RSAA]: {
        foo: 'bar',
        endpoint: '/foo',
        types: [
          {
            type: 'REQUEST',
            meta: {
              params: {
                foo: 'bar',
                bar: ['baz', 'qaz'],
                baz: null,
                qux: undefined,
                quux: 0,
                quuz: false,
              },
            },
          },
          'SUCCESS',
          'FAILURE',
        ],
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        foo: 'bar',
        endpoint: '/foo?foo=bar&bar%5B%5D=baz&bar%5B%5D=qaz&quux=0&quuz=false',
      }),
    });

    const endpoint = () => '/foo';

    paramsMiddleware()(next)({
      [RSAA]: {
        endpoint,
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
      },
    });

    expect(next).toHaveBeenCalledWith({
      [RSAA]: expect.objectContaining({
        endpoint,
      }),
    });
  });
});
