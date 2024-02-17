const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const pool = require("../../DB/conexion");

const recuperarContrasena = async (req, res) => {
    const { correo } = req.body;
  
    try {
      // Verificar que el correo existe en la tabla persona
      const personaResult = await pool.query('SELECT * FROM persona WHERE email = $1', [correo]);
  
      if (personaResult.rows.length > 0) {
        // Generar un código de recuperación único
        const codigoRecuperacion = uuidv4();
  
        // Almacenar el código de recuperación en la base de datos
        await pool.query('INSERT INTO recovery_codes (correo, codigo_recuperacion, status) VALUES ($1, $2, true)', [correo, codigoRecuperacion]);
  
        // Configurar el transporte de correo (en este ejemplo se utiliza Gmail, asegúrate de permitir el acceso de aplicaciones menos seguras en tu cuenta)
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'cordovacristhian32@gmail.com',
            pass: 'whhc foci zeby rsia',
          },
        });
  
        const mailOptions = {
          from: 'cordovacristhian32@gmail.com',
          to: correo,
          subject: 'Recuperación de Contraseña',
          html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #3498db;">Recuperación de Contraseña</h2>
                  <p>Hola,</p>
                  <p>Recibes este correo porque solicitaste la recuperación de tu contraseña.</p>
                  <p>Tu código de recuperación es: <strong style="color: #e74c3c;">${codigoRecuperacion}</strong></p>
                  <p>Por favor, utiliza este código para restablecer tu contraseña.</p>
                  <p>Si no has solicitado la recuperación de contraseña, puedes ignorar este correo.</p>
                  <p>Gracias,<br>El equipo de FONET.</p>
                </div>`,
        };
  
        // Enviar el correo electrónico
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).json(error.toString());
          }
          res.status(200).json('Código de recuperación enviado por correo');
        });
      } else {
        // Comentario: El correo no existe en la tabla persona
        res.status(400).json('Correo no registrado en el sistema');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json('Error al generar y almacenar el código de recuperación');
    }
  };


  const cambiarContrasena = async (req, res) => {
    const { correo, codigoRecuperacion, nuevaContrasena } = req.body;
  
    try {
      // Verificar que el código de recuperación sea válido
      const result = await pool.query('SELECT * FROM recovery_codes WHERE correo = $1 AND codigo_recuperacion = $2', [correo, codigoRecuperacion]);
  
      if (result.rows.length > 0) {
        // Verificar que el correo existe en la tabla persona
        const personaResult = await pool.query('SELECT * FROM persona WHERE email = $1', [correo]);
  
        if (personaResult.rows.length > 0) {
          // Actualizar la contraseña en la tabla usuario
          await pool.query('UPDATE usuario SET password = $1 WHERE fk_id_persona = $2', [nuevaContrasena, personaResult.rows[0].id_persona]);
  
          // Eliminar el código de recuperación utilizado
          await pool.query('DELETE FROM recovery_codes WHERE correo = $1', [correo]);
  
          res.status(200).json('Contraseña cambiada exitosamente');
        } else {
          // Comentario: El correo no existe en la tabla persona
          res.status(400).json('Correo no registrado en el sistema');
        }
      } else {
        // Comentario: Código de recuperación inválido o correo no registrado
        res.status(400).json('Código de recuperación inválido o correo no registrado en el sistema');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json('Error al verificar el código de recuperación');
    }
  };

  const validaCodigo = async (req, res) => {
    const { correo, codigoRecuperacion } = req.body;
  
    try {
      // Verificar que el código de recuperación sea válido
      const result = await pool.query('SELECT * FROM recovery_codes WHERE correo = $1 AND codigo_recuperacion = $2', [correo, codigoRecuperacion]);
  
      if (result.rows.length > 0) {
        res.status(200).json('Codigo Valido!');
      } else {
        // Comentario: Código de recuperación inválido o correo no registrado
        res.status(400).json('Código de recuperación inválido o correo no registrado en el sistema');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json('Error al verificar el código de recuperación');
    }
  };

  
  module.exports = {
    recuperarContrasena,
    cambiarContrasena,
    validaCodigo
};
