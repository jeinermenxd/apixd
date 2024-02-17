const pool = require("../../DB/conexion");

const getPersonas = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM persona ORDER BY id_persona ASC;');
        res.status(200).json(response.rows);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener personas"
        });
    }
};

const getPersonaById = async (req, res) => {
    try {
        const id_persona = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM persona WHERE id_persona = $1', [id_persona]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Persona no encontrada"
            });
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener la persona"
        });
    }
};
const getPersonaByDNI = async (req, res) => {
    try {
        const id_persona = req.params.id;
        const response = await pool.query('SELECT * FROM persona WHERE dni = $1', [id_persona]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Persona no encontrada"
            });
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener la persona"
        });
    }
};

const createPersona = async (req, res) => {
    try {
        const { dni, nombre_rs, apellidos, genero, direccion, referencia, telefono, celular, email, discapacidad, ter_edad, tipo_perso, ciudad, canton, parroquia, estado } = req.body;

        // Verificar si la cédula ya está registrada
        const existingCedula = await pool.query('SELECT * FROM persona WHERE dni = $1', [dni]);
        if (existingCedula.rows.length > 0) {
            return res.status(400).json({
                message: "La cédula ya está registrada"
            });
        }

        // Verificar si el correo electrónico ya está registrado
        const existingEmail = await pool.query('SELECT * FROM persona WHERE email = $1', [email]);
        if (existingEmail.rows.length > 0) {
            return res.status(400).json({
                message: "El correo electrónico ya está registrado"
            });
        }

        const response = await pool.query('INSERT INTO persona (dni, nombre_rs, apellidos, genero, direccion, referencia, telefono, celular, email, discapacidad, ter_edad, tipo_perso, ciudad, canton, parroquia, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);', [dni, nombre_rs, apellidos, genero, direccion, referencia, telefono, celular, email, discapacidad, ter_edad, tipo_perso, ciudad, canton, parroquia, estado]);

        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                persona: { dni, nombre_rs, apellidos, genero, direccion, referencia, telefono, celular, email, discapacidad, ter_edad, tipo_perso, ciudad, canton, parroquia, estado }
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear la persona"
        });
    }
};


const updatePersona = async (req, res) => {
    try {
        const id_persona = parseInt(req.params.id);
        const { dni, nombre_rs, apellidos, genero, direccion, referencia, telefono, celular, email, discapacidad, ter_edad, tipo_perso, ciudad, canton, parroquia, estado} = req.body;

        // Verificar si el correo electrónico ya existe en otra persona
        const existingPersona = await pool.query('SELECT * FROM persona WHERE email = $1 AND id_persona <> $2', [email, id_persona]);
        if (existingPersona.rows.length > 0) {
            return res.status(400).json({
                message: "El correo electrónico ya está registrado en otra persona"
            });
        }

        const response = await pool.query('UPDATE persona SET dni=$1, nombre_rs=$2, apellidos=$3, genero=$4, direccion=$5, referencia=$6, telefono=$7, celular=$8, email=$9, discapacidad=$10, ter_edad=$11, tipo_perso=$12, ciudad=$13, canton=$14, parroquia=$15, estado=$16 WHERE id_persona=$17', [dni, nombre_rs, apellidos, genero, direccion, referencia, telefono, celular, email, discapacidad, ter_edad, tipo_perso, ciudad, canton, parroquia, estado, id_persona]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Persona no encontrada"
            });
        }

        res.status(200).json('Persona actualizada exitosamente');
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar la persona"
        });
    }
};

const deletePersona = async (req, res) => {
    try {
        const id_persona = parseInt(req.params.id);
        const response = await pool.query('DELETE FROM persona WHERE id_persona = $1', [id_persona]);

        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Persona no encontrada"
            });
        }

        res.status(200).json(`Persona ${id_persona} eliminada exitosamente`);
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar la persona"
        });
    }
};

module.exports = {
    getPersonas,
    getPersonaById,
    getPersonaByDNI,
    createPersona,
    updatePersona,
    deletePersona
};
