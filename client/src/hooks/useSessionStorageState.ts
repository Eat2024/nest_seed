import { SetStateAction, useCallback, useSyncExternalStore } from "react";

// 用法同 useState，但值會同步到 sessionStorage：
// 同一個瀏覽器分頁內切換頁面再回來，狀態還在；關閉分頁即清空。
// 用 useSyncExternalStore 而不是「useEffect 裡 setState 還原」，
// 避免 mount 後多一次連鎖渲染（react-hooks/set-state-in-effect），
// SSR 時 server 端走 getServerSnapshot 回傳初始值，hydration 由 React 處理。

// setValue 時通知訂閱同一個 key 的所有元件重新讀取
const listeners = new Map<string, Set<() => void>>();

// getSnapshot 每次 render 都會被呼叫且必須回傳穩定的參考（否則無限重繪），
// 所以快取「原始字串 → 解析結果」，字串沒變就回傳同一個物件
const cache = new Map<string, { raw: string | null; value: unknown }>();

const emit = (key: string) => listeners.get(key)?.forEach((notify) => notify());

const read = <T>(key: string, fallback: T): T => {
  const raw = sessionStorage.getItem(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      // 壞資料當作沒存過，維持 fallback
    }
  }
  cache.set(key, { raw, value });
  return value;
};

export function useSessionStorageState<T>(key: string, initialValue: T) {
  const subscribe = useCallback(
    (notify: () => void) => {
      let set = listeners.get(key);
      if (!set) {
        set = new Set();
        listeners.set(key, set);
      }
      set.add(notify);
      return () => set.delete(notify);
    },
    [key],
  );

  const value = useSyncExternalStore(
    subscribe,
    () => read(key, initialValue),
    () => initialValue,
  );

  const setValue = useCallback(
    (action: SetStateAction<T>) => {
      const next =
        typeof action === "function"
          ? (action as (prev: T) => T)(read(key, initialValue))
          : action;
      cache.set(key, { raw: JSON.stringify(next), value: next });
      sessionStorage.setItem(key, JSON.stringify(next));
      emit(key);
    },
    // 依賴 initialValue 是給 updater function 算 prev 用；
    // 呼叫端若以 inline 字面值傳入，setValue 參考會每次 render 變動，目前用法無影響
    [key, initialValue],
  );

  return [value, setValue] as const;
}
