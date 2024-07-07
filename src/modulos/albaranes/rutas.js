const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./controlador');


const router = express.Router();


router.get("/", todos);
router.get("/:columna/:id", uno);
router.post('/', agregar);
router.put("/", eliminar);


router.get("/detalles", todosDetalles);
router.get("/detalles/:columna/:id", unoDetalles);



async function todos(req, res, next){
    try{
        const items = await controlador.todos();
//console.log('Datos obtenidos de controlador.todos:', todos);
        respuesta.success(req, res, items, 200)
    }catch(err){
        next(err);
        //respuesta.error(req, res, err, 500);
    }
}

async function uno(req, res, next){
    try{
        const { columna, id } = req.params;
        const items = await controlador.uno(columna, id);
//console.log('Datos obtenidos de controlador.todos:', uno);
        respuesta.success(req, res, items, 200)
    }catch(err){
        next(err);
        //respuesta.error(req, res, err, 500);
    }
}

async function todosDetalles(req, res, next){
    try{
        const items = await controlador.todosDetalles();
//console.log('Datos obtenidos de controlador.todos:', todos);
        respuesta.success(req, res, items, 200)
    }catch(err){
        next(err);
        //respuesta.error(req, res, err, 500);
    }
}

async function unoDetalles(req, res, next){
    try{
        const { columna, id } = req.params;
        const items = await controlador.unoDetalles(columna, id);
//console.log('Datos obtenidos de controlador.todos:', uno);
        respuesta.success(req, res, items, 200)
    }catch(err){
        next(err);
        //respuesta.error(req, res, err, 500);
    }
}

async function agregar(req, res, next){
    try{
        const data = req.body;
        
        const items = await controlador.agregar(req.body);
        
        //si es un articulo nuevo, lo agrego
        if(req.body.NAlbaran == 0){
            message = "Item guardado con exito";
        }else{
        //Actualizaar item existente
        message = "Item actualizado con exito"
        }

        const itemsDetalles = await controlador.agregarDetalles(req.body);
        
        //si es un articulo nuevo, lo agrego
        /*
        if(req.body.NAlbaran == 0){
            message = "Item guardado con exito";
        }else{
        //Actualizaar item existente
        message = "Item actualizado con exito"
        }
        */
        respuesta.success(req, res, message, 201)
    }catch(err){
        next(err);
    }
}


async function eliminar(req, res, next){
    try{
        const { columna, valor } = req.params;
        const items = await controlador.eliminar(columna, valor);
        respuesta.success(req, res, 'Item eliminado satisfactoriamente', 200)
    }catch(err){
        next(err);
        //respuesta.error(req, res, err, 500);
    }
}

module.exports = router;