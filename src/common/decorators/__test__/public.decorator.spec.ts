import { IS_PUBLIC_KEY, Public } from '../public.decorator';

describe('(Unit test) @Public', () => {
  @Public()
  class TestMethod {
    @Public()
    myRouteHandler(this: void) {}
  }

  it('should must set the isPublic metadata to true in a method', () => {
    const isPublic = Reflect.getMetadata(
      IS_PUBLIC_KEY,
      TestMethod.prototype.myRouteHandler,
    ) as boolean | undefined;

    expect(isPublic).toBe(true);
  });

  it('should set the isPublic metadata to true in a class', () => {
    const isPublic = Reflect.getMetadata(
      IS_PUBLIC_KEY,
      TestMethod.prototype.constructor,
    ) as boolean | undefined;

    expect(isPublic).toBe(true);
  });
});
