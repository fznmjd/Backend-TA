const DataKonveyor = require('../models/sensorModel');

const createSensor = async (req, res) => {
  try {
    const { ind1, ind2, kec1, kec2, kond, dur, konv1, konv2, stat, table, startA, startB} = req.body;
    const newSensorData = {
      ind1,
      ind2,
      kec1,
      kec2,
      kond, 
      dur, 
      konv1, 
      konv2, 
      stat,
      table,
      startA,
      startB
    };

    await DataKonveyor.create(newSensorData);

    res.status(201).json({
      success: true,
      statusCode: res.statusCode,
      message: "Data sensor berhasil dibuat",
      data: newSensorData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      statusCode: res.statusCode,
      error: err.message,
    });
  }
};

const getSensors = async (req, res) => {
  try {
    const dataSensor = (await DataKonveyor.find().sort({waktu:-1})
    //.limit(7)
    );
    if (!dataSensor) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.status(200).json(
      {
        success: true,
        statusCode: res.statusCode,
        data: dataSensor,
      }
      );
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
}

const getSensor = async (req, res) => {
  try {
    const dataSensor = await DataKonveyor.find().sort({waktu:-1}).limit(1);
    if (!dataSensor) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.status(200).json(
      {
        success: true,
        statusCode: res.statusCode,
        data: dataSensor,
      }
      );
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
}





module.exports = { createSensor, getSensors, getSensor };
