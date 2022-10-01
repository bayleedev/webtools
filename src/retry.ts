const assert = (value: any, msg: string, data?: any) => {
  const msgAndDataArray = [
    msg,
    data
  ].filter(Boolean)

  if (value) {
    console.log('SUCCESS', ...msgAndDataArray)
  } else {
    console.log('FAILURE', ...msgAndDataArray)
  }
}

type FN_TYPE<A, R> = (arg: A) => Promise<R>

const retry = <A, R>(oleUnreliableFn: FN_TYPE<A, R>, retries: number): FN_TYPE<A, R> => {
  return (arg: A) => {
    if (retries < 1) {
      return oleUnreliableFn(arg)
    }
    return oleUnreliableFn(arg).catch((e: any) => {
      const nextRetryFn: FN_TYPE<A, R> = retry(oleUnreliableFn, retries-1)
      return nextRetryFn(arg)
    })
  }
}

const test_always_ok = () => {
  const unreliableHttpCall = (multiplier: boolean = false): Promise<number> => {
    return new Promise((resolve, reject) => {
      resolve(200)
    })
  }

  const reliableHttpCall: FN_TYPE<boolean, number> = retry(unreliableHttpCall, 3)

  reliableHttpCall(true).then((result: number) => {
    assert(true, 'test_always_ok')
  }).catch(() => {
    assert(false, 'test_always_ok')
  })
}

const test_always_throw = () => {
  const unreliableHttpCall = (multiplier: boolean = false): Promise<number> => {
    return new Promise((resolve, reject) => {
      throw Error('503 Server Error')
    })
  }
  const reliableHttpCall: FN_TYPE<boolean, number> = retry(unreliableHttpCall, 3)
  reliableHttpCall(true).then((result: number) => {
    assert(false, 'test_always_throw')
  }).catch((e) => {
    assert(true, 'test_always_throw')
  })
}

const test_retry_count = () => {
  let numberOfThrows = 0
  const unreliableHttpCall = (multiplier: boolean = false): Promise<number> => {
    return new Promise((resolve, reject) => {
      numberOfThrows++
      throw Error('503 Server Error')
    })
  }
  const numberOfRetries = 3
  const reliableHttpCall: FN_TYPE<boolean, number> = retry(unreliableHttpCall, numberOfRetries)
  reliableHttpCall(true).then((result: number) => {
    assert(false, 'test_retry_count')
  }).catch((e) => {
    assert(numberOfThrows === (numberOfRetries+1), 'test_retry_count', {
      numberOfThrows
    })
  })
}

const test_fail_once_then_success = () => {
  let numberOfThrows = 0
  let numberOfResolves = 0
  const unreliableHttpCall = (multiplier: boolean = false): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (numberOfThrows === 0) {
        numberOfThrows++
        throw Error('503 Server Error')
      }
      numberOfResolves++
      resolve(200)
    })
  }
  const reliableHttpCall: FN_TYPE<boolean, number> = retry(unreliableHttpCall, 100)

  reliableHttpCall(true).finally(() => {
    assert(numberOfResolves === 1 && numberOfThrows === 1, 'test_fail_once_then_success', {
      numberOfThrows,
      numberOfResolves,
    })
  })
}

const test_different_fn_signature = () => {
  interface Response {
    status: number
    body: string
  }
  const unreliableHttpCall = (url: string): Promise<Response> => {
    return new Promise((resolve, reject) => {
      resolve({
        status: 200,
        body: 'hello world',
      } as Response)
    })
  }

  const reliableHttpCall: FN_TYPE<string, Response> = retry(unreliableHttpCall, 100)

  reliableHttpCall('google.com').then((result: Response) => {
    assert(true, 'test_different_fn_signature')
  }).catch(() => {
    assert(false, 'test_different_fn_signature')
  })
}

test_always_ok()
test_always_throw()
test_retry_count()
test_fail_once_then_success()
test_different_fn_signature()

export {}
