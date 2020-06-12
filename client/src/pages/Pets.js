import React, {useState} from 'react'
import gql from 'graphql-tag'
import PetBox from '../components/PetBox'
import NewPet from '../components/NewPet'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import Loader from '../components/Loader'

const PET_DETAILS = gql`
  fragment PetDetails on Pet {
    id
    type
    name
    img
    lastVaccineType @client
    lastVaccineDays @client
  }
`


const GET_PETS = gql`
  query getPets($input: PetsInput) {
    pets(input: $input) {
      ...PetDetails
    } 
  }
  ${PET_DETAILS}
  `;


const createNew = gql`
  mutation newPet($input: NewPetInput!) {
    newPet: addPet (input: $input) {
      ...PetDetails
    }
  }
  ${PET_DETAILS}
`;



export default function Pets (...args) {
  console.log(args)
  const [modal, setModal] = useState(false)
  const pets = useQuery(GET_PETS);
  const client = useApolloClient();

  const [createNewPet] = useMutation(createNew, {
    update(cache, {data: {newPet}}) {

      const {pets} = cache.readQuery({query: GET_PETS});
      console.log({pets})
      cache.writeQuery({query: GET_PETS, data: { pets: pets.concat(newPet)}})
    }
  });


  if (pets.loading) return <Loader /> 


  const onSubmit = input => {
    setModal(false)
    console.log(input)
    createNewPet({
      variables: {input},
      optimisticResponse: {
        __typename: "Mutation",
        newPet: {
          __typename: "Pet",
          id: Math.random() + "",
          name: input.name,
          type: input.type,
          img: 'http://placekitten.com/300/300',
          lastVaccineType: 3,
          lastVaccineType: "rabies"
        }
      }
    })
  }


  const petsList = pets.data.pets.map(pet => (
    <div className="col-xs-12 col-md-4 col" key={pet.id}>
      <div className="box">
        <PetBox pet={pet} />
      </div>
    </div>
  ))
  
  if (modal) {
    return (
      <div className="row center-xs">
        <div className="col-xs-8">
          <NewPet onSubmit={(input) => onSubmit(input)} onCancel={() => setModal(false)}/>
        </div>
      </div>
    )
  }
console.log(pets)
  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <div className="row">
          {petsList}
        </div>
      </section>
    </div>
  )
}
