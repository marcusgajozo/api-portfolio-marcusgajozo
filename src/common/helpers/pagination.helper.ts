import { BadRequestException } from '@nestjs/common';
import { HydratedDocument, Model, QueryFilter, Types } from 'mongoose';
import { PaginationInput } from '../dtos/pagination.input';
import { EdgeShape, PaginationShape } from '../dtos/pagination.type';
import { BaseSchema } from '../schemas/base.schema';

type PaginateParams<T extends BaseSchema> = {
  model: Model<HydratedDocument<T>>;
  pagination: PaginationInput | null;
  filter?: QueryFilter<HydratedDocument<T>>;
};

export class PaginationHelper {
  static async paginate<T extends BaseSchema>({
    model,
    pagination,
    filter = {},
  }: PaginateParams<T>): Promise<PaginationShape<T>> {
    const { after, first = 10 } = pagination || {};

    const safeFirst = Math.min(Math.max(first, 1), 50);
    const query: QueryFilter<HydratedDocument<T>> = { ...filter };

    if (after) {
      const decodedId = this.decodeCursor(after);

      if (!Types.ObjectId.isValid(decodedId)) {
        throw new BadRequestException('Cursor invalido');
      }

      query._id = { $gt: new Types.ObjectId(decodedId) };
    }

    const docs = await model
      .find(query)
      .sort({ _id: 1 })
      .limit(safeFirst + 1)
      .exec();

    const hasNextPage = docs.length > safeFirst;
    const pageDocs = hasNextPage ? docs.slice(0, safeFirst) : docs;

    const edges: EdgeShape<T>[] = pageDocs.map((doc) => ({
      node: doc.toObject() as T,
      cursor: this.encodeCursor(doc._id),
    }));

    const totalCount = await model.countDocuments(filter).exec();

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
