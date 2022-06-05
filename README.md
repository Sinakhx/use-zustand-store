# **@sinakhx/useZustandStore**
![npm](https://img.shields.io/npm/v/@sinakhx/use-zustand-store?color=%23b8860b&style=flat-square)
![license](https://img.shields.io/npm/l/@sinakhx/use-zustand-store?color=red&style=flat-square)
![types](https://img.shields.io/npm/types/@sinakhx/use-zustand-store?style=flat-square)

custom helpers for using [zustand](https://github.com/pmndrs/zustand) in react apps.
it can be used for creating local (component scoped) stores using Zustand. So that:
- you won't need to worry about garbage collecting your store on page components' unmount lifecycle.
- you can get rid of using multiple selectors to acces different parts of the store (as it's using [react-tracked](https://github.com/dai-shi/react-tracked) under the hood)
- you avoid making your codebase weird with currying, Providers, mind-boggling type annotations, etc.

## Installation
```bash
npm install @sinakhx/use-zustand-store
```

## Usage

Creating a store is exactly the same way as creating a store in Zustand. You only need to change Zustand's `create` function with this library's `createZustandStore` function. Everything else is the same. (It's just a wrapper to avoid nesting due to currying)

**Example counter app:**

*counterStore.ts*
```ts
import { createZustandStore } from '@sinakhx/use-zustand-store'

interface ICounterStore {
    count: number
    increment: () => void
}

export const counterStore = createZustandStore<ICounterStore>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
}))

```

*CounterComponent.tsx*
```tsx
import { useZustandStore } from '@sinakhx/use-zustand-store'
import { counterStore } from './counterStore'

const CounterComponent = () => {
    const store = useZustandStore(counterStore)
    return <button onClick={store.increment}>{store.count}</button>
}

export default CounterComponent
```

Now the store is bound to the component. By changing the page route (unmounting the component), the store gets garbage collected & by going back to the page (mounting the component again), a fresh store is created.

That's done! Happy coding!

<details>
<summary style="font-weight:bold;">Advanced usage: initializing store with props</summary>

*counterStore.ts*
```ts
import { createZustandStore } from '@sinakhx/use-zustand-store'

interface ICounterStore {
    count: number
    increment: () => void
}

interface ICounterProps {
    initialCount: number
}

export const counterStoreFactory = ({ initialCount } : ICounterProps) => createZustandStore<ICounterStore>((set) => ({
    count: initialCount,
    increment: () => set((state) => ({ count: state.count + 1 })),
}))

```

*CounterComponent.tsx*
```tsx
import { useZustandStore } from '@sinakhx/use-zustand-store'
import { counterStoreFactory } from './counterStore'

interface ICounterProps {
    initialCount: number
}

const CounterComponent = ({ initialCount }: ICounterProps) => {
    const store = useZustandStore(counterStoreFactory({ initialCount }))
    return <button onClick={store.increment}>{store.count}</button>
}

export default CounterComponent
```

</details>

<details>
<summary style="font-weight:bold;">Still need global stores in other scenarios? no problem!</summary>

In that case, you can create a global version of the `useZustandStore` hook by using the `createTrackedSelector` helper from [react-tracked](https://github.com/dai-shi/react-tracked)

*counterStore.ts*
```ts
import { createZustandStore, createTrackedSelector } from '@sinakhx/use-zustand-store'

interface ICounterStore {
    count: number
    increment: () => void
}

const counterStore = createZustandStore<ICounterStore>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
}))

export const useGlobalCounterStore = createTrackedSelector(counterStore())

```

*CounterComponent.tsx*
```tsx
// import { useZustandStore } from '@sinakhx/use-zustand-store'
import { useGlobalCounterStore } from './counterStore'

const CounterComponent = () => {
    const store = useGlobalCounterStore()
    return <button onClick={store.increment}>{store.count}</button>
}

export default CounterComponent
```

now the store is independent from the components & will keep its state regardless of the route changes.
</details>

<!--
____________________________________
### **Want More Examples?**
see the [tests folder][tests-url] for more detailed examples.
-->
____________________________________
### **Contributing**
Please feel free to open an issue or create a pull request to add a new feature or fix a bug. (see [contributing][contribution-url] for more details)

____________________________________

## **License**

The [MIT License][license-url] (MIT)

&copy; 2022 Sina Khodabandehloo

[tests-url]: https://github.com/Sinakhx/use-zustand-store/tree/main/__tests__/
[contribution-url]:  https://github.com/Sinakhx/use-zustand-store/blob/main/CONTRIBUTING.md
[changelog-url]:  https://github.com/Sinakhx/use-zustand-store/blob/main/CHANGELOG.md
[license-url]:  https://github.com/Sinakhx/use-zustand-store/blob/main/LICENSE
