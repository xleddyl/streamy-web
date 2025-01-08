export const sleep = (seconds: number) =>
   new Promise((resolve) => {
      setTimeout(() => resolve(null), seconds * 1000)
   })
