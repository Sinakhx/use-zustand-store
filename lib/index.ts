import create from 'zustand';
import { useRef } from 'react';
import { createTrackedSelector } from 'react-tracked';
import type { StoreApi, UseBoundStore, StateCreator } from 'zustand';

// custom hook to create a zustand store which cleans up on component unmount
const useZustandStoreCreator = <T extends object>(storeFactory: () => UseBoundStore<StoreApi<T>>) => {
    const ref = useRef<() => T>();
    if (!ref.current) {
        const useStore = storeFactory();
        const useTrackedStore = createTrackedSelector(useStore);
        ref.current = useTrackedStore;
    }
    return ref.current;
};

// typed curried store creator to avoid nesting
const createZustandStore =
    <T extends object>(storeFactory: StateCreator<T>) =>
    () =>
        create<T>()(storeFactory);

/**
 * creates a component-scoped Zustand store which gets cleaned up when the component unmounts
 * @param storeFactory a function that returns a zustand store
 * @returns a custom hook for handling application stores using Zustand
 */
const useZustandStore = <T extends object>(storeFactory: () => UseBoundStore<StoreApi<T>>) =>
    useZustandStoreCreator(storeFactory)();

export { combine, devtools, persist, redux, subscribeWithSelector } from 'zustand/middleware';
export { default as shallow } from 'zustand/shallow';
export { createZustandStore, useZustandStore, createTrackedSelector };
export default create;
