import axiosInstance from '../utils/axiosInstance';

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Generate idempotency key
  const idempotencyKey = crypto.randomUUID?.() 
    ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  
  try {
    const response = await axiosInstance.post('/api/itineraries/upload', formData, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Document upload failed:', error.message);
    throw error; // Let caller decide retry logic
  }
};

export const getItineraries = async () => {
  const response = await axiosInstance.get('/api/itineraries');
  return response.data;
};

export const deleteItinerary = async (id) => {
  const response = await axiosInstance.delete(`/api/itineraries/${id}`);
  return response.data;
};

export const getSharedItinerary = async (shareToken) => {
  const response = await axiosInstance.get(`/api/itineraries/shared/${shareToken}`);
  return response.data;
};
