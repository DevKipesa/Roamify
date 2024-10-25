import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './tripdestination.css';

const RecentTrips = () => {
  const [recentTrips, setRecentTrips] = useState([]);
  const [topDestinations, setTopDestinations] = useState([]);

  const tripsDataUrl = 'https://rapidtechinsights.github.io/hr-assignment/recent.json';

  useEffect(() => {
    const fetchTrips = async () => {
      const response = await fetch(tripsDataUrl);
      const data = await response.json();
      processTripsData(data.trips);
    };

    const processTripsData = (trips) => {
      const sortedTrips = trips.sort((a, b) => new Date(b.request_date) - new Date(a.request_date));
      const topRecentTrips = sortedTrips.slice(0, 5);
      setRecentTrips(topRecentTrips);

      const destinationCounts = {};

      trips.forEach((trip) => {
        const destination = trip.dropoff_location;
        if (destination) {
          destinationCounts[destination] = (destinationCounts[destination] || 0) + 1;
        }
      });

      const sortedDestinations = Object.entries(destinationCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

      const totalTrips = trips.length;
      const destinationsWithPercentage = sortedDestinations.map(([location, count]) => ({
        location,
        percentage: ((count / totalTrips) * 100).toFixed(2),
        value: count
      }));

      setTopDestinations(destinationsWithPercentage);
    };

    fetchTrips();
  }, []);

  const COLORS = ['#867AD2', '#FF7777', '#FFDAA3'];

  return (
    <div className="recent-trips-container">
      <div className="trips-content"> {/* Parent div for header and container */}
        <div className="trips-header">
          <h4>Latest Trips</h4>
          <h5 onClick={() => window.location.href = tripsDataUrl} className='see'>See all</h5>
        </div>
        
        <div className="trips-container">
          <ol className="trip-list">
            {recentTrips.map((trip) => (
              <li key={trip.id} >
               {trip.pickup_location}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span className='date'>{new Date(trip.request_date).toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })}</span>
              </li>
            ))}
          </ol>

          <div className="destinations-card">
            <h3 className='toper'>Top 3 Destinations</h3>
            <div className="chart-and-list">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topDestinations}
                    dataKey="value"
                    nameKey="location"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}  // Create a donut chart
                    outerRadius={110}
                    fill="#8884d8"
                    labelLine={false}
                    label={() => ''}
                  >
                    {topDestinations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="destination-list">
                {topDestinations.map((destination, index) => (
                  <div key={index} className="destination-progress">
                    <div className="destination-name">
                      {destination.location}
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{ width: `${destination.percentage}%`, backgroundColor: COLORS[index % COLORS.length] }}
                      />
                    </div>
                    <div className="percentage">{destination.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTrips;
