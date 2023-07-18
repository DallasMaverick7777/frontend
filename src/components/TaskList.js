import { useEffect, useState } from "react";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import axios from "axios";
import loadingImg from "../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskID, setTaskID] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });
  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Get Tasks

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const {data} = await axios.get(`http://localhost:5000/api/tasks`);
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  //Create Task

  const createTask = async (e) => {
      e.preventDefault();
      if (name === "") {
        toast.error("Scrie ceva inainte sa apesi butonul");
      } else {
        try {
          await axios.post(`http://localhost:5000/api/tasks`, formData);
          toast.success("Task-ul a fost adaugat cu succes");
          setFormData({ ...formData, name: "" });
          getTasks();
        } catch (error) {
          toast.error(error.message);
        }
      }
  };

      const deleteTask = async (id) => {
        try {
          await axios.delete(`http://localhost:5000/api/tasks/${id}`);
          toast.success("Task-ul a fost sters cu succes");
          getTasks();
        } catch (error) {
          toast.error(error.message);
        }
      };
      useEffect(() => {
        const cTasks = tasks.filter((task) => task.completed === true);
        setCompletedTasks(cTasks);
      }, [tasks]);


      const getSingleTask = async (task) => {
        setFormData({ ...formData, name: task.name, completed: false });
        setTaskID(task._id);
        setIsEditing(true);
      };

      const updateTask = async (e) => {
        e.preventDefault();
        if (name === "") {
          return toast.error("Scrie ceva inainte sa apesi butonul");
        }
        try {
          await axios.put(`http://localhost:5000/api/tasks/${taskID}`, formData);
          toast.success("Task-ul a fost actualizat cu succes");
          setFormData({ ...formData, name: "" });
          setIsEditing(false);
          getTasks();
        } catch (error) {
          toast.error(error.message);
        }
      };
      const setToCompleted = async (task) => {
        const newFormData= {
          name: task.name,
          completed: true,
        };
        try {
          await axios.put(`http://localhost:5000/api/tasks/${task._id}`, newFormData);
          getTasks();
        } catch (error) {
          toast.error(error.message);
        }
      };

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm name={name} handleInputChange={handleInputChange} createTask={createTask} isEditing={isEditing} updateTask={updateTask}/>
      
      {tasks.length > 0 && (
              <div className="--flex-between --pb">
              <p>
                <b>Total Tasks:</b> {tasks.length}
              </p>
              <p>
                <b>Completed Tasks:</b> {completedTasks.length}
              </p>
            </div>
      )}
      

      <hr />
      {isLoading && <div className="--flex-center"><img src={loadingImg} alt="Loading"/></div>}
      {!isLoading && tasks.length === 0 ? (
      <p className="--py">No Tasks</p>
) : (
  <>
    {tasks.map((task, index) => { 
      return (<Task key={task._id} task={task} index={index} deleteTask={deleteTask} getSingleTask={getSingleTask} setToCompleted={setToCompleted}/>)
    })}
  </>
)}

      
    </div>
  );
};

export default TaskList;
