import clorianHttp from '../clorian-common';

class ClorianApiService{
    consultarProductos(monumento){
        return clorianHttp.get('/productos', {
            params:{
                monumento: monumento
            },
            headers:{
                
            }
        })
    }

    consultarDetallesProducto(productoId, monumento){
        return clorianHttp.get('/detalles-producto', {
            params:{
                productId: productoId,
                monumento: monumento
            },
            headers:{
                
            }
        })
    }

    /**
     * Consulta las fechas disponibles para este producto
     * @param {number} productoId - Id del producto 
     * @param {String} monumento - Nombre del monumento al que pertenece este producto.
     * @returns 
     */
    consultarFechasProducto(productoId, monumento, year, month){
        return clorianHttp.get('/fechas-producto',{
            params:{
                productId: productoId,
                monumento: monumento,
                year: year,
                month: month
            },
            headers:{

            }
        })
    }
}

export default new ClorianApiService();