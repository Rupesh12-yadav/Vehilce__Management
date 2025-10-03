import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const DocumentApproval = () => {
  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [filter]);

  const fetchDocuments = async () => {
    try {
      const response = await API.get(`/documents?status=${filter}`);
      setDocuments(response.data.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
    setLoading(false);
  };

  const handleApproval = async (documentId, status, reason = '') => {
    try {
      await API.put(`/documents/${documentId}/approve`, {
        status,
        rejectionReason: reason
      });
      alert(`Document ${status} successfully`);
      fetchDocuments();
    } catch (error) {
      alert('Error updating document status');
    }
  };

  const getDocumentTypeColor = (type) => {
    const colors = {
      license: 'bg-blue-100 text-blue-800',
      aadhar: 'bg-green-100 text-green-800',
      rc: 'bg-purple-100 text-purple-800',
      insurance: 'bg-yellow-100 text-yellow-800',
      puc: 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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
          <h2 className="text-2xl font-bold">Document Approval</h2>
        </div>
        
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No {filter} documents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc._id} className="bg-white rounded shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDocumentTypeColor(doc.documentType)}`}>
                    {doc.documentType.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-bold mt-2">{doc.user.name}</h3>
                  <p className="text-gray-600">{doc.user.email}</p>
                  <p className="text-sm text-gray-500">{doc.user.role}</p>
                </div>
                
                <span className={`px-2 py-1 text-xs rounded-full ${
                  doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {doc.status}
                </span>
              </div>

              {doc.vehicle && (
                <div className="mb-4 p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Vehicle:</p>
                  <p className="font-semibold">{doc.vehicle.name}</p>
                  <p className="text-sm">{doc.vehicle.registrationNumber}</p>
                </div>
              )}

              <div className="mb-4">
                <img
                  src={doc.documentUrl}
                  alt={doc.documentType}
                  className="w-full h-32 object-cover rounded border"
                  onClick={() => window.open(doc.documentUrl, '_blank')}
                />
                <p className="text-xs text-gray-500 mt-1 cursor-pointer" 
                   onClick={() => window.open(doc.documentUrl, '_blank')}>
                  Click to view full size
                </p>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <p>Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</p>
                {doc.approvedBy && (
                  <p>Approved by: {doc.approvedBy.name}</p>
                )}
                {doc.rejectionReason && (
                  <p className="text-red-600">Reason: {doc.rejectionReason}</p>
                )}
              </div>

              {doc.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproval(doc._id, 'approved')}
                    className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Rejection reason:');
                      if (reason) handleApproval(doc._id, 'rejected', reason);
                    }}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-yellow-600">
            {documents.filter(d => d.status === 'pending').length}
          </h3>
          <p className="text-gray-600">Pending Approval</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-green-600">
            {documents.filter(d => d.status === 'approved').length}
          </h3>
          <p className="text-gray-600">Approved</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold text-red-600">
            {documents.filter(d => d.status === 'rejected').length}
          </h3>
          <p className="text-gray-600">Rejected</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentApproval;