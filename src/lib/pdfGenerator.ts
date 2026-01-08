import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Color constants matching the HTML templates
const colors = {
  accent: rgb(0.15, 0.39, 0.92),      // #2563eb
  accentLight: rgb(0.23, 0.51, 0.96), // #3b82f6
  text: rgb(0.06, 0.09, 0.16),        // #0f172a
  muted: rgb(0.39, 0.45, 0.55),       // #64748b
  border: rgb(0.89, 0.91, 0.94),      // #e2e8f0
  bg: rgb(1, 1, 1),                   // #ffffff
};

export async function generatePdfFromResume(resume: any, template: string = 'standard-a'): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size in points (8.5" x 11")
  
  const { width, height } = page.getSize();
  const margin = 40;
  const contentWidth = width - (margin * 2);
  
  let yPosition = height - margin;
  
  // Load fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Draw header with border line (matching standard-a template)
  const headerY = yPosition;
  
  // Name
  const name = resume.name || '';
  const nameSize = 32;
  const nameWidth = helveticaBold.widthOfTextAtSize(name, nameSize);
  page.drawText(name, {
    x: (width - nameWidth) / 2,
    y: headerY,
    size: nameSize,
    font: helveticaBold,
    color: colors.text,
  });
  yPosition -= nameSize + 12;
  
  // Contact info
  const contactInfo: string[] = [];
  if (resume.email) contactInfo.push(resume.email);
  if (resume.phone) contactInfo.push(resume.phone);
  if (resume.location) contactInfo.push(resume.location);
  if (resume.linkedin) contactInfo.push(resume.linkedin);
  
  if (contactInfo.length > 0) {
    const contactText = contactInfo.join(' · ');
    const contactSize = 14;
    const contactWidth = helvetica.widthOfTextAtSize(contactText, contactSize);
    page.drawText(contactText, {
      x: (width - contactWidth) / 2,
      y: yPosition,
      size: contactSize,
      font: helvetica,
      color: colors.muted,
    });
    yPosition -= contactSize + 8;
  }
  
  // Draw horizontal line under header (accent color, 2px)
  yPosition -= 12;
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 2,
    color: colors.accent,
  });
  yPosition -= 20;
  
  // Summary section
  if (resume.summary) {
    yPosition = drawSection(page, pdfDoc, {
      title: 'SUMMARY',
      content: resume.summary,
      yPosition,
      margin,
      width,
      contentWidth,
      helvetica,
      helveticaBold,
      colors,
    });
  }
  
  // Experience section
  if (resume.experience && Array.isArray(resume.experience) && resume.experience.length > 0) {
    yPosition = drawExperienceSection(page, pdfDoc, {
      experiences: resume.experience,
      yPosition,
      margin,
      width,
      contentWidth,
      helvetica,
      helveticaBold,
      helveticaOblique,
      colors,
    });
  }
  
  // Skills section
  if (resume.skills) {
    yPosition = drawSkillsSection(page, pdfDoc, {
      skills: resume.skills,
      yPosition,
      margin,
      width,
      contentWidth,
      helvetica,
      helveticaBold,
      colors,
    });
  }
  
  // Education section
  if (resume.education && Array.isArray(resume.education) && resume.education.length > 0) {
    yPosition = drawEducationSection(page, pdfDoc, {
      education: resume.education,
      yPosition,
      margin,
      width,
      contentWidth,
      helvetica,
      helveticaBold,
      colors,
    });
  }
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

function drawSection(
  page: any,
  pdfDoc: PDFDocument,
  options: {
    title: string;
    content: string;
    yPosition: number;
    margin: number;
    width: number;
    contentWidth: number;
    helvetica: any;
    helveticaBold: any;
    colors: any;
  }
): number {
  let { yPosition, margin, width, contentWidth, helvetica, helveticaBold, colors } = options;
  const sectionPadding = 16;
  const sectionMargin = 12;
  
  // Check if we need a new page
  if (yPosition < 150) {
    const newPage = pdfDoc.addPage([612, 792]);
    yPosition = 792 - margin;
  }
  
  const sectionStartY = yPosition;
  const sectionTop = yPosition + sectionPadding;
  
  // Section title
  const titleSize = 13;
  page.drawText(options.title, {
    x: margin + sectionPadding,
    y: sectionTop,
    size: titleSize,
    font: helveticaBold,
    color: colors.accent,
  });
  
  // Draw accent line after title
  const titleWidth = helveticaBold.widthOfTextAtSize(options.title, titleSize);
  const lineStartX = margin + sectionPadding + titleWidth + 12;
  const lineEndX = width - margin - sectionPadding;
  if (lineEndX > lineStartX) {
    page.drawLine({
      start: { x: lineStartX, y: sectionTop + titleSize / 2 },
      end: { x: lineEndX, y: sectionTop + titleSize / 2 },
      thickness: 1,
      color: colors.accent,
    });
  }
  
  yPosition = sectionTop - titleSize - 8;
  
  // Draw colored accent bar on left (4px wide)
  const accentBarWidth = 4;
  page.drawRectangle({
    x: margin,
    y: yPosition - 20,
    width: accentBarWidth,
    height: 100, // Will be adjusted based on content
    color: colors.accent,
  });
  
  // Content
  const contentSize = 14;
  const contentLines = wrapText(options.content, contentWidth - (sectionPadding * 2) - accentBarWidth, helvetica, contentSize);
  contentLines.forEach((line: string) => {
    if (yPosition < 50) {
      const newPage = pdfDoc.addPage([612, 792]);
      yPosition = 792 - margin - sectionPadding;
    }
    page.drawText(line, {
      x: margin + sectionPadding + accentBarWidth,
      y: yPosition,
      size: contentSize,
      font: helvetica,
      color: colors.muted,
      maxWidth: contentWidth - (sectionPadding * 2) - accentBarWidth,
    });
    yPosition -= contentSize * 1.7;
  });
  
  // Draw section border
  const sectionHeight = sectionStartY - yPosition + sectionPadding;
  page.drawRectangle({
    x: margin,
    y: yPosition - sectionPadding,
    width: contentWidth,
    height: sectionHeight,
    borderColor: colors.border,
    borderWidth: 1,
  });
  
  yPosition -= sectionMargin + sectionPadding;
  return yPosition;
}

function drawExperienceSection(
  page: any,
  pdfDoc: PDFDocument,
  options: {
    experiences: any[];
    yPosition: number;
    margin: number;
    width: number;
    contentWidth: number;
    helvetica: any;
    helveticaBold: any;
    helveticaOblique: any;
    colors: any;
  }
): number {
  let { yPosition, margin, width, contentWidth, helvetica, helveticaBold, helveticaOblique, colors } = options;
  const sectionPadding = 16;
  const sectionMargin = 12;
  
  if (yPosition < 200) {
    const newPage = pdfDoc.addPage([612, 792]);
    yPosition = 792 - margin;
  }
  
  const sectionStartY = yPosition;
  const sectionTop = yPosition + sectionPadding;
  
  // Section title
  const titleSize = 13;
  page.drawText('EXPERIENCE', {
    x: margin + sectionPadding,
    y: sectionTop,
    size: titleSize,
    font: helveticaBold,
    color: colors.accent,
  });
  
  // Draw accent line after title
  const titleWidth = helveticaBold.widthOfTextAtSize('EXPERIENCE', titleSize);
  const lineStartX = margin + sectionPadding + titleWidth + 12;
  const lineEndX = width - margin - sectionPadding;
  if (lineEndX > lineStartX) {
    page.drawLine({
      start: { x: lineStartX, y: sectionTop + titleSize / 2 },
      end: { x: lineEndX, y: sectionTop + titleSize / 2 },
      thickness: 1,
      color: colors.accent,
    });
  }
  
  yPosition = sectionTop - titleSize - 8;
  
  // Draw accent bar
  const accentBarWidth = 4;
  const accentBarStartY = yPosition;
  
  options.experiences.forEach((exp: any, index: number) => {
    if (yPosition < 100) {
      const newPage = pdfDoc.addPage([612, 792]);
      yPosition = 792 - margin - sectionPadding;
    }
    
    const expStartY = yPosition;
    
    // Title and company
    const titleText = exp.title || '';
    const companyText = exp.company ? ` — ${exp.company}` : '';
    const titleCompanyText = titleText + companyText;
    
    if (titleCompanyText) {
      // Title part
      page.drawText(titleText, {
        x: margin + sectionPadding + accentBarWidth,
        y: yPosition,
        size: 16,
        font: helveticaBold,
        color: colors.text,
        maxWidth: contentWidth - (sectionPadding * 2) - accentBarWidth,
      });
      yPosition -= 18;
      
      // Company part (in accent color)
      if (exp.company) {
        page.drawText(exp.company, {
          x: margin + sectionPadding + accentBarWidth,
          y: yPosition,
          size: 15,
          font: helveticaBold,
          color: colors.accent,
          maxWidth: contentWidth - (sectionPadding * 2) - accentBarWidth,
        });
        yPosition -= 18;
      }
    }
    
    // Dates and location (right aligned)
    const dateLocation: string[] = [];
    if (exp.startDate && exp.endDate) {
      dateLocation.push(`${exp.startDate} — ${exp.endDate}`);
    }
    if (exp.location) {
      if (dateLocation.length > 0) dateLocation.push(' · ');
      dateLocation.push(exp.location);
    }
    
    if (dateLocation.length > 0) {
      const dateText = dateLocation.join('');
      const dateWidth = helveticaOblique.widthOfTextAtSize(dateText, 13);
      page.drawText(dateText, {
        x: width - margin - sectionPadding - dateWidth,
        y: yPosition + 18, // Align with title
        size: 13,
        font: helveticaOblique,
        color: colors.muted,
      });
    }
    
    yPosition -= 8;
    
    // Achievements
    if (exp.achievements && Array.isArray(exp.achievements) && exp.achievements.length > 0) {
      exp.achievements.forEach((ach: string) => {
        if (yPosition < 50) {
          const newPage = pdfDoc.addPage([612, 792]);
          yPosition = 792 - margin - sectionPadding;
        }
        const bulletText = `• ${ach}`;
        const bulletLines = wrapText(bulletText, contentWidth - (sectionPadding * 2) - accentBarWidth - 20, helvetica, 14);
        bulletLines.forEach((line: string) => {
          page.drawText(line, {
            x: margin + sectionPadding + accentBarWidth + 20,
            y: yPosition,
            size: 14,
            font: helvetica,
            color: colors.text,
            maxWidth: contentWidth - (sectionPadding * 2) - accentBarWidth - 20,
          });
          yPosition -= 16;
        });
      });
    }
    
    // Draw separator line between experiences (except last)
    if (index < options.experiences.length - 1) {
      yPosition -= 8;
      page.drawLine({
        start: { x: margin + sectionPadding + accentBarWidth, y: yPosition },
        end: { x: width - margin - sectionPadding, y: yPosition },
        thickness: 1,
        color: colors.border,
      });
      yPosition -= 16;
    } else {
      yPosition -= 8;
    }
  });
  
  // Draw accent bar (full height)
  const accentBarHeight = accentBarStartY - yPosition;
  page.drawRectangle({
    x: margin,
    y: yPosition,
    width: accentBarWidth,
    height: accentBarHeight,
    color: colors.accent,
  });
  
  // Draw section border
  const sectionHeight = sectionStartY - yPosition + sectionPadding;
  page.drawRectangle({
    x: margin,
    y: yPosition - sectionPadding,
    width: contentWidth,
    height: sectionHeight,
    borderColor: colors.border,
    borderWidth: 1,
  });
  
  yPosition -= sectionMargin + sectionPadding;
  return yPosition;
}

function drawSkillsSection(
  page: any,
  pdfDoc: PDFDocument,
  options: {
    skills: any;
    yPosition: number;
    margin: number;
    width: number;
    contentWidth: number;
    helvetica: any;
    helveticaBold: any;
    colors: any;
  }
): number {
  let { yPosition, margin, width, contentWidth, helvetica, helveticaBold, colors } = options;
  const sectionPadding = 16;
  const sectionMargin = 12;
  
  if (yPosition < 150) {
    const newPage = pdfDoc.addPage([612, 792]);
    yPosition = 792 - margin;
  }
  
  const sectionStartY = yPosition;
  const sectionTop = yPosition + sectionPadding;
  
  // Section title
  const titleSize = 13;
  page.drawText('SKILLS', {
    x: margin + sectionPadding,
    y: sectionTop,
    size: titleSize,
    font: helveticaBold,
    color: colors.accent,
  });
  
  // Draw accent line after title
  const titleWidth = helveticaBold.widthOfTextAtSize('SKILLS', titleSize);
  const lineStartX = margin + sectionPadding + titleWidth + 12;
  const lineEndX = width - margin - sectionPadding;
  if (lineEndX > lineStartX) {
    page.drawLine({
      start: { x: lineStartX, y: sectionTop + titleSize / 2 },
      end: { x: lineEndX, y: sectionTop + titleSize / 2 },
      thickness: 1,
      color: colors.accent,
    });
  }
  
  yPosition = sectionTop - titleSize - 8;
  
  // Draw accent bar
  const accentBarWidth = 4;
  const accentBarStartY = yPosition;
  
  if (typeof options.skills === 'object') {
    const skillEntries = Object.entries(options.skills);
    skillEntries.forEach(([key, value], index: number) => {
      if (yPosition < 50) {
        const newPage = pdfDoc.addPage([612, 792]);
        yPosition = 792 - margin - sectionPadding;
      }
      
      // Category (uppercase, accent color)
      const categoryText = key.toUpperCase();
      page.drawText(categoryText, {
        x: margin + sectionPadding + accentBarWidth,
        y: yPosition,
        size: 13,
        font: helveticaBold,
        color: colors.accent,
        maxWidth: contentWidth - (sectionPadding * 2) - accentBarWidth,
      });
      yPosition -= 16;
      
      // Value
      const valueText = Array.isArray(value) ? value.join(', ') : String(value);
      const valueLines = wrapText(valueText, contentWidth - (sectionPadding * 2) - accentBarWidth, helvetica, 13);
      valueLines.forEach((line: string) => {
        page.drawText(line, {
          x: margin + sectionPadding + accentBarWidth,
          y: yPosition,
          size: 13,
          font: helvetica,
          color: colors.muted,
          maxWidth: contentWidth - (sectionPadding * 2) - accentBarWidth,
        });
        yPosition -= 14;
      });
      
      // Separator line (except last)
      if (index < skillEntries.length - 1) {
        yPosition -= 4;
        page.drawLine({
          start: { x: margin + sectionPadding + accentBarWidth, y: yPosition },
          end: { x: width - margin - sectionPadding, y: yPosition },
          thickness: 1,
          color: colors.border,
        });
        yPosition -= 6;
      }
    });
  }
  
  // Draw accent bar
  const accentBarHeight = accentBarStartY - yPosition;
  page.drawRectangle({
    x: margin,
    y: yPosition,
    width: accentBarWidth,
    height: accentBarHeight,
    color: colors.accent,
  });
  
  // Draw section border
  const sectionHeight = sectionStartY - yPosition + sectionPadding;
  page.drawRectangle({
    x: margin,
    y: yPosition - sectionPadding,
    width: contentWidth,
    height: sectionHeight,
    borderColor: colors.border,
    borderWidth: 1,
  });
  
  yPosition -= sectionMargin + sectionPadding;
  return yPosition;
}

function drawEducationSection(
  page: any,
  pdfDoc: PDFDocument,
  options: {
    education: any[];
    yPosition: number;
    margin: number;
    width: number;
    contentWidth: number;
    helvetica: any;
    helveticaBold: any;
    colors: any;
  }
): number {
  let { yPosition, margin, width, contentWidth, helvetica, helveticaBold, colors } = options;
  const sectionPadding = 16;
  const sectionMargin = 12;
  
  if (yPosition < 150) {
    const newPage = pdfDoc.addPage([612, 792]);
    yPosition = 792 - margin;
  }
  
  const sectionStartY = yPosition;
  const sectionTop = yPosition + sectionPadding;
  
  // Section title
  const titleSize = 13;
  page.drawText('EDUCATION', {
    x: margin + sectionPadding,
    y: sectionTop,
    size: titleSize,
    font: helveticaBold,
    color: colors.accent,
  });
  
  // Draw accent line after title
  const titleWidth = helveticaBold.widthOfTextAtSize('EDUCATION', titleSize);
  const lineStartX = margin + sectionPadding + titleWidth + 12;
  const lineEndX = width - margin - sectionPadding;
  if (lineEndX > lineStartX) {
    page.drawLine({
      start: { x: lineStartX, y: sectionTop + titleSize / 2 },
      end: { x: lineEndX, y: sectionTop + titleSize / 2 },
      thickness: 1,
      color: colors.accent,
    });
  }
  
  yPosition = sectionTop - titleSize - 8;
  
  // Draw accent bar
  const accentBarWidth = 4;
  const accentBarStartY = yPosition;
  
  options.education.forEach((edu: any, index: number) => {
    if (yPosition < 50) {
      const newPage = pdfDoc.addPage([612, 792]);
      yPosition = 792 - margin - sectionPadding;
    }
    
    // Degree (bold)
    if (edu.degree) {
      page.drawText(edu.degree, {
        x: margin + sectionPadding + accentBarWidth,
        y: yPosition,
        size: 15,
        font: helveticaBold,
        color: colors.text,
        maxWidth: contentWidth - (sectionPadding * 2) - accentBarWidth,
      });
      yPosition -= 18;
    }
    
    // School (accent color)
    if (edu.school) {
      page.drawText(edu.school, {
        x: margin + sectionPadding + accentBarWidth,
        y: yPosition,
        size: 14,
        font: helveticaBold,
        color: colors.accent,
        maxWidth: contentWidth - (sectionPadding * 2) - accentBarWidth,
      });
      yPosition -= 18;
    }
    
    // Date (right aligned, muted)
    if (edu.graduationDate) {
      const dateWidth = helveticaBold.widthOfTextAtSize(edu.graduationDate, 13);
      page.drawText(edu.graduationDate, {
        x: width - margin - sectionPadding - dateWidth,
        y: yPosition + 18, // Align with degree
        size: 13,
        font: helveticaBold,
        color: colors.muted,
      });
    }
    
    // Separator line (except last)
    if (index < options.education.length - 1) {
      yPosition -= 8;
      page.drawLine({
        start: { x: margin + sectionPadding + accentBarWidth, y: yPosition },
        end: { x: width - margin - sectionPadding, y: yPosition },
        thickness: 1,
        color: colors.border,
      });
      yPosition -= 8;
    } else {
      yPosition -= 8;
    }
  });
  
  // Draw accent bar
  const accentBarHeight = accentBarStartY - yPosition;
  page.drawRectangle({
    x: margin,
    y: yPosition,
    width: accentBarWidth,
    height: accentBarHeight,
    color: colors.accent,
  });
  
  // Draw section border
  const sectionHeight = sectionStartY - yPosition + sectionPadding;
  page.drawRectangle({
    x: margin,
    y: yPosition - sectionPadding,
    width: contentWidth,
    height: sectionHeight,
    borderColor: colors.border,
    borderWidth: 1,
  });
  
  yPosition -= sectionMargin + sectionPadding;
  return yPosition;
}

// Helper function to wrap text
function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  // Replace unsupported Unicode characters
  const safeText = text
    .replace(/▸/g, '•')
    .replace(/—/g, '-')
    .replace(/–/g, '-')
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/'/g, "'");
  
  const words = safeText.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    try {
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    } catch (error) {
      console.warn('Text encoding issue:', error);
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}
