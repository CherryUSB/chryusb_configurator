
export { }

declare global {
  interface Window {
    removeLoading: () => void
  }
}

declare function $t(key:string, params?:any):string
