import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    type: 'car',
    year: '',
    registrationNumber: '',
    pricePerDay: '',
    pricePerHour: '',
    fuelType: 'petrol',
    seatingCapacity: '',
    transmission: 'manual',
    features: '',
    images: '',
    city: '',
    state: '',
    pincode: '',
    address: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await API.get('/vehicles/my/vehicles');
      setVehicles(response.data.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vehicleData = {
        ...formData,
        features: formData.features
          ? formData.features.split(',').map(f => f.trim())
          : [],
        images: formData.images
          ? formData.images.split(',').map(img => img.trim())
          : []
      };

      if (editingVehicle) {
        await API.put(`/vehicles/${editingVehicle._id}`, vehicleData);
        alert('Vehicle updated successfully!');
      } else {
        await API.post('/vehicles', vehicleData);
        alert('Vehicle added successfully!');
      }

      setShowForm(false);
      setEditingVehicle(null);
      resetForm();
      fetchVehicles();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      type: 'car',
      year: '',
      registrationNumber: '',
      pricePerDay: '',
      pricePerHour: '',
      fuelType: 'petrol',
      seatingCapacity: '',
      transmission: 'manual',
      features: '',
      images: '',
      city: '',
      state: '',
      pincode: '',
      address: ''
    });
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      ...vehicle,
      features: vehicle.features?.join(', ') || '',
      images: vehicle.images?.join(', ') || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await API.delete(`/vehicles/${id}`);
        alert('Vehicle deleted successfully!');
        fetchVehicles();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.message || 'Cannot delete vehicle'));
      }
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await API.patch(`/vehicles/${id}/availability`);
      fetchVehicles();
    } catch (error) {
      alert('Error updating availability');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/vehicleadmin/dashboard'}
            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold">My Vehicles</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Vehicle
        </button>
      </div>

      {/* Vehicle Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Vehicle Name" className="p-2 border rounded"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <input type="text" placeholder="Brand" className="p-2 border rounded"
                  value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} required />
                <input type="text" placeholder="Model" className="p-2 border rounded"
                  value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required />
                <select className="p-2 border rounded" value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="truck">Truck</option>
                  <option value="bus">Bus</option>
                  <option value="auto">Auto</option>
                </select>
                <input type="number" placeholder="Year" className="p-2 border rounded"
                  value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required />
                <input type="text" placeholder="Registration Number" className="p-2 border rounded"
                  value={formData.registrationNumber} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} required />
                <input type="number" placeholder="Price Per Day" className="p-2 border rounded"
                  value={formData.pricePerDay} onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})} required />
                <input type="number" placeholder="Price Per Hour" className="p-2 border rounded"
                  value={formData.pricePerHour} onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})} required />
                <select className="p-2 border rounded" value={formData.fuelType}
                  onChange={(e) => setFormData({...formData, fuelType: e.target.value})}>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="cng">CNG</option>
                </select>
                <input type="number" placeholder="Seating Capacity" className="p-2 border rounded"
                  value={formData.seatingCapacity} onChange={(e) => setFormData({...formData, seatingCapacity: e.target.value})} required />
                <select className="p-2 border rounded" value={formData.transmission}
                  onChange={(e) => setFormData({...formData, transmission: e.target.value})}>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>

              <input type="text" placeholder="Features (comma separated)" className="w-full p-2 border rounded"
                value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} />

              {/* Image URLs */}
              <input type="text" placeholder="Image URLs (comma separated)" className="w-full p-2 border rounded"
                value={formData.images} onChange={(e) => setFormData({...formData, images: e.target.value})} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="p-2 border rounded"
                  value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
                <input type="text" placeholder="State" className="p-2 border rounded"
                  value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} required />
                <input type="text" placeholder="Pincode" className="p-2 border rounded"
                  value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} required />
                <input type="text" placeholder="Address" className="p-2 border rounded"
                  value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  {editingVehicle ? 'Update' : 'Add'} Vehicle
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingVehicle(null); resetForm(); }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vehicle List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className="bg-white rounded shadow p-4">
            {vehicle.images?.length > 0 && (
              <img src={vehicle.images[0]} alt={vehicle.name}
                className="w-50 h-40 object-cover rounded mb-2" />
            )}
            <h3 className="text-lg font-bold">{vehicle.brand} {vehicle.model}</h3>
            <p className="text-gray-600">{vehicle.type} • {vehicle.year}</p>
            <p className="text-gray-600">{vehicle.registrationNumber}</p>
            <p className="text-gray-600">{vehicle.city}, {vehicle.state}</p>
            <p className="text-gray-600">Pincode: {vehicle.pincode}</p>
            <p className="text-gray-600">{vehicle.address}</p>

            <div className="mt-2">
              <p className="text-lg font-bold text-green-600">₹{vehicle.pricePerDay}/day</p>
              <p className="text-sm text-gray-600">₹{vehicle.pricePerHour}/hour</p>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => handleEdit(vehicle)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
              <button onClick={() => toggleAvailability(vehicle._id)}
                className={`px-3 py-1 rounded text-sm ${
                  vehicle.availability ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                } text-white`}>
                {vehicle.availability ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => handleDelete(vehicle._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
            </div>

            <div className="mt-2">
              <span className={`px-2 py-1 rounded text-xs ${
                vehicle.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {vehicle.availability ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
