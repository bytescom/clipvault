"use client"
import React, { useState, useEffect } from 'react'
import CreateTodo from './createTodo'
import DisplayTodo from './displayTodo'
import { nanoid } from 'nanoid'

const Todo = () => {
    const [todos, setTodos] = useState("");
    const [allTodos, setAllTodos] = useState([]);
    const [editTodo, setEditTodo] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedTodos = localStorage.getItem("todos");
            if (storedTodos) {
                try {
                    setAllTodos(JSON.parse(storedTodos));
                } catch (e) {
                    console.error("Failed to parse todos", e);
                }
            }
        }
    }, []);

    const handleAddTodo = (e) => {
        e.preventDefault();

        if (editTodo) {
            let updateTodo = allTodos.map((ele) => {
                if (ele.id === editTodo) {
                    return { ...ele, text: todos.trim() }
                }
                return ele
            })

            setAllTodos(updateTodo);
            localStorage.setItem("todos", JSON.stringify(updateTodo));
            setTodos("");
            setEditTodo(null);
            return;
        }


        let newTodo = {
            id: nanoid(),
            text: todos,
        };

        let existingTodos = JSON.parse(localStorage.getItem("todos")) || [];
        existingTodos.push(newTodo)
        localStorage.setItem("todos", JSON.stringify(existingTodos));

        setAllTodos(existingTodos)

        setTodos("")
    }


    const handleDeleteTodo = (id) => {
        let updatedTodo = allTodos.filter((todo) => todo.id !== id)
        setAllTodos(updatedTodo);
        localStorage.removeItem("todos", JSON.stringify(updatedTodo));
    }

    const handleEditTodo = (id) => {
        let todoToBeEdited = allTodos.find((todo) => todo.id === id)
        setTodos(todoToBeEdited.text)
        setEditTodo(id)
    }

    return (
        <main className="min-h-screen bg-[#4db8c8] flex flex-col items-center p-4 sm:p-8 font-sans selection:bg-black selection:text-white relative">
            {/* Background Noise Texture */}
            <div className="fixed inset-0 opacity-[0.06] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            <div className="w-full max-w-3xl bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col p-6 sm:p-10 relative z-10 mt-10 mb-20 mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-black tracking-tight uppercase inline-block border-b-4 border-black pb-1">TODO APP</h1>
                    <p className="text-black font-bold text-sm mt-4 uppercase">Keep track of your tasks and goals 🚀</p>
                </header>

                <CreateTodo todos={todos} setTodos={setTodos} handleAddTodo={handleAddTodo} editTodo={editTodo} />
                <DisplayTodo allTodos={allTodos} handleDeleteTodo={handleDeleteTodo} handleEditTodo={handleEditTodo} />
            </div>
        </main>
    )
}

export default Todo
