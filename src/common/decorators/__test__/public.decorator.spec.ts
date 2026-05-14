import { IS_PUBLIC_KEY, Public } from '../public.decorator';

describe('(Unit test) @Public', () => {
  @Public()
  class TestMethod {
    @Public()
    myRouteHandler(this: void) {}
  }

  it('deve definir o metadado isPublic como true em um método', () => {
    const isPublic = Reflect.getMetadata(
      IS_PUBLIC_KEY,
      TestMethod.prototype.myRouteHandler,
    ) as boolean | undefined;

    expect(isPublic).toBe(true);
  });

  it('deve definir o metadado isPublic como true na classe', () => {
    const isPublic = Reflect.getMetadata(
      IS_PUBLIC_KEY,
      TestMethod.prototype.constructor,
    ) as boolean | undefined;

    console.log('isPublic:', isPublic);

    expect(isPublic).toBe(true);
  });
});
