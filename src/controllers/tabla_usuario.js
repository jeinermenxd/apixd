const pool = require("../../DB/conexion");

const getUsuarios = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM usuario ORDER BY id_user ASC;');
        res.status(200).json(response.rows);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener usuarios"
        });
    }
};

const getUsuarioByIdPersona = async (req, res) => {
    try {
        const id_user = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM usuario WHERE fk_id_persona = $1', [id_user]);

        // Si no se encuentra ningún usuario, devolver null
        if (response.rows.length === 0) {
            return res.status(200).json(null);
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el usuario"
        });
    }
};


const getUsuarioById = async (req, res) => {
    try {
        const id_user = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM usuario WHERE id_user = $1', [id_user]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el usuario"
        });
    }
};

const createUsuario = async (req, res) => {
    try {
        const { user_name, password, status, fk_id_persona, fk_id_rol } = req.body;
        const response = await pool.query('INSERT INTO usuario (user_name, password, status, fk_id_persona, fk_id_rol) VALUES ($1, $2, $3, $4, $5);', [user_name, password, status, fk_id_persona, fk_id_rol]);
        
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                usuario: { user_name, password, status, fk_id_persona, fk_id_rol }
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear el usuario"
        });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const id_user = parseInt(req.params.id);
        const { user_name, password, status, fk_id_persona, fk_id_rol } = req.body;

        const response = await pool.query('UPDATE usuario SET user_name=$1, password=$2, status=$3, fk_id_persona=$4, fk_id_rol=$5 WHERE id_user=$6', [user_name, password, status, fk_id_persona, fk_id_rol, id_user]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json('Usuario actualizado exitosamente');
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar el usuario"
        });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const id_user = parseInt(req.params.id);
        const response = await pool.query('DELETE FROM usuario WHERE id_user = $1', [id_user]);

        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json(`Usuario ${id_user} eliminado exitosamente`);
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el usuario"
        });
    }
};
/*
const updateRegister = (req, res) => {
    const { key1, key2 } = req.body;
    
    console.log(key1);
    console.log(key2);
    
    const {
      id_persona,
      dni,
      nombre_rs,
      apellidos,
      genero,
      direccion,
      referencia,
      telefono,
      celular,
      email,
      discapacidad,
      ter_edad,
      tipo_perso,
      ciudad,
      canton,
      parroquia,
      estado,
    } = key1;
  
    const { id_user, user_name, password, create_user, fk_id_persona, fk_id_rol, estado2 } = key2;
  
    // Validar si el email ya existe en la tabla persona
    pool.query('SELECT id_persona FROM persona WHERE email = $1', [email], (error, emailResults) => {
      if (error) {
        return res.status(500).json({
          message: "Error al verificar el email en la tabla persona",
        });
      }
  
      if (emailResults.rows.length > 0 && emailResults.rows[0].id_persona !== id_persona) {
        return res.status(400).json({
          message: "El email ya está en uso en la tabla persona",
        });
      }
  
      // Validar si el user_name ya existe en la tabla usuario
      pool.query('SELECT id_user FROM usuario WHERE user_name = $1', [user_name], (error, userNameResults) => {
        if (error) {
          return res.status(500).json({
            message: "Error al verificar el user_name en la tabla usuario",
          });
        }
  
        if (userNameResults.rows.length > 0 && (id_user === 0 || userNameResults.rows[0].id_user !== id_user)) {
          return res.status(400).json({
            message: "El user_name ya está en uso en la tabla usuario",
          });
        }
  
        // Actualizar en la tabla persona
        pool.query(
          'UPDATE persona SET dni=$1, nombre_rs=$2, apellidos=$3, genero=$4, direccion=$5, referencia=$6, telefono=$7, celular=$8, email=$9, discapacidad=$10, ter_edad=$11, tipo_perso=$12, ciudad=$13, canton=$14, parroquia=$15, estado=$16 WHERE id_persona=$17',
          [
            dni,
            nombre_rs,
            apellidos,
            genero,
            direccion,
            referencia,
            telefono,
            celular,
            email,
            discapacidad,
            ter_edad,
            tipo_perso,
            ciudad,
            canton,
            parroquia,
            estado,
            id_persona,
          ],
          (error, personaResults) => {
            if (error) {
              return res.status(500).json({
                message: "Error al actualizar la persona",
              });
            }
  
            // Actualizar o insertar en la tabla usuario
            if (id_user === 0) {
              // Insertar en la tabla usuario
              pool.query(
                'INSERT INTO usuario (user_name, password, create_user, fk_id_persona, fk_id_rol, estado) VALUES ($1, $2, $3, $4, $5, $6)',
                [user_name, password, create_user, fk_id_persona, fk_id_rol, estado2],
                (error, usuarioResults) => {
                  if (error) {
                    return res.status(500).json({
                      message: "Error al insertar en la tabla usuario",
                    });
                  }
  
                  res.status(200).json('Registro actualizado exitosamente');
                }
              );
            } else {
              // Actualizar en la tabla usuario
              pool.query(
                'UPDATE usuario SET user_name=$1, password=$2, create_user=$3, fk_id_persona=$4, fk_id_rol=$5, estado=$6 WHERE id_user=$7',
                [user_name, password, create_user, fk_id_persona, fk_id_rol, estado2, id_user],
                (error, usuarioResults) => {
                  if (error) {
                    return res.status(500).json({
                      message: "Error al actualizar el usuario",
                    });
                  }
  
                  res.status(200).json('Registro actualizado exitosamente');
                }
              );
            }
          }
        );
      });
    });
  };
*/

const updateRegister = (req, res) => {
  const { key1, key2 } = req.body;

  console.log(key1);
  console.log(key2);

  const {
      id_persona,
      dni,
      nombre_rs,
      apellidos,
      genero,
      direccion,
      referencia,
      telefono,
      celular,
      email,
      discapacidad,
      ter_edad,
      tipo_perso,
      ciudad,
      canton,
      parroquia,
      estado,
  } = key1;

  const { id_user, user_name, password, create_user, fk_id_persona, fk_id_rol, status } = key2;

  // Validar si la cédula ya existe en la tabla persona
  pool.query('SELECT id_persona FROM persona WHERE dni = $1', [dni], (error, cedulaResults) => {
      if (error) {
          return res.status(500).json({
              message: "Error al verificar la cédula en la tabla persona",
          });
      }

      if (cedulaResults.rows.length > 0 && cedulaResults.rows[0].id_persona !== id_persona) {
          return res.status(400).json({
              message: "La cédula ya está registrada",
          });
      }

      // Validar si el email ya existe en la tabla persona
      pool.query('SELECT id_persona FROM persona WHERE email = $1', [email], (error, emailResults) => {
          if (error) {
              return res.status(500).json({
                  message: "Error al verificar el email en la tabla persona",
              });
          }

          if (emailResults.rows.length > 0 && emailResults.rows[0].id_persona !== id_persona) {
              return res.status(400).json({
                  message: "El email ya está en uso",
              });
          }

          // Validar si el user_name ya existe en la tabla usuario
          pool.query('SELECT id_user FROM usuario WHERE user_name = $1', [user_name], (error, userNameResults) => {
              if (error) {
                  return res.status(500).json({
                      message: "Error al verificar el User Name",
                  });
              }

              if (userNameResults.rows.length > 0 && (id_user === 0 || userNameResults.rows[0].id_user !== id_user)) {
                  return res.status(400).json({
                      message: "El User Name ya está en uso",
                  });
              }

              // Actualizar en la tabla persona
              pool.query(
                  'UPDATE persona SET dni=$1, nombre_rs=$2, apellidos=$3, genero=$4, direccion=$5, referencia=$6, telefono=$7, celular=$8, email=$9, discapacidad=$10, ter_edad=$11, tipo_perso=$12, ciudad=$13, canton=$14, parroquia=$15, estado=$16 WHERE id_persona=$17',
                  [
                      dni,
                      nombre_rs,
                      apellidos,
                      genero,
                      direccion,
                      referencia,
                      telefono,
                      celular,
                      email,
                      discapacidad,
                      ter_edad,
                      tipo_perso,
                      ciudad,
                      canton,
                      parroquia,
                      estado,
                      id_persona,
                  ],
                  (error, personaResults) => {
                      if (error) {
                          return res.status(500).json({
                              message: "Error al actualizar la persona",
                          });
                      }

                      // Actualizar o insertar en la tabla usuario
                      if (id_user === 0) {
                          // Insertar en la tabla usuario
                          pool.query(
                              'INSERT INTO usuario (user_name, password, status, create_user, fk_id_persona, fk_id_rol) VALUES ($1, $2, $3, $4, $5, $6)',
                              [user_name, password, status, create_user, fk_id_persona, fk_id_rol],
                              (error, usuarioResults) => {
                                  if (error) {
                                      return res.status(500).json({
                                          message: "Error al insertar en la tabla usuario",
                                      });
                                  }

                                  res.status(200).json('Registro actualizado exitosamente');
                              }
                          );
                      } else {
                          // Actualizar en la tabla usuario
                          console.log(fk_id_rol)
                          pool.query(
                              'UPDATE usuario SET user_name=$1, password=$2, status=$3, create_user=$4, fk_id_persona=$5, fk_id_rol=$6 WHERE id_user=$7',
                              [user_name, password, status, create_user, fk_id_persona, fk_id_rol, id_user],
                              (error, usuarioResults) => {
                                  if (error) {
                                      return res.status(500).json({
                                          message: "Error al actualizar el usuario",
                                      });
                                  }

                                  res.status(200).json('Registro actualizado exitosamente');
                              }
                          );
                      }
                  }
              );
          });
      });
  });
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    getUsuarioByIdPersona,
    createUsuario,
    updateUsuario,
    updateRegister,
    deleteUsuario
};
