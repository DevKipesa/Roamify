import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TripsLineChart = () => {
  const [monthlyTrips, setMonthlyTrips] = useState([]);
  const tripsDataUrl = 'https://rapidtechinsights.github.io/hr-assignment/recent.json';

  useEffect(() => {
    const fetchTrips = async () => {
      const response = await fetch(tripsDataUrl);
      const data = await response.json();
      processTripsData(data.trips);
    };

    const processTripsData = (trips) => {
      const monthlyCounts = Array(12).fill(0);

      trips.forEach((trip) => {
        const tripDate = new Date(trip.request_date);
        const month = tripDate.getMonth();
        if (trip.status === "COMPLETED") {
          monthlyCounts[month] += 1;
        }
      });

      const formattedData = monthlyCounts.map((count, index) => {
        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return { month: monthNames[index], trips: count };
      });

      setMonthlyTrips(formattedData);
    };

    fetchTrips();
  }, []);

  return (
    <div style={{ padding: '0px' }}>
      <h2 style={{ color: '#fff', marginBottom: '0px' }}>Trips Over Time</h2>
      <div style={{ border: '1px solid #867AD2', padding: '15px', borderRadius: '20px', backgroundColor: '#151515' }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrips} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="trips" stroke="#8884d8" activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TripsLineChart;
