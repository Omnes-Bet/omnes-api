const fns = require("./handlers")
const cors = require('./lib/cors')
const models = require("./models");


const extractPathValues = (pathExpression, httpPath) => {
  const pathExpressionPattern = pathExpression.replace(/{[\w]+}|:[\w]+/g, '([^/]+)')
  const pathValueRegex = new RegExp(`^${pathExpressionPattern}$`)
  const pathValues = pathValueRegex.exec(httpPath)
  return pathValues && pathValues.length > 0 ? pathValues.slice(1) : null
}

const extractPathNames = (pathExpression) => {
  const pathExpressionPattern = pathExpression?.replace(/{[\w.]+}|:[\w.]+/g, '[:{]([\\w]+)}?');
  const pathNameRegex = new RegExp(`^${pathExpressionPattern}$`)
  const pathNames = pathNameRegex.exec(pathExpression)
  return pathNames && pathNames.length > 0 ? pathNames.slice(1) : null
}

const getRouterHandler = (event) => {
  const routesByMethod = fns.filter(r => r.method === event.httpMethod)
  for(const route of routesByMethod) {
    const pathPartNames = extractPathNames(route.path)
    const pathValues = extractPathValues(route.path, event.path)
    if (pathValues && pathPartNames) {
      const params = {}
      let keyIndex = 0;
      for(const key of pathPartNames) {
        params[ key ] = pathValues[ keyIndex ]
        keyIndex++;
      }
      return {route, params}
    }
  }
}

const getHandler = async (event) => {
  return getRouterHandler(event)
}

exports.handler = async (event, context) => {
  if(event.Records) return tRender(event, context, models)
  if(process.env.NODE_ENV!=='test') console.log(event)
  const HANDLER = await getHandler(event)
  if(!HANDLER) return { statusCode: 404, body: JSON.stringify({ message: 'Not Found' }) }
  const { route, params } = HANDLER
  if(!event.pathParameters || !Object.keys(event.pathParameters).length) {
    event.pathParameters = params
  }
  
  if((process.env.NODE_ENV || '').trim() !== 'test') console.debug({ event }) 

  const response = cors(
    await route.handler(event, models, context).catch(err => {
      console.error(err)
      if(!err.statusCode || !err.body ) {
        return Promise.reject(err)
      }
      return Promise.resolve(err)
    })
  )
  return response
}
