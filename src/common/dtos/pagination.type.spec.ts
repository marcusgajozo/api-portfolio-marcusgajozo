import { getDesignType } from '@/test/utils/get-design-type.util';
import { createPaginationType } from './pagination.type';
import { TypeMetadataStorage } from '@nestjs/graphql';
import { LazyMetadataStorage } from '@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage.js';

describe('(Unit test) pagination.type.ts', () => {
  class BaseClass {
    test1: string;
    test2: number;
  }

  class BaseClassPaginationType extends createPaginationType(BaseClass) {}

  describe('createPaginationType', () => {
    it('deve criar classes paginadas com os nomes corretos', () => {
      expect(BaseClassPaginationType.name).toBe('BaseClassPaginationType');

      type ClassConstructor = new (...args: unknown[]) => unknown;

      const getTypeFunction = getDesignType(
        'design:type:fn',
        BaseClassPaginationType.prototype,
        'edges',
      ) as (() => ClassConstructor | ClassConstructor[]) | undefined;

      if (getTypeFunction) {
        const typeResult = getTypeFunction();
        const EdgeTypeClass = Array.isArray(typeResult)
          ? typeResult[0]
          : typeResult;
        expect(EdgeTypeClass.name).toBe('BaseClassEdgeType');
      }
    });

    it('deve ter o decorador @ObjectType GraphQL na classe', () => {
      const objectTypes = TypeMetadataStorage.getObjectTypesMetadata();

      const objectType = objectTypes.find((type) => {
        return type.name === BaseClassPaginationType.name;
      });

      expect(objectType).toBeDefined();
    });

    it('deve ter os campos corretos', () => {
      LazyMetadataStorage.load([BaseClassPaginationType]);

      const objectTypes = TypeMetadataStorage.getObjectTypesMetadata();

      const objectType = objectTypes.find((type) => {
        return type.name === BaseClassPaginationType.name;
      });

      TypeMetadataStorage.compileClassMetadata(objectType ? [objectType] : []);

      const fields = objectType?.properties || [];

      const edgesField = fields.find((field) => field.name === 'edges');
      const pageInfoField = fields.find((field) => field.name === 'pageInfo');
      const totalCountField = fields.find(
        (field) => field.name === 'totalCount',
      );

      expect(edgesField).toBeDefined();
      expect(pageInfoField).toBeDefined();
      expect(totalCountField).toBeDefined();
    });

    it('deve criar uma instância paginada com dados', () => {
      const pageInfo = {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'a',
        endCursor: 'b',
      };
      const edge = { node: { test1: 'foo', test2: 1 }, cursor: 'abc' };
      const paginationInstance = new BaseClassPaginationType();
      paginationInstance.edges = [edge];
      paginationInstance.pageInfo = pageInfo;
      paginationInstance.totalCount = 1;

      expect(paginationInstance.edges).toEqual([edge]);
      expect(paginationInstance.pageInfo).toEqual(pageInfo);
      expect(paginationInstance.totalCount).toBe(1);
    });
  });
});
