const {
    Router
} = require('express');
const router = Router();




const mercadopago = require('mercadopago');
const ChosenModel = require('../models/ChosenModel');
const PayModel = require('../models/payModel');
const ProductsModel = require('../models/ProducModel');
const RegisterPayModel = require("../models/RegisterPayModel")
const https = require('https');
const querystring = require('querystring');

mercadopago.configurations.setAccessToken("APP_USR-6786679189352218-092210-8c759ee3eabcbf2302092e88f0feeffe-265854976");


/**
 * Registro de informacion en HubSpot para el formulario de deonacion
 * @param {Object} data informacion de registro en plataforma chosen 
 * @param {String} status estado de la transaccion efectuada con MP
 */
const registerFrom = (data,status)=>{   

    // build the data object
    
    var postData = querystring.stringify({
        'email': data.email,
        'firstname': data.firstName,
        'lastname': data.lastName,
        'phone': data.phone,
        'co_status_elegido': status,
        'hs_context': JSON.stringify({
            "hutk": '60c2ccdfe4892f0fa0593940b12c11123',
            "ipAddress": '0.0.0.0',
            "pageUrl": "https://elegido.worldvision.co/",
            "pageName": "Elegido World Vision"
        })
    });
    
    // set the post options, changing out the HUB ID and FORM GUID variables.
    
    var options = {
        hostname: 'forms.hubspot.com',
        path: '/uploads/form/v2/2623910/923f8e6d-fa8d-4d22-93d7-555f4923c2f4',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    }
    
    // set up the request
    
    var request = https.request(options, function(response){
        console.log("Status: " + response.statusCode);
        console.log("Headers: " + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        response.on('data', function(chunk){
            console.log('Body: ' + chunk)
        });
    });
    
    request.on('error', function(e){
        console.log("Problem with request " + e.message)
    });
    
    // post the data
    
    request.write(postData);
    request.end();
    

}


/**
 * Registro de informacion en HubSpot para el formulario de pre transaccion
 * @param {Object} data informacion de registro en plataforma chosen en el formulario de contacto
 */
 const registerPreTransactionFrom = (data)=>{   

    // build the data object    
    var postData = querystring.stringify({
        'firstname': data.first_name,
        'lastname': data.last_name,
        'email': data.email,
        'fecha_de_nacimiento':data.birthdate,  
        'g_nero':data.gender,  
        'phone': data.phone.value,
        'adress': data.address_street,
        'city': data.address_city,
        'hs_context': JSON.stringify({
            "hutk": '60c2ccdfe4892f0fa0593940b12c11123',
            "ipAddress": '0.0.0.0',
            "pageUrl": "https://elegido.worldvision.co/",
            "pageName": "Elegido World Vision"
        })
    });
    
    // set the post options, changing out the HUB ID and FORM GUID variables.    
    var options = {
        hostname: 'forms.hubspot.com',
        path: '/uploads/form/v2/2623910/3b2488ec-ddd5-42b3-8e6f-c4c5327f8eae',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    }
    
    // set up the request    
    var request = https.request(options, function(response){
        console.log("Status: " + response.statusCode);
        console.log("Headers: " + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        response.on('data', function(chunk){
            console.log('Body: ' + chunk)
        });
    });
    
    request.on('error', function(e){
        console.log("Problem with request " + e.message)
    });
    
    // post the data
    
    request.write(postData);
    request.end();
    
 }

/**
 * Registra el formulario de ingreso o contactForm para los elegidos en la DB
 * creacion elegido en la bd
 */
router.post('/api/chosenRegister', (req, res) => {
    const data = req.body;
    if (!data) {
        return res.status(400).json({
            error: 'chosen is missing',
        });
    }
    console.log(data)
    const chosen = new ChosenModel(req.body);
    chosen.save()
        .then((WriteResult) => {
            const donor = {
                id: WriteResult.id,
            }
            res.json({
                donor
            })
        })
        .catch((err) => {
            console.log(err);
        })

    registerPreTransactionFrom(data); 
})

/**
 * Agrega o actualiza la foto del elegido
 * registro de photoForm
 */
router.post('/api/checkout/upload-photo-donor/:id', (req, res) => {
    const idParams = req.params.id;
    const data = req.body;
    if (!data) {
        return res.status(400).json({
            error: 'Photo is missing',
        });
    }
    ChosenModel.updateOne({
            _id: idParams
        }, data)
        .then((WriteResult) => {
            res.json({
                respuesta: "La fotografia se agrego Correctamente"
            });
        })
        .catch((err) => {
            res.json({
                err
            });
        })
})

/**
 * registro del formulario de pago sin registro en MP, tomando
 * el formulario inicial entregado por brasil
 */
router.post('/api/checkout/upload-pay-donor/:id', (req, res) => {
    const idParams = req.params.id;
    const payData = req.body;
    const dataPayData = {
        document: { 
            type: payData.document.type, 
            value: payData.document.value, 
        },
        card: {
          number: payData.card.number,
          exp_month: payData.card.exp_month,
          exp_year: payData.card.exp_year,
          cvc: '',
          holder_name: payData.card.holder_name,
          installments: Number(payData.card.installments)
        },
        address: { 
            street: payData.address.street, 
            city: payData.address.city, 
        },
        child_quantity: payData.child_quantity,
        items_id: [ 
            payData.items_id[0], 
            payData.items_id[1],
         ]
    };
    let data = {
        status : "rejected",
        payData : dataPayData,
        idParams : idParams,
        date: new Date
    }
    const pay = new PayModel(data);
    pay.save()
    .then((WriteResult)=>{
        let idPay = WriteResult.id
        ChosenModel.updateOne({_id: idParams}, {payId: idPay})
        .then(()=>{
            res.json({
                data:{
                    id: 1314503591,
                    status: "rejected",
                    status_detail: "cc_rejected_other_reason",    
                }
            })
        })
        .catch((e)=>{
            res.send("No se pudo ejecutar la actualizacion",e)
        })
    })  
    
})

/**
 * Registro del formulario con la respuesta de MP actualizando
 * el objeto donador agregando un id de pago para relacionarlo
 */
router.post('/api/checkout/add-pay-donor/:id', (req, res) => {
    const idParams = req.params.id;
    const registerPayData = req.body;
    let data = {
        aIdDonor: idParams,
        card:{
           emitter : registerPayData.card.emitter,
           expiration_month : registerPayData.card.expiration_month,
           expiration_year : registerPayData.card.expiration_year,
           first_eigth_digits : registerPayData.card.first_eigth_digits,
           last_four_digits : registerPayData.card.last_four_digits, 
        },
        identification : registerPayData.identification,
        typeIdentification : registerPayData.typeIdentification,
        payment_method_id : registerPayData.payment_method_id,
        transaction : {
            status : registerPayData.transaction.status,
            status_detail : registerPayData.transaction.status_detail,
            id : registerPayData.transaction.id,
        },
        transaction_amount: registerPayData.transaction_amount,
        date: new Date,
    }    

    const pay = new RegisterPayModel(data);
    pay.save()
    .then((WriteResult)=>{
        let idPay = WriteResult.id
        ChosenModel.updateOne({_id: idParams}, {payId: idPay})
        .then(()=>{
            res.status(201).send("Actualizacion Exitosa")
        })
        .catch((e)=>{
            res.send("No se pudo ejecutar la actualizacion",e)
        })
    })

    registerFrom(registerPayData.contactForm, registerPayData.transaction.status);
   
})


/**
 * Tipos de producto en el storage
 * requerido por el desarrollo original
 */
router.get('/api/products', (req, res)=>{
    ProductsModel.find({})
    .then((datos)=>{
        const arrayProducts = datos[0].product;
        res.status(200).send(arrayProducts);
    })
    .catch((err)=>{
        res.json({err})
    })
})


/**
 * decodifica las fotografias ingresando el id
 * 
 */
router.get('/api/decobase64/:id', (req,res)=>{
    const idParams = req.params.id;
    ChosenModel.find({_id: idParams})
    .then((chose)=>{
        console.log('llego una pet')
        res.json(chose[0].donor_photo_base64);
    })
    .catch((err)=>{
        res.json({err});
    })
})


/**
 * servicios de mercado pago; registra el pago.
 */
router.post('/api/registerpay', (req, res) => {

    let payment_data = {
        transaction_amount: Number(req.body.transaction_amount),
        token: req.body.token,
        description: req.body.description,
        installments: Number(req.body.installments),
        payment_method_id: req.body.payment_method_id,
        issuer_id: req.body.issuer_id,
        payer: {
            email: req.body.email,
            identification: {
            type: req.body.type,
            number: req.body.number
            }
        }
    };
    
    mercadopago.payment.save(payment_data)
    .then(function(response) {      
        res.status(response.status).json({
            status: response.body.status,
            status_detail: response.body.status_detail,
            id: response.body.id
        });
    })
    .catch(function(error) {
    console.error(error)
    });
})


router.post('/api/registerpayPSE', (req, res) => {  

    let payment_data = {
        transaction_amount: req.body.transaction_amount,
        description: req.body.description,
        payment_method_id: req.body.payment_method_id,
        payer: {
            entity_type: req.body.payer.entity_type,
            email: req.body.payer.email,
            identification: {
                type: req.body.payer.identification.type,
                number: req.body.payer.identification.number,
            }
        },
        additional_info: {
            ip_address: req.body.additional_info.ip_address,
        },
        transaction_details: {
            financial_institution: req.body.transaction_details.financial_institution,
        },
        callback_url: req.body.callback_url,
    };
    

    mercadopago.payment.save(payment_data)
    .then(function(response) {      
        res.status(response.status).json({
            status: response.body.status,
            status_detail: response.body.status_detail,
            id: response.body.id,
            external_resource_url:response.body.transaction_details.external_resource_url,
            transaction_id:response.body.transaction_details.transaction_id,
        });
    })
    .catch(function(error) {
        console.error(error)
        res.json(error)
    });
})


router.get('/api/payment_metods_pse',(req ,res)=>{
    const paymentMethod = async() =>{
        let response = await mercadopago.payment_methods.listAll();
        let payment_methods = response.body;
        let payment_methods_pse = payment_methods.find((metodo) => metodo.id == 'pse' );
        let financial_institutions = payment_methods_pse.financial_institutions;
        res.json(financial_institutions);
    }
    
    paymentMethod()
})


module.exports = router;