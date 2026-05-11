import 'reflect-metadata';
import { Type } from '@nestjs/common';

export const SORTABLE_KEY = 'sortable_fields';

export interface SortableMetadata {
  name: string;
  typeFn?: () => Type<any>;
}

export function Sortable(typeFn?: () => Type<any>): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const sortableFields: SortableMetadata[] =
      (Reflect.getMetadata(SORTABLE_KEY, target) as
        | SortableMetadata[]
        | undefined) ?? [];

    const fieldName = propertyKey.toString();

    const newSortableField = [...sortableFields];

    if (!newSortableField.find((f) => f.name === fieldName)) {
      newSortableField.push({ name: fieldName, typeFn });
    }

    Reflect.defineMetadata(SORTABLE_KEY, newSortableField, target);
  };
}
