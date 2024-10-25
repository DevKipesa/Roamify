import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './Trips.css'; // Ensure you have appropriate styles in this file

const Trips = () => {
  const [tripsData, setTripsData] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All Trips');
  const [keyword, setKeyword] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState('any');
  const [timeFilter, setTimeFilter] = useState('any');
  const [isSearched, setIsSearched] = useState(false);

  // Fetch trip data from JSON file
  useEffect(() => {
    const fetchTrips = async () => {
      const response = await fetch('https://rapidtechinsights.github.io/hr-assignment/recent.json');
      const data = await response.json();
      setTripsData(data.trips);
      setFilteredTrips(data.trips);
    };

    fetchTrips();
  }, []);

  // Handle input change and filters
  const handleInputChange = (e) => {
    setKeyword(e.target.value.toLowerCase());
  };

  const handleDistanceChange = (e) => {
    setDistanceFilter(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTimeFilter(e.target.value);
  };

  const handleSearch = () => {
    let filtered = tripsData;

    // Filter by status
    if (selectedStatus && selectedStatus !== 'All Trips') {
      filtered = filtered.filter((trip) => trip.status === selectedStatus);
    }

    // Filter by keyword
    if (keyword) {
      filtered = filtered.filter((trip) =>
        trip.pickup_location.toLowerCase().includes(keyword) ||
        trip.dropoff_location.toLowerCase().includes(keyword) ||
        trip.driver_name.toLowerCase().includes(keyword) ||
        trip.car_model.toLowerCase().includes(keyword)
      );
    }

    // Filter by distance
    if (distanceFilter !== 'any') {
      filtered = filtered.filter((trip) => {
        const distance = trip.distance;
        switch (distanceFilter) {
          case 'under3':
            return distance < 3;
          case '3to6':
            return distance >= 3 && distance <= 6;
          case '6to15':
            return distance > 6 && distance <= 15;
          case 'more15':
            return distance > 15;
          default:
            return true;
        }
      });
    }

    // Filter by time
    if (timeFilter !== 'any') {
      filtered = filtered.filter((trip) => {
        const duration = trip.duration;
        switch (timeFilter) {
          case 'under5':
            return duration < 5;
          case '5to10':
            return duration >= 5 && duration <= 10;
          case '10to20':
            return duration > 10 && duration <= 20;
          case 'more20':
            return duration > 20;
          default:
            return true;
        }
      });
    }

    setFilteredTrips(filtered);
    setIsSearched(true);
  };

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
  };

  const handleClearSelection = () => {
    setSelectedTrip(null);
  };

  return (
    <div className="tripsContainer">
      <h2 className="statusTitle">KEYWORD</h2>
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search by location, driver, or car model..."
          className="searchInput"
          value={keyword}
          onChange={handleInputChange}
        />
        <FaSearch className="searchIcon" />
      </div>

      <div className="statusContainer">
        <h2 className="statusTitle">STATUS</h2>
        <div className="statusOptions">
          <div
            className={`statusOption ${selectedStatus === 'All Trips' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('All Trips')}
          >
            All Trips
          </div>
          <div
            className={`statusOption ${selectedStatus === 'Completed' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('Completed')}
          >
            Completed
          </div>
          <div
            className={`statusOption ${selectedStatus === 'Cancelled' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('Cancelled')}
          >
            Cancelled
          </div>
        </div>
      </div>

      {selectedStatus === 'All Trips' && (
        <div className="filterCards">
          {/* Distance filter */}
          <div className="filterCard">
            <h3 className='time'>Distance</h3>
            <label>
              <input type="radio" name="distance" value="any" checked={distanceFilter === 'any'} onChange={handleDistanceChange} />
              Any
            </label>
            <label>
              <input type="radio" name="distance" value="under3" checked={distanceFilter === 'under3'} onChange={handleDistanceChange} />
              Under 3 km
            </label>
            <label>
              <input type="radio" name="distance" value="3to6" checked={distanceFilter === '3to6'} onChange={handleDistanceChange} />
              3 to 6 km
            </label>
            <label>
              <input type="radio" name="distance" value="6to15" checked={distanceFilter === '6to15'} onChange={handleDistanceChange} />
              6 to 15 km
            </label>
            <label>
              <input type="radio" name="distance" value="more15" checked={distanceFilter === 'more15'} onChange={handleDistanceChange} />
              More than 15 km
            </label>
          </div>
          {/* Time filter */}
          <div className="filterCard">
            <h3 className='time'>Time</h3>
            <label>
              <input type="radio" name="time" value="any" checked={timeFilter === 'any'} onChange={handleTimeChange} />
              Any
            </label>
            <label>
              <input type="radio" name="time" value="under5" checked={timeFilter === 'under5'} onChange={handleTimeChange} />
              Under 5 min
            </label>
            <label>
              <input type="radio" name="time" value="5to10" checked={timeFilter === '5to10'} onChange={handleTimeChange} />
              5 to 10 min
            </label>
            <label>
              <input type="radio" name="time" value="10to20" checked={timeFilter === '10to20'} onChange={handleTimeChange} />
              10 to 20 min
            </label>
            <label>
              <input type="radio" name="time" value="more20" checked={timeFilter === 'more20'} onChange={handleTimeChange} />
              More than 20 min
            </label>
          </div>
        </div>
      )}

      <div className="searchButtonContainer">
        <button className="searchButton" onClick={handleSearch}>
          SEARCH
        </button>
      </div>

      {/* Display filtered trip cards only after search */}
      {isSearched && filteredTrips.length > 0 && (
        <div className="filterCards">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="filterCard tripCard" onClick={() => handleTripClick(trip)}>
              <h3>{trip.driver_name}</h3>
              <p>Pickup: {trip.pickup_location}</p>
              <p>Dropoff: {trip.dropoff_location}</p>
              <p>Cost: {trip.cost} {trip.cost_unit}</p>
            </div>
          ))}
        </div>
      )}

      {isSearched && filteredTrips.length === 0 && <p className='tripes'>No trips found.</p>}

      {/* Display selected trip details */}
      {selectedTrip && (
        <div className="tripDetails">
          <button className="closeButton" onClick={handleClearSelection}>X</button>
          <h2>Trip Details</h2>
          <p><strong>Driver:</strong> {selectedTrip.driver_name}</p>
          <p><strong>Pickup:</strong> {selectedTrip.pickup_location}</p>
          <p><strong>Dropoff:</strong> {selectedTrip.dropoff_location}</p>
          <p><strong>Cost:</strong> {selectedTrip.cost} {selectedTrip.cost_unit}</p>
        </div>
      )}
    </div>
  );
};

export default Trips;
