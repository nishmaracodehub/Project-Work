var express = require("express");
var router = express.Router();
var User = require("../Models/user");
var Hospitals = require("../Models/hospital");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

router.post("/", (req, res) => {
  User.create(req.body, (err, savedData) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.redirect("/documents/" + savedData._id);
    }
  });
});

router.get("/documents/:id", (req, res) => {
  let uid = req.params.id;
  res.render("documents", { uid });
});

router.post("/documents/:id", async (req, res) => {
  let updatedData = await User.findOneAndUpdate(
    {
      _id: req.params.id
    },
    {
      $set: {
        fileUpload: true
      }
    }
  );

  if (!updatedData) {
    console.log("no data");
  } else {
    res.redirect("/patientinfo/" + updatedData._id);
  }
});

router.get("/patientinfo/:id", (req, res) => {
  let pid = req.params.id;
  res.render("patientinfo", { pid });
});

router.post("/patientinfo/:id", async (req, res) => {
  let finalData = await User.findOneAndUpdate(
    {
      _id: req.params.id
    },
    {
      $set: {
        patientName: req.body.patientName,
        patientEmail: req.body.patientEmail,
        patientAge: req.body.patientAge,
        patientPhone: req.body.patientPhone
      }
    }
  );

  if (!finalData) {
    console.log("no final data");
  } else {
    let data = await Hospitals.find(
      { surgeryType: finalData.surgeryType },
      "-_id"
    );
    if (!data) {
      console.log("no data");
    } else {
      console.log(JSON.stringify(data));
      res.render("hospitals", { dataJSON: JSON.stringify(data) });
    }
  }
});

module.exports = router;
