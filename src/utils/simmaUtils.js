require('dotenv').config();

const crypto = require('crypto');
const axios = require('axios');

/**
 * 
 * @param {string} username Usuario a generar hash
 * @returns Hash con la estructura establecida de la cadena
 */
const generateHash = (username) => {
    const weekday = ["DO","LU","MA","MI","JU","VI","SA"];
    const month = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];

    const d = new Date();
    const nameday = weekday[d.getDay()];
    const day = d.getDate();
    const namemonth = month[d.getMonth()];
    const year = d.getFullYear()

    const converthash = `${nameday}${day}${namemonth}${year}${username}`;
    const hash = crypto.createHash('md5').update(converthash).digest("hex");
    return hash;
}


/**
 * 
 * @param {string} username Usuario a generar token
 * @param {string} hash Hash generado de manera dinamica
 * @returns Token generado en la conexion a la api o un mensaje de error
 */
const generateToken = async (username, hash) => {
    return new Promise((resolve) => {
        axios.post(process.env.URL_API_TOKEN, {
            "UserName": username,
            "Password": hash
        }).then((response) => {
            resolve({error: false, data: response.data})
        })
        .catch((error) => {
            resolve({error: true, data: error.message})
        });
    })
}

module.exports = {
    generateHash,
    generateToken
}