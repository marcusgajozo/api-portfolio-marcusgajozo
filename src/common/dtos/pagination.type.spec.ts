import { getDesignType } from '@/test/utils/get-design-type';
import { createPaginationType } from './pagination.type';

describe('(Unit test) pagination.type.ts', () => {
  class BaseClass {
    test1: string;
    test2: number;
  }

  class BaseClassPaginationType extends createPaginationType(BaseClass) {}

  describe('createPaginationType', () => {
    it('deve criar classes paginadas com os nomes corretos', () => {
      expect(BaseClassPaginationType.name).toBe('BaseClassPaginationType');

      type ClassConstructor = new (...args: any[]) => any;

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

    it('deve ter os decoradores GraphQL corretos', () => {
      // TODO: Verificar se BaseClassPaginationType é um ObjectType
      // TODO: Verificar se 'edges' é um Field que retorna um array de EdgeType
      // TODO: Verificar se 'pageInfo' é um Field que retorna PageInfoType
      // TODO: Verificar se 'totalCount' é um Field que retorna Int
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
