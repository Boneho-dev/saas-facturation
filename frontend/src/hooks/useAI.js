import { useState } from 'react';
import { aiService } from '../services/aiService.js';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (description) => {
    setLoading(true);
    setError(null);
    try {
      const { lines } = await aiService.generateLines(description);
      return lines;
    } catch (err) {
      const msg = err.response?.data?.error || 'Erreur lors de la génération IA.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error };
}
