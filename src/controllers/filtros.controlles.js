const pool = require("../../DB/conexion");



const filtroCantonCiudad= async (req, res) => {
    try {
        const { p_id_canton } = req.body;
        const response = await pool.query('SELECT * FROM obtener_ciudades_por_canton($1);', [p_id_canton]);
        res.status(200).json(response.rows);
    } catch (error) {
        return res.status(500).json({
            message: "Error al select filtro CantonCiudad"
        });
    }
};

const filtroCiudadParroquia = async (req, res) => {
    try {
        const { p_id_ciudad } = req.body;
        const response = await pool.query('SELECT * FROM obtener_parroquias_por_ciudad($1);', [p_id_ciudad]);
        res.status(200).json(response.rows);
    } catch (error) {
        return res.status(500).json({
            message: "Error al select filtro CiudadParroquia"
        });
    }
};


module.exports = {
    filtroCantonCiudad,
    filtroCiudadParroquia
};
