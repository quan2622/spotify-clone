import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAlbumStore } from "../stores/useAlbumStore";

interface AlbumLazyState {
  page: number;
  loading: boolean;
  initialLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

interface UseCachingAlbumLazyOptions {
  pageSize?: number;
  threshold?: number;
  rootMargin?: string;
  debounceDelay?: number;
  enabled?: boolean;
}

const useCachingAlbumLazy = ({
  pageSize = 10,
  threshold = 0.1,
  rootMargin = '100px',
  debounceDelay = 300,
  enabled = true,
}: UseCachingAlbumLazyOptions = {}) => {
  const { fetchDataNewRelease, releaseAlbum } = useAlbumStore();

  const [state, setState] = useState<AlbumLazyState>({
    page: 1,
    loading: false,
    initialLoading: true,
    hasMore: true,
    error: null,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const debouncedLoadRef = useRef<ReturnType<typeof debounce> | null>(null);

  const storeData = releaseAlbum || [];

  const createDebouncedLoad = useCallback(() => {
    return debounce(async (page: number) => {
      setState(prev => {
        if (!enabled || prev.loading) return prev;
        return {
          ...prev,
          loading: true,
          error: null
        };
      });

      try {
        const result = await fetchDataNewRelease(page, pageSize);

        setState(prev => ({
          ...prev,
          loading: false,
          initialLoading: false,
          hasMore: result.hasMore,
          page: page,
          error: null,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          initialLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    }, debounceDelay);
  }, [fetchDataNewRelease, pageSize, enabled, debounceDelay]);


  useEffect(() => {
    debouncedLoadRef.current = createDebouncedLoad();

    return () => {
      if (debouncedLoadRef.current) {
        debouncedLoadRef.current.cancel();
      }
    };
  }, [createDebouncedLoad]);

  const loadMore = useCallback(() => {
    if (!state.hasMore || state.loading || !debouncedLoadRef.current) return;
    debouncedLoadRef.current(state.page + 1);
  }, [state.hasMore, state.loading, state.page]);

  // Intersection Observer
  useEffect(() => {
    if (!enabled || !triggerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && state.hasMore && !state.loading) {
        loadMore();
      }
    }, {
      threshold,
      rootMargin,
    });

    observer.observe(triggerRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, state.hasMore, state.loading, enabled, threshold, rootMargin]);

  // Initial load
  useEffect(() => {
    if (enabled && storeData.length === 0 && state.initialLoading && debouncedLoadRef.current) {
      debouncedLoadRef.current(1);
    }
  }, [enabled, storeData.length, state.initialLoading]);

  const refresh = useCallback(() => {
    // Cancel any pending debounced calls
    if (debouncedLoadRef.current) {
      debouncedLoadRef.current.cancel();
    }

    setState({
      page: 1,
      loading: false,
      initialLoading: true,
      hasMore: true,
      error: null
    });

    // Trigger fresh load
    if (debouncedLoadRef.current) {
      debouncedLoadRef.current(1);
    }
  }, []);

  const retry = useCallback(() => {
    if (state.error && debouncedLoadRef.current) {
      setState(prev => ({ ...prev, error: null }));
      debouncedLoadRef.current(state.page);
    }
  }, [state.error, state.page, debouncedLoadRef]);

  return {
    data: storeData,
    loading: state.loading,
    initialLoading: state.initialLoading,
    hasMore: state.hasMore,
    error: state.error,

    loadMore,
    refresh,
    retry,

    triggerRef,

    // Computed values
    isEmpty: storeData.length === 0 && !state.initialLoading,
    isEnd: !state.hasMore && storeData.length > 0,
    currentPage: state.page,
    totalItems: storeData.length,
  };
};

export default useCachingAlbumLazy;