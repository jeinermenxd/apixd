
const pool = require("../../DB/conexion");

const getRoles = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM roles ORDER BY id_rol ASC;');
        res.status(200).json(response.rows);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener roles"
        });
    }
};

const getRolesById = async (req, res) => {
    try {
        const id_rol = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM roles WHERE id_rol = $1', [id_rol]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Rol no encontrado"
            });
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el rol"
        });
    }
};


const createRoles = async (req, res) => {
    try {
        const { id_rol, nombre, estado } = req.body;
        const response = await pool.query('INSERT INTO roles (nombre, estado) VALUES ($1, $2);', [nombre, estado]);
        
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                rol: { id_rol, nombre, estado }
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear el rol"
        });
    }
};



const updateRoles = async (req, res) => {
    try {
        const id_rol = parseInt(req.params.id);
        const { nombre, estado } = req.body;

        const response = await pool.query('UPDATE roles SET nombre=$1, estado=$2 WHERE id_rol=$3', [nombre, estado, id_rol]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Rol no encontrado"
            });
        }

        res.status(200).json('Rol actualizado exitosamente');
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar el rol"
        });
    }
};



const deleteRol = async (req, res) => {
    try {
        const id_rol = parseInt(req.params.id);
        const response = await pool.query('DELETE FROM roles WHERE id_rol = $1', [id_rol]);

        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Rol no encontrado"
            });
        }

        res.status(200).json(`Rol ${id_rol} eliminado exitosamente`);
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el rol"
        });
    }
};



module.exports = {
    getRoles,
    getRolesById,
    createRoles,
    updateRoles,
    deleteRol
};