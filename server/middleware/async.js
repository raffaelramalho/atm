const asyncWrapper = (fn) => {
    return async (req, res, next) => { //retorna de maneira assincrona request response e next
        try {
            await fn(req, res, next) //await por que o controlador ainda é assincrono, e como esses parametros 
            //são fornecidos pelo express, nos passamos eles aqui de novo
        } catch (error) {
            next(error)
        }
    }
}

module.exports = asyncWrapper