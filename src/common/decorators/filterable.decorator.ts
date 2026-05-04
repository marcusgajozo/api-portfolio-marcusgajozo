import 'reflect-metadata';

export const FILTERABLE_FIELDS_KEY = 'custom:filterable_fields';

interface FilterableField {
  propertyKey: string | symbol;
  type: unknown;
}

export function Filterable(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const type: unknown = Reflect.getMetadata(
      'design:type',
      target,
      propertyKey,
    );

    const constructor = (target as { constructor: object }).constructor;

    const existingFields: FilterableField[] =
      (Reflect.getMetadata(FILTERABLE_FIELDS_KEY, constructor) as
        | FilterableField[]
        | undefined) ?? [];

    existingFields.push({ propertyKey, type });

    Reflect.defineMetadata(FILTERABLE_FIELDS_KEY, existingFields, constructor);
  };
}
