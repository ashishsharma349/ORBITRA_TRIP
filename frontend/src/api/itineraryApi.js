import axiosInstance from '../utils/axiosInstance';

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/api/itineraries/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
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
