const pool = require("../../DB/conexion");

const getContratos = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM contrato ORDER BY id_contrato ASC;');
        res.status(200).json(response.rows);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener contratos"
        });
    }
};

const getContratoById = async (req, res) => {
    try {
        const id_contrato = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM contrato WHERE id_contrato = $1', [id_contrato]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Contrato no encontrado"
            });
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el contrato"
        });
    }
};

const getinfoContratoById1 = async (req, res) => {
    try {
        const id_contrato = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM infoContrato($1)', [id_contrato]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Contrato no encontrado"
            });
        }

        res.status(200).json(response.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el contrato"
        });
    }
};

const getinfoContratoById = async (req, res) => {
    try {
        const id_contrato = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM infoContrato($1)', [id_contrato]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({
                message: "Contrato no encontrado"
            });
        }

        const contratoInfo = response.rows[0];

        // Obtener todos los registros de anexo2 asociados al contrato
        const responseAnexo2 = await pool.query('SELECT * FROM anexo2 WHERE fk_id_contrato = $1', [id_contrato]);
        const anexo2Registros = responseAnexo2.rows;

        // Agregar los registros de anexo2 al objeto de contrato
        contratoInfo.anexo2 = anexo2Registros;

        res.status(200).json(contratoInfo);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el contrato"
        });
    }
};


const createContrato2 = async (req, res) => {
    try {
        const { key1, key2, key3 } = req.body;

 

        const { fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma } = key1;
        const response = await pool.query('INSERT INTO contrato (fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id_contrato', 
        [fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma],
                (error, personaResults) => {
                    if (error) {
                        throw error;
                    }

        const id_contrato = personaResults.rows[0].id_contrato;
        
        const { fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, fk_id_contrato } = key2;
        
        pool.query('INSERT INTO anexo1 (fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, fk_id_contrato) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);', [fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, id_contrato]);
       
        const { modelo, serie, valor_reposicion, observacion} = key3;
        
        pool.query('INSERT INTO anexo2 (modelo, serie, valor_reposicion, observacion, fk_id_contrato) VALUES ($1, $2, $3, $4, $5);', [modelo, serie, valor_reposicion, observacion, id_contrato]);
        
        
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                contrato: { fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma }
            }
        });
    });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear el contrato"
        });
    }
};

const createContratoF = async (req, res) => {
    try {
        const { key1, key2, key3 } = req.body;

        // Insertar datos de key1 en la tabla contrato
        const { fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma } = key1;
        const contratoResponse = await pool.query('INSERT INTO contrato (fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id_contrato', 
        [fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma]);
        const id_contrato = contratoResponse.rows[0].id_contrato;

        // Insertar datos de key2 en la tabla anexo1
        const { fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio: servicioAnexo1, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total } = key2;
        await pool.query('INSERT INTO anexo1 (fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, fk_id_contrato) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);', 
        [fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicioAnexo1, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, id_contrato]);
       
        // Insertar datos de key3 en la tabla anexo2 (por cada conjunto)
        for (const conjunto in key3) {
            if (key3.hasOwnProperty(conjunto)) {
                const { modelo, serie, valor_reposicion, observacion } = key3[conjunto];
                await pool.query('INSERT INTO anexo2 (modelo, serie, valor_reposicion, observacion, fk_id_contrato) VALUES ($1, $2, $3, $4, $5);', 
                [modelo, serie, valor_reposicion, observacion, id_contrato]);
            }
        }
        
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                contrato: { fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma }
            }
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            message: "Error al crear el contrato"
        });
    }
};

const createContrato = async (req, res) => {
    try {
        const { key1, key2, key3 } = req.body;

        // Insertar datos de key1 en la tabla contrato
        const { fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma } = key1;
        const contratoResponse = await pool.query('INSERT INTO contrato (fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id_contrato', 
        [fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma]);
        const id_contrato = contratoResponse.rows[0].id_contrato;

        // Insertar datos de key2 en la tabla anexo1
        const { fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio: servicioAnexo1, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total } = key2;
        await pool.query('INSERT INTO anexo1 (fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, fk_id_contrato) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);', 
        [fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicioAnexo1, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, id_contrato]);
       
        // Insertar datos de key3 en la tabla anexo2 (por cada conjunto)
        for (const conjunto in key3) {
            if (key3.hasOwnProperty(conjunto)) {
                const { modelo, serie, valor_reposicion, observacion } = key3[conjunto];
                // Verificar si los datos del conjunto no están vacíos
                if (modelo || serie || valor_reposicion || observacion) {
                    await pool.query('INSERT INTO anexo2 (modelo, serie, valor_reposicion, observacion, fk_id_contrato) VALUES ($1, $2, $3, $4, $5);', 
                    [modelo, serie, valor_reposicion, observacion, id_contrato]);
                }
            }
        }
        
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                contrato: { fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma }
            }
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            message: "Error al crear el contrato"
        });
    }
};


const updateContrato1 = async (req, res) => {
    try {
        const id_contrato = parseInt(req.params.id);
        const { fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma } = req.body;

        const response = await pool.query('UPDATE contrato SET fk_id_user=$1, fk_id_persona=$2, nro_contrato=$3, nuevo_orenova=$4, fecha_contrato=$5, fechamod_contrato=$6, servicio=$7, renovacion_auto=$8, perma_min=$9, deb_auto=$10, empaquetamiento=$11, beneficio_paquete=$12, firma=$13 WHERE id_contrato=$14', [fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma, id_contrato]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Contrato no encontrado"
            });
        }

        res.status(200).json('Contrato actualizado exitosamente');
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar el contrato"
        });
    }
};


const updateContratoF = async (req, res) => {
    try {
        const { key1, key2, key3 } = req.body;
        // Actualización de la tabla contrato
        const { id_contrato, fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma } = key1;
        const responseContrato = await pool.query('UPDATE contrato SET fk_id_user=$1, fk_id_persona=$2, nro_contrato=$3, nuevo_orenova=$4, fecha_contrato=$5, fechamod_contrato=$6, servicio=$7, renovacion_auto=$8, perma_min=$9, deb_auto=$10, empaquetamiento=$11, beneficio_paquete=$12, firma=$13 WHERE id_contrato=$14', [fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma, id_contrato]);
        
        // Actualización de la tabla anexo1
        const { fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio: servicioAnexo1, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total } = key2;
        const responseAnexo1 = await pool.query('UPDATE anexo1 SET fk_id_plan=$1, tipo_res_corp=$2, permanencia_min=$3, tiempo=$4, servicio=$5, cantidad_servicio=$6, costo_instalacion=$7, val_mensual=$8, nombre_promocion=$9, desc_instalacion=$10, desc_mensualidad=$11, observaciones=$12, periodo=$13, subtotal=$14, iva=$15, total=$16 WHERE fk_id_contrato=$17', [fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicioAnexo1, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, id_contrato]);
        
        // Actualización de la tabla anexo2
        const { conjunto1, conjunto2, conjunto3 } = key3;
        // Suponiendo que conjunto1, conjunto2 y conjunto3 son objetos con los campos modelo, serie, valor_reposicion y observacion
        await Promise.all([
            pool.query('UPDATE anexo2 SET modelo=$1, serie=$2, valor_reposicion=$3, observacion=$4 WHERE fk_id_contrato=$5 AND id_anexo2=$6', [conjunto1.modelo, conjunto1.serie, conjunto1.valor_reposicion, conjunto1.observacion, id_contrato, conjunto1.id_anexo2]),
            pool.query('UPDATE anexo2 SET modelo=$1, serie=$2, valor_reposicion=$3, observacion=$4 WHERE fk_id_contrato=$5 AND id_anexo2=$6', [conjunto2.modelo, conjunto2.serie, conjunto2.valor_reposicion, conjunto2.observacion, id_contrato, conjunto2.id_anexo2]),
            pool.query('UPDATE anexo2 SET modelo=$1, serie=$2, valor_reposicion=$3, observacion=$4 WHERE fk_id_contrato=$5 AND id_anexo2=$6', [conjunto3.modelo, conjunto3.serie, conjunto3.valor_reposicion, conjunto3.observacion, id_contrato, conjunto3.id_anexo2])
        ]);

        // Verificar si se realizaron actualizaciones
        if (responseContrato.rowCount === 0 || responseAnexo1.rowCount === 0) {
            return res.status(404).json({
                message: "Contrato no encontrado"
            });
        }

        res.status(200).json('Contrato actualizado exitosamente');
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar el contrato",
            error: error.message // Aquí se incluye el mensaje de error en la respuesta
        });
    }
};

const updateContrato = async (req, res) => {
    try {
        const { key1, key2, key3 } = req.body;
        const { id_contrato } = key1;

        // Actualización de la tabla contrato
        const { fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma } = key1;
        const responseContrato = await pool.query('UPDATE contrato SET fk_id_user=$1, fk_id_persona=$2, nro_contrato=$3, nuevo_orenova=$4, fecha_contrato=$5, fechamod_contrato=$6, servicio=$7, renovacion_auto=$8, perma_min=$9, deb_auto=$10, empaquetamiento=$11, beneficio_paquete=$12, firma=$13 WHERE id_contrato=$14', [fk_id_user, fk_id_persona, nro_contrato, nuevo_orenova, fecha_contrato, fechamod_contrato, servicio, renovacion_auto, perma_min, deb_auto, empaquetamiento, beneficio_paquete, firma, id_contrato]);
        
        // Actualización de la tabla anexo1
        const { fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicio: servicioAnexo1, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total } = key2;
        const responseAnexo1 = await pool.query('UPDATE anexo1 SET fk_id_plan=$1, tipo_res_corp=$2, permanencia_min=$3, tiempo=$4, servicio=$5, cantidad_servicio=$6, costo_instalacion=$7, val_mensual=$8, nombre_promocion=$9, desc_instalacion=$10, desc_mensualidad=$11, observaciones=$12, periodo=$13, subtotal=$14, iva=$15, total=$16 WHERE fk_id_contrato=$17', [fk_id_plan, tipo_res_corp, permanencia_min, tiempo, servicioAnexo1, cantidad_servicio, costo_instalacion, val_mensual, nombre_promocion, desc_instalacion, desc_mensualidad, observaciones, periodo, subtotal, iva, total, id_contrato]);
        
        // Actualización e inserción de datos en la tabla anexo2
        for (const conjunto in key3) {
            if (key3.hasOwnProperty(conjunto)) {
                const { modelo, serie, valor_reposicion, observacion, id_anexo2 } = key3[conjunto];
                // Verificar si al menos un campo del conjunto no está vacío o si hay un id_anexo2 existente
                if ((modelo || serie || valor_reposicion || observacion) && id_anexo2) {
                    // Si existe un id_anexo2 en el conjunto, actualizar los datos existentes
                    await pool.query('UPDATE anexo2 SET modelo=$1, serie=$2, valor_reposicion=$3, observacion=$4 WHERE fk_id_contrato=$5 AND id_anexo2=$6', [modelo, serie, valor_reposicion, observacion, id_contrato, id_anexo2]);
                } else if (modelo || serie || valor_reposicion || observacion) {
                    // Si no hay id_anexo2 pero al menos un campo está lleno, insertar un nuevo registro en la tabla anexo2
                    await pool.query('INSERT INTO anexo2 (modelo, serie, valor_reposicion, observacion, fk_id_contrato) VALUES ($1, $2, $3, $4, $5)', [modelo, serie, valor_reposicion, observacion, id_contrato]);
                }
            }
        }

        // Verificar si se realizaron actualizaciones
        if (responseContrato.rowCount === 0 || responseAnexo1.rowCount === 0) {
            return res.status(404).json({
                message: "Contrato no encontrado"
            });
        }

        res.status(200).json('Contrato actualizado exitosamente');
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar el contrato",
            error: error.message // Aquí se incluye el mensaje de error en la respuesta
        });
    }
};





const deleteContrato = async (req, res) => {
    try {
        const id_contrato = parseInt(req.params.id);
        const response = await pool.query('DELETE FROM contrato WHERE id_contrato = $1', [id_contrato]);

        if (response.rowCount === 0) {
            return res.status(404).json({
                message: "Contrato no encontrado"
            });
        }

        res.status(200).json(`Contrato ${id_contrato} eliminado exitosamente`);
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el contrato"
        });
    }
};

module.exports = {
    getContratos,
    getContratoById,
    getinfoContratoById,
    createContrato,
    updateContrato,
    deleteContrato
};
