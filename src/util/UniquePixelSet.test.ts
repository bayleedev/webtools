import { UniquePixelSet } from './UniquePixelSet';

describe('UniquePixelSet', () => {
  it('does not add the same item twice', () => {
    // Setup
    const pxSet = new UniquePixelSet()
    expect([...pxSet.iterator.values()].length).toEqual(0)

    // add two new
    pxSet.add({
      x: 1,
      y: 1,
    })
    pxSet.add({
      x: 3,
      y: 3,
    })
    expect([...pxSet.iterator.values()].length).toEqual(2)

    // add a duplciate, and a new
    pxSet.add({
      x: 1,
      y: 1,
    })
    pxSet.add({
      x: 2,
      y: 2,
    })
    expect([...pxSet.iterator.values()].length).toEqual(3)
  })
})
