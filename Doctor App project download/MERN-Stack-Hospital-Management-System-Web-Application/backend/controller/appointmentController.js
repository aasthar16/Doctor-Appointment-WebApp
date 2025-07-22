import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }
  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Send!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;

  let appointments;

  if (user.role === "Admin") {
    appointments = await Appointment.find();
  } else if (user.role === "Doctor") {
    appointments = await Appointment.find({ doctorId: user._id });
  } else {
    return next(new ErrorHandler("Unauthorized access", 403));
  }

  // Add doctor _id to each appointment's `doctor` field for frontend filtering
  appointments = appointments.map((appt) => ({
    ...appt._doc,
    doctor: {
      ...appt._doc.doctor,
      _id: appt.doctorId,
    },
  }));

  res.status(200).json({
    success: true,
    appointments,
  });
});


export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id).populate("doctor");

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }

  
  if (
  !req.user ||
  (req.user.role !== "Admin" &&
    (!appointment.doctor ||
     !appointment.doctor._id ||
     appointment.doctor._id.toString() !== req.user._id.toString()))
) {
  return next(
    new ErrorHandler("Not authorized to update this appointment", 403)
  );
}


  
  await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Appointment Status Updated!",
  });
});


export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
