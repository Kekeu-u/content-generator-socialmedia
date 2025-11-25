import { useState, useEffect } from "react";

/**
 * Custom hook para debounce de valores
 * Útil para otimizar chamadas de API em campos de busca
 *
 * @param value - Valor a ser "debounced"
 * @param delay - Delay em milissegundos (padrão: 500ms)
 * @returns Valor com debounce aplicado
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // Executar busca apenas após 500ms sem mudanças
 *   if (debouncedSearch) {
 *     fetchSearchResults(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
