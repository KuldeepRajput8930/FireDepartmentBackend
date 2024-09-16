const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const FormDataModel = require("./models/LoginFormdata");
const Departmentlogin = require("./models/DepartmentLogin");
const Application = require("./models/Application");
const FireExtinguishingDetails = require("./models/FireExtinguishingDetails");
const OfficerLogin = require("./models/OfficerLogin");

// Import dotenv to use environment variables
require("dotenv").config();

// Constants
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.mongoURI;

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ------------------- File Upload Setup with Multer -------------------

// Setup multer with file size limit and type validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/${req.body.email}`; // Organize files by user email
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`; // Generate unique filenames with timestamp
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf, .jpg, .jpeg, .png files are allowed"));
    }
  },
});

// ------------------- Authentication Middleware -------------------

const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token) {
    const tokenWithoutBearer = token.split(" ")[1]; // Extract token from "Bearer <token>"
    jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden
      req.user = user; // Attach user info to request
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// ------------------- Routes -------------------

// Registration route
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  FormDataModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.status(400).json({
          message: "An account with this email ID already exists, please login",
        });
      } else {
        FormDataModel.create(req.body)
          .then((newUser) => res.status(201).json(newUser))
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  FormDataModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          // Create JWT token
          const token = jwt.sign({ email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
          });
          res.status(200).json({
            token,
            message: "Login successful!",
          });
        } else {
          res.status(401).json({ message: "Wrong password" });
        }
      } else {
        res.status(404).json({ message: "No records found!" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// route to handle department login

app.post("/departmentlogin", async (req, res) => {
  const { email, password } = req.body;

  Departmentlogin.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          // Create JWT token
          const token = jwt.sign({ email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
          });
          res.status(200).json({
            token,
            message: "Login successful!",
          });
        } else {
          res.status(401).json({ message: "Wrong password" });
        }
      } else {
        res.status(404).json({ message: "No records found!" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});
// route to handle officer login

app.post("/officerlogin", async (req, res) => {
  const { email, password } = req.body;

  OfficerLogin.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          // Create JWT token
          const token = jwt.sign({ email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
          });
          res.status(200).json({
            token,
            message: "Login successful!",
          });
        } else {
          res.status(401).json({ message: "Wrong password" });
        }
      } else {
        res.status(404).json({ message: "No records found!" });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Route to handle form submission
app.post("/submit", async (req, res) => {
  try {
    const newDetails = new FireExtinguishingDetails(req.body);
    // Save the data to the database
    await newDetails.save();

    // Send a success response
    res.status(201).json({ message: "Details saved successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error saving details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to fetch all applications (for department dashboard)
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find(); // Fetch all applications
    console.log("Fetched Applications:", applications);
    res.json(applications); // Send the applications as a JSON response
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
});

app.get("/api/user/applications", authenticateJWT, async (req, res) => {
  console.log("Authenticated user:", req.user); // Check if this logs the user correctly
  try {
    const applications = await FireExtinguishingDetails.find({
      email: req.user.email,
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get a specific application by ID
app.get("/api/application/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application); // Return application details
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update application status (accept/reject)
app.put("/api/application/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the status is 'accepted' and send email
    if (status === "accepted") {
      sendAcceptanceEmail(application.email, application._id); // Send acceptance email
    } else if (status === "rejected") {
      sendRejectanceEmail(application.email, application._id); // Send Rejectance email
    }

    res.json(application); // Send the updated application
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Nodemailer setup for sending email
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use your email service here (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email
    pass: process.env.EMAIL_PASSWORD, // Replace with your email password or app-specific password
  },
});

// Function to send email
const sendAcceptanceEmail = (toEmail, applicationId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to: toEmail, // Receiver's email address
    subject: "Application Accepted - Fire Department",
    text: `Dear Applicant, Your application with ID: ${applicationId} has been accepted by the fire department.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const sendRejectanceEmail = (toEmail, applicationId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to: toEmail, // Receiver's email address
    subject: "Application Rejected - Fire Department",
    text: `Dear Applicant, Your application with ID: ${applicationId} has been Rejected by the fire department.`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// Initialize Twilio with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID; // From .env
const authToken = process.env.TWILIO_AUTH_TOKEN; // From .env
const client = require("twilio")(accountSid, authToken);

console.log(process.env.TWILIO_ACCOUNT_SID);
console.log(process.env.TWILIO_AUTH_TOKEN);
console.log(process.env.TWILIO_PHONE_NUMBER);

app.put("/api/application/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "accepted" or "rejected"

  try {
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update the application status
    application.status = status;
    await application.save();

    // Define custom message based on the status
    let message;
    if (status === "accepted") {
      message = `Dear ${application.firstName}, your application with ID ${application._id} has been accepted by the fire department.`;
    } else if (status === "rejected") {
      message = `Dear ${application.firstName}, your application with ID ${application._id} has been rejected by the fire department.`;
    }

    // Send SMS to the applicant
    sendSMS(application.mobNo, message);

    res
      .status(200)
      .json({ message: "Application status updated and SMS sent" });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Function to send SMS
const sendSMS = (to, message) => {
  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: +918930467411,
    })
    .then((message) => {
      console.log(`SMS sent successfully: ${message.sid}`);
    })
    .catch((error) => {
      console.error("Error sending SMS:", error);
    });
};

// Route to update scheduling details for an application
// In your schedule route (e.g., PUT /api/application/:applicationId/schedule)

app.put("/api/application/:applicationId/schedule", async (req, res) => {
  const { scheduleDate, officerName, officerMobNo, officerEmail } = req.body;
  const applicationId = req.params.applicationId;

  try {
    // Find the application by ID and update the schedule details
    const application = await Application.findByIdAndUpdate(
      applicationId,
      {
        scheduleDate,
        officerName,
        officerMobNo,
        officerEmail,
        status: "Scheduled",
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Send custom email after scheduling
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your app password
      },
    });

    const mailOptions = {
      from: "kuldeeprajput9050540739@gmail.com", // Sender email
      to: application.email, // Consumer's email (from the application)
      subject: "Your Application is Scheduled for Inspection",
      text: `Dear ${application.firstName} ${application.lastName},\n\n
              Your application with ID ${application._id} is successfully scheduled for inspection on ${scheduleDate} by Officer ${officerName}.\n
              You can contact the inspection officer at:\n
              Mobile: ${officerMobNo}\n
              Email: ${officerEmail}\n\n
              Best regards,\n
              Fire Department`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return res.json({
          message: "Application scheduled and email sent",
          application,
        });
      }
    });
  } catch (error) {
    console.error("Error scheduling application:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Serve static files (uploaded attachments)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------- Server -------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
