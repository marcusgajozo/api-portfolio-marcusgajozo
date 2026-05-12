import { Filterable, FilterableField } from '../filterable.decorator';

describe('Filterable Decorator', () => {
  class BaseTestClass {
    @Filterable()
    baseField: string;
  }

  class TestClass2 {
    @Filterable()
    name2: string;

    @Filterable()
    createdAt2: Date;
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
    const fields = Reflect.getMetadata('filterable', TestClass.prototype) as
      | FilterableField[]
      | undefined;

    expect(fields).toHaveLength(4);
  });
});
