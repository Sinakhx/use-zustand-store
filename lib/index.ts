/* eslint-disable @typescript-eslint/no-explicit-any */
import create from 'zustand';
import { useRef } from 'react';
import * as O from 'optics-ts';
import { createTrackedSelector } from 'react-tracked';
import type { StoreApi, UseBoundStore, StateCreator, State, StoreMutatorIdentifier } from 'zustand';

type StoreFactory<T extends State> = () => UseBoundStore<StoreApi<T>>;

// custom hook to create a zustand store which cleans up on component unmount
const useZustandStoreCreator = <T extends State>(storeFactory: StoreFactory<T>) => {
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
    <
        T extends State,
        Mis extends [StoreMutatorIdentifier, unknown][] = [],
        Mos extends [StoreMutatorIdentifier, unknown][] = [],
        U = T,
    >(
        storeFactory: StateCreator<T, Mis, Mos, U>,
    ) =>
    () =>
        create<T, Mos>(storeFactory as any);

/**
 * creates a component-scoped Zustand store which gets cleaned up when the component unmounts
 * @param storeFactory a function that returns a zustand store
 * @returns a custom hook for handling application stores using Zustand
 */
const useZustandStore = <T extends State>(storeFactory: StoreFactory<T>) => useZustandStoreCreator(storeFactory)();

/**
 * immutable store-mutator function to update the store
 * @param target the target object to which the store will be attached
 * @returns an immer-like store mutator function but with optics-ts
 */
const produce = <Store = Record<string, any>>(target: string) => O.modify(O.optic_<Store>().path(target));

/**
 * updates an store item/field by a single key-value object
 * @param obj the object representing a new item in the store
 * @returns the updated store
 */
const mutateStoreItem = (obj: Record<string, unknown>) => {
    const key = Object.keys(obj)[0];
    return produce(key)(() => obj[key]);
};

const Optics = O;

// exports
export { createContainer, getUntrackedObject, memo } from 'react-tracked';
export { combine, devtools, persist, redux, subscribeWithSelector } from 'zustand/middleware';
export { default as shallow } from 'zustand/shallow';
export { createZustandStore, useZustandStore, createTrackedSelector, produce, mutateStoreItem, Optics };
export default create;
