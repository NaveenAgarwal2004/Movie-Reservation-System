import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface TicketData {
  bookingReference: string;
  movie: {
    title: string;
    poster: string;
  };
  theater: {
    name: string;
    address: string;
  };
  showtime: {
    date: string;
    time: string;
  };
  seats: Array<{
    row: string;
    number: number;
    type: string;
  }>;
  totalAmount: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const generateTicketPDF = async (ticketData: TicketData) => {
  const pdf = new jsPDF();
  
  // Set font
  pdf.setFont('helvetica');
  
  // Header
  pdf.setFillColor(239, 68, 68); // Red
  pdf.rect(0, 0, 210, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.text('CineMax', 105, 20, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text('Your Movie Ticket', 105, 30, { align: 'center' });
  
  // Reset text color
  pdf.setTextColor(0, 0, 0);
  
  // Booking Reference (prominent)
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Booking Reference', 20, 55);
  pdf.setFontSize(24);
  pdf.setTextColor(239, 68, 68);
  pdf.text(ticketData.bookingReference, 20, 65);
  
  // Generate QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(ticketData.bookingReference, {
      width: 100,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    pdf.addImage(qrDataUrl, 'PNG', 150, 45, 40, 40);
  } catch (error) {
    console.error('QR Code generation error:', error);
  }
  
  // Movie Details
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Movie Details', 20, 95);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Title: ${ticketData.movie.title}`, 20, 105);
  pdf.text(`Theater: ${ticketData.theater.name}`, 20, 112);
  pdf.text(`Address: ${ticketData.theater.address}`, 20, 119);
  
  // Showtime Details
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('Showtime Details', 20, 135);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Date: ${new Date(ticketData.showtime.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, 20, 145);
  pdf.text(`Time: ${ticketData.showtime.time}`, 20, 152);
  
  // Seat Details
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('Seat Information', 20, 168);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  const seatNumbers = ticketData.seats.map(s => `${s.row}${s.number}`).join(', ');
  pdf.text(`Seats: ${seatNumbers}`, 20, 178);
  pdf.text(`Total Seats: ${ticketData.seats.length}`, 20, 185);
  
  // Customer Details
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('Customer Details', 20, 201);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Name: ${ticketData.user.firstName} ${ticketData.user.lastName}`, 20, 211);
  pdf.text(`Email: ${ticketData.user.email}`, 20, 218);
  
  // Amount
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text(`Total Amount: $${ticketData.totalAmount.toFixed(2)}`, 20, 234);
  
  // Footer
  pdf.setFillColor(31, 41, 55); // Dark gray
  pdf.rect(0, 260, 210, 37, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Important Information:', 20, 268);
  pdf.text('• Please arrive 15 minutes before showtime', 20, 274);
  pdf.text('• Carry a valid ID for verification', 20, 279);
  pdf.text('• This ticket is non-transferable', 20, 284);
  pdf.text('• Outside food & beverages not allowed', 20, 289);
  
  // Save PDF
  pdf.save(`CineMax-Ticket-${ticketData.bookingReference}.pdf`);
};

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
};

export const printTicket = async (ticketData: TicketData) => {
  const pdf = new jsPDF();
  await generateTicketPDF(ticketData);
  window.print();
};