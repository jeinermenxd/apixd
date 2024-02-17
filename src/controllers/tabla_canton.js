const pool = require("../../DB/conexion");

const getCantones = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM canton ORDER BY id_canton ASC;');
        res.status(200).json(response.rows);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener cantones"
        });
    }
};

const getCantonById = async (req, res) => {
    try {
        const id_canton = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM canton WHERE id_canton = $1', [id_canton]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Canton no encontrado"
            });
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el canton"
        });
    }
};

//crea el canton y se recuerara el id_canton despues del registro//
const createCanton = async (req, res) => {
    try {
        const { nombre_canton } = req.body;
        const response = await pool.query('INSERT INTO canton (nombre_canton) VALUES ($1) RETURNING id_canton;', [nombre_canton]);
        
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                canton: { id_canton: response.rows[0].id_canton, nombre_canton }
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear el canton"
        });
    }
};

const updateCanton = async (req, res) => {
    try {
        const id_canton = parseInt(req.params.id);
        const { fk_id_ciudad, nombre_canton } = req.body;

        const response = await pool.query('UPDATE canton SET nombre_canton=$1 WHERE id_canton=$2', [nombre_canton, id_canton]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Canton no encontrado"
            });
        }

        res.status(200).json('Canton actualizado exitosamente');
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar el canton"
        });
    }
};

const deleteCanton = async (req, res) => {
    try {
        const id_canton = parseInt(req.params.id);
        const response = await pool.query('DELETE FROM canton WHERE id_canton = $1', [id_canton]);

        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Canton no encontrado"
            });
        }

        res.status(200).json(`Canton ${id_canton} eliminado exitosamente`);
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el canton"
        });
    }
};

module.exports = {
    getCantones,
    getCantonById,
    createCanton,
    updateCanton,
    deleteCanton
};
