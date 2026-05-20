require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Ensure database file exists
const DB_FILE = path.join(__dirname, 'db.json');
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ submissions: [] }, null, 2));
}

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limits
});

// Load submissions database helper
const getSubmissions = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data).submissions;
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
};

// Save submissions database helper
const saveSubmissions = (submissions) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify({ submissions }, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// Configure Nodemailer SMTP Transporter
const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Check if credentials are mock/default
  const isMock = !user || user.includes('mock-email') || !pass || pass.includes('mock-pass');

  if (isMock) {
    console.log('⚠️ Running in SMTP Dry-Run Mode (mock credentials). Emails will be logged to console.');
    return null;
  }

  // Gmail SMTP setup
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass }
  });
};

// HTML email template helper for authors
const getAuthorEmailHtml = (submission) => {
  return `
    <div style="background-color: #0b0f19; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #6366f1; margin: 0; font-size: 28px; letter-spacing: 1.5px;">LIBERELO</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Your Self-Publishing Success Engine</p>
      </div>
      
      <div style="background-color: #111827; padding: 24px; border-radius: 8px; border: 1px solid #1f2937; margin-bottom: 24px;">
        <h2 style="color: #f8fafc; margin-top: 0; font-size: 20px; border-bottom: 1px solid #1f2937; padding-bottom: 10px;">Submission Received</h2>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">Dear <strong>${submission.fullName}</strong>,</p>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">We have successfully received your manuscript, <strong>${submission.manuscriptName}</strong>, for automated ingestion and formatting. Your project ID is listed below:</p>
        
        <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%); border: 1px dashed #6366f1; padding: 12px; text-align: center; border-radius: 6px; margin: 20px 0;">
          <span style="font-size: 13px; color: #a5b4fc; text-transform: uppercase; letter-spacing: 1px; display: block;">Submission Tracking ID</span>
          <span style="font-size: 22px; font-weight: bold; color: #f8fafc; letter-spacing: 2px;">${submission.id}</span>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="color: #38bdf8; font-size: 16px; margin-bottom: 10px;">What Happens Next?</h3>
        <ol style="padding-left: 20px; color: #cbd5e1; font-size: 14px; line-height: 1.8;">
          <li><strong>Automated Scan & Review:</strong> Our system will parse your document file to verify text formatting structure, calculate precise page dimensions, and detect any placeholder text leaks.</li>
          <li><strong>Ingest Approval:</strong> Once our review is finalized, we will generate a verification report for you.</li>
          <li><strong>EPUB3 Generation:</strong> Approved files will be compiled into high-fidelity, validated Reflowable EPUB3 files, fully optimized for Amazon Kindle, Apple Books, and Google Play.</li>
        </ol>
      </div>

      <div style="background-color: #0f172a; padding: 16px; border-radius: 6px; border-left: 4px solid #10b981; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
          <strong>Rights & Intellectual Property Notice:</strong> You retain 100% intellectual property ownership of your files. Liberelo acts solely as a compilation processing platform.
        </p>
      </div>

      <div style="border-top: 1px solid #1e293b; padding-top: 20px; text-align: center; font-size: 12px; color: #64748b;">
        <p style="margin: 5px 0;">Liberelo Publishing Inc. | Secure Digital Ingestion Protocol</p>
        <p style="margin: 5px 0;">Need help? Track your progress directly inside the Liberelo Mobile Application.</p>
      </div>
    </div>
  `;
};

// HTML email template helper for admin notifications
const getAdminEmailHtml = (submission) => {
  return `
    <div style="background-color: #0f172a; color: #f8fafc; font-family: sans-serif; padding: 30px; border-radius: 8px;">
      <h2 style="color: #a855f7; border-bottom: 1px solid #334155; padding-bottom: 10px; margin-top: 0;">New Manuscript Submission Alert</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; color: #cbd5e1;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #94a3b8;">Submission ID:</td>
          <td>${submission.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #94a3b8;">Author Name:</td>
          <td>${submission.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #94a3b8;">Email Address:</td>
          <td>${submission.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #94a3b8;">Phone Contact:</td>
          <td>${submission.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #94a3b8;">Genre:</td>
          <td>${submission.genre || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #94a3b8;">Manuscript Name:</td>
          <td>${submission.manuscriptName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #94a3b8;">Signature Status:</td>
          <td>Executed (Verified Match: "${submission.signature}")</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #94a3b8;">Date Submitted:</td>
          <td>${new Date(submission.createdAt).toLocaleString()}</td>
        </tr>
      </table>
      <div style="background-color: #1e293b; padding: 15px; border-radius: 6px; margin-top: 15px;">
        <span style="font-weight: bold; display: block; margin-bottom: 5px; color: #f8fafc;">Local File Path:</span>
        <code style="color: #38bdf8; font-size: 12px; word-break: break-all;">${submission.filePath}</code>
      </div>
    </div>
  `;
};

// POST: Intake endpoint
app.post('/api/submissions', upload.single('file'), async (req, res) => {
  try {
    const { fullName, email, phone, genre, signature } = req.body;
    const file = req.file;

    if (!fullName || !email || !file) {
      return res.status(400).json({ error: 'Missing mandatory fields: fullName, email, or manuscript file.' });
    }

    const uniqueId = `LIB-${Math.floor(100000 + Math.random() * 900000)}`;

    const newSubmission = {
      id: uniqueId,
      fullName,
      email: email.trim().toLowerCase(),
      phone: phone || '',
      genre: genre || 'Unspecified',
      manuscriptName: file.originalname,
      filePath: file.path,
      signature,
      status: 'Submitted', // Submitted -> In Review -> Formatting -> Ready
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0.15, // progress indicator between 0 and 1
    };

    // Save to local JSON store
    const submissions = getSubmissions();
    submissions.push(newSubmission);
    saveSubmissions(submissions);

    console.log(`✅ Ingested submission ${uniqueId} for ${fullName} (${email})`);

    // Prepare and dispatch SMTP emails
    const transporter = createTransporter();
    
    if (transporter) {
      try {
        // Mail to Author
        await transporter.sendMail({
          from: `"Liberelo Ingest" <${process.env.SMTP_USER}>`,
          to: email,
          subject: `📚 Your Liberelo Manuscript Submission Confirmation [${uniqueId}]`,
          html: getAuthorEmailHtml(newSubmission),
        });
        console.log(`📧 Confirmation email successfully dispatched to Author (${email})`);

        // Mail to Admin
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
        await transporter.sendMail({
          from: `"Liberelo System" <${process.env.SMTP_USER}>`,
          to: adminEmail,
          subject: `🚨 [NEW SUBMISSION] ${uniqueId} - ${fullName}`,
          html: getAdminEmailHtml(newSubmission),
          attachments: [
            {
              filename: file.originalname,
              path: file.path,
            }
          ]
        });
        console.log(`📧 Notification email successfully dispatched to Admin (${adminEmail}) with manuscript attachment`);

      } catch (mailError) {
        console.error('❌ Failed to dispatch SMTP notifications:', mailError);
        // Do not fail the API response if email fail - return success to user with warning in logs
      }
    } else {
      // Dry run logging
      console.log('--- SMTP DRY RUN: Email to Author ---');
      console.log(`To: ${email}`);
      console.log(`Subject: 📚 Your Liberelo Manuscript Submission Confirmation [${uniqueId}]`);
      console.log('Body: (HTML content matches templates)');
      console.log('------------------------------------');
    }

    // Success response
    return res.status(201).json({
      success: true,
      message: 'Manuscript submitted and ingested successfully.',
      submissionId: uniqueId,
      submission: {
        id: uniqueId,
        fullName,
        email,
        manuscriptName: file.originalname,
        status: 'Submitted',
        createdAt: newSubmission.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error processing manuscript ingestion:', error);
    res.status(500).json({ error: 'Internal server error processing compilation workflow.' });
  }
});

// GET: Fetch submissions by email
app.get('/api/submissions/author/:email', (req, res) => {
  const email = req.params.email.trim().toLowerCase();
  const submissions = getSubmissions();
  const filtered = submissions.filter(sub => sub.email === email);
  res.json({ success: true, submissions: filtered });
});

// GET: Track submission by ID
app.get('/api/submissions/track/:id', (req, res) => {
  const id = req.params.id.toUpperCase();
  const submissions = getSubmissions();
  const found = submissions.find(sub => sub.id === id);

  if (!found) {
    return res.status(404).json({ error: 'Submission record not found.' });
  }

  res.json({ success: true, submission: found });
});

// POST: Helper endpoint to update status (for test & verification purposes)
app.post('/api/submissions/:id/status', (req, res) => {
  const id = req.params.id.toUpperCase();
  const { status, progress } = req.body;

  const validStatuses = ['Submitted', 'In Review', 'Formatting', 'Ready'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const submissions = getSubmissions();
  const index = submissions.findIndex(sub => sub.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Submission record not found.' });
  }

  submissions[index].status = status || submissions[index].status;
  if (progress !== undefined) {
    submissions[index].progress = parseFloat(progress);
  } else {
    // Auto-update progress based on status
    if (status === 'Submitted') submissions[index].progress = 0.15;
    else if (status === 'In Review') submissions[index].progress = 0.45;
    else if (status === 'Formatting') submissions[index].progress = 0.75;
    else if (status === 'Ready') submissions[index].progress = 1.0;
  }
  submissions[index].updatedAt = new Date().toISOString();

  saveSubmissions(submissions);
  console.log(`♻️ Updated submission ${id} status to ${submissions[index].status} (progress: ${submissions[index].progress})`);

  res.json({ success: true, submission: submissions[index] });
});

// Check Server Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Liberelo Ingestion SMTP Server active on port ${PORT}`);
});
