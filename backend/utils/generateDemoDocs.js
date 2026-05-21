const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputDir = path.join(__dirname, '..', '..', 'Demodocuments');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createFlightPdf() {
  const doc = new PDFDocument();
  const filePath = path.join(outputDir, 'flight_ticket.pdf');
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('FLIGHT CONFIRMATION / E-TICKET', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text('Passenger Name: Test User');
  doc.text('Airline: Air France');
  doc.text('Flight Number: AF015');
  doc.text('Class: Economy');
  doc.moveDown();
  doc.text('Departure Airport: JFK, New York');
  doc.text('Departure Date: June 15, 2026');
  doc.text('Departure Time: 19:30');
  doc.moveDown();
  doc.text('Arrival Airport: CDG, Paris');
  doc.text('Arrival Date: June 16, 2026');
  doc.text('Arrival Time: 08:45');
  doc.moveDown();
  doc.text('Booking Reference: AF987654');

  doc.end();
}

function createHotelPdf() {
  const doc = new PDFDocument();
  const filePath = path.join(outputDir, 'hotel_reservation.pdf');
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('HOTEL RESERVATION CONFIRMATION', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text('Hotel Name: Hotel de Paris');
  doc.text('Address: 12 Rue de la Paix, 75002 Paris, France');
  doc.text('Phone: +33 1 23 45 67 89');
  doc.moveDown();
  doc.text('Guest Name: Test User');
  doc.text('Confirmation Number: HP-2026-993');
  doc.text('Check-in Date: June 16, 2026 (15:00)');
  doc.text('Check-out Date: June 19, 2026 (11:00)');
  doc.text('Room Type: Deluxe Double Room');
  doc.text('Number of Nights: 3');

  doc.end();
}

function createActivityPdf() {
  const doc = new PDFDocument();
  const filePath = path.join(outputDir, 'activity_booking.pdf');
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('ACTIVITY TOUR BOOKING VOUCHER', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text('Activity Name: Eiffel Tower Skip-the-Line Tour');
  doc.text('Operator: Paris City Vision');
  doc.text('Voucher Code: PCV-88273-X');
  doc.moveDown();
  doc.text('Date of Tour: June 17, 2026');
  doc.text('Meeting Time: 10:00');
  doc.text('Meeting Point: Eiffel Tower South Pillar, Paris, France');
  doc.text('Group Size: 2 Adults');
  doc.text('Guide Language: English');

  doc.end();
}

createFlightPdf();
createHotelPdf();
createActivityPdf();
