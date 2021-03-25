/* src/App.js */
import React, { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Heading from './Components/Heading/Heading';
import Standings from './Components/Standings/Standings';
import RSVP from './Components/RSVP/RSVP';
import awsExports from "./aws-exports";

import './App.scss';

Amplify.configure(awsExports);


const initialState = { name: '', description: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  return (
    <div className="container">
		
		<Heading />

		<div className="blockGroup">
			<Standings />
			<RSVP />
		</div>

      <h2>Amplify Todos</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addTodo}>Create Todo</button>
      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
          </div>

        ))
      }
	  <h1>Heading 1</h1>
	  <h2>Heading 2</h2>
	  <h3>Heading 3</h3>
	  <div className="red">
	  </div>
	  <div className="gray">
	  </div>
	  <div className="lime">
	  </div>
	  <div className="forest">
	  </div>
	  <div className="black">
	  </div>
	  <div className="teal">
	  </div>
	  <div className="navy">
	  </div>
	  <div className="purple">
	  </div>
	  <div className="gold">
	  </div>

    </div>
  )
}

const styles = {

  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App)
