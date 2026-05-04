import { BadRequestException } from '@nestjs/common';
import { HydratedDocument, Model, QueryFilter, Types } from 'mongoose';
import { PaginationInput } from '../dtos/pagination.input';
import { EdgeShape, PaginationShape } from '../dtos/pagination.type';
import { BaseSchema } from '../schemas/base.schema';

type FilterPrimitive = string | number | boolean | Date;
type FilterValue = FilterPrimitive | FilterPrimitive[] | FilterObject;
type FilterObject = { [key: string]: FilterValue | undefined };

type MongoOperatorValue = {
  $eq?: unknown;
  $ne?: unknown;
  $gt?: unknown;
  $gte?: unknown;
  $lt?: unknown;
  $lte?: unknown;
  $in?: unknown;
  $nin?: unknown;
  $regex?: RegExp;
};
type MongoQuery = { [key: string]: MongoOperatorValue | MongoQuery };

type PaginateParams<T extends BaseSchema> = {
  model: Model<HydratedDocument<T>>;
  pagination?: PaginationInput;
  filter?: Record<string, any>;
  sorting?: { [P in keyof T]?: 1 | -1 };
};

export class PaginationHelper {
  private static readonly OPERATORS = [
    'eq',
    'ne',
    'gt',
    'gte',
    'lt',
    'lte',
    'in',
    'nin',
    'like',
    'ilike',
  ];

  private static escapeRegex(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  private static buildMongoQuery<T>(
    filterInput?: Record<string, any>,
  ): QueryFilter<T> {
    if (!filterInput || Object.keys(filterInput).length === 0) {
      return {};
    }

    const query: MongoQuery = {};

    const processNode = (node: FilterValue | undefined, path: string) => {
      if (!node || typeof node !== 'object' || Array.isArray(node)) return;

      const keys = Object.keys(node);
      const isOperatorNode = keys.some((key) => this.OPERATORS.includes(key));

      if (isOperatorNode) {
        query[path] = {};
        const target = query[path] as Record<string, unknown>;

        for (const [operator, value] of Object.entries(node)) {
          if (value === undefined || value === null) continue;

          switch (operator) {
            case 'eq':
              target.$eq = value;
              break;
            case 'ne':
              target.$ne = value;
              break;
            case 'gt':
              target.$gt = value;
              break;
            case 'gte':
              target.$gte = value;
              break;
            case 'lt':
              target.$lt = value;
              break;
            case 'lte':
              target.$lte = value;
              break;
            case 'in':
              target.$in = value;
              break;
            case 'nin':
              target.$nin = value;
              break;
            case 'like':
              target.$regex = new RegExp(this.escapeRegex(String(value)));
              break;
            case 'ilike':
              target.$regex = new RegExp(this.escapeRegex(String(value)), 'i');
              break;
          }
        }

        if (Object.keys(target).length === 0) {
          delete query[path];
        }
      } else {
        for (const [key, value] of Object.entries(node)) {
          const newPath = path ? `${path}.${key}` : key;
          processNode(value, newPath);
        }
      }
    };

    for (const [key, value] of Object.entries(filterInput)) {
      processNode(value, key);
    }

    return query as QueryFilter<T>;
  }

  static async paginate<T extends BaseSchema>({
    model,
    pagination,
    filter,
  }: PaginateParams<T>): Promise<PaginationShape<T>> {
    const { after, first = 10, before, last = 10 } = pagination || {};

    const safeFirst = Math.min(Math.max(first, 1), 50);
    const safeLast = Math.min(Math.max(last, 1), 50);
    const safeLimit = after ? safeFirst : safeLast;

    const baseQuery = this.buildMongoQuery<HydratedDocument<T>>(filter);
    const paginationQuery: QueryFilter<HydratedDocument<T>> = { ...baseQuery };

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
      .sort({ _id: 1 })
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
}
