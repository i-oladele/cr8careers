import { jsPDF } from 'jspdf';
import { Course } from '../data/courseContent';

interface CertificateData {
  userName: string;
  courseName: string;
  completionDate: string;
  instructor: string;
  duration: string;
  level: string;
}

export function generateCertificate(data: CertificateData, course: Course) {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Set background
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, 297, 210, 'F');

  // Add decorative border
  pdf.setDrawColor(13, 148, 136); // #0d9488
  pdf.setLineWidth(2);
  pdf.rect(10, 10, 277, 190);

  // Add inner border
  pdf.setDrawColor(13, 148, 136);
  pdf.setLineWidth(1);
  pdf.rect(15, 15, 267, 180);

  // Add header background
  pdf.setFillColor(13, 148, 136, 0.1);
  pdf.rect(15, 15, 267, 40, 'F');

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.setTextColor(13, 148, 136);
  pdf.text('Certificate of Completion', 148.5, 35, { align: 'center' });

  // Subtitle
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text('This is to certify that', 148.5, 65, { align: 'center' });

  // Student name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(29, 29, 29);
  pdf.text(data.userName, 148.5, 85, { align: 'center' });

  // Course completion text
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text('has successfully completed the course', 148.5, 105, { align: 'center' });

  // Course name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(245, 140, 33); // #f58c21
  pdf.text(data.courseName, 148.5, 125, { align: 'center' });

  // Course details
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Duration: ${data.duration} | Level: ${data.level}`, 148.5, 145, { align: 'center' });

  // Instructor
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(11);
  pdf.text(`Instructor: ${data.instructor}`, 148.5, 160, { align: 'center' });

  // Date
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(`Completed on ${data.completionDate}`, 148.5, 170, { align: 'center' });

  // Add decorative elements
  pdf.setDrawColor(245, 140, 33);
  pdf.setLineWidth(1);
  pdf.line(50, 180, 247, 180);

  // Add CR8Careers branding
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(13, 148, 136);
  pdf.text('CR8Careers - Repositioning HR, Repositioning People', 148.5, 195, { align: 'center' });

  // Save the PDF
  pdf.save(`certificate-${data.courseName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}

export function downloadCertificate(course: Course, userName: string) {
  const certificateData: CertificateData = {
    userName: userName,
    courseName: course.title,
    completionDate: new Date().toLocaleDateString(),
    instructor: course.instructor,
    duration: course.duration,
    level: course.level
  };

  generateCertificate(certificateData, course);
}

// Certificate preview component
export function CertificatePreview({ 
  course, 
  userName, 
  onDownload 
}: { 
  course: Course; 
  userName: string; 
  onDownload: () => void;
}) {
  return (
    <div className="border-4 border-double border-[#0d9488] p-8 bg-white max-w-4xl mx-auto">
      <div className="text-center">
        {/* Header */}
        <div className="bg-[#0d9488] bg-opacity-10 p-4 mb-6">
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#0d9488]">
            Certificate of Completion
          </h2>
        </div>

        {/* Certification text */}
        <p className="font-['DM_Sans',sans-serif] text-lg text-gray-600 mb-4">
          This is to certify that
        </p>

        {/* Student name */}
        <p className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-6">
          {userName}
        </p>

        {/* Course completion */}
        <p className="font-['DM_Sans',sans-serif] text-lg text-gray-600 mb-4">
          has successfully completed the course
        </p>

        {/* Course name */}
        <p className="font-['DM_Sans',sans-serif] font-bold text-2xl text-[#f58c21] mb-6">
          {course.title}
        </p>

        {/* Course details */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="font-['DM_Sans',sans-serif] text-sm text-gray-600">Duration</p>
            <p className="font-['DM_Sans',sans-serif] font-semibold">{course.duration}</p>
          </div>
          <div className="text-center">
            <p className="font-['DM_Sans',sans-serif] text-sm text-gray-600">Level</p>
            <p className="font-['DM_Sans',sans-serif] font-semibold">{course.level}</p>
          </div>
          <div className="text-center">
            <p className="font-['DM_Sans',sans-serif] text-sm text-gray-600">Instructor</p>
            <p className="font-['DM_Sans',sans-serif] font-semibold">{course.instructor}</p>
          </div>
        </div>

        {/* Completion date */}
        <p className="font-['DM_Sans',sans-serif] text-sm text-gray-600 mb-6">
          Completed on {new Date().toLocaleDateString()}
        </p>

        {/* Decorative line */}
        <div className="border-t-2 border-[#f58c21] mb-4"></div>

        {/* Branding */}
        <p className="font-['DM_Sans',sans-serif] text-sm text-[#0d9488] font-semibold">
          CR8Careers - Repositioning HR, Repositioning People
        </p>

        {/* Download button */}
        <button
          onClick={onDownload}
          className="mt-6 bg-[#0d9488] text-white px-6 py-3 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-bold"
        >
          Download Certificate
        </button>
      </div>
    </div>
  );
}
