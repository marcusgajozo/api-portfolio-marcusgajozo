import { BadRequestException } from '@nestjs/common';
import { HydratedDocument, Model, QueryFilter, Types } from 'mongoose';
import { PaginationInput } from '../dtos/pagination.input';
import { EdgeShape, PaginationShape } from '../dtos/pagination.type';
import { BaseSchema } from '../schemas/base.schema';
import { SortingInput } from '../types/sorting-input.type';
import {
  StringFilter,
  BooleanFilter,
  DateFilter,
  FilterType,
  NumberFilter,
} from '../types/filter-input.type';
import { SortDirection } from '../enums/sort-direction.enum';

type FilterPrimitive = string | number | boolean | Date;
type FilterObject = { [key: string]: FilterValue | undefined };
type FilterValue = FilterPrimitive | FilterPrimitive[] | FilterObject;

export type FilterOperatorKeys =
  | keyof StringFilter
  | keyof NumberFilter
  | keyof DateFilter
  | keyof BooleanFilter;

type PaginateParams<T extends BaseSchema> = {
  model: Model<HydratedDocument<T>>;
  pagination?: PaginationInput;
  filter?: FilterType<T>;
  sorting?: SortingInput[];
};

export class PaginationHelper {
  private static readonly OPERATORS: readonly FilterOperatorKeys[] = [
    'eq',
    'ne',
    'gt',
    'gte',
    'lt',
    'lte',
    'in',
    'like',
    'ilike',
  ];

  private static escapeRegex(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  private static buildMongoQuery<T>(
    filterInput?: FilterType<T>,
  ): QueryFilter<T> {
    if (!filterInput || Object.keys(filterInput).length === 0) {
      return {};
    }

    const query: Record<string, Record<string, unknown>> = {};

    const processNode = (node: FilterValue | undefined, path: string) => {
      if (!node || typeof node !== 'object' || Array.isArray(node)) return;

      const keys = Object.keys(node);
      const isOperatorNode = keys.some((key) =>
        this.OPERATORS.includes(key as FilterOperatorKeys),
      );

      if (isOperatorNode) {
        query[path] = {};
        const target = query[path];

        const entries = Object.entries(node) as [FilterOperatorKeys, unknown][];

        for (const [operator, value] of entries) {
          if (value === undefined || value === null) continue;

          if (operator === 'like') {
            target['$regex'] = new RegExp(this.escapeRegex(value as string));
            continue;
          }

          if (operator === 'ilike') {
            target['$regex'] = new RegExp(
              this.escapeRegex(value as string),
              'i',
            );
            continue;
          }

          const mongoOperator = `$${operator}`;

          target[mongoOperator] = value;
        }
        return;
      }

      for (const [key, value] of Object.entries(node)) {
        const newPath = path ? `${path}.${key}` : key;
        processNode(value as unknown as FilterValue, newPath);
      }
    };

    for (const [key, value] of Object.entries(filterInput)) {
      processNode(value as unknown as FilterValue, key);
    }

    return query as QueryFilter<T>;
  }

  static async paginate<T extends BaseSchema>({
    model,
    pagination,
    filter,
    sorting,
  }: PaginateParams<T>): Promise<PaginationShape<T>> {
    const { after, first = 10, before, last = 10 } = pagination || {};

    const safeFirst = Math.min(Math.max(first, 1), 50);
    const safeLast = Math.min(Math.max(last, 1), 50);
    const safeLimit = after ? safeFirst : before ? safeLast : safeFirst;

    const baseQuery = this.buildMongoQuery<T>(filter);
    const mongoSort = this.buildMongoSort(sorting);

    const paginationQuery: QueryFilter<HydratedDocument<T>> = {
      ...baseQuery,
    };

    if (before) {
      const decodedId = this.decodeCursor(before);
      if (!Types.ObjectId.isValid(decodedId)) {
        throw new BadRequestException('Cursor invalido');
      }
      paginationQuery._id = { $lt: new Types.ObjectId(decodedId) };
    }

    if (after) {
      const decodedId = this.decodeCursor(after);
      if (!Types.ObjectId.isValid(decodedId)) {
        throw new BadRequestException('Cursor invalido');
      }
      paginationQuery._id = { $gt: new Types.ObjectId(decodedId) };
    }

    const docs = await model
      .find(paginationQuery)
      .sort(mongoSort)
      .limit(safeLimit + 1)
      .exec();

    const hasNextPage = docs.length > safeLimit;
    const pageDocs = hasNextPage ? docs.slice(0, safeLimit) : docs;

    const edges: EdgeShape<T>[] = pageDocs.map((doc) => ({
      node: doc.toObject() as T,
      cursor: this.encodeCursor(doc._id.toString()),
    }));

    const totalCount = await model.countDocuments(baseQuery).exec();

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: Boolean(after),
        startCursor: edges.length ? edges[0].cursor : null,
        endCursor: edges.length ? edges[edges.length - 1].cursor : null,
      },
      totalCount,
    };
  }

  private static encodeCursor(id: string): string {
    return Buffer.from(id, 'utf8').toString('base64');
  }

  private static decodeCursor(cursor: string): string {
    try {
      return Buffer.from(cursor, 'base64').toString('utf8');
    } catch {
      throw new BadRequestException('Cursor invalido');
    }
  }

  private static buildMongoSort(
    sorting?: SortingInput[],
  ): Record<string, 1 | -1> {
    const sortObject: Record<string, 1 | -1> = {};

    if (sorting && sorting.length > 0) {
      for (const sort of sorting) {
        sortObject[sort.field] = sort.direction === SortDirection.DESC ? -1 : 1;
      }
    }

    if (!sortObject['_id']) {
      sortObject['_id'] = 1;
    }

    return sortObject;
  }
}
