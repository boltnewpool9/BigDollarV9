import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Winner, PrizeWinner } from '../types';

export const useWinners = () => {
  const [winners, setWinners] = useState<PrizeWinner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWinners = async () => {
    try {
      const { data, error } = await supabase
        .from('winners')
        .select('*')
        .order('won_at', { ascending: false });

      if (error) throw error;
      setWinners(data || []);
    } catch (error) {
      console.error('Error fetching winners:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWinners = async (newWinners: any[]) => {
    try {
      const { error } = await supabase
        .from('winners')
        .insert(newWinners);

      if (error) throw error;
      await fetchWinners(); // Refresh the list
    } catch (error) {
      console.error('Error adding winners:', error);
      throw error;
    }
  };

  const purgeWinners = async () => {
    try {
      // First, check if there are any winners
      const { count, error: countError } = await supabase
        .from('winners')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      
      if (!count || count === 0) {
        return; // No winners to delete
      }

      // Delete all records using a simple delete operation
      const { error } = await supabase
        .from('winners')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // This will match all real UUIDs

      if (error) throw error;
      await fetchWinners(); // Refresh the list
    } catch (error) {
      console.error('Error purging winners:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchWinners();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('winners_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'winners' },
        () => {
          fetchWinners();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { winners, loading, addWinners, fetchWinners, purgeWinners };
};