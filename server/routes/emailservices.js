import nodemailer from "nodemailer";

// Configura aquí tu correo y contraseña directamente
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "patroneshermosos9@gmail.com", // Tu correo
    pass: "pthr uvmy lsej aamq", // Tu contraseña
  },
});

// Función para enviar correo
export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: "patroneshermosos9@gmail.com", // Tu correo
      to,
      subject,
      html,
    });

    console.log("Correo enviado a:", to);
  } catch (error) {
    console.error("Error al enviar correo:", error);
    throw new Error("Error al enviar correo");
  }
};