import 'reflect-metadata';

export const getDesignType = Reflect.getMetadata as (
  metadataKey: string,
  target: object,
  propertyKey: string | symbol,
) => unknown;
