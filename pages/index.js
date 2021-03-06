import React from 'react';
import MainGrid from '../src/componentes/MainGrid';
import Box from '../src/componentes/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/componentes/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as= "aside"> 
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{borderRadius: '8px'}}/>
      <hr />
      <p>
      <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
        @{propriedades.githubUser}
      </a>
      </p>

      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return (
    <ProfileRelationsBoxWrapper> 
    <h2 className="smallTitle"> {propriedades.title} ({propriedades.items.length}) </h2>
    <ul>
        {/* seguidores.map((itemAtual) => {
        return (
          <li key={itemAtual}>
             <a href={`httos://github.com/${itemAtual}.png`}>
           {<img src={itemAtual.image}/>}
            <span>{itemAtual.title}</span>
          </a>
          </li>
          
        )
        })*/}
    </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const [comunidades, setComunidades] = React.useState([]);
  //const comunidades = comunidades [0];
  //const alteradorDeComunidades/serComunidades = comunidades [1];
  const usuarioAleatorio = props.githubUser;
  //const comunidades = ['Alurakut'];
  const pessoasFavoritas = [
'peas',
'juunegreiros',
'marcobruno',
'felipefialho',
'shiftkey',
'omariosouto'];

// 0 - Pegar o array de dados do github
const [seguidores, setSeguidores] = React.useState([]);
React.useEffect(function () {
  fetch('https://api.github.com/users/peas/followers')
    .then(function (respostaServidor) {
      return respostaServidor.json();
    })
    .then(function (respostaCompleta) {
      setSeguidores(respostaCompleta)
    })


  fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '6227f7923a0bd5641b575de7d7d5c7',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {      
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }` })
    })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        console.log(comunidadesVindasDoDato)
        setComunidades(comunidadesVindasDoDato)

      })

  }, [])


console.log('seguidores antes do return', seguidores)

  return (
    <>
    <AlurakutMenu/>
  <MainGrid> 

    <div className="profileArea" style= {{ gridArea: 'profileArea'}}>
    <ProfileSidebar   githubUser={usuarioAleatorio} />
    </div>
    <div className="welcomeArea" style= {{ gridArea: 'welcomeArea'}}>
    <Box> 
      <h1 className="title">Bem vindo(a)</h1>
      <OrkutNostalgicIconSet/>
    </Box>

    <Box>
      <h2 className="subTitle">O que voc?? deseja fazer?</h2>
      <form onSubmit={function handleCriaComunidade(e) {
        e.preventDefault();
        const dadosDoForm = new FormData(e.target);

        console.log('Campo: ', dadosDoForm.get('title'));
        console.log('Campo: ', dadosDoForm.get('image'));

        const comunidade = {
          id: new Date().toISOString(),
          title: dadosDoForm.get('title'),
          imageUrl: dadosDoForm.get('image'),
          cradtorSlug: usuarioAleatorio,
        }

        fetch('/api/comunidades', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(comunidade)
        })

        .then(async (response) => {
          const dados = response.json();
          console.log(dados.registroCriado);
          const comunidade = dados.registroCriado
          const comunidadesAtualizadas = [...comunidades, comunidade]
          setComunidades(comunidadesAtualizadas)
        })

       
      }}>
          <div>
          <input 
          placeholder="Qual vai ser o nome da sua comunidade?"
          name="title"
          aria-label="Qual vai ser o nome da sua comunidade?" 
          type="text"
          />
          </div>
          <div>
          <input 
          placeholder="Coloque uma URL para usarmos de capa"
          name="image"
          aria-label="Coloque uma URL para usarmos de capa" />
          </div>

          <button>
            Criar comunidade
          </button>
          </form>
    </Box>
    </div>
    <div className="profileRelationsArea" style= {{ gridArea: 'profileRelationsArea'}}> 
    <ProfileRelationsBox title="Seguidores" items={seguidores}/>
    <ProfileRelationsBoxWrapper> 
      <h2 className="smallTitle">Meus Amigos ({pessoasFavoritas.length}) </h2>
      
    <ul>
        {pessoasFavoritas.map((itemAtual) => {
        return (
          <li key={itemAtual}>
             <a href={`/users/${itemAtual}`}>
            <img src={`https://github.com/${itemAtual}.png`}/>
            <span>{itemAtual}</span>
          </a>
          </li>
          
        )
        })}
    </ul>
    </ProfileRelationsBoxWrapper>
    <ProfileRelationsBoxWrapper> 
    <h2 className="smallTitle">Comunidades({comunidades.length}) </h2>
    <ul>
        {comunidades.map((itemAtual) => {
        return (
          <li key={itemAtual.id}>
             <a href={`/comunidades/${itemAtual.id}`}>
           {<img src={itemAtual.imageUrl}/>}
            <span>{itemAtual.title}</span>
          </a>
          </li>
          
        )
        })}
    </ul>
    </ProfileRelationsBoxWrapper>
    </div>
    
  </MainGrid>
  </>
  )
}

export async function getServerSideProps(context){
 
  return {
    props: {
      githubUser: 'marichaves'
    },
  }
}