import React from 'react'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { useNavigate, useLocation } from 'react-router-dom'
import WorkerCard from '../components/WorkerCard'
import axios from 'axios'

const WorkerList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sortOption, setSortOption] = useState('');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    
    console.log('Category from URL:', category); // Debug log

    const fetchWorkers = async () => {
      try {
        // First get all workers
        const response = await axios.get('http://localhost:3001/api/workers');
        console.log('All workers:', response.data); // Debug log

        // Map of URL categories to database categories
        const categoryMap = {
          'oldcare': 'Old Care',
          'housecleaning': 'House Cleaning',
          'cook': 'Cook',
          'babysitting': 'Baby Sitting',
          'hometution': 'Home Tution',
          'physiotherapist': 'Physiotherapist'
        };

        // Get the proper category name from the map
        const properCategory = categoryMap[category] || category;
        console.log('Looking for workers with category:', properCategory); // Debug log

        // Filter workers by category
        const filteredWorkers = response.data.filter(worker => 
          worker.category === properCategory
        );
        
        console.log('Filtered workers:', filteredWorkers); // Debug log
        setWorkers(filteredWorkers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching workers:', error);
        setError('Failed to load workers. Please try again later.');
        setLoading(false);
      }
    };

    if (category) {
      fetchWorkers();
    } else {
      setError('No category selected');
      setLoading(false);
    }
  }, [location.search]);

  const handleWorkerClick = (workerId) => {
    navigate(`/workerdetails/${workerId}`);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    // Here, you can implement sorting logic if needed
    console.log("Selected sort option:", event.target.value);
  };

  return (
    <div class='bg-gradient-to-b from-amber-500 to-white p-2'>
      <Header />
      <div class="m-4 flex flex items-center justify-between">
        <div>
          <select
            className="bg-white text-black font-bold py-3 px-6 rounded-full shadow-md cursor-pointer hover:bg-grey-200 transition duration-300"
            onChange={handleSortChange}
            value={sortOption}
          >
            <option value="">Sort by</option>
            <option value="popular">Most Popular</option>
            <option value="highest_review">Highest Review</option>
            <option value="oldest">Oldest Worker</option>
          </select>
        </div>
        <div class="font-bold text-gray-700">
          {workers.length} results
        </div>
      </div>
      <hr className="border-t-2 border-white my-4" />
      {error ? (
        <div className="text-center text-red-500 p-4">
          {error}
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center text-gray-600 p-4">
          No workers found in this category. Please check if the category name matches exactly with what was used when creating the worker.
        </div>
      ) : (
        <div class="flex pl-10 pr-10 justify-center place-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {workers.map((worker) => (
            <WorkerCard 
              key={worker._id} 
              worker={worker}
              onClick={() => handleWorkerClick(worker._id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkerList