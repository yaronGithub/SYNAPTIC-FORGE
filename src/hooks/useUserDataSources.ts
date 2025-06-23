import { useState, useEffect } from 'react';
import { supabase, UserDataSource } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useUserDataSources() {
  const { user } = useAuth();
  const [dataSources, setDataSources] = useState<UserDataSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDataSources();
    } else {
      setDataSources([]);
      setLoading(false);
    }
  }, [user]);

  const fetchDataSources = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_data_sources')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDataSources(data || []);
    } catch (error) {
      console.error('Error fetching data sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDataSource = async (name: string, content: string, type: string = 'text') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_data_sources')
        .insert({
          user_id: user.id,
          name,
          data_content: content,
          data_type: type,
        })
        .select()
        .single();

      if (error) throw error;
      
      setDataSources(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding data source:', error);
      throw error;
    }
  };

  const removeDataSource = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_data_sources')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setDataSources(prev => prev.filter(ds => ds.id !== id));
    } catch (error) {
      console.error('Error removing data source:', error);
      throw error;
    }
  };

  return {
    dataSources,
    loading,
    addDataSource,
    removeDataSource,
    refetch: fetchDataSources,
  };
}