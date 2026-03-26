# ⚡ Bolt: Performance Journal

## Optimization 1: Contract Lookup Caching
- **Target**: `src/lib/contract-interactions.ts`
- **Problem**: `findContract` performed an $O(N)$ linear search on every read-only call.
- **Solution**: Implemented an in-memory `Map` to cache resolved contract identifiers.
- **Impact**: Reduces CPU overhead for high-frequency telemetry calls. Lookups are now $O(1)$ after the first hit.

## Optimization 2: Token Balance Mapping
- **Target**: `src/components/ui/TokenSelect.tsx`
- **Problem**: `getBalance` performed a linear search through the balances array for every token in the listbox during render ($O(T \times B)$).
- **Solution**: Used `useMemo` to construct a balance `Map` when the balances array changes.
- **Impact**: Improves listbox render performance from $O(T \times B)$ to $O(T + B)$.

## Optimization 3: Perceived Performance (UI Stability)
- **Target**: `src/app/page.tsx`
- **Problem**: Setting `loading(true)` on every 30s refresh caused the dashboard to flicker back to skeleton states.
- **Solution**: Only trigger full loading state if initial data is missing.
- **Impact**: Smoother real-time updates without visual disruption.
