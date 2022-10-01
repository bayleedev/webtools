let count = 0
const unreliableHttpCall = (multiplier: boolean = false): Promise<number> => {
  return new Promise((resolve, reject) => {
    count++
    if (count === 1) {
      throw new Error('503 Sever Error')
    }
    if (multiplier) {
      return resolve(30)
    }
    return resolve(3)
  })
}

type FN_TYPE = (arg: boolean) => Promise<number>
const retry = (oleUnreliableFn: FN_TYPE, retries: number): FN_TYPE => {
  return (arg: boolean) => {
    if (retries <= 1) {
      return oleUnreliableFn(arg)
    }
    return oleUnreliableFn(arg).catch((e: any) => {
      console.log('Error Zero', e)
      const nextRetryFn: FN_TYPE = retry(oleUnreliableFn, retries-1)
      return nextRetryFn(arg)
    })
  }
}

const reliableHttpCall: FN_TYPE = retry(unreliableHttpCall, 3)

reliableHttpCall(true).then((result: number) => {
  console.log('Call One', result)
}).catch((e: any) => {
  console.log('Error One', e.message)
})

export {}
