
const pool = require("../../DB/conexion");


/* El código anterior requiere el módulo jsonwebtoken. */
const jwt = require('jsonwebtoken');
const fs = require('fs');
// Leer llave privada
const privateKey = fs.readFileSync('./private.pem', 'utf8');

// Verificar token
/**
 * Comprueba si hay un token en las cookies, si lo hay, lo verifica y agrega el usuario decodificado a
 * la solicitud.
 * @param req - El objeto de la solicitud.
 * @param res - El objeto de respuesta.
 * @param next - Esta es una función de devolución de llamada que se llamará cuando se complete el
 * middleware.
 * @returns Una función que verifica el token.
 */
const verifyToken = (req, res, next) => {
    // Obtener token de las cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    // Verificar token
    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        // Agregar usuario decodificado al request
        req.user = decoded.user;
        next();
    });
};



/* Lectura de la clave pública del sistema de archivos. */
const publicKey = fs.readFileSync('./public.pem', 'utf8');

/**
 * Toma los datos del usuario del cuerpo de la solicitud, verifica si el correo electrónico ya está en
 * uso y, si no lo está, crea un nuevo usuario en la base de datos y devuelve un token.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */

const setRegister = (req, res) => {
    const { nameuser,password,dni, nombre_rs, apellidos, genero, direccion, referencia, telefono, celular, email, discapacidad, ter_edad, tipo_perso, ciudad,canton,parroquia, id_rol } = req.body;

    // Verificar si el email ya está en uso en la tabla usuario
    pool.query('SELECT email FROM persona WHERE email = $1', [email], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rowCount > 0) {
            res.status(400).json({ message: 'Email ya en uso' });
        } else {
            // Insertar en la tabla persona
            pool.query('INSERT INTO persona (dni, nombre_rs, apellidos, genero, direccion, referencia, telefono, celular, email, discapacidad, ter_edad, tipo_perso, ciudad, canton, parroquia, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id_persona',
                [dni, nombre_rs, apellidos, genero, direccion, referencia, telefono, celular, email, discapacidad, ter_edad, tipo_perso, ciudad,canton,parroquia, true],
                (error, personaResults) => {
                    if (error) {
                        throw error;
                    }
 
                    const id_persona = personaResults.rows[0].id_persona;

                    // Insertar en la tabla usuario
                    pool.query('INSERT INTO usuario (user_name, password, status, create_user, fk_id_persona, fk_id_rol) VALUES ($1, $2, $3, NOW(), $4, $5)',
                        [nameuser, password, true, id_persona, id_rol], // Usamos 2 como el ID del rol por defecto
                        (error, usuarioResults) => {
                            if (error) {
                                throw error;
                            }

                            const user = {
                                id_usuario: usuarioResults.insertId,
                                nombres: nombre_rs,
                                apellidos: apellidos,
                                email: email,
                                rol: 'user',
                                status: 'active'
                            }

                            // Crear token
                            const token = jwt.sign({ user }, privateKey);
                            res.status(201).json({ token });
                        });
                });
        }
    });
}




/**
 * Recibe un correo electrónico y una contraseña del cuerpo de la solicitud, luego consulta la base de
 * datos para encontrar al usuario con ese correo electrónico, si existe, compara la contraseña con la
 * de la base de datos, si coinciden, crea un token con el usuario. id, correo electrónico y rol, y lo
 * envía de vuelta al cliente
 * @param req - El objeto de la solicitud.
 * @param res - El objeto de respuesta.
 */


const setLogin = (req, res) => {
    const { email, password } = req.body;

    // Realizar una consulta que combina información de las tablas persona y usuario
    pool.query('SELECT usuario.*, persona.nombre_rs, persona.email, roles.nombre AS rol_nombre FROM usuario JOIN persona ON usuario.fk_id_persona = persona.id_persona JOIN roles ON usuario.fk_id_rol = roles.id_rol WHERE usuario.user_name = $1', [email], (error, results) => {
        if (error) {
            throw error;
        }

        if (results.rows.length > 0) {
            const user = {
                id: results.rows[0].fk_id_persona,
                id_user: results.rows[0].id_user,
                email: results.rows[0].email,
                nombres: results.rows[0].nombre_rs,
                rol: results.rows[0].fk_id_rol,
                rol_nombre: results.rows[0].rol_nombre // Agregar el nombre del rol
            };
            // Verificar la contraseña
            if (results.rows[0].password === password) {
                // Crear token
                const token = jwt.sign({ user }, privateKey, { expiresIn: '1h' });

                res.status(200).json({ token });
            } else {
                res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ message: 'Email no encontrado' });
        }
    });
};



//-------------------------SELECCIONAR PROUCTO----------------------------//
/**
 * Obtiene todos los productos de la base de datos y los devuelve en formato JSON
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const getProducto = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM "Producto" ORDER BY pk_id_producto ASC;');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//------------------------SELECCIONAR POR ID DE PROUCTO----------------------------//
/**
 * Es una función que recibe una solicitud y una respuesta, y devuelve un JSON con el producto que
 * coincide con la identificación que se envió en la solicitud.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 * @returns El producto con el id que se pasa como parámetro.
 */
const getProductoById = async (req, res) => {

    try {
        const pk_id_producto = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM "Producto" WHERE "pk_id_producto" = $1', [pk_id_producto]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------CREAR PROUCTO----------------------------//
/**
 * Crea un nuevo producto en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const createProducto = async (req, res) => {

    try {
        const { pk_id_producto, codigo_producto, img, nombre_producto, descripcion, fk_marca, modelo, genero, talla, costo, oferta, fk_id_categoria, color,estado } = req.body;
        const response = await pool.query('insert into "Producto"(pk_id_producto,codigo_producto,img,nombre_producto,descripcion,fk_marca,modelo, genero, talla, costo,oferta, fk_id_categoria,color,estado)values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14);', [pk_id_producto, codigo_producto, img, nombre_producto, descripcion, fk_marca, modelo, genero, talla, costo, oferta, fk_id_categoria,color,estado]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: { pk_id_producto, codigo_producto, img, nombre_producto, descripcion, fk_marca, modelo, genero, talla, costo, oferta, fk_id_categoria,color,estado }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------MODIFICAR PROUCTO----------------------------//
/**
 * Actualiza un producto en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updateProducto = async (req, res) => {

    try {
        const pk_id_producto = parseInt(req.params.id);
        const { codigo_producto, img, nombre_producto, descripcion, fk_marca, modelo, genero, talla, costo, oferta, fk_id_categoria,color,estado } = req.body;

        const response = await pool.query('UPDATE "Producto" SET codigo_producto=$1,img=$2,nombre_producto=$3,descripcion=$4,fk_marca=$5,modelo=$6, genero=$7, talla=$8, costo=$9,oferta=$10,fk_id_categoria=$11, color=$12,estado=$13 WHERE "pk_id_producto" =$14', [
            codigo_producto,
            img, nombre_producto,
            descripcion,
            fk_marca,
            modelo,
            genero,
            talla,
            costo,
            oferta,
            fk_id_categoria,
            color,
            estado,
            pk_id_producto
        ]);
        res.json('User Updated Successfully');

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//-------------------------------DELETE PROUCTO------------------------------//
/**
 * Elimina un producto de la base de datos.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param res - El objeto de respuesta.
 */
const deleteProducto = async (req, res) => {

    try {
        const pk_id_producto = parseInt(req.params.id);
        await pool.query('SELECT eliminar_producto($1);', [
            pk_id_producto
        ]);
        res.json(`User ${pk_id_producto} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

/*const deleteProducto = async (req, res) => {

    try {
        const pk_id_producto = parseInt(req.params.id);
        await pool.query('DELETE FROM "Producto" where pk_id_producto = $1', [
            pk_id_producto
        ]);
        res.json(`User ${pk_id_producto} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};*/

//-----------------------------------------------------------SENTENCIAS DE TABLA MARCAS-------------------------------------------------///
//-------------------------SELECCIONAR MARCAS----------------------------//
/**
 * Es una función que devuelve una promesa que se resuelve en una matriz de objetos.
 * @param req - El objeto de la solicitud.
 * @param res - El objeto de respuesta.
 * @returns la lista de marcas en la base de datos.
 */
const getMarcas = async (req, res) => {

    try {
        const response = await pool.query('SELECT * FROM "Marca" ORDER BY "id_Marca" ASC;');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//------------------------SELECCIONAR POR ID DE MARCAS----------------------------//
/**
 * Es una función que recibe una solicitud y una respuesta, y devuelve los datos de una marca con el id
 * que se envía en la solicitud
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const getMarcasById = async (req, res) => {
    try {
        const id_Marca = parseInt(req.params.id);
        const response = await pool.query('select *from "Marca" WHERE "id_Marca" = $1', [id_Marca]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------CREAR MARCAS----------------------------//
/**
 * Crea un nuevo Marca en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 * @returns const getMarca = asíncrono (req, res) => {
 *     intentar {
 *         const respuesta = espera pool.query('SELECT * FROM "Marca";');
 *         res.json(respuesta.filas);
 *     } atrapar (error) {
 *         devuelve res.status(500).json({
 *             mensaje: "Lo sentimos!!! :'v "
 */
const createMarca = async (req, res) => {
    try {
        const { id_Marca, nombre, descripcion } = req.body;
        const response = await pool.query('INSERT INTO "Marca" ("id_Marca","nombre","descripcion") VALUES($1, $2, $3);', [id_Marca, nombre, descripcion]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: { id_Marca, nombre, descripcion }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------MODIFICAR MARCAS----------------------------//
/**
 * Actualiza una marca en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updateMarca = async (req, res) => {
    try {
        const id_Marca = parseInt(req.params.id);
        const { nombre, descripcion } = req.body;

        const response = await pool.query('UPDATE "Marca" SET "nombre"=$1 ,"descripcion" = $2 WHERE "id_Marca" = $3 ;', [
            nombre,
            descripcion,
            id_Marca
        ]);
        res.json('Marca Updated Exitosa');

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//-------------------------------DELETE MARCAS------------------------------//
/**
 * Elimina una marca de la base de datos.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param res - El objeto de respuesta.
 */
const deleteMarca = async (req, res) => {

    try {
        const id_Marca = parseInt(req.params.id);
        await pool.query('SELECT eliminar_marca($1);', [
            id_Marca
        ]);
        res.json(`User ${id_Marca} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};

/*
const deleteMarca = async (req, res) => {

    try {
        const id_Marca = parseInt(req.params.id);
        await pool.query('DELETE FROM "Marca" where "id_Marca" = $1', [
            id_Marca
        ]);
        res.json(`User ${id_Marca} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};*/
//------------------------------------------------------------SENTENCIAS DE TABLA CATEGORIAS-------------------------------------------------///
//-------------------------SELECCIONAR CATEGORIA----------------------------//
/**
 * Consulta la base de datos para todas las categorías y las devuelve en formato JSON.
 * @param req - El objeto de la solicitud.
 * @param res - El objeto de respuesta.
 * @returns la lista de categorías.
 */
const getCategoria = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM "Categoria" ORDER BY "pk_id_categoria" ASC;');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//------------------------SELECCIONAR POR NOMBRE DE CATEGORIA----------------------------//
/**
 * Es una función que recibe una solicitud y una respuesta, y devuelve un JSON con los datos de la
 * categoría que coinciden con el id que se envió en la solicitud
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 * @returns la categoría por id.
 */
const getCategoriaById = async (req, res) => {
    try {
        const pk_id_categoria = parseInt(req.params.id);
        const response = await pool.query('select *from "Categoria" WHERE "pk_id_categoria" = $1;', [pk_id_categoria]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------CREAR CATEGORIAS----------------------------//
/**
 * Crea una nueva categoría en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const createCategoria = async (req, res) => {
    try {
        const { pk_id_categoria, nombre_cat,  descripcion } = req.body;
        const response = await pool.query('INSERT INTO "Categoria" ("pk_id_categoria","nombre_cat","descripcion") VALUES ($1, $2, $3);', [pk_id_categoria, nombre_cat,  descripcion]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: { pk_id_categoria, nombre_cat,  descripcion }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------MODIFICAR CATEGORIAS----------------------------//
/**
 * Actualiza una categoría en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updateCategoria = async (req, res) => {
    try {
        const pk_id_categoria = parseInt(req.params.id);
        const { nombre_cat, descripcion } = req.body;

        const response = await pool.query('UPDATE "Categoria" SET "nombre_cat"= $1 ,"descripcion" = $2  WHERE "pk_id_categoria" = $3;', [
            nombre_cat,
            descripcion,
            pk_id_categoria
        ]);
        res.json('Categoria Updated Exitosa');

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//-------------------------------DELETE CATEGORIAS------------------------------//
/**
 * Elimina una categoría de la base de datos.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param res - El objeto de respuesta.
 */
const deleteCategoria = async (req, res) => {

    try {
        const pk_id_categoria = parseInt(req.params.id);
        await pool.query('SELECT eliminar_categoria($1);', [
            pk_id_categoria
        ]);
        res.json(`User ${pk_id_categoria} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};

/*
const deleteCategoria = async (req, res) => {

    try {
        const pk_id_categoria = parseInt(req.params.id);
        await pool.query('DELETE FROM "Categoria" where "pk_id_categoria" = $1', [
            pk_id_categoria
        ]);
        res.json(`User ${pk_id_categoria} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
*/
//----------------------------------------------------------USUARIO---------------------------------------------------------------///
//-------------------------SELECCIONAR USUARIO----------------------------//
/**
 * Consulta la base de datos para todos los usuarios y devuelve el resultado en formato JSON
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const getUsuario = async (req, res) => {
    try {
        const response = await pool.query('select *from "usuarios";');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

//-------------------------OBTENER NUMERO DE COMPROBANTES---------------------------//
/**
 * Consulta la base de datos para todos los usuarios y devuelve el resultado en formato JSON
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const getCOMPROBANTES = async (req, res) => {
    try {
        const response = await pool.query('select *from "comprobante_venta";');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!!"
        })
    }
};

//------------------------SELECCIONAR POR ID DE USUARIO----------------------------//
/**
 * Es una función que recibe una petición y una respuesta, y devuelve un JSON con los datos del usuario
 * @param req - El objeto de la solicitud.
 * @param res - El objeto de respuesta.
 * @returns el usuario con el id que se está pasando como parámetro.
 */
const getUsuarioById = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id);
        const response = await pool.query('select *from "usuarios" WHERE "id_usuario" = $1;', [id_usuario]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------CREAR UASUARIOS----------------------------//
/**
 * Crea un nuevo usuario en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const createUsuario = async (req, res) => {
    try {
        const { id_usuario, nombre, apellido, correo, contrasena } = req.body;
        const response = await pool.query('INSERT INTO "usuarios" ("id_usuario","nombre","apellido","correo", "contrasena") VALUES ($1, $2, $3,$4,$5);', [id_usuario, nombre, apellido, correo, contrasena]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: { id_usuario, nombre, apellido, correo, contrasena }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------MODIFICAR USUARIOS----------------------------//
/**
 * Toma la identificación del usuario para actualizarse, y los nuevos datos para actualizarse, y
 * actualiza al usuario en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updateUsuario = async (req, res) => {
    try {
      const id_usuario = parseInt(req.params.id);
      const usuario = req.body[0]; // Accedemos al primer elemento del array (el objeto del usuario) 
      const { nombres, apellidos, email, password, created_at, updated_at, rol, status } = usuario; // Desestructuramos las propiedades del objeto
  
      const response = await pool.query(
        'UPDATE "usuarios" SET "nombres" = $1, "apellidos" = $2, "email" = $3, "password" = $4, "created_at" = $5, "updated_at" = $6, "rol" = $7, "status" = $8 WHERE "id_usuario" = $9;',
        [nombres, apellidos, email, password, created_at, updated_at, rol, status, id_usuario]
      );
  
      res.json('Usuario Updated Exitosa');
    } catch (error) {
      return res.status(500).json({
        message: "Lo sentimos!!! :'v "
      });
    }
  };
//-------------------------------DELETE USUARIOS------------------------------//
/**
 * Elimina un usuario de la base de datos.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param res - El objeto de respuesta.
 */
const deleteUsuario = async (req, res) => {

    try {
        const id_usuario = parseInt(req.params.id);
        await pool.query('SELECT eliminar_usuario($1);', [
            id_usuario
        ]);
        res.json(`User ${id_usuario} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};

// CARRITO
const listarCarrito = async (req, res) => {

    try {
        const email = req.body.email;
        // Buscar id del usuario correspondiente al email recibido
        const usuario = await pool.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email]);
        const id_usuario = usuario.rows[0].id_usuario;



        // Consultar los productos favoritos del usuario
        const response = await pool.query('SELECT * FROM carrito WHERE id_usuario = $1', [id_usuario]);
        res.status(200).json({ success: true, data: response.rows });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lo sentimos!!! :'v "
        })
    }
};
const getCarritoById = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM carrito WHERE fk_id_usuario = $1 AND estado = $2', [id_usuario, 'pendiente']);
        for (let i = 0; i < response.rows.length; i++) {
            const producto = await pool.query('SELECT * FROM "Producto" WHERE pk_id_producto = $1', [response.rows[i].fk_id_producto]);
            response.rows[i].producto = producto.rows[0];
        }
        res.status(200).json({ success: true, data: response.rows });
    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
const getCarrito = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM carrito WHERE estado = $1', ['pendiente']);
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

const createCarrito = async (req, res) => {
    try {
        const email = req.body.email;
        const id_producto = req.body.id_producto;

        // Obtener el id_usuario correspondiente al email recibido
        const usuario = await pool.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email]);
        const id_usuario = usuario.rows[0].id_usuario;

        // Verificar si el producto ya está en la tabla de carrito
        const existingCarrito = await pool.query('SELECT * FROM carrito WHERE fk_id_producto = $1 AND fk_id_usuario = $2 AND estado = $3', [id_producto, id_usuario, 'pendiente']);
        if (existingCarrito.rows.length > 0) {
            return res.status(400).json({
                message: 'El producto ya está en el carrito'
            });
        }

        // Insertar en la tabla "carrito"
        const response = await pool.query('INSERT INTO carrito (fk_id_usuario, fk_id_producto, cantidad, estado) VALUES ($1, $2, $3, $4)', [id_usuario, id_producto, 1, 'pendiente']);

        res.json({
            message: 'Producto agregado al carrito con éxito.',
            body: {
                carrito: { id_producto, email }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Ha ocurrido un error."
        });
    }
};
const updateCarritoCantidad = async (req, res) => {
    try {
        const id_carrito = req.body.id_carrito;
        const cantidad = req.body.cantidad;
        // Verificar si el registro existe en el carrito
        const existingCarrito = await pool.query('SELECT * FROM carrito WHERE id_carrito = $1', [id_carrito]);
        if (existingCarrito.rows.length === 0) {
            return res.status(404).json({
                message: 'El registro del carrito no existe'
            });
        }

        // Actualizar la cantidad del producto en el carrito
        await pool.query('UPDATE carrito SET cantidad = $1 WHERE id_carrito = $2', [cantidad, id_carrito]);

        res.json({
            message: 'La cantidad del producto en el carrito se ha actualizado con éxito.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Ha ocurrido un error al actualizar la cantidad en el carrito.'
        });
    }
};
const deleteCarrito = async (req, res) => {
    try {
        const id_carrito = req.params.id;
        // Verificar si el registro existe en el carrito
        const existingCarrito = await pool.query('SELECT * FROM carrito WHERE id_carrito = $1', [id_carrito]);
        if (existingCarrito.rows.length === 0) {
            return res.status(404).json({
                message: 'El registro del carrito no existe'
            });
        }

        // Eliminar el registro del carrito
        await pool.query('DELETE FROM carrito WHERE id_carrito = $1', [id_carrito]);

        res.json({
            message: 'El registro del carrito se ha eliminado con éxito.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Ha ocurrido un error al eliminar el registro del carrito.'
        });
    }
};


// Comprobante venta
const crearComprobanteVentaConDetalle = async (req, res) => {
    try {
        const { email, total, carrito } = req.body;

        // Obtener el id_usuario correspondiente al email recibido
        const usuario = await pool.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email]);
        const fk_id_usuario = usuario.rows[0].id_usuario;
        // Iniciar una transacción
        await pool.query('BEGIN');

        // Insertar el comprobante de venta en la tabla comprobante_venta
        const nuevoComprobante = await pool.query(
            'INSERT INTO comprobante_venta (fk_id_usuario, fecha_venta, total) VALUES ($1, CURRENT_DATE, $2) RETURNING id_comprobante',
            [fk_id_usuario, total]
        );

        const idComprobante = nuevoComprobante.rows[0].id_comprobante;

        // Actualizar el estado de los productos en la tabla carrito a "comprado"
        for (const producto of carrito) {
            await pool.query(
                'UPDATE carrito SET estado = $1 WHERE id_carrito = $2',
                ['comprado', producto.id_carrito]
            );
        }

        // Insertar los productos del carrito en la tabla detalle_comprobante
        for (const producto of carrito) {
            await pool.query(
                'INSERT INTO detalle_comprobante (id_comprobante, fk_id_producto, cantidad, precio_unitario, nombre_producto, codigo_producto, modelo, genero, talla) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [idComprobante, producto.fk_id_producto, producto.cantidad, producto.producto.costo,producto.producto.nombre_producto,producto.producto.codigo_producto, producto.producto.modelo, producto.producto.genero, producto.producto.talla]
            );
        }

        // Confirmar la transacción
        await pool.query('COMMIT');

        res.json({
            message: 'Comprobante de venta creado exitosamente',
            id_comprobante: idComprobante
        });
    } catch (error) {
        // Revertir la transacción en caso de error
        await pool.query('ROLLBACK');

        return res.status(500).json({
            message: 'Error al crear el comprobante de venta',
            error: error.message
        });
    }
};


const listarComprobantesConDetalle = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id);

        // Obtener los comprobantes de venta asociados al fk_id_usuario
        const comprobantes = await pool.query(
            'SELECT * FROM comprobante_venta WHERE fk_id_usuario = $1',
            [id_usuario]
        );

        // Obtener los detalles de cada comprobante de venta
        for (const comprobante of comprobantes.rows) {
            const detalles = await pool.query(
                `SELECT detalle.*
                FROM detalle_comprobante AS detalle
                WHERE detalle.id_comprobante = $1;`,
                [comprobante.id_comprobante]
            );

            comprobante.detalles = detalles.rows;
        }

        res.json({
            comprobantes: comprobantes.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los comprobantes de venta con su detalle',
            error: error.message
        });
    }
};



//----------------------------------------------------------FAVORITOS---------------------------------------------------------------///
//-------------------------------------------------------SELECCIONAR FAVORITOS------------------------------------------------------//
/**
 * Recibe un correo electrónico, busca la identificación del usuario y luego devuelve los productos
 * favoritos del usuario.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 * @returns los productos que el usuario ha marcado como favoritos.
 */
const listarFavoritos = async (req, res) => {

    try {
        const email = req.body.email;
        console.log(email);
        // Buscar id del usuario correspondiente al email recibido
        const usuario = await pool.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email]);
        const id_usuario = usuario.rows[0].id_usuario;

        console.log(id_usuario);

        // Consultar los productos favoritos del usuario
        const response = await pool.query('SELECT * FROM favoritos WHERE id_usuario = $1', [id_usuario]);
        res.status(200).json({ success: true, data: response.rows });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lo sentimos!!! :'v "
        })
    }
};
//------------------------SELECCIONAR POR ID DE FAVORITOS----------------------------//
/**
 * Obtiene los favoritos de un usuario por su id
 * @param req - El objeto de la solicitud.
 * @param res - El objeto de respuesta.
 * @returns const getFavoritesById = async(req, res) => {
 *     intentar {
 *         const user_id = parseInt(req.params.id);
 *         const respuesta = espera pool.query('SELECCIONE * DE favoritos DONDE fk_user_id = ',
 * [user_id]);
 *         para (
 */
const getFavoritosById = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM favoritos WHERE fk_id_usuario = $1', [id_usuario]);
        for (let i = 0; i < response.rows.length; i++) {
            const producto = await pool.query('SELECT * FROM "Producto" WHERE pk_id_producto = $1', [response.rows[i].fk_id_producto]);
            response.rows[i].producto = producto.rows[0];
        }
        res.status(200).json({ success: true, data: response.rows });
    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

/**
 * Consulta en la base de datos todas las filas de la tabla 'favoritos' y las devuelve en formato JSON
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const getFavoritos = async (req, res) => {
    try
    {
        const response = await pool.query('select *from favoritos;');
        res.status(200).json(response.rows);

    } catch (error)
    {
        return res.status(500).json({
            message:"Lo sentimos!!! :'v "
        })
    }   
};

//----------------------------CREAR FAVORITOS----------------------------//
/**
 * Toma el correo electrónico y la identificación del producto del cuerpo de la solicitud, encuentra la
 * identificación de usuario correspondiente al correo electrónico, verifica si el producto ya está en
 * la lista de favoritos del usuario y, de no ser así, lo agrega a la lista de favoritos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const createFavorito = async (req, res) => {
    try {
        const email = req.body.email;
        const id_producto = req.body.id_producto;
        //console.log(email);
        // Buscar id del usuario correspondiente al email recibido
        const usuario = await pool.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email]);
        const id_usuario = usuario.rows[0].id_usuario;

        // Check si el producto ya esta en la tabla de fav
        const existingFavorites = await pool.query('SELECT * FROM favoritos WHERE fk_id_producto = $1 AND fk_id_usuario = $2', [id_producto, id_usuario]);
        if (existingFavorites.rows.length > 0) {
            return res.status(400).json({
                message: 'Product ya esta en la lista de favoritos'
            });
        }

        // Insertar en la tabla "favoritos"
        const response = await pool.query('INSERT INTO favoritos (fk_id_producto,fk_id_usuario) VALUES ($1, $2)', [id_producto, id_usuario]);

        res.json({
            message: 'Insertado con exito.',
            body: {
                favorito: { id_producto, email }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Ocurre un error."
        });
    }
};


//----------------------------MODIFICAR FAVORITOS----------------------------//
/**
 * Actualiza los datos de la tabla Favoritos en la base de datos
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updateFavoritos = async (req, res) => {
    try {
        const pk_id_favorito = parseInt(req.params.id);
        const { fk_id_usuario, fk_id_producto } = req.body;

        const response = await pool.query('UPDATE "Favoritos" SET fk_id_usuario=$1,fk_id_producto=$2 WHERE "pk_id_favorito" = $3;', [
            fk_id_usuario,
            fk_id_producto,
            pk_id_favorito
        ]);
        res.json('Categoria Updated Exitosa');

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//-------------------------------DELETE FAVORITOS------------------------------//
/**
 * Elimina un usuario de la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const deleteFavoritos = async (req, res) => {

    try {
        const pk_id_favorito = parseInt(req.params.id);
        await pool.query('DELETE FROM favoritos where "id_favorito" = $1', [
            pk_id_favorito
        ]);
        res.json(`User ${pk_id_favorito} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------------------------------------ADMINISTRACION---------------------------------------------------------------///
//-------------------------SELECCIONAR ADMINISTRACION----------------------------//
/**
 * Es una función asíncrona que usa la palabra clave await para esperar el resultado de una consulta a
 * la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const getAdminstracion = async (req, res) => {
    try {
        const response = await pool.query('select *from "Administrador";');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//------------------------SELECCIONAR POR ID DE ADMINISTRACION----------------------------//
/**
 * Obtiene el administrador por id.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const getAdminstracionById = async (req, res) => {
    try {
        const pk_id_administrador = parseInt(req.params.id);
        const response = await pool.query('select *from "Administrador" WHERE "pk_id_administrador" = $1;', [pk_id_administrador]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------CREAR ADMINISTRADOR----------------------------//
/**
 * Crea un nuevo administrador en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const createAdminstracion = async (req, res) => {
    try {
        const { pk_id_administrador, cedula, nombre_admin, apellido_admin, usuario, contrasena, email } = req.body;
        const response = await pool.query('insert into "Administrador"("pk_id_administrador", "cedula", "nombre_admin", "apellido_admin", "usuario", "contrasena", "email") VALUES ($1, $2, $3,$4,$5,$6,$7);', [pk_id_administrador, cedula, nombre_admin, apellido_admin, usuario, contrasena, email]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: { pk_id_administrador, cedula, nombre_admin, apellido_admin, usuario, contrasena, email }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
//----------------------------MODIFICAR ADMINISTRACION----------------------------//
/**
 * Actualiza los datos del administrador con el id que se le pasa como parámetro
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updateAdministracion = async (req, res) => {
    try {
        const pk_id_administrador = parseInt(req.params.id);
        const { cedula, nombre_admin, apellido_admin, usuario, contrasena, email } = req.body;

        const response = await pool.query('UPDATE "Administrador" SET "cedula"=$1, "nombre_admin"=$2, "apellido_admin"=$3, "usuario"=$4, "contrasena"=$5, "email"=$6 WHERE "pk_id_administrador" = $7;', [
            cedula,
            nombre_admin,
            apellido_admin,
            usuario,
            contrasena,
            email,
            pk_id_administrador
        ]);
        res.json('Categoria Updated Exitosa');

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};
//-------------------------------DELETE ADMINISTRACION------------------------------//
/**
 * Elimina un usuario de la base de datos.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param res - El objeto de respuesta.
 */
const deleteAdministracion = async (req, res) => {

    try {
        const pk_id_administrador = parseInt(req.params.id);
        await pool.query('DELETE FROM "Administrador" where "pk_id_administrador" = $1', [
            pk_id_administrador
        ]);
        res.json(`User ${pk_id_administrador} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

//---------------------------LISTAR PDF----------------------------------------------------------//
const getPDF = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM "pdf" ORDER BY id_pdf ASC;');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};

//---------------------------Insertar DE PDF----------------------------------------------------------//

const create_pdf = async (req, res) => {

    try {
        const {  id_pdf, version_pdf, enlace_pdf, descripcion } = req.body;
        const response = await pool.query('insert into "pdf"( id_pdf, version_pdf, enlace_pdf, descripcion)values ($1,$2,$3,$4);', [ id_pdf, version_pdf, enlace_pdf, descripcion]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: {  id_pdf, version_pdf, enlace_pdf, descripcion }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

//--------------------------MODIFICAR PDF-------------------------------------------------------//

/**
 * Actualiza un producto en la base de datos.
 * @param req - El objeto de la solicitud. Contiene información sobre la solicitud HTTP que generó el
 * evento.
 * @param res - El objeto de respuesta.
 */
const updatePDF = async (req, res) => {

    try {
        const id_pdf = parseInt(req.params.id);
        const { version_pdf, enlace_pdf, descripcion } = req.body;

        const response = await pool.query(
            'UPDATE "pdf" SET version_pdf=$1, enlace_pdf=$2, descripcion=$3 WHERE "id_pdf" =$4',
            [version_pdf, enlace_pdf, descripcion, id_pdf
        ]);
        res.json('User Updated Successfully');

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }

};

//-------------------------------DELETE PDF------------------------------//
/**
 * Elimina un producto de la base de datos.
 * @param req - El objeto de solicitud representa la solicitud HTTP y tiene propiedades para la cadena
 * de consulta de solicitud, parámetros, cuerpo, encabezados HTTP, etc.
 * @param res - El objeto de respuesta.
 */
const delete_pdf = async (req, res) => {

    try {
        const id_pdf = parseInt(req.params.id);
        await pool.query('DELETE FROM "pdf" where id_pdf = $1', [
            id_pdf
        ]);
        res.json(`User ${id_pdf} deleted Successfully`);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

/////// GETID///////////
const getPDFById = async (req, res) => {
    try {
        const id_pdf = parseInt(req.params.id);
        const response = await pool.query('select *from "pdf" WHERE "id_pdf" = $1', [id_pdf]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};


const filtro = async (req, res) => {
    try {
        const { talla ,fk_marca,  costo, color, genero } = req.body;
        const response = await pool.query('SELECT * FROM filtrar_productos($1, $2, $3, $4, $5);', [talla ,fk_marca,  costo, color, genero]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};
const getResenaById = async (req, res) => {
    try {
        const id_resenas = parseInt(req.params.id);
        const response = await pool.query('select *from "resenas" WHERE "id_resenas" = $1;', [id_resenas]);
        res.json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};


const getResenas = async (req, res) => {
    try {
        const response = await pool.query('select *from "resenas";');
        res.status(200).json(response.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!!"
        })
    }
};

const create_resenas = async (req, res) => {

    try {
        const { id_resenas,fk_id_usuario,estrellas,comentario } = req.body;
        const response = await pool.query('insert into "resenas"(fk_id_usuario,estrellas,comentario)values ($1,$2,$3);', [fk_id_usuario,estrellas,comentario]);
        res.json({
            message: 'Ingreso Exitoso!!',
            body: {
                producto: {  id_resenas,fk_id_usuario,estrellas,comentario }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lo sentimos!!! :'v "
        })
    }
};

//----------------------------------------------------------COMUNICACION-------------------------------------------///
/* El código anterior está exportando las funciones que se van a utilizar en las rutas. */
module.exports = {
    verifyToken,
    setRegister,
    setLogin,
    getProdcuto: getProducto,
    getProdcutoById: getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
    getMarcas,
    getMarcasById,
    createMarca,
    updateMarca,
    deleteMarca,
    getCategoria,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    getUsuario,
    getCOMPROBANTES,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    listarCarrito,
    getCarrito,
    getCarritoById,
    createCarrito,
    updateCarritoCantidad,
    deleteCarrito,
    listarFavoritos,
    getFavoritos,
    getFavoritosById,
    createFavorito,
    updateFavoritos,
    deleteFavoritos,
    getAdminstracion,
    getAdminstracionById,
    createAdminstracion,
    updateAdministracion,
    deleteAdministracion,
    crearComprobanteVentaConDetalle,
    listarComprobantesConDetalle,
    getPDF,
    create_pdf,
    updatePDF,
    delete_pdf,
    getPDFById,
    filtro,
    getResenaById,
    getResenas,
    create_resenas
};