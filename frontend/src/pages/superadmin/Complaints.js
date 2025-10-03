import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await API.get('/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
    setLoading(false);
  };

  const updateComplaintStatus = async (complaintId, status) => {
    try {
      await API.put(`/complaints/${complaintId}`, { status });
      fetchComplaints();
      alert('Complaint status updated successfully');
    } catch (error) {
      alert('Error updating complaint status');
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true;
    return complaint.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/superadmin/dashboard'}
            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold">Manage Complaints</h2>
        </div>
        
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Complaints</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No complaints found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div key={complaint._id} className="bg-white rounded shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{complaint.title}</h3>
                  <p className="text-gray-600 mt-2">{complaint.description}</p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Complainant:</p>
                      <p className="font-semibold">{complaint.complainant?.name}</p>
                      <p className="text-sm text-gray-600">{complaint.complainant?.email}</p>
                    </div>
                    
                    {complaint.booking && (
                      <div>
                        <p className="text-sm text-gray-600">Related Booking:</p>
                        <p className="font-semibold">{complaint.booking.bookingId}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(complaint.booking.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(complaint.status)}`}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)} Priority
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <p>Created: {new Date(complaint.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(complaint.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2">
                  {complaint.status === 'open' && (
                    <button
                      onClick={() => updateComplaintStatus(complaint._id, 'in-progress')}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Start Progress
                    </button>
                  )}
                  
                  {complaint.status === 'in-progress' && (
                    <button
                      onClick={() => updateComplaintStatus(complaint._id, 'resolved')}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Mark Resolved
                    </button>
                  )}
                  
                  {complaint.status === 'resolved' && (
                    <button
                      onClick={() => updateComplaintStatus(complaint._id, 'closed')}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Close
                    </button>
                  )}
                  
                  <button
                    onClick={() => window.location.href = `/complaint/${complaint._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-red-600">
            {complaints.filter(c => c.status === 'open').length}
          </h3>
          <p className="text-gray-600">Open</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-yellow-600">
            {complaints.filter(c => c.status === 'in-progress').length}
          </h3>
          <p className="text-gray-600">In Progress</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-green-600">
            {complaints.filter(c => c.status === 'resolved').length}
          </h3>
          <p className="text-gray-600">Resolved</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-gray-600">
            {complaints.filter(c => c.status === 'closed').length}
          </h3>
          <p className="text-gray-600">Closed</p>
        </div>
      </div>
    </div>
  );
};

export default Complaints;