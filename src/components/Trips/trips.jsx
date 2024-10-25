import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './trips.css';

const Trips = () => {
  const [tripsData, setTripsData] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All Trips');
  const [keyword, setKeyword] = useState('');
  const [distanceFilter, setDistanceFilter] = useState('any');
  const [timeFilter, setTimeFilter] = useState('any');
  const [isSearched, setIsSearched] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const response = await fetch('https://rapidtechinsights.github.io/hr-assignment/recent.json');
      const data = await response.json();
      setTripsData(data.trips);
      setFilteredTrips(data.trips);
    };

    fetchTrips();
  }, []);

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
    const newFilters = [];

    if (selectedStatus && selectedStatus !== 'All Trips') {
      filtered = filtered.filter((trip) => trip.status === selectedStatus);
      newFilters.push({ type: 'Status', value: selectedStatus });
    }

    if (keyword) {
      filtered = filtered.filter((trip) =>
        trip.pickup_location.toLowerCase().includes(keyword) ||
        trip.dropoff_location.toLowerCase().includes(keyword) ||
        trip.driver_name.toLowerCase().includes(keyword) ||
        trip.car_model.toLowerCase().includes(keyword)
      );
      newFilters.push({ type: 'Keyword', value: keyword });
    }

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
      newFilters.push({ type: 'Distance', value: distanceFilter });
    }

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
      newFilters.push({ type: 'Time', value: timeFilter });
    }

    setFilteredTrips(filtered.slice(0, 6));
    setAppliedFilters(newFilters);
    setIsSearched(true);
  };

  const handleRemoveFilter = (filterType) => {
    if (filterType === 'Status') setSelectedStatus('All Trips');
    if (filterType === 'Keyword') setKeyword('');
    if (filterType === 'Distance') setDistanceFilter('any');
    if (filterType === 'Time') setTimeFilter('any');
    handleSearch();
  };

  const handleCardClick = (trip) => {
    setSelectedTrip(trip);
  };

  const handleBack = () => {
    setIsSearched(false);
    setKeyword('');
    setSelectedStatus('All Trips');
    setDistanceFilter('any');
    setTimeFilter('any');
    setSelectedTrip(null);
    setAppliedFilters([]);
  };

  return (
    <div className="tripsContainer">
      <div className="filterHeader">
        {isSearched && (
          <span className="backArrow" onClick={handleBack}>←</span>
        )}
        <div className="appliedFilters">
          {appliedFilters.map((filter, index) => (
            <span key={index} className="filterLabel">
              {filter.type}: {filter.value}
              <button className="removeFilter" onClick={() => handleRemoveFilter(filter.type)}>x</button>
            </span>
          ))}
        </div>
      </div>

      {!isSearched && !selectedTrip && (
        <>
          <div className="statusTitle">KEYWORD</div>
          <div className="searchBar">
            <input
              type="text"
              placeholder="Search by distance, duration, keyword..."
              className="searchInput"
              value={keyword}
              onChange={handleInputChange}
            />
            <FaSearch className="searchIcon" />
          </div>

          <div className="statusContainer">
            <div className="statusTitle">STATUS</div>
            <div className="statusOptions">
              <div className={`statusOption ${selectedStatus === 'All Trips' ? 'active' : ''}`} onClick={() => setSelectedStatus('All Trips')}>All Trips</div>
              <div className={`statusOption ${selectedStatus === 'Completed' ? 'active' : ''}`} onClick={() => setSelectedStatus('Completed')}>Completed</div>
              <div className={`statusOption ${selectedStatus === 'Cancelled' ? 'active' : ''}`} onClick={() => setSelectedStatus('Cancelled')}>Cancelled</div>
            </div>
          </div>

          <div className="filterCards">
            <div className="filterCard">
              <div className='time'>DISTANCE</div>
              <label><input type="radio" name="distance" value="any" checked={distanceFilter === 'any'} onChange={handleDistanceChange} />Any</label>
              <label><input type="radio" name="distance" value="under3" checked={distanceFilter === 'under3'} onChange={handleDistanceChange} />Under 3 km</label>
              <label><input type="radio" name="distance" value="3to6" checked={distanceFilter === '3to6'} onChange={handleDistanceChange} />3 to 6 km</label>
              <label><input type="radio" name="distance" value="6to15" checked={distanceFilter === '6to15'} onChange={handleDistanceChange} />6 to 15 km</label>
              <label><input type="radio" name="distance" value="more15" checked={distanceFilter === 'more15'} onChange={handleDistanceChange} />More than 15 km</label>
            </div>
            <div className="filterCard">
              <div className='time'>TIME</div>
              <label><input type="radio" name="time" value="any" checked={timeFilter === 'any'} onChange={handleTimeChange} />Any</label>
              <label><input type="radio" name="time" value="under5" checked={timeFilter === 'under5'} onChange={handleTimeChange} />Under 5 min</label>
              <label><input type="radio" name="time" value="5to10" checked={timeFilter === '5to10'} onChange={handleTimeChange} />5 to 10 min</label>
              <label><input type="radio" name="time" value="10to20" checked={timeFilter === '10to20'} onChange={handleTimeChange} />10 to 20 min</label>
              <label><input type="radio" name="time" value="more20" checked={timeFilter === 'more20'} onChange={handleTimeChange} />More than 20 min</label>
            </div>
          </div>

          <div className="searchButtonContainer">
            <button className="searchButton" onClick={handleSearch}>SEARCH</button>
          </div>
        </>
      )}

      {isSearched && !selectedTrip && (
        <div>
          {filteredTrips.length > 0 ? (
            <div className="filterCards">
              {filteredTrips.map((trip) => (
                <div key={trip.id} className="tripCard" onClick={() => handleCardClick(trip)}>
                  {/* <h3 className="tripTitle">{trip.driver_name}</h3> */}
                  <p className="tripreq">{trip.request_date}</p>
                  <div className='triprate'>
                  <button className={`tripstate ${trip.status === 'CANCELED' ? 'canceled' : ''}`}>
                    {trip.status}
                   </button>
                  <p className="triprates">★★★★☆</p>
                  </div>
                  <p className="trippick">{trip.pickup_location}</p>
                  <p className="tripoff">{trip.dropoff_location}</p>
                  <p className="cost">{trip.cost_unit} {trip.cost} </p> {/* Assuming cost_unit is part of the trip object */}
                  {/* <p className="duration">{trip.duration} min</p> */}
                  <p className="distance">{trip.distance} KM</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No trips found.</p>
          )}
        </div>
      )}

      {selectedTrip && (
        <div className="tripDetailsContainer">
          <div className="tripDetails">
            <div className="tripImageContainer">
            <img src={`/map.jpg`} alt="Trip" className="tripImage" />
            </div>
            <div className="tripInfo">
              {/* <h2>{selectedTrip.driver_name}</h2> */}
              <div className='three'>
              <div className='tip'>
              <p> {selectedTrip.request_date}</p>
              <p className="triprated">★★★★☆</p>
              </div>
              <button className='butt'> {selectedTrip.status}</button>
              </div>
              <div className='piceco'>
              <p><strong>PRICE</strong> {selectedTrip.cost} {selectedTrip.cost_unit}</p>
              <p><strong>DURATION</strong> {selectedTrip.duration} min</p>
              </div>
              <div className="trippicke">
              <p >{selectedTrip.pickup_location}</p>
              <p> {selectedTrip.dropoff_location}</p>
              </div>
            </div>
          </div>

          <div className="infoCardsContainer">
            <div className="driverCard">
              <h3 className='info'>Driver Information</h3>
              <div className="driverInfo">
                <img src={selectedTrip.driver_pic} alt="Driver" className="driverImage" />
                <div className="driverDetails">
                <p className="names">
                       <span className="label">DRIVER NAME</span>
                       <span className="driverName">{selectedTrip.driver_name}</span>
                       </p>
                  <p className="triprateds">★★★★☆</p>
                </div>
              </div>
            </div>

            <div className="carCard">
              <h3 className='info'>Car Information</h3>
              <div className="carInfo">
                <img src={selectedTrip.car_pic} alt="Car" className="carImage" />
                <div className="carDetails">
                  <div className='makeye'>
                  <p><strong>MAKE/MODEL</strong> {selectedTrip.car_model}</p>
                  <p><strong>YEAR</strong> {selectedTrip.car_year}</p>
                  </div>
                  <div className='num'>
                  <p><strong>PLATE</strong> {selectedTrip.car_number}</p>
                  <p><strong>MAKE</strong> {selectedTrip.car_make}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <button className="backButton" onClick={handleBack}>Back</button> */}
        </div>
      )}
    </div>
  );
};

export default Trips;
