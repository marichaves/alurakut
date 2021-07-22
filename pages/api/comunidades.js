import {SiteClient} from 'datocms-client';
export default async function recebedorDeRequests(request, response){
    
    if(request.method === 'POST') {

    const TOKEN = 'afe54b322c37f6364292db7d292990';
    const client = new SiteClient(TOKEN);
        //Validar os dados antes de sair cadastrando
   const registroCriado = await client.items.create({
        itemType: "972797", //ID gerado pelo Dato
        ...request.body,
       // title: "Comunidade de Teste",
       // imageUrl: "https://github.com/marichaves.png",
       // creatorSlug: "marichaves"

    })
    
    response.json({
        dados: 'Algum dado qualquer',
        registroCriado: registroCriado,
    })
    return;
    
    }
    
    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}