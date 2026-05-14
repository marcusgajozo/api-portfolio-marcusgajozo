import { Filterable } from '../../decorators/filterable.decorator';
import { createFilterType } from '../filter-pagination.input';

describe('(Unit tests) FilterPaginationInput', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve gerar a classe na primeira chamada e usar o cache na segunda', () => {
    class TestClassCache {
      @Filterable()
      name: string;
    }

    const mapGetSpy = jest.spyOn(Map.prototype, 'get');
    const mapSetSpy = jest.spyOn(Map.prototype, 'set');

    const filterType1 = createFilterType(TestClassCache);

    expect(mapGetSpy).toHaveBeenCalledWith(TestClassCache);
    expect(mapSetSpy).toHaveBeenCalledWith(
      TestClassCache,
      expect.any(Function),
    );

    mapGetSpy.mockClear();
    mapSetSpy.mockClear();

    const filterType2 = createFilterType(TestClassCache);

    expect(mapGetSpy).toHaveBeenCalledWith(TestClassCache);
    expect(mapSetSpy).not.toHaveBeenCalled();

    expect(filterType1).toBe(filterType2);
  });

  it('deve criar um tipo de filtro com os campos decorados', () => {
    class TestClass {
      @Filterable()
      name: string;

      @Filterable()
      isActive: boolean;
    }

    const FilterTypeClass = createFilterType(TestClass);

    const nameField = Reflect.getMetadata(
      'design:type',
      FilterTypeClass.prototype,
      'name',
    );

    const isActiveField = Reflect.getMetadata(
      'design:type',
      FilterTypeClass.prototype,
      'isActive',
    );

    expect(nameField).toBe(String);
    expect(isActiveField).toBe(Boolean);
  });

  it('deve ignorar campos sem tipo de filtro correspondente');

  it('deve lidar com tipos de filtro aninhados');
});
