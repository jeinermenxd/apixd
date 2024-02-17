const pool = require("../../DB/conexion");

const getCiudades = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM ciudad ORDER BY id_ciudad ASC;');
        res.status(200).json(response.rows);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener ciudades"
        });
    }
};

const getCiudadById = async (req, res) => {
    try {
        const id_ciudad = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM ciudad WHERE id_ciudad = $1', [id_ciudad]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Ciudad no encontrada"
            });
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener la ciudad"
        });
    }
};

const createCiudad = async (req, res) => {
    try {
        const { id_ciudad, nombre_ciudad ,fk_id_canton} = req.body;
        const response = await pool.query('INSERT INTO ciudad (nombre_ciudad, fk_id_canton) VALUES ($1, $2);', [nombre_ciudad, fk_id_canton]);
        
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                ciudad: { id_ciudad, nombre_ciudad }
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear la ciudad"
        });
    }
};

const updateCiudad = async (req, res) => {
    try {
        const id_ciudad = parseInt(req.params.id);
        const { nombre_ciudad,fk_id_canton } = req.body;

        const response = await pool.query('UPDATE ciudad SET nombre_ciudad=$1, fk_id_canton=$2 WHERE id_ciudad=$3', [nombre_ciudad,fk_id_canton, id_ciudad]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Ciudad no encontrada"
            });
        }

        res.status(200).json('Ciudad actualizada exitosamente');
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar la ciudad"
        });
    }
};

const deleteCiudad = async (req, res) => {
    try {
        const id_ciudad = parseInt(req.params.id);
        const response = await pool.query('DELETE FROM ciudad WHERE id_ciudad = $1', [id_ciudad]);

        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Ciudad no encontrada"
            });
        }

        res.status(200).json(`Ciudad ${id_ciudad} eliminada exitosamente`);
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar la ciudad"
        });
    }
};

//----------------------------CREAR CIUDAD Y EL ID DEL CANTON----------------------------//
/**
 
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const createCiudadIDCanton = async (req, res) => {
    try {
        const { nombre_ciudad, fk_id_canton } = req.body;
        console.log('Datos recibidos:', { nombre_ciudad, fk_id_canton });

        const response = await pool.query('INSERT INTO ciudad (nombre_ciudad, fk_id_canton) VALUES ($1, $2) RETURNING id_ciudad;', [nombre_ciudad, fk_id_canton]);
        
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                ciudad: { id_ciudad: response.rows[0].id_ciudad, nombre_ciudad, fk_id_canton }
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear la ciudad"
        });
    }
};


module.exports = {
    getCiudades,
    getCiudadById,
    createCiudad,
    updateCiudad,
    deleteCiudad,
    createCiudadIDCanton
};
