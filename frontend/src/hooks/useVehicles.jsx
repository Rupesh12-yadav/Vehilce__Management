import { useState, useEffect } from 'react';
import { vehicleAPI } from '../services/api.service';

export const useVehicles = (filters = {}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, [JSON.stringify(filters)]);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.city) params.city = filters.city;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      
      const response = await vehicleAPI.getAllVehicles(params);
      setVehicles(response.data.data || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err.message);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  return { vehicles, loading, error, refetch: fetchVehicles };
};


