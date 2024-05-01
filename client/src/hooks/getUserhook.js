import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user/current-user",{
          withCredentials:true,
        });
        setUser(response.data.data);
        console.log(response.data.data)
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Empty dependency array to run the effect only once

  return { user, loading };
};

export default useGetUser;