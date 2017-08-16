# `loggingMiddleware([options])`

Redoodle provides a `loggingMiddleware()` function which adds beautiful logs for all of your Redux actions:

![logging-output-example](TODO:diagram)

It is extensible, allowing for more careful unrolling or messaging around your application's actions.
By default, `loggingMiddleware()` will unroll compound actions into a format that's more consumable, as above.

#### TypeScript definition

```ts
function loggingMiddleware(options?: LoggingMiddlewareOptions): Middleware;
```

```ts
interface LoggingHandlerArgs {
    previousState: any;
    nextState: any;
    action: Action;
}

interface LoggingHandler {
    accept: (action: Action) => boolean;
    log: (args: LoggingHandlerArgs) => void;
}

interface LoggingMiddlewareOptions {
  enableInProduction?: boolean;
  handlers?: LoggingHandler[];
  ignore?: string[] | ((action: Action) => boolean);
  includeStackTraces?: boolean | ((action: Action) => boolean);
  prettyPrintSingleActions?: boolean;
}
```
