import { useState, useEffect } from "react"
import axios from "axios"

function Home() {
    const [todoItems, setTodoItems] = useState([])
    const [description, setDescription] = useState("")

    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await axios.get("http://localhost:4000/allItems")
                if (response.data) {
                    setTodoItems(response.data.items)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchItems()
    }, [todoItems]) 

    async function handleAdd(e) {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:4000/addItem", { task: description })
            if (response.status === 200 && response.data.item) {
                setTodoItems([...todoItems, response.data.item])
                setDescription("")
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function handleDelete(id, e) {
        e.preventDefault()
        try {
            const response = await axios.delete(`http://localhost:4000/deleteItem/${id}`)
            console.log(response)
            if (response.data.message === "Deleted successfully") {
                const updatedItems = todoItems.filter((item) => item.id !== id)
                setTodoItems(updatedItems)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <form>
                <label>Task description</label>
                <input
                    type="text"
                    value={description}
                    placeholder="Enter description"
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={handleAdd}>Add</button>
            </form>
            {(todoItems.length)?
            <ul>
                {todoItems.map((item) => (
                    <div key={item._id}>
                        <li>{item.task}</li>
                        <button onClick={(e) => handleDelete(item._id, e)}>Delete</button>
                    </div>
                ))}
            </ul>:
            <p>No items found</p>}
        </div>
    )
}

export default Home
