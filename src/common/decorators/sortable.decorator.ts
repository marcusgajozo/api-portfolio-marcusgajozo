import 'reflect-metadata';

export const SORTABLE_KEY = 'sortable_fields';
const TYPE_KEY = 'design:type';

export interface SortableMetadata {
  name: string;
  type: unknown;
}

export function Sortable(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const type: unknown = Reflect.getMetadata(TYPE_KEY, target, propertyKey);

    const sortableFields: SortableMetadata[] =
      (Reflect.getMetadata(SORTABLE_KEY, target) as
        | SortableMetadata[]
        | undefined) ?? [];

    const fieldName = propertyKey.toString();

    const newSortableField = [...sortableFields];

    if (!newSortableField.find((f) => f.name === fieldName)) {
      newSortableField.push({ name: fieldName, type });
    }

    Reflect.defineMetadata(SORTABLE_KEY, newSortableField, target);
  };
}
