import { ImageDataUtil } from './ImageFrame';

describe('.PxToIndex', () => {
  describe('given a 3x3 Image Data', () => {
    const imageData: any = {
      width: 3,
      height: 3,
    }
    const badPixels = [
      [0,0],
      [1,0],
      [0,1],
      [1,4],
      [4,1],
    ]
    badPixels.forEach(([x, y]) => {
      it(`throws for too x:${x}, y:${y}`, () => {
        expect(() => {
          ImageDataUtil.pxToIndex({
            x,
            y,
            data: imageData
          })
        }).toThrow(RangeError)
      })
    })
    it('gets first index', () => {
      const startIdx = ImageDataUtil.pxToIndex({
        x: 1,
        y: 1,
        data: imageData
      })
      expect(startIdx).toEqual(0);
    });
    it('gets middle index', () => {
      const startIdx = ImageDataUtil.pxToIndex({
        x: 2,
        y: 2,
        data: imageData
      })
      expect(startIdx).toEqual(16);
    });
    it('gets last index', () => {
      const startIdx = ImageDataUtil.pxToIndex({
        x: 3,
        y: 3,
        data: imageData
      })
      expect(startIdx).toEqual(32);
    });
  });
});
