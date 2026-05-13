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

async function getLogoDataUrl(): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = '/logo.png';
  });
}

async function generateCertificate(data: CertificateData) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297, H = 210;
  const cx = W / 2;

  // Background — warm ivory
  pdf.setFillColor(254, 252, 247);
  pdf.rect(0, 0, W, H, 'F');

  // Gold outer border
  pdf.setDrawColor(201, 168, 76);
  pdf.setLineWidth(1.5);
  pdf.rect(7, 7, W - 14, H - 14);

  // Thinner gold inner border
  pdf.setLineWidth(0.4);
  pdf.rect(11, 11, W - 22, H - 22);

  // Corner L-marks (gold, thick)
  const c = 12, cs = 10;
  pdf.setLineWidth(2);
  [
    [c, c, c + cs, c, c, c + cs],
    [W - c, c, W - c - cs, c, W - c, c + cs],
    [c, H - c, c + cs, H - c, c, H - c - cs],
    [W - c, H - c, W - c - cs, H - c, W - c, H - c - cs],
  ].forEach(([x1, y1, x2, y2, x3, y3]) => {
    pdf.line(x1, y1, x2, y2);
    pdf.line(x1, y1, x3, y3);
  });

  // Logo on ivory background
  const logoData = await getLogoDataUrl();
  if (logoData) {
    pdf.addImage(logoData, 'PNG', cx - 28, 16, 56, 18);
  } else {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(237, 42, 16);
    pdf.text('CR8CAREERS', cx, 26, { align: 'center' });
  }

  // Tagline below logo
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(180, 160, 100);
  pdf.text('REPOSITIONING HR  |  REPOSITIONING PEOPLE', cx, 38, { align: 'center' });

  // Gold divider below tagline
  pdf.setDrawColor(201, 168, 76);
  pdf.setLineWidth(0.8);
  pdf.line(14, 44, W - 14, 44);

  // "CERTIFICATE OF ACHIEVEMENT"
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(26);
  pdf.setTextColor(26, 32, 56);
  pdf.text('CERTIFICATE OF ACHIEVEMENT', cx, 62, { align: 'center' });

  // Decorative dots either side of title
  pdf.setFillColor(201, 168, 76);
  pdf.circle(cx - 82, 59.5, 1.2, 'F');
  pdf.circle(cx + 82, 59.5, 1.2, 'F');

  // "This is to certify that"
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(11);
  pdf.setTextColor(130, 110, 70);
  pdf.text('This is to certify that', cx, 74, { align: 'center' });

  // Learner name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.setTextColor(29, 29, 29);
  pdf.text(data.userName, cx, 92, { align: 'center' });

  // Underline the name in orange
  const nameW = pdf.getTextWidth(data.userName);
  pdf.setDrawColor(245, 140, 33);
  pdf.setLineWidth(0.8);
  pdf.line(cx - nameW / 2, 95, cx + nameW / 2, 95);

  // "has successfully completed"
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(100, 100, 100);
  pdf.text('has successfully completed the course', cx, 106, { align: 'center' });

  // Course name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(17);
  pdf.setTextColor(237, 42, 16);
  const courseLines = pdf.splitTextToSize(data.courseName, 180);
  pdf.text(courseLines, cx, 118, { align: 'center' });

  // Details row
  const detailY = courseLines.length > 1 ? 140 : 136;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Duration: ${data.duration}`, 74, detailY, { align: 'center' });
  pdf.setDrawColor(201, 168, 76);
  pdf.setLineWidth(0.3);
  pdf.line(115, detailY - 4, 115, detailY + 1);
  pdf.text(`Level: ${data.level}`, cx, detailY, { align: 'center' });
  pdf.line(182, detailY - 4, 182, detailY + 1);
  pdf.text(`Instructor: ${data.instructor}`, 223, detailY, { align: 'center' });

  // Gold divider above signature
  pdf.setDrawColor(201, 168, 76);
  pdf.setLineWidth(0.4);
  pdf.line(14, detailY + 8, W - 14, detailY + 8);

  const sigY = detailY + 20;

  // Completion date (left)
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(9);
  pdf.setTextColor(120, 100, 60);
  pdf.text(`Issued: ${data.completionDate}`, 70, sigY, { align: 'center' });

  // Signature line (centre-left)
  pdf.setDrawColor(80, 80, 80);
  pdf.setLineWidth(0.4);
  pdf.line(100, sigY + 8, 175, sigY + 8);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(80, 80, 80);
  pdf.text(data.instructor, 137.5, sigY + 13, { align: 'center' });
  pdf.setFontSize(7.5);
  pdf.setTextColor(140, 140, 140);
  pdf.text('Instructor / Course Director', 137.5, sigY + 18, { align: 'center' });

  // Seal (right)
  const sealX = 230, sealY = sigY + 6;
  pdf.setDrawColor(201, 168, 76);
  pdf.setLineWidth(1);
  pdf.circle(sealX, sealY, 18);
  pdf.setLineWidth(0.4);
  pdf.circle(sealX, sealY, 15);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);
  pdf.setTextColor(201, 168, 76);
  pdf.text('CR8CAREERS', sealX, sealY - 4, { align: 'center' });
  pdf.setFontSize(8);
  pdf.text('✦', sealX, sealY + 1, { align: 'center' });
  pdf.setFontSize(6);
  pdf.text('CERTIFIED', sealX, sealY + 6, { align: 'center' });

  pdf.save(`certificate-${data.courseName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}

export async function downloadCertificate(course: Course, userName: string) {
  const data: CertificateData = {
    userName,
    courseName: course.title,
    completionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    instructor: course.instructor || 'CR8Careers',
    duration: course.duration || 'Self-paced',
    level: course.level || 'All Levels',
  };
  await generateCertificate(data);
}

export function CertificatePreview({
  course,
  userName,
  onDownload,
}: {
  course: Course;
  userName: string;
  onDownload: () => void;
}) {
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="relative overflow-hidden rounded-lg shadow-2xl" style={{ background: '#FEFCF7', border: '6px solid #C9A84C' }}>
        {/* Inner border */}
        <div className="absolute inset-2 pointer-events-none" style={{ border: '1.5px solid #C9A84C', borderRadius: 4 }} />

        {/* Corner marks */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-5 h-5 pointer-events-none`} style={{
            borderTop: i < 2 ? '3px solid #C9A84C' : undefined,
            borderBottom: i >= 2 ? '3px solid #C9A84C' : undefined,
            borderLeft: i % 2 === 0 ? '3px solid #C9A84C' : undefined,
            borderRight: i % 2 === 1 ? '3px solid #C9A84C' : undefined,
            margin: 10,
          }} />
        ))}

        {/* Logo on ivory */}
        <div className="flex flex-col items-center pt-8 pb-3 px-8">
          <img src="/logo.png" alt="CR8Careers" className="h-12 object-contain mb-1" />
          <p className="text-xs tracking-widest" style={{ color: '#B4A064' }}>
            REPOSITIONING HR &nbsp;|&nbsp; REPOSITIONING PEOPLE
          </p>
        </div>

        {/* Gold divider */}
        <div className="h-px mx-8" style={{ background: '#C9A84C' }} />

        {/* Body */}
        <div className="px-12 py-8 text-center">
          {/* Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: '#C9A84C' }} />
            <h2 className="text-xl font-bold tracking-widest uppercase" style={{ color: '#1A2038', letterSpacing: '0.15em' }}>
              Certificate of Achievement
            </h2>
            <div className="h-px flex-1" style={{ background: '#C9A84C' }} />
          </div>

          <p className="text-sm italic mb-3" style={{ color: '#7A6A40' }}>This is to certify that</p>

          {/* Name */}
          <div className="mb-1">
            <p className="text-4xl font-bold" style={{ color: '#1D1D1D' }}>{userName}</p>
          </div>
          <div className="h-0.5 w-48 mx-auto mb-5" style={{ background: '#F58C21' }} />

          <p className="text-sm mb-3" style={{ color: '#666' }}>has successfully completed the course</p>

          {/* Course name */}
          <p className="text-xl font-bold mb-6" style={{ color: '#ED2A10' }}>{course.title}</p>

          {/* Details */}
          <div className="flex justify-center gap-10 mb-6">
            {[
              { label: 'Duration', value: course.duration || 'Self-paced' },
              { label: 'Level', value: course.level || 'All Levels' },
              { label: 'Instructor', value: course.instructor || 'CR8Careers' },
            ].map(({ label, value }, i) => (
              <div key={i} className="text-center">
                <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: '#C9A84C' }}>{label}</p>
                <p className="text-sm font-semibold" style={{ color: '#1D1D1D' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Gold divider */}
          <div className="h-px mb-5" style={{ background: '#C9A84C', opacity: 0.5 }} />

          {/* Signature + seal row */}
          <div className="flex items-end justify-between px-4">
            <div className="text-left">
              <p className="text-xs italic mb-3" style={{ color: '#7A6A40' }}>Issued: {date}</p>
              <div className="w-36 h-px mb-1" style={{ background: '#555' }} />
              <p className="text-xs font-semibold" style={{ color: '#333' }}>{course.instructor || 'CR8Careers'}</p>
              <p className="text-xs" style={{ color: '#999' }}>Instructor / Course Director</p>
            </div>

            {/* Seal */}
            <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-dashed mb-1"
              style={{ borderColor: '#C9A84C', color: '#C9A84C' }}>
              <p className="text-xs font-bold tracking-tight leading-none">CR8</p>
              <p className="text-xs font-bold tracking-tight leading-none">CAREERS</p>
              <p className="text-base leading-none mt-0.5">✦</p>
              <p className="text-xs leading-none" style={{ fontSize: 9 }}>CERTIFIED</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onDownload}
        className="mt-5 w-full py-3 rounded-lg font-bold text-white transition-colors"
        style={{ background: '#0d9488' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#0a7a70')}
        onMouseLeave={e => (e.currentTarget.style.background = '#0d9488')}
      >
        Download Certificate (PDF)
      </button>
    </div>
  );
}
