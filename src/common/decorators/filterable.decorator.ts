import 'reflect-metadata';

export const FILTERABLE_FIELDS_KEY = 'custom:filterable_fields';
const TYPE_KEY = 'design:type';

export interface FilterableField {
  propertyKey: string | symbol;
  type: unknown;
}

export function Filterable(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const type: unknown = Reflect.getMetadata(TYPE_KEY, target, propertyKey);

    const existingFields: FilterableField[] =
      (Reflect.getMetadata(FILTERABLE_FIELDS_KEY, target) as
        | FilterableField[]
        | undefined) ?? [];

    const newFields = [...existingFields];

    const isDuplicate = newFields.some(
      (field) => field.propertyKey === propertyKey,
    );

    if (!isDuplicate) {
      newFields.push({ propertyKey, type });
    }

    Reflect.defineMetadata(FILTERABLE_FIELDS_KEY, newFields, target);
  };
}
