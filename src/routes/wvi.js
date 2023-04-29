const {
    Router
} = require('express');
const router = Router();

const mercadopago = require('mercadopago');
const ChosenModel = require('../models/ChosenModel');
const PayModel = require('../models/payModel');
const ProductsModel = require('../models/ProducModel');

mercadopago.configurations.setAccessToken("TEST-6786679189352218-092210-fddd03b205cadf771f954ef52eeb34be-265854976");

/**
 * Registra el formulario de ingreso para los elegidos en la DB
 */
router.post('/api/chosenRegister', (req, res) => {
    const data = req.body;
    if (!data) {
        return res.status(400).json({
            error: 'chosen is missing',
        });
    }
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
})

/**
 * Agrega o actualiza la foto del elegido
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
 * 
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
          installments: payData.card.installments
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
 * chose es el objeto viejo
 */
router.get('/api/decobase64/:id', (req,res)=>{
    const idParams = req.params.id;
    ChosenModel.find({_id: idParams})
    .then((chose)=>{
        console.log('llego una pet')
        res.json(chose[0].photo.url);
    })
    .catch((err)=>{
        res.json({err});
    })
})


/**
 * servicios de mercado pago
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
    
    console.log(payment_data)

   

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


module.exports = router;