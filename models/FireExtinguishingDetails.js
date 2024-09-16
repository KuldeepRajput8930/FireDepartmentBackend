// models/FireExtinguishingDetails.js

const mongoose = require("mongoose");

const fireExtinguishingSchema = new mongoose.Schema(
  {
    // Application Details
    ulbname: { type: String },
    registrationdate: { type: Date },
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    address: { type: String },
    middlename: { type: String },
    mobileno: { type: String },

    // noc details
    fromdate: { type: Date },
    firenoclocation: { type: String },
    todate: { type: Date },
    area: { type: Number },

    //   buildingDetails

    buildingname: {
      type: String,
      enum: [
        "residential",
        "educational",
        "institutional",
        "assembly",
        "business",
        "mercantile",
        "industrial",
        "storage",
        "hazardous",
      ],
      required: false,
    },
    buildername: { type: String },
    amount: { type: String, required: false },
    buildingheight: { type: String, required: false },
    nooffloor: { type: String, required: false },
    wetriserprovide: { type: String, enum: ["yes", "no"], required: false },
    noofwetriser: { type: String, required: false },
    dryriserprovide: { type: String, enum: ["yes", "no"], required: false },
    downconnerprovide: { type: String, enum: ["yes", "no"], required: false },
    replenishmentofwater: { type: String, required: false },
    waterquantity: { type: String, required: false },
    Addressofbuilding: { type: String, required: false }, // Assuming it's a string for address
    plotarea: { type: Number, required: false },
    plintharea: { type: Number, required: false },
    overallheight: { type: Number, required: false },
    watersupplydetail: { type: Number, required: false },
    wetriserdiameter: { type: String, required: false },
    dryriserdetails: { type: String, required: false },
    dwonconnerdetails: { type: String, required: false },
    waterstore: { type: String, enum: ["yes", "no"], required: false },
    waterstoredistance: { type: String, required: false },

    //   fireHoseReelDetails

    internalhyderantprovided: {
      type: String,
      enum: ["yes", "no"],
    },
    firstaddreelprovided: {
      type: String,
      enum: ["yes", "no"],
      required: false,
    },
    hosereellength: { type: String, required: false },
    nozzletype: { type: String, required: false },
    firehoseprovided: { type: String, enum: ["yes", "no"], required: false },
    sizeofhoses: { type: String, required: false },
    numberofhoses: { type: String, required: false },
    branchpipesprovided: { type: String, enum: ["yes", "no"], required: false },
    nozzlesizebranchpipe: { type: String, required: false },
    numberofhyderants: { type: String, required: false },
    numberofhosereel: { type: String, required: false },
    nozzlesizehosereel: { type: Number, required: false },
    nozzleconnection: { type: String, required: false },
    typeofhoses: { type: String, required: false },
    lengthofhose: { type: String, required: false },
    branchpipetype: { type: String, required: false },
    sprinkled: { type: String, enum: ["yes", "no"], required: false },

    //   otherSystemDetails

    automatcidetectionsystem: {
      type: String,
      enum: ["yes", "no", "na"],
      required: false,
    },
    installationconfirmcode: { type: String, required: false },
    callboxinstall: {
      type: String,
      enum: ["yes", "no", "na"],
      required: false,
    },
    publicaddresssystem: {
      type: String,
      enum: ["yes", "no", "na"],
      required: false,
    },
    firecontrolroomprovided: {
      type: String,
      enum: ["yes", "no", "na"],
      required: false,
    },
    numberofstaircase: { type: String, required: false },
    widthoftreads: { type: String, required: false },
    typeoftreads: { type: String, enum: ["yes", "no"], required: false },
    numberoflifts: { type: String, required: false },
    typeoflifetdoor: { type: String, required: false },
    liftcarfloorarea: { type: String, required: false },
    liftcarcommunicationsystem: {
      type: String,
      enum: ["yes", "no"],
      required: false,
    },
    typeofdetector: { type: String, required: false },
    detectorstandard: { type: String, required: false },
    manualcalboxdetail: { type: Number, required: false },
    intercomsystem: {
      type: String,
      enum: ["yes", "no", "na"],
      required: false,
    },
    widthofstairway: { type: String, required: false },
    riserheight: { type: String, required: false },
    loadperfloor: { type: String, required: false },
    liftrunbtwfloor: { type: String, required: false },
    fireresistancerating: { type: String, required: false },
    liftloadingcapacity: { type: String, required: false },
    firemanswitchinstall: {
      type: String,
      enum: ["yes", "no"],
      required: false,
    },

    // Other building details
    stationaryfirepump: {
      type: String,
      enum: ["yes", "no", "na"],
      required: true,
    },

    sizeofsuctiondelivery: {
      type: String,
      required: true,
    },

    maximumheadforpump: {
      type: String,
      required: true,
    },

    sourceofpower: {
      type: String,
      enum: ["yes", "no", "na"],
      required: true,
    },

    parallelfuncongenerator: {
      type: String,
      enum: ["yes", "no", "na"],
      required: true,
    },

    yardhydrantprovided: {
      type: String,
      enum: ["yes", "no", "na"],
      required: true,
    },

    liftshaftpressurized: {
      type: String,
      enum: ["yes", "no", "na"],
      required: true,
    },

    liftenclosed: {
      type: String,
      enum: ["yes", "no", "na"],
      required: true,
    },

    falseceilingprovide: {
      type: String,
      enum: ["yes", "no", "na"],
      required: true,
    },

    materialtype: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    centrallyairconditioned: {
      type: String,
      enum: ["yes", "no", "na"],
      required: true,
    },

    typeoftinningduct: {
      type: String,
      required: true,
    },

    insulatingportion: {
      type: String,
      required: true,
    },

    separateahu: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    ahudetails: {
      type: String,
      required: true,
    },

    numberofpumps: {
      type: String,
      required: true,
    },

    eachpumpoutput: {
      type: String,
      required: true,
    },

    ispumpauto: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    pumpcapacity: {
      type: String,
      required: true,
    },

    generatorauto: {
      type: String,
      enum: ["yes", "no", "na"],
      required: true,
    },

    liftseparated: {
      type: String,
      enum: ["yes", "no", "na"],
      required: true,
    },

    illuminatedsign: {
      type: String,
      enum: ["yes", "no", "na"],
      required: true,
    },

    falseceilingmaterialtype: {
      type: String,
      required: true,
    },

    ductmaterial: {
      type: String,
      required: true,
    },

    laggingtype: {
      type: String,
      required: true,
    },

    falseceilingdetails: {
      type: String,
      required: true,
    },

    returnairpassage: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    //   fireExtinguishing

    switchgearandtransformers: { type: String },
    precautionfortransformer: { type: String },
    numberoffireextinguisher: { type: Number },
    fireextinguishermaintenance: { type: String },
    refugearea: { type: String },
    refugareadetails: { type: String },
    emergencyorganisation: { type: String },
    fireofficer: { type: String },
    lighteningprotect: { type: String },
    switchgearTransformerSeparateCompartment: { type: String },
    cablessealed: { type: String },
    fireextinguisherstype: { type: String },
    extinguishercertification: { type: String },
    occupanttraining: { type: String },
    emergencyorganisationdetails: { type: String },
    lighteningprotection: { type: String },
  },
  { collection: "formdatas" }
);

module.exports = mongoose.model(
  "FireExtinguishingDetails",
  fireExtinguishingSchema
);
