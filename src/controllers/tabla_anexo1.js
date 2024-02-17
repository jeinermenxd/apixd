const pool = require("../../DB/conexion");

const getAnexos1 = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM anexo1 ORDER BY id_anexo1 ASC;');
        res.status(200).json(response.rows);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener anexos1"
        });
    }
};

const getAnexo1ById = async (req, res) => {
    try {
        const id_anexo1 = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM anexo1 WHERE id_anexo1 = $1', [id_anexo1]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Anexo1 no encontrado"
            });
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el anexo1"
        });
    }
};

const createAnexo1 = async (req, res) => {
    try {
        const { fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, fk_id_contrato } = req.body;
        const response = await pool.query('INSERT INTO anexo1 (fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, fk_id_contrato) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);', [fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, fk_id_contrato]);
        
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                anexo1: { fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, fk_id_contrato }
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear el anexo1"
        });
    }
};

const updateAnexo1 = async (req, res) => {
    try {
        const id_anexo1 = parseInt(req.params.id);
        const { fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, fk_id_contrato } = req.body;

        const response = await pool.query('UPDATE anexo1 SET fk_id_plan=$1, tipo_res_corp=$2, permanencia_min=$3, tiempo=$4, servicio=$5, cantidad_servicio=$6, costo_instalacion=$7, val_mensual=$8, nombre_promocion=$9, desc_instalacion=$10, desc_mensualidad=$11, observaciones=$12, periodo=$13, subtotal=$14, iva=$15, total=$16, fk_id_contrato=$17 WHERE id_anexo1=$18', [fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, fk_id_contrato, id_anexo1]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Anexo1 no encontrado"
            });
        }

        res.status(200).json('Anexo1 actualizado exitosamente');
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar el anexo1"
        });
    }
};

const deleteAnexo1 = async (req, res) => {
    try {
        const id_anexo1 = parseInt(req.params.id);
        const response = await pool.query('DELETE FROM anexo1 WHERE id_anexo1 = $1', [id_anexo1]);

        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Anexo1 no encontrado"
            });
        }

        res.status(200).json(`Anexo1 ${id_anexo1} eliminado exitosamente`);
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el anexo1"
        });
    }
};

module.exports = {
    getAnexos1,
    getAnexo1ById,
    createAnexo1,
    updateAnexo1,
    deleteAnexo1
};
