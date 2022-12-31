module.exports = async function(response){
    if(!response) return
    
    response.headers = {
      ...response.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Expose-Headers': 'X-TOTAL-PAGES,X-TOTAL-COUNT'
    }
    return response;
  }