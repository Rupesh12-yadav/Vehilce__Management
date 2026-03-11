import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/api';

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    aadharNumber: '',
    dateOfBirth: '',
    gender: ''
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchDocuments();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/users/profile');
      // Handle both { data: {...} } and { success: true, data: {...} }
      const userData = response.data.data || response.data;
      if (userData) {
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          licenseNumber: userData.licenseNumber || '',
          aadharNumber: userData.aadharNumber || '',
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
          gender: userData.gender || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    setLoading(false);
  };

  const fetchDocuments = async () => {
    try {
      const response = await API.get('/documents');
      // Handle both { data: [...] } and { success: true, data: [...] }
      const docsData = response.data.data || response.data;
      setDocuments(Array.isArray(docsData) ? docsData : []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put('/users/profile', formData);
      login({ ...user, ...response.data.data });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const uploadDocument = async (documentType) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,application/pdf';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // In real app, upload to cloud storage and get URL
      const documentUrl = `https://example.com/documents/${file.name}`;
      
      try {
        await API.post('/documents', {
          documentType,
          documentUrl
        });
        alert('Document uploaded successfully! Awaiting approval.');
        fetchDocuments();
      } catch (error) {
        alert('Error uploading document');
      }
    };
    fileInput.click();
  };

  const getDocumentStatus = (docType) => {
    const doc = documents.find(d => d.documentType === docType);
    return doc ? doc.status : 'not_uploaded';
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      not_uploaded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold">My Profile</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Form */}
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-xl font-bold mb-4">Personal Information</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded bg-gray-50"
                value={formData.email}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                className="w-full p-2 border rounded"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                className="w-full p-2 border rounded"
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {user?.role === 'driver' && (
              <div>
                <label className="block text-sm font-medium mb-1">License Number</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Aadhar Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.aadharNumber}
                onChange={(e) => setFormData({...formData, aadharNumber: e.target.value})}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Document Upload */}
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-xl font-bold mb-4">Document Verification</h3>
          
          <div className="space-y-4">
            {/* Aadhar Card */}
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-semibold">Aadhar Card</p>
                <p className="text-sm text-gray-600">Identity verification</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(getDocumentStatus('aadhar'))}`}>
                  {getDocumentStatus('aadhar').replace('_', ' ')}
                </span>
                <button
                  onClick={() => uploadDocument('aadhar')}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Upload
                </button>
              </div>
            </div>

            {/* License (for drivers) */}
            {user?.role === 'driver' && (
              <div className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-semibold">Driving License</p>
                  <p className="text-sm text-gray-600">Required for booking vehicles</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(getDocumentStatus('license'))}`}>
                    {getDocumentStatus('license').replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => uploadDocument('license')}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}

            {/* Profile Photo */}
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-semibold">Profile Photo</p>
                <p className="text-sm text-gray-600">Your profile picture</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(getDocumentStatus('profile'))}`}>
                  {getDocumentStatus('profile').replace('_', ' ')}
                </span>
                <button
                  onClick={() => uploadDocument('profile')}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">Verification Status</h4>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                user?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user?.isVerified ? 'Verified Account' : 'Pending Verification'}
              </span>
            </div>
            {!user?.isVerified && (
              <p className="text-sm text-gray-600 mt-2">
                Upload required documents to get your account verified
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

