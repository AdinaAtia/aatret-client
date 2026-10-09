import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface Rabbi {
  id: number;
  name: string;
}

interface RabbisContextType {
  rabbis: Rabbi[];
  refreshRabbis: () => Promise<void>;
}

const RabbisContext = createContext<RabbisContextType>({
  rabbis: [],
  refreshRabbis: async () => {},
});

export const useRabbis = () => useContext(RabbisContext);

export const RabbisProvider = ({ children }: { children: ReactNode }) => {
  const [rabbis, setRabbis] = useState<Rabbi[]>([]);

  const refreshRabbis = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/rabbis?fields[0]=name`);
      const data = response.data.data || [];
      const list = data.map((r: any) => ({ id: r.id, name: r.attributes?.name || r.name }));
      setRabbis(list.sort((a: Rabbi, b: Rabbi) => {
        if (a.name.includes('מרדכי עטייה')) return -1;
        if (b.name.includes('מרדכי עטייה')) return 1;
        return a.name.localeCompare(b.name, 'he');
      }));
    } catch (error) {
      console.error('Error fetching rabbis:', error);
    }
  }, []);

  useEffect(() => {
    refreshRabbis();
  }, [refreshRabbis]);

  return (
    <RabbisContext.Provider value={{ rabbis, refreshRabbis }}>
      {children}
    </RabbisContext.Provider>
  );
};
