import {
  Sortable,
  SORTABLE_KEY,
  SortableMetadata,
} from '../sortable.decorator';

describe('Sortable Decorator', () => {
  describe('when applied', () => {
    class BaseTestClass {
      @Sortable()
      baseField: string;
    }

    class TestClass2 {
      @Sortable()
      name2: string;

      @Sortable()
      createdAt2: Date;
    }

    class TestClass extends BaseTestClass {
      @Sortable()
      name: string;

      @Sortable()
      createdAt: Date;

      @Sortable()
      testClass2: TestClass2;
    }

    it('should register the field testClass2', () => {
      const fields = Reflect.getMetadata(
        SORTABLE_KEY,
        TestClass.prototype,
      ) as SortableMetadata[];

      expect(fields.some((f) => f.name === 'testClass2')).toBe(true);
    });

    it('should accumulate multiple fields', () => {
      const fields = Reflect.getMetadata(
        SORTABLE_KEY,
        TestClass.prototype,
      ) as SortableMetadata[];
      expect(fields).toHaveLength(4);
    });

    it('should set type as String', () => {
      const fields = Reflect.getMetadata(
        SORTABLE_KEY,
        TestClass.prototype,
      ) as SortableMetadata[];
      const field = fields.find((f) => f.name === 'name');
      expect(field?.type).toBe(String);
    });

    it('should have 1 field from the base class', () => {
      const fields = Reflect.getMetadata(
        SORTABLE_KEY,
        BaseTestClass.prototype,
      ) as SortableMetadata[];
      expect(fields).toHaveLength(1);
    });
  });

  describe('deduplication', () => {
    it('should not register the same field twice', () => {
      const decorator = Sortable();
      const target = {};

      decorator(target, 'name');
      decorator(target, 'name');

      const fields: SortableMetadata[] = Reflect.getMetadata(
        SORTABLE_KEY,
        target,
      ) as SortableMetadata[];
      expect(fields).toHaveLength(1);
    });
  });
});
