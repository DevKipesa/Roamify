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
          <h2>Latest Trips</h2>
          <h2 onClick={() => window.location.href = tripsDataUrl} className='see'>See All</h2>
        </div>
        
        <div className="trips-container">
          <ol>
            {recentTrips.map((trip) => (
              <li key={trip.id}>
                <strong>Pickup Location:</strong> {trip.pickup_location} <br />
              </li>
            ))}
          </ol>

          <div className="destinations-card">
            <h3>Top 3 Destinations</h3>
            <div className="chart-and-list">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={topDestinations}
                    dataKey="value"
                    nameKey="location"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    label
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
                  <div key={index}>
                    {destination.location}: {destination.percentage}%
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
