import 'reflect-metadata';

export const SORTABLE_KEY = 'sortable_fields';

export function Sortable(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const sortableFields: string[] =
      (Reflect.getMetadata(SORTABLE_KEY, target) as string[] | undefined) ?? [];

    const fieldName = propertyKey.toString();

    const newFields = [...sortableFields];

    if (!newFields.includes(fieldName)) {
      newFields.push(fieldName);
    }

    Reflect.defineMetadata(SORTABLE_KEY, newFields, target);
  };
}
