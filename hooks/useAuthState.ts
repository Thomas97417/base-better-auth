import { useCallback, useState } from "react";

interface AuthState {
  loading: boolean;
  error?: string;
  success?: string;
}

const initialState: AuthState = {
  loading: false,
  error: "",
  success: "",
};

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>(initialState);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string) => {
    setState((prev) => ({ ...prev, error, success: "" }));
  }, []);

  const setSuccess = useCallback((success: string) => {
    setState((prev) => ({ ...prev, success, error: "" }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setError,
    setSuccess,
    setLoading,
    resetState,
  };
};
