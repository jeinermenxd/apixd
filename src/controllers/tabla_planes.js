const pool = require("../../DB/conexion");

const getPlanes = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM planes ORDER BY id_plan ASC;');
        res.status(200).json(response.rows);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener planes"
        });
    }
};

const getPlanById = async (req, res) => {
    try {
        const id_plan = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM planes WHERE id_plan = $1', [id_plan]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Plan no encontrado"
            });
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el plan"
        });
    }
};

const createPlan = async (req, res) => {
    try {
        const { id_plan, nombre_plan, comparticion, capacidad, precio } = req.body;
        const response = await pool.query('INSERT INTO planes (nombre_plan, comparticion, capacidad, precio) VALUES ($1, $2, $3, $4);', [nombre_plan, comparticion, capacidad, precio]);
        
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                plan: { id_plan, nombre_plan, comparticion, capacidad, precio }
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear el plan"
        });
    }
};

const updatePlan = async (req, res) => {
    try {
        const id_plan = parseInt(req.params.id);
        const { nombre_plan, comparticion, capacidad, precio } = req.body;

        const response = await pool.query('UPDATE planes SET nombre_plan=$1, comparticion=$2, capacidad=$3, precio=$4 WHERE id_plan=$5', [nombre_plan, comparticion, capacidad, precio, id_plan]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Plan no encontrado"
            });
        }

        res.status(200).json('Plan actualizado exitosamente');
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar el plan"
        });
    }
};

const deletePlan = async (req, res) => {
    try {
        const id_plan = parseInt(req.params.id);
        const response = await pool.query('DELETE FROM planes WHERE id_plan = $1', [id_plan]);

        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Plan no encontrado"
            });
        }

        res.status(200).json(`Plan ${id_plan} eliminado exitosamente`);
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el plan"
        });
    }
};

module.exports = {
    getPlanes,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan
};
