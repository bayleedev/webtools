```
interface ImageFaye {
  images: Image[]
}

interface Image {
  frames: Frame[]
  selection?: Selection
}

interface Selection {
  topX: number
  topY: number
  data: Uint8Array[]
}

interface Frame {
  layers: Layer[]
}

interface Layer {
  width: number
  height: number
  data: Uint8Array[]
}
```

```
interface RGBAColor {
  red: number
  green: number
  blue: number
  alpha: number
}
type ColorArr = number[]
type Color = RGBAColor | ColorArr
type IteratorFn = (color: Color, change: Change) => Change
interface Change {
  set: (x: number, y: number, color: Color) => Change
  hasChanged: (x: number, y: number) => boolean
  commit: () => boolean
  iterate: (selection: Selection, iterator: IteratorFn) => Change
}

interface Tool {
  icon: string
}
```

```
// Transparent the 100x100 square in the top left
faye.images[0]
  .select(SQUARE, 0, 0, 100, 100)
  .delete()
  .commit()

// Transparent the top left corner
faye.images[0]
  .select(MAGIC_WAND, 0, 0)
  .delete()
  .commit()
```
