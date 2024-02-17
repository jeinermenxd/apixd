const pool = require("../../DB/conexion");

const getAnexos2 = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM anexo2 ORDER BY id_anexo2 ASC;');
        res.status(200).json(response.rows);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener anexos2"
        });
    }
};

const getAnexo2ById = async (req, res) => {
    try {
        const id_anexo2 = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM anexo2 WHERE id_anexo2 = $1', [id_anexo2]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Anexo2 no encontrado"
            });
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el anexo2"
        });
    }
};

const createAnexo2 = async (req, res) => {
    try {
        const { modelo, serie, valor_reposicion, observacion, fk_id_contrato } = req.body;
        const response = await pool.query('INSERT INTO anexo2 (modelo, serie, valor_reposicion, observacion, fk_id_contrato) VALUES ($1, $2, $3, $4, $5);', [modelo, serie, valor_reposicion, observacion, fk_id_contrato]);
        
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                anexo2: { modelo, serie, valor_reposicion, observacion, fk_id_contrato }
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear el anexo2"
        });
    }
};

const updateAnexo2 = async (req, res) => {
    try {
        const id_anexo2 = parseInt(req.params.id);
        const { modelo, serie, valor_reposicion, observacion, fk_id_contrato } = req.body;

        const response = await pool.query('UPDATE anexo2 SET modelo=$1, serie=$2, valor_reposicion=$3, observacion=$4, fk_id_contrato=$5 WHERE id_anexo2=$6', [modelo, serie, valor_reposicion, observacion, fk_id_contrato, id_anexo2]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Anexo2 no encontrado"
            });
        }

        res.status(200).json('Anexo2 actualizado exitosamente');
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar el anexo2"
        });
    }
};

const deleteAnexo2 = async (req, res) => {
    try {
        const id_anexo2 = parseInt(req.params.id);
        const response = await pool.query('DELETE FROM anexo2 WHERE id_anexo2 = $1', [id_anexo2]);

        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Anexo2 no encontrado"
            });
        }

        res.status(200).json(`Anexo2 ${id_anexo2} eliminado exitosamente`);
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el anexo2"
        });
    }
};

module.exports = {
    getAnexos2,
    getAnexo2ById,
    createAnexo2,
    updateAnexo2,
    deleteAnexo2
};
