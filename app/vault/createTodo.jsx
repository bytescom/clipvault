import React from 'react'

const CreateTodo = ({ todos, setTodos, handleAddTodo, editTodo }) => {
    return (
        <form onSubmit={handleAddTodo} className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
                type="text"
                value={todos}
                onChange={(e) => setTodos(e.target.value)}
                placeholder="ADD A NEW TASK..."
                className="flex-1 px-4 py-3.5 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-black placeholder:text-gray-400 text-base rounded-none"
            />
            <button
                type="submit"
                className="px-8 py-3.5 bg-[#45b6fe] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-black text-black uppercase cursor-pointer rounded-none flex-shrink-0 "
                disabled={!todos.trim()}
            >
                {editTodo ? 'Save' : 'Add Task'}
            </button>
        </form>
    )
}

export default CreateTodo;
