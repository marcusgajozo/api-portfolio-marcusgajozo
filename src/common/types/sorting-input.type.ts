import { SortDirection } from '../enums/sort-direction.enum';

export interface SortingInput {
  field: string;
  direction: SortDirection;
}
