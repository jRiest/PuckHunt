// @flow
type SchemaType = {
  [key: string]: string | SchemaType
};

export type ExpressErrorHandlerType = (err: Error, req: any, rsp: any, next: any) => void | Promise<void>;

export type ExpressMiddlewareType = (req: any, rsp: any, next: any) => void | Promise<void>;

export type ExpressRouteType = (req: any, rsp: any) => Promise<void> & {
  inputSchema?: SchemaType,
  logLevel?: 'audit' | 'stats' | 'event' | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal',
};