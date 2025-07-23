// src/components/SomeComponent.js
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const SomeComponent = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/some-endpoint');
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Data</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default SomeComponent;
