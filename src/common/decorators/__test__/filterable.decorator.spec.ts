import {
  Filterable,
  FILTERABLE_FIELDS_KEY,
  FilterableField,
} from '../filterable.decorator';

describe('Filterable Decorator', () => {
  class BaseTestClass {
    @Filterable()
    baseField: string;
  }

  class TestClass2 {
    @Filterable()
    name2: string;
  }

  class TestClass extends BaseTestClass {
    @Filterable()
    name: string;

    @Filterable()
    createdAt: Date;

    @Filterable()
    testClass2: TestClass2;
  }

  it('should have 4 filterable fields in TestClass', () => {
    const fields = Reflect.getMetadata(
      FILTERABLE_FIELDS_KEY,
      TestClass.prototype,
    ) as FilterableField[] | undefined;

    expect(fields).toHaveLength(4);
  });

  it('should have 1 filterable fields in BaseTestClass', () => {
    const fields = Reflect.getMetadata(
      FILTERABLE_FIELDS_KEY,
      BaseTestClass.prototype,
    ) as FilterableField[] | undefined;

    expect(fields).toHaveLength(1);
  });

  it('should have 1 filterable fields in TestClass2', () => {
    const fields = Reflect.getMetadata(
      FILTERABLE_FIELDS_KEY,
      TestClass2.prototype,
    ) as FilterableField[] | undefined;

    expect(fields).toHaveLength(1);
  });

  it('should have correct property keys and types in TestClass', () => {
    const fields = Reflect.getMetadata(
      FILTERABLE_FIELDS_KEY,
      TestClass.prototype,
    ) as FilterableField[] | undefined;

    expect(fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          propertyKey: 'name',
          type: String,
        }),
        expect.objectContaining({
          propertyKey: 'createdAt',
          type: Date,
        }),
        expect.objectContaining({
          propertyKey: 'testClass2',
          type: TestClass2,
        }),
        expect.objectContaining({
          propertyKey: 'baseField',
          type: String,
        }),
      ]),
    );
  });
});
