const itineraryService = require('../services/itineraryService');
const documentRepository = require('../repositories/documentRepository');
const cloudinaryService = require('../services/cloudinaryService');
const geminiService = require('../services/geminiService');
const aiService = require('../services/aiService');
const { AppError } = require('./errorHandler');

async function runMockTest() {
  console.log('--- START MOCK GARBAGE REJECTION TEST ---');

  // 1. Mock documentRepository.create
  const mockDoc = {
    _id: 'mock_doc_id',
    user: 'mock_user_id',
    originalName: 'syllabus.pdf',
    filename: 'mock_public_id',
    path: 'https://res.cloudinary.com/dummy/syllabus.pdf',
    mimeType: 'application/pdf',
    size: 1024,
    status: 'processing',
    save: async function() { return this; }
  };
  documentRepository.create = async () => mockDoc;

  // 2. Mock cloudinaryService.uploadBuffer
  cloudinaryService.uploadBuffer = async () => ({
    secure_url: 'https://res.cloudinary.com/dummy/syllabus.pdf',
    public_id: 'mock_public_id'
  });

  // 3. Mock cloudinaryService.deleteAsset
  let deletedAssetId = null;
  cloudinaryService.deleteAsset = async (publicId) => {
    deletedAssetId = publicId;
  };

  // 4. Mock geminiService/aiService output
  geminiService.extractItineraryFromText = async () => ({
    isValidTravelDocument: false,
    garbageReason: 'college syllabus detected'
  });
  aiService.extractItineraryFromText = async () => ({
    isValidTravelDocument: false,
    garbageReason: 'college syllabus detected'
  });

  // 5. Mock documentRepository.update to catch status updates
  let updatedDocStatus = null;
  let updatedDocError = null;
  documentRepository.update = async (id, updateData) => {
    updatedDocStatus = updateData.status;
    updatedDocError = updateData.errorMessage;
    return { ...mockDoc, ...updateData };
  };

  // Mock documentService dependency if it gets called, or bypass by ensuring process.env works
  const documentService = require('../services/documentService');
  documentService.extractTextFromPDF = async () => 'Mock text representing a college syllabus';

  try {
    process.env.MODEL_API_KEY = 'AIzaSyDummyKey'; // enforce geminiService branch
    await itineraryService.createItinerary({
      userId: 'mock_user_id',
      file: {
        originalname: 'syllabus.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('mock pdf content')
      }
    });
    console.error('FAILURE: Expected createItinerary to throw AppError but it succeeded.');
  } catch (error) {
    if (error instanceof AppError) {
      console.log('Status Code:', error.statusCode);
      console.log('Error Message:', error.message);
      
      const expectedMessage = 'Invalid Travel Document: college syllabus detected';
      const isMessageCorrect = error.message === expectedMessage;
      const isStatus400 = error.statusCode === 400;
      const isCloudinaryDeleted = deletedAssetId === 'mock_public_id';
      const isDocStatusFailed = updatedDocStatus === 'failed';

      if (isMessageCorrect && isStatus400 && isCloudinaryDeleted && isDocStatusFailed) {
        console.log('\nSUCCESS: Mock test passed!');
        console.log('- Threw correct 400 Bad Request status');
        console.log(`- Threw correct message: "${error.message}"`);
        console.log('- Successfully deleted uploaded asset from Cloudinary');
        console.log('- Correctly updated database document status to "failed"');
      } else {
        console.error('FAILURE: Some assertions failed:', {
          isMessageCorrect,
          isStatus400,
          isCloudinaryDeleted,
          isDocStatusFailed
        });
      }
    } else {
      console.error('FAILURE: Caught unexpected error type:', error);
    }
  }
}

runMockTest().catch(console.error);
