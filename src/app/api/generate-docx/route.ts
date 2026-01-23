import { NextRequest, NextResponse } from "next/server";
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
  try {
    const { coverLetter } = await request.json();

    if (!coverLetter) {
      return NextResponse.json(
        { error: "Cover letter text is required" },
        { status: 400 }
      );
    }

    // Create a basic .docx file structure
    // A .docx file is a ZIP archive containing XML files
    const zip = new JSZip();

    // Split cover letter into paragraphs (by double line breaks)
    const paragraphs = coverLetter.split(/\n\s*\n/).filter((p: string) => p.trim());
    if (paragraphs.length === 0) {
      paragraphs.push(coverLetter);
    }

    // Create paragraph XML for each paragraph
    const paragraphXmls = paragraphs.map((para: string) => {
      // Split by single line breaks to handle line breaks within paragraphs
      const lines = para.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
      
      if (lines.length === 0) {
        return `    <w:p>
      <w:r>
        <w:t></w:t>
      </w:r>
    </w:p>`;
      }
      
      // Create runs for each line with line breaks between them
      const runs: string[] = [];
      lines.forEach((line: string, index: number) => {
        runs.push(`      <w:r>
        <w:t xml:space="preserve">${escapeXml(line)}</w:t>
      </w:r>`);
        // Add line break after each line except the last one
        if (index < lines.length - 1) {
          runs.push(`      <w:r>
        <w:br/>
      </w:r>`);
        }
      });
      
      return `    <w:p>
${runs.join('\n')}
    </w:p>`;
    }).join('\n');

    // Create the main document XML
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:xml="http://www.w3.org/XML/1998/namespace">
  <w:body>
${paragraphXmls}
  </w:body>
</w:document>`;

    // Create relationships XML
    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    // Create document relationships XML
    const documentRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`;

    // Create content types XML
    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

    // Create app properties XML
    const appXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Office Word</Application>
</Properties>`;

    // Create core properties XML
    const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title></dc:title>
  <dc:creator></dc:creator>
  <cp:keywords></cp:keywords>
  <dc:description></dc:description>
  <cp:lastModifiedBy></cp:lastModifiedBy>
  <cp:revision>1</cp:revision>
  <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified>
</cp:coreProperties>`;

    // Create settings XML
    const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
</w:settings>`;

    // Create styles XML
    const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>
</w:styles>`;

    // Add files to ZIP
    zip.file("[Content_Types].xml", contentTypesXml);
    zip.file("_rels/.rels", relsXml);
    zip.file("word/document.xml", documentXml);
    zip.file("word/_rels/document.xml.rels", documentRelsXml);
    zip.file("word/settings.xml", settingsXml);
    zip.file("word/styles.xml", stylesXml);
    zip.file("docProps/app.xml", appXml);
    zip.file("docProps/core.xml", coreXml);

    // Generate the ZIP file as a buffer
    const docxBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Return the file as a response
    return new NextResponse(docxBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=cover-letter.docx",
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while generating the DOCX file",
      },
      { status: 500 }
    );
  }
}

// Helper function to escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
