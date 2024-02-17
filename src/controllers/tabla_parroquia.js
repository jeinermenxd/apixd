const pool = require("../../DB/conexion");

const getParroquias = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM parroquia ORDER BY id_parroquia ASC;');
        res.status(200).json(response.rows);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener parroquias"
        });
    }
};

const getParroquiaById = async (req, res) => {
    try {
        const id_parroquia = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM parroquia WHERE id_parroquia = $1', [id_parroquia]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Parroquia no encontrada"
            });
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener la parroquia"
        });
    }
};

const createParroquia = async (req, res) => {
    try {
        const { nombre_parroquia,fk_id_ciudad } = req.body;
        const response = await pool.query('INSERT INTO parroquia (nombre_parroquia, fk_id_ciudad) VALUES ($1, $2);', [nombre_parroquia,fk_id_ciudad]);
        
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                parroquia: { nombre_parroquia, fk_id_ciudad }
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear la parroquia"
        });
    }
};

const updateParroquia = async (req, res) => {
    try {
        const id_parroquia = parseInt(req.params.id);
        const { nombre_parroquia,fk_id_ciudad } = req.body;

        const response = await pool.query('UPDATE parroquia SET nombre_parroquia=$1, fk_id_ciudad=$2 WHERE id_parroquia=$3', [nombre_parroquia,fk_id_ciudad, id_parroquia]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Parroquia no encontrada"
            });
        }

        res.status(200).json('Parroquia actualizada exitosamente');
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar la parroquia"
        });
    }
};

const deleteParroquia = async (req, res) => {
    try {
        const id_parroquia = parseInt(req.params.id);
        const response = await pool.query('DELETE FROM parroquia WHERE id_parroquia = $1', [id_parroquia]);

        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Parroquia no encontrada"
            });
        }

        res.status(200).json(`Parroquia ${id_parroquia} eliminada exitosamente`);
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar la parroquia"
        });
    }
};

module.exports = {
    getParroquias,
    getParroquiaById,
    createParroquia,
    updateParroquia,
    deleteParroquia
};
